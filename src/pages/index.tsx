import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useRef } from 'react';
import ApiKeyModal from '../components/ApiKeyModal';
import SettingsModal from '../components/SettingsModal';
import useQuizLogic from '../hooks/useQuizLogic';

const Home: NextPage = () => {
    const {
        apiKey,
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
    } = useQuizLogic();

    // Refs for smooth scrolling
    const loadingRef = useRef<HTMLDivElement>(null);
    const questionsRef = useRef<HTMLDivElement>(null);

    // Auto-scroll effect when loading state changes
    useEffect(() => {
        if (loading) {
            // Scroll down to loading indicator when AI starts generating
            setTimeout(() => {
                loadingRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 300); // Small delay to ensure the loading component is rendered
        } else if (questions.length > 0) {
            // Scroll up to first question when content is generated
            setTimeout(() => {
                questionsRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 500);
        }
    }, [loading, questions.length]);

    return (
        <>
            <Head>
                <title>AI Japanese Learning</title>
                <meta name="description" content="Master Japanese with intelligent AI questions and interactive quizzes. Improve your vocabulary, grammar, and comprehension with personalized learning." />
                <link rel="icon" href="/favicon.ico" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://ai-language-learning-eta.vercel.app/" />
                <meta property="og:title" content="AI Japanese Learning - Master Japanese with AI Quizzes" />
                <meta property="og:description" content="Improve your Japanese skills with AI-generated questions tailored to your level. Interactive quizzes for vocabulary, grammar, and comprehension." />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://ai-language-learning-eta.vercel.app/" />
                <meta property="twitter:title" content="AI Japanese Learning - Master Japanese with AI Quizzes" />
                <meta property="twitter:description" content="Improve your Japanese skills with AI-generated questions tailored to your level. Interactive quizzes for vocabulary, grammar, and comprehension." />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-blue-200 rounded-full opacity-20 animate-bounce"></div>
                <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-yellow-200 rounded-full opacity-20 animate-pulse delay-1000"></div>

                <ApiKeyModal
                    isOpen={isApiKeyModalOpen}
                    onRequestClose={() => setIsApiKeyModalOpen(false)}
                    onApiKeySubmit={handleApiKeySubmit}
                />

                <SettingsModal
                    isOpen={isSettingsModalOpen}
                    onRequestClose={() => setIsSettingsModalOpen(false)}
                    questionLanguage={questionLanguage}
                    setQuestionLanguage={setQuestionLanguage}
                    answerDisplayFormat={answerDisplayFormat}
                    setAnswerDisplayFormat={setAnswerDisplayFormat}
                />

                <div className="relative z-10 p-4 sm:p-8">
                    <header className="text-center mb-12">
                        <div className="inline-block mb-4">
                            <h1 className="text-4xl sm:text-6xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                                日本語 AI
                            </h1>
                            <div className="h-1 w-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
                        </div>
                        <p className="text-lg text-gray-600 font-medium">Master Japanese with intelligent AI questions</p>
                        <div className="mt-4 inline-flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-sm font-semibold text-gray-700">Powered by Gemini AI</span>
                        </div>
                    </header>

                    {apiKey ? (
                        <main className="max-w-4xl mx-auto">
                            {/* Score and Settings Bar */}
                            <div className="flex justify-between items-center mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-3 rounded-xl">
                                        <span className="text-2xl">🏆</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Total Score</p>
                                        <p className="text-3xl font-bold text-gray-800">{totalScore}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsSettingsModalOpen(true)}
                                    className="bg-gray-800/90 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    ⚙️ Settings
                                </button>
                            </div>

                            {/* Level Selection */}
                            <div className="mb-12">
                                <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Choose Your Challenge</h3>
                                <div className="flex justify-center flex-wrap gap-4">
                                    {[1, 2, 3, 4, 5].map((lvl) => {
                                        const requiredScore = (lvl - 1) * 100;
                                        const isLevelLocked = totalScore < requiredScore;
                                        const isActive = level === lvl && !submitted;

                                        return (
                                            <button
                                                key={lvl}
                                                onClick={() => fetchQuestions(lvl)}
                                                disabled={loading || isLevelLocked}
                                                className={`relative group p-6 rounded-2xl font-bold transition-all duration-300 transform ${isActive
                                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl scale-110 -translate-y-2'
                                                    : isLevelLocked
                                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                        : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-xl hover:scale-105 hover:-translate-y-1'
                                                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''} shadow-lg border border-white/20`}
                                            >
                                                <div className="text-2xl mb-2">
                                                    {isLevelLocked ? '🔒' : isActive ? '🌟' : '📚'}
                                                </div>
                                                <div className="text-lg">Level {lvl}</div>
                                                {isLevelLocked && (
                                                    <div className="text-xs mt-1 opacity-70">{requiredScore} pts needed</div>
                                                )}
                                                {isActive && (
                                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Loading State */}
                            {loading && (
                                <div
                                    ref={loadingRef}
                                    className="flex flex-col items-center justify-center py-16 min-h-[400px]"
                                >
                                    <div className="relative mb-8">
                                        <div className="w-20 h-20 border-4 border-indigo-200 rounded-full animate-spin border-t-indigo-600"></div>
                                        <div className="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-ping border-t-purple-400"></div>
                                    </div>
                                    <div className="text-center space-y-2">
                                        <p className="text-xl font-bold text-gray-800 animate-pulse">
                                            🤖 AI is crafting your questions...
                                        </p>
                                        <p className="text-lg text-gray-600 animate-pulse delay-500">
                                            ✨ This might take a few moments
                                        </p>
                                        <div className="flex items-center justify-center space-x-1 mt-4">
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                                            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-200"></div>
                                        </div>
                                    </div>
                                    {/* Extra spacing to make scroll more noticeable */}
                                    <div className="h-32"></div>
                                </div>
                            )}

                            {/* Questions */}
                            {!loading && questions.length > 0 && (
                                <div ref={questionsRef} className="space-y-8">
                                    {/* Scroll target indicator (invisible) */}
                                    <div className="h-4 -mb-4"></div>

                                    {questions.map((q, index) => (
                                        <div key={index} className="group relative">
                                            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/30 transition-all duration-500 hover:shadow-2xl">
                                                {/* Question Number Badge */}
                                                <div className="absolute -top-4 -left-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                                                    {index + 1}
                                                </div>

                                                <div className="flex items-start justify-between gap-4 mb-6 pt-4">
                                                    <p className="font-bold text-xl text-gray-900 leading-relaxed flex-1">
                                                        {q.question}
                                                    </p>
                                                    <button
                                                        onClick={() => setVisibleRomajiIndex(visibleRomajiIndex === index ? null : index)}
                                                        className="bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 font-semibold py-2 px-4 rounded-full hover:from-pink-200 hover:to-purple-200 transition-all duration-300 flex-shrink-0 shadow-md hover:shadow-lg transform hover:scale-105"
                                                    >
                                                        🔤 Rōmaji
                                                    </button>
                                                </div>

                                                {/* Romaji Display */}
                                                {visibleRomajiIndex === index && (
                                                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 text-blue-800 rounded-2xl font-medium animate-fadeIn">
                                                        <span className="text-sm text-blue-600 font-semibold block mb-1">Romaji:</span>
                                                        {q.question_romaji}
                                                    </div>
                                                )}

                                                {/* Answer Options */}
                                                <div className="space-y-3 mb-6">
                                                    {q.options.map((option, i) => {
                                                        const isCorrect = option === q.answer;
                                                        const isSelected = userAnswers[index] === option;

                                                        let buttonClass = 'bg-white border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-900 shadow-md hover:shadow-lg';
                                                        let iconClass = '';

                                                        if (submitted) {
                                                            if (isCorrect) {
                                                                buttonClass = 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400 text-green-900 font-bold shadow-lg';
                                                                iconClass = '✅';
                                                            } else if (isSelected && !isCorrect) {
                                                                buttonClass = 'bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-400 text-red-900 shadow-lg';
                                                                iconClass = '❌';
                                                            } else {
                                                                buttonClass = 'bg-gray-50 border-2 border-gray-200 opacity-60';
                                                            }
                                                        } else if (isSelected) {
                                                            buttonClass = 'bg-gradient-to-r from-indigo-100 to-purple-100 border-2 border-indigo-400 text-indigo-900 font-semibold shadow-lg';
                                                            iconClass = '👆';
                                                        }

                                                        const displayedOption = answerDisplayFormat === 'romaji' && questionLanguage === 'english' && q.options_romaji ? q.options_romaji[i] : option;
                                                        return (
                                                            <button
                                                                key={i}
                                                                onClick={() => handleAnswerChange(index, option)}
                                                                disabled={submitted}
                                                                className={`w-full text-left p-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${buttonClass} ${!submitted ? 'cursor-pointer' : 'cursor-not-allowed'
                                                                    } flex items-center justify-between`}
                                                            >
                                                                <span className="text-lg">{displayedOption}</span>
                                                                {iconClass && <span className="text-xl">{iconClass}</span>}
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                {/* Hint Section */}
                                                <details className="group/hint">
                                                    <summary className="cursor-pointer text-sm font-bold text-gray-600 hover:text-indigo-600 transition-colors duration-300 flex items-center space-x-2 p-3 rounded-xl hover:bg-yellow-50">
                                                        <span>💡</span>
                                                        <span>Need a hint?</span>
                                                        <span className="transform transition-transform duration-300 group-open/hint:rotate-180">🔻</span>
                                                    </summary>
                                                    <div className="mt-3 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 border-l-4 border-yellow-400 text-yellow-900 rounded-2xl shadow-inner">
                                                        <p className="font-medium">{q.hint}</p>
                                                    </div>
                                                </details>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Submit Button */}
                                    {!submitted && (
                                        <div className="text-center mt-12">
                                            <button
                                                onClick={handleSubmit}
                                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-12 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-2xl text-xl"
                                            >
                                                🎯 Check My Answers
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Score Display */}
                            {submitted && score !== null && (
                                <div className="text-center mt-12">
                                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30 max-w-md mx-auto">
                                        <div className="text-6xl mb-4">
                                            {score === questions.length ? '🎉' : score >= questions.length * 0.7 ? '🌟' : '💪'}
                                        </div>
                                        <h2 className="text-4xl font-black mb-2">
                                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                {score} / {questions.length}
                                            </span>
                                        </h2>
                                        <p className="text-gray-600 mb-6 font-medium">
                                            {score === questions.length
                                                ? 'Perfect! You\'re amazing!'
                                                : score >= questions.length * 0.7
                                                    ? 'Great job! Keep it up!'
                                                    : 'Good effort! Practice makes perfect!'}
                                        </p>
                                        <button
                                            onClick={() => fetchQuestions(level)}
                                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-8 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
                                        >
                                            🔄 Try Level {level} Again
                                        </button>
                                    </div>
                                </div>
                            )}
                        </main>
                    ) : (
                        <div className="text-center mt-16">
                            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/30 max-w-md mx-auto">
                                <div className="text-6xl mb-6">🔑</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Learn?</h3>
                                <p className="text-gray-600 font-medium">Enter your Gemini API key to unlock your Japanese learning journey!</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;
