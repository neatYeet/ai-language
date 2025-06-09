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
                    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 transition-all duration-200 hover:shadow-lg">
                        {/* Question Number Badge */}
                        <div className="absolute -top-3 -left-3 bg-red-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm shadow-sm">
                            {index + 1}
                        </div>

                        <div className="flex items-start justify-between gap-4 mb-6 pt-2">
                            <p className="font-semibold text-xl text-gray-900 leading-relaxed flex-1">
                                {q.question}
                            </p>
                            {questionLanguage === 'japanese' &&
                                <button
                                    onClick={() => setVisibleRomajiIndex(visibleRomajiIndex === index ? null : index)}
                                    className="bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex-shrink-0 border border-gray-200"
                                >
                                    🔤 Rōmaji
                                </button>
                            }
                        </div>

                        {/* Romaji Display */}
                        {visibleRomajiIndex === index && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-800 rounded-lg font-medium">
                                <span className="text-sm text-red-600 font-semibold block mb-1">Romaji:</span>
                                {q.question_romaji}
                            </div>
                        )}

                        {/* Answer Options */}
                        <div className="space-y-3 mb-6">
                            {q.options.map((option, i) => {
                                const isCorrect = option === q.answer;
                                const isSelected = userAnswers[index] === option;

                                let buttonClass = 'bg-white border border-gray-300 hover:border-red-400 hover:bg-red-50 text-gray-900 shadow-sm hover:shadow-md';
                                let iconClass = '';

                                if (submitted) {
                                    if (isCorrect) {
                                        buttonClass = 'bg-green-50 border border-green-400 text-green-900 font-semibold shadow-sm';
                                        iconClass = '✅';
                                    } else if (isSelected && !isCorrect) {
                                        buttonClass = 'bg-red-50 border border-red-400 text-red-900 shadow-sm';
                                        iconClass = '❌';
                                    } else {
                                        buttonClass = 'bg-gray-50 border border-gray-200 opacity-60';
                                    }
                                } else if (isSelected) {
                                    buttonClass = 'bg-red-50 border border-red-400 text-red-900 font-semibold shadow-sm';
                                    iconClass = '👆';
                                }

                                let displayedOption = option;
                                if (answerDisplayFormat == 'japanese') {
                                    displayedOption = q.options[i];
                                }
                                if (answerDisplayFormat == 'romaji' && q.options_romaji) {
                                    displayedOption = q.options_romaji[i];
                                } else if (answerDisplayFormat == 'both' && q.options_romaji) {
                                    displayedOption = `${option} (${q.options_romaji[i]})`;
                                }
                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleAnswerChange(index, option)}
                                        disabled={submitted}
                                        className={`w-full text-left p-4 rounded-lg transition-colors duration-200 ${buttonClass} ${!submitted ? 'cursor-pointer' : 'cursor-not-allowed'
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
                            <summary className="cursor-pointer text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors duration-200 flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 border border-gray-200">
                                <span>💡</span>
                                <span>Need a hint?</span>
                                <span className="transform transition-transform duration-200 group-open/hint:rotate-180">🔻</span>
                            </summary>
                            <div className="mt-3 p-4 bg-red-50 border-l-4 border-red-400 text-red-900 rounded-lg">
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
                        className="bg-red-600 text-white font-semibold py-4 px-12 rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md text-xl"
                    >
                        🎯 Check My Answers
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuestionsComponent;
