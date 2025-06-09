import React from 'react';

interface Question {
    question: string;
    question_romaji: string;
    options: string[];
    options_romaji?: string[];
    answer: string;
    hint: string;
}

interface QuestionsComponentProps {
    questions: Question[];
    userAnswers: { [key: number]: string };
    submitted: boolean;
    visibleRomajiIndex: number | null;
    setVisibleRomajiIndex: (index: number | null) => void;
    handleAnswerChange: (questionIndex: number, answer: string) => void;
    handleSubmit: () => void;
    answerDisplayFormat: string;
    questionLanguage: string;
}

const QuestionsComponent: React.FC<QuestionsComponentProps> = ({
    questions,
    userAnswers,
    submitted,
    visibleRomajiIndex,
    setVisibleRomajiIndex,
    handleAnswerChange,
    handleSubmit,
    answerDisplayFormat,
    questionLanguage,
}) => {
    return (
        <div className="space-y-8">
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
                            {questionLanguage === 'japanese' &&
                                <button
                                    onClick={() => setVisibleRomajiIndex(visibleRomajiIndex === index ? null : index)}
                                    className="bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 font-semibold py-2 px-4 rounded-full hover:from-pink-200 hover:to-purple-200 transition-all duration-300 flex-shrink-0 shadow-md hover:shadow-lg transform hover:scale-105"
                                >
                                    🔤 Rōmaji
                                </button>
                            }
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

                                let displayedOption = option;
                                if (answerDisplayFormat == 'romaji' && q.options_romaji) {
                                    displayedOption = q.options_romaji[i];
                                } else if (answerDisplayFormat == 'both' && (questionLanguage === 'japanese' || questionLanguage === 'english') && q.options_romaji) {
                                    displayedOption = `${option} (${q.options_romaji[i]})`;
                                }
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
    );
};

export default QuestionsComponent;
