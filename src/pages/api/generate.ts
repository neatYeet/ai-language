import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Question {
    question: string;
    options: string[];
    answer: string;
    hint: string;
    question_romaji: string;
}

interface RequestBody {
    apiKey: string;
    level: number;
    language?: 'english' | 'japanese';
}

type ResponseData = {
    questions: Question[];
}

type ErrorData = {
    error: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData | ErrorData>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { apiKey, level, language } = req.body as RequestBody;

    if (!apiKey || !level) {
        return res.status(400).json({ error: 'API key and level are required' });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' });

        const japaneseLevels: { [key: number]: string } = {
            1: 'Beginner (JLPT N5)',
            2: 'Elementary (JLPT N4)',
            3: 'Intermediate (JLPT N3)',
            4: 'Upper-Intermediate (JLPT N2)',
            5: 'Advanced (JLPT N1)',
        };

        let prompt;

        if (language === 'english') {
            prompt = `
  You are an API that returns JSON. Do not speak in conversational language.
  Your entire response must be ONLY the raw JSON object.
  Do not use any markdown formatting (like \`\`\`json).
  Your response must start immediately with "{" and end with "}".

  Generate 5 multiple-choice questions for a Japanese language learner at the ${japaneseLevels[level]} level. The questions should be in English, asking for the Japanese translation of a word or phrase.

  The JSON object must have one key: "questions".
  The value of "questions" must be an array of 5 objects.
  Each object in the array MUST contain these five keys:
  1. "question": A string in English (e.g., "What is 'apple' in Japanese?").
  2. "options": An array of 4 strings (Japanese words or phrases).
  3. "answer": A string that is an exact match to one of the "options".
  4. "hint": A string containing a helpful hint in English or simple hiragana.
  5. "question_romaji": A string containing the Romaji transliteration of the correct answer.
`;
        } else {
            prompt = `
  You are an API that returns JSON. Do not speak in conversational language.
  Your entire response must be ONLY the raw JSON object.
  Do not use any markdown formatting (like \`\`\`json).
  Your response must start immediately with "{" and end with "}".

  Generate 5 multiple-choice questions for a Japanese language learner at the ${japaneseLevels[level]} level. The questions should be in Japanese with a fill-in-the-blank.

  The JSON object must have one key: "questions".
  The value of "questions" must be an array of 5 objects.
  Each object in the array MUST contain these five keys:
  1. "question": A string in Japanese with a fill-in-the-blank (e.g., "🍎 これは_______です。"). For questions about objects, it MUST include an emoji for context.
  2. "options": An array of 4 strings (Japanese words or phrases).
  3. "answer": A string that is an exact match to one of the "options".
  4. "hint": A string containing a helpful hint in English or simple hiragana.
  5. "question_romaji": A string containing the literal Romaji transliteration of the "question" field.
     **Crucially, do NOT fill in the blank.** The "_______" characters must remain as "_______".
     **Example:** If the question is "🍎 これは_______です。", the question_romaji MUST be "🍎 kore wa _______ desu.".
`;
        }


        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        const startIndex = responseText.indexOf('{');
        const endIndex = responseText.lastIndexOf('}');

        if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
            console.error("Invalid response format, no JSON object found:", responseText);
            throw new Error("Failed to find a valid JSON object in the response.");
        }

        const jsonString = responseText.substring(startIndex, endIndex + 1);

        const jsonResponse: { questions: Question[] } = JSON.parse(jsonString);


        res.status(200).json(jsonResponse);

    } catch (error) {
        console.error('API call failed:', error);
        res.status(500).json({ error: 'The AI failed to return questions in a valid format. Please try again.' });
    }
}
