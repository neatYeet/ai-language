import { useState, useEffect } from 'react';

interface Question {
    question: string;
    options: string[];
    answer: string;
    hint: string;
    question_romaji: string; // Romaji for the question (Japanese) or the answer (English)
    options_romaji?: string[]; // Romaji for each option (only for English questions)
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
    answerDisplayFormat: 'japanese' | 'romaji' | 'both';
    setAnswerDisplayFormat: (format: 'japanese' | 'romaji' | 'both') => void;
    isSettingsModalOpen: boolean;
    setIsSettingsModalOpen: (isOpen: boolean) => void;
    handleApiKeySubmit: (key: string) => void;
    fetchQuestions: (selectedLevel: number) => Promise<void>;
    handleAnswerChange: (questionIndex: number, selectedOption: string) => void;
    handleSubmit: () => void;
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
    const [answerDisplayFormat, setAnswerDisplayFormat] = useState<'japanese' | 'romaji' | 'both'>('japanese');
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
    };
};

export default useQuizLogic;
