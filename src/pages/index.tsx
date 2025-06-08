import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import ApiKeyModal from '../components/ApiKeyModal';

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

const Home: NextPage = () => {
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [level, setLevel] = useState<number>(1);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
    const [score, setScore] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [visibleRomajiIndex, setVisibleRomajiIndex] = useState<number | null>(null);

    useEffect(() => {
        const storedApiKey = localStorage.getItem('geminiApiKey');
        if (storedApiKey) {
            setApiKey(storedApiKey);
        } else {
            setIsModalOpen(true);
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
        setLoading(true);
        setLevel(selectedLevel);

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ apiKey, level: selectedLevel }),
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
        setScore(correctAnswers);
        setSubmitted(true);
    };

    return (
        <>
            <Head>
                <title>AI Japanese Learning</title>
                <meta name="description" content="Learn Japanese with AI-generated questions" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
                <ApiKeyModal
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    onApiKeySubmit={handleApiKeySubmit}
                />

                <header className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">AI-Powered Japanese Learning</h1>
                    <p className="text-gray-600 mt-2">Select a level to generate questions with Gemini</p>
                </header>

                {apiKey ? (
                    <main className="max-w-4xl mx-auto">
                        <div className="flex justify-center flex-wrap mb-8 gap-2 sm:gap-4 bg-white p-4 rounded-xl shadow-md">
                            {[1, 2, 3, 4, 5].map((lvl) => (
                                <button
                                    key={lvl}
                                    onClick={() => fetchQuestions(lvl)}
                                    disabled={loading}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${level === lvl && !submitted
                                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                                        : 'bg-white text-blue-600 hover:bg-blue-100'
                                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Level {lvl}
                                </button>
                            ))}
                        </div>

                        {loading && <div className="text-center font-semibold text-gray-700">Loading questions...</div>}

                        {!loading && questions.length > 0 && (
                            <div className="space-y-6">
                                {questions.map((q, index) => (
                                    <div key={index} className="bg-white p-6 rounded-lg shadow-md transition-all duration-300">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <p className="font-semibold text-lg text-gray-900 pt-1">{index + 1}. {q.question}</p>
                                            <button
                                                onClick={() => setVisibleRomajiIndex(visibleRomajiIndex === index ? null : index)}
                                                className="text-xs bg-gray-200 text-gray-700 font-bold py-1 px-3 rounded-full hover:bg-gray-300 transition-colors flex-shrink-0"
                                                title="Show/Hide Romaji"
                                            >
                                                Rōmaji
                                            </button>
                                        </div>

                                        {visibleRomajiIndex === index && (
                                            <div className="mb-4 p-2 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-sm transition-all duration-300 ease-in-out">
                                                {q.question_romaji}
                                            </div>
                                        )}                                        <div className="space-y-2">
                                            {q.options.map((option, i) => {
                                                const isCorrect = option === q.answer;
                                                const isSelected = userAnswers[index] === option;

                                                let buttonClass = 'border-gray-300 hover:bg-gray-100 text-gray-900';
                                                if (submitted) {
                                                    if (isCorrect) {
                                                        buttonClass = 'bg-green-200 border-green-400 text-green-900 font-bold';
                                                    } else if (isSelected && !isCorrect) {
                                                        buttonClass = 'bg-red-200 border-red-400 text-red-900';
                                                    } else {
                                                        buttonClass = 'border-gray-300 opacity-70';
                                                    }
                                                } else if (isSelected) {
                                                    buttonClass = 'bg-blue-100 border-blue-400';
                                                }

                                                return (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleAnswerChange(index, option)}
                                                        disabled={submitted}
                                                        className={`w-full text-left p-3 border rounded-lg transition-colors duration-200 ${buttonClass} ${!submitted ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                                    >
                                                        {option}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <details className="mt-4">
                                            <summary className="cursor-pointer text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                                                Hint
                                            </summary>
                                            <div className="mt-2 p-3 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 rounded-r-lg">
                                                <p>{q.hint}</p>
                                            </div>
                                        </details>
                                    </div>
                                ))}

                                {!submitted && (
                                    <div className="text-center mt-8">
                                        <button
                                            onClick={handleSubmit}
                                            className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105"
                                        >
                                            Check Answers
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {submitted && score !== null && (
                            <div className="text-center mt-8 p-6 bg-white rounded-lg shadow-xl">
                                <h2 className="text-3xl font-bold text-blue-600 mb-2">
                                    Your Score: {score} / {questions.length}
                                </h2>
                                <button
                                    onClick={() => fetchQuestions(level)}
                                    className="mt-4 bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Retry Level {level}
                                </button>
                            </div>
                        )}

                    </main>
                ) : (
                    <div className="text-center text-gray-600 mt-16">
                        <p>Please enter your Gemini API key to begin.</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default Home;