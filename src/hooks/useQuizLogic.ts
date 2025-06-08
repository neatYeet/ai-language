import { useState, useEffect } from 'react';

interface Question {
    question: string;
    options: string[];
    answer: string;
    hint: string;
    question_romaji: string;
}

interface UserAnswers {
    [key: number]: string;
}

interface UseQuizLogic {
    apiKey: string | null;
    setApiKey: (key: string | null) => void;
    isApiKeyModalOpen: boolean;
    setIsApiKeyModalOpen: (isOpen: boolean) => void;
    level: number;
    questions: Question[];
    loading: boolean;
    userAnswers: UserAnswers;
    score: number | null;
    submitted: boolean;
    visibleRomajiIndex: number | null;
    setVisibleRomajiIndex: (index: number | null) => void;
    totalScore: number;
    questionLanguage: 'english' | 'japanese';
    setQuestionLanguage: (language: 'english' | 'japanese') => void;
    answerDisplayFormat: 'japanese' | 'romaji';
    setAnswerDisplayFormat: (format: 'japanese' | 'romaji') => void;
    isSettingsModalOpen: boolean;
    setIsSettingsModalOpen: (isOpen: boolean) => void;
    handleApiKeySubmit: (key: string) => void;
    fetchQuestions: (selectedLevel: number) => Promise<void>;
    handleAnswerChange: (questionIndex: number, selectedOption: string) => void;
    handleSubmit: () => void;
    toRomaji: (text: string) => string;
}

const useQuizLogic = (): UseQuizLogic => {
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

    const [level, setLevel] = useState<number>(1);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
    const [score, setScore] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [visibleRomajiIndex, setVisibleRomajiIndex] = useState<number | null>(null);
    const [totalScore, setTotalScore] = useState<number>(0);
    const [questionLanguage, setQuestionLanguage] = useState<'english' | 'japanese'>('japanese');
    const [answerDisplayFormat, setAnswerDisplayFormat] = useState<'japanese' | 'romaji'>('japanese');
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const storedApiKey = localStorage.getItem('geminiApiKey');
        if (storedApiKey) {
            setApiKey(storedApiKey);
        } else {
            setIsApiKeyModalOpen(true); // Automatically open API key modal if not found
        }

        const storedTotalScore = localStorage.getItem('totalScore');
        if (storedTotalScore) {
            setTotalScore(parseInt(storedTotalScore, 10));
        }
    }, []);

    const handleApiKeySubmit = (key: string) => {
        localStorage.setItem('geminiApiKey', key);
        setApiKey(key);
    };

    const resetQuiz = () => {
        setQuestions([]);
        setUserAnswers({});
        setScore(null);
        setSubmitted(false);
    };

    const fetchQuestions = async (selectedLevel: number) => {
        if (!apiKey) {
            alert("API Key is not set. Please provide your API key.");
            return;
        };
        resetQuiz();
        const requiredScore = (selectedLevel - 1) * 100;
        if (totalScore < requiredScore) {
            alert(`You need ${requiredScore} points to unlock Level ${selectedLevel}. Keep practicing on lower levels!`);
            return;
        }

        resetQuiz();
        setLoading(true);
        setLevel(selectedLevel);

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ apiKey, level: selectedLevel, language: questionLanguage }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch questions');
            }

            const data: { questions: Question[] } = await response.json();
            setQuestions(data.questions);
        } catch (error) {
            console.error(error);
            alert((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionIndex: number, selectedOption: string) => {
        setUserAnswers({
            ...userAnswers,
            [questionIndex]: selectedOption,
        });
    };

    const handleSubmit = () => {
        let correctAnswers = 0;
        questions.forEach((q, index) => {
            if (userAnswers[index] === q.answer) {
                correctAnswers++;
            }
        });
        const quizScore = correctAnswers * 10;
        const newTotalScore = totalScore + quizScore;
        setScore(correctAnswers);
        setTotalScore(newTotalScore);
        localStorage.setItem('totalScore', newTotalScore.toString());
        setSubmitted(true);
    };

    // Simple Romaji conversion (This is a basic implementation and may not cover all cases)
    const toRomaji = (text: string): string => {
        const hiraganaMap: { [key: string]: string } = {
            'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
            'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
            'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
            'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
            'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
            'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
            'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
            'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
            'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
            'わ': 'wa', 'を': 'wo', 'ん': 'n',
            'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
            'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
            'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
            'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
            'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
            'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
            'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
            'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
            'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
            'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
            'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
            'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
            'ぎゃ': 'gya', 'ぎゅ': 'gyu',
            'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jo',
            'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
            'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',
        };

        let romaji = '';
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const nextChar = text[i + 1];
            const twoChars = char + nextChar;

            if (hiraganaMap[twoChars]) {
                romaji += hiraganaMap[twoChars];
                i++;
            } else if (hiraganaMap[char]) {
                romaji += hiraganaMap[char];
            } else {
                romaji += char;
            }
        }
        return romaji;
    };

    return {
        apiKey,
        setApiKey,
        isApiKeyModalOpen,
        setIsApiKeyModalOpen,
        level,
        questions,
        loading,
        userAnswers,
        score,
        submitted,
        visibleRomajiIndex,
        setVisibleRomajiIndex,
        totalScore,
        questionLanguage,
        setQuestionLanguage,
        answerDisplayFormat,
        setAnswerDisplayFormat,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
        handleApiKeySubmit,
        fetchQuestions,
        handleAnswerChange,
        handleSubmit,
        toRomaji,
    };
};

export default useQuizLogic;
