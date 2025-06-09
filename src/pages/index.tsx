import type { NextPage } from 'next';
import { useEffect, useRef } from 'react';
import HeadComponent from '../components/HeadComponent';
import ApiKeyModal from '../components/ApiKeyModal';
import SettingsModal from '../components/SettingsModal';
import QuestionsComponent from '../components/QuestionsComponent';
import ScoreSettingsBar from '../components/ScoreSettingsBar';
import LevelSelection from '../components/LevelSelection';
import LoadingState from '../components/LoadingState';
import ScoreDisplay from '../components/ScoreDisplay';
import AppHeader from '../components/AppHeader';
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

    const loadingRef = useRef<HTMLDivElement>(null);
    const questionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (loading) {
            setTimeout(() => {
                loadingRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 300);
        } else if (questions.length > 0) {
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
            <HeadComponent />

            <div className="min-h-screen bg-gray-50 relative overflow-hidden">
                <SettingsModal
                    isOpen={isSettingsModalOpen}
                    onRequestClose={() => setIsSettingsModalOpen(false)}
                    questionLanguage={questionLanguage}
                    setQuestionLanguage={setQuestionLanguage}
                    answerDisplayFormat={answerDisplayFormat}
                    setAnswerDisplayFormat={setAnswerDisplayFormat}
                />

                {apiKey ? (
                    <div className="relative z-10 p-4 sm:p-8">
                        <AppHeader />

                        <main className="max-w-4xl mx-auto">
                            {/* Score and Settings Bar */}
                            <ScoreSettingsBar
                                totalScore={totalScore}
                                setIsSettingsModalOpen={setIsSettingsModalOpen}
                            />

                            {/* Level Selection */}
                            <LevelSelection
                                level={level}
                                totalScore={totalScore}
                                loading={loading}
                                submitted={submitted}
                                fetchQuestions={fetchQuestions}
                            />

                            {/* Loading State */}
                            {loading && (
                                <LoadingState loadingRef={loadingRef} />
                            )}

                            {/* Questions */}
                            {!loading && questions.length > 0 && (
                                <QuestionsComponent
                                    questions={questions}
                                    userAnswers={userAnswers}
                                    submitted={submitted}
                                    visibleRomajiIndex={visibleRomajiIndex}
                                    setVisibleRomajiIndex={setVisibleRomajiIndex}
                                    handleAnswerChange={handleAnswerChange}
                                    handleSubmit={handleSubmit}
                                    answerDisplayFormat={answerDisplayFormat}
                                    questionLanguage={questionLanguage}
                                />
                            )}

                            {/* Score Display */}
                            {submitted && score !== null && (
                                <ScoreDisplay
                                    score={score}
                                    questionsLength={questions.length}
                                    level={level}
                                    fetchQuestions={fetchQuestions}
                                />
                            )}
                        </main>
                    </div>
                ) : (
                    <ApiKeyModal
                        isOpen={isApiKeyModalOpen}
                        onRequestClose={() => setIsApiKeyModalOpen(false)}
                        onApiKeySubmit={handleApiKeySubmit}
                    />
                )}
            </div>
        </>
    );
};

export default Home;
