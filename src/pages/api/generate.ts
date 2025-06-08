import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Question {
    question: string;
    options: string[];
    answer: string;
}

interface RequestBody {
    apiKey: string;
    level: number;
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

    const { apiKey, level } = req.body as RequestBody;

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

        const prompt = `
      Create 5 multiple-choice questions for a Japanese language learner at the ${japaneseLevels[level]} level.
      The questions should test vocabulary and grammar.
      Provide the response as a valid JSON object with a single key "questions" which is an array of objects.
      Each object in the array must have these keys: "question" (string), "options" (an array of 4 strings), and "answer" (a string).
      Do not wrap the JSON in markdown backticks.
    `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        const jsonResponse: { questions: Question[] } = JSON.parse(responseText);

        res.status(200).json(jsonResponse);

    } catch (error) {
        console.error('API call failed:', error);
        res.status(500).json({ error: 'Failed to generate questions. The API may have returned an invalid format.' });
    }
}