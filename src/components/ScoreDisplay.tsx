import React from 'react';

interface ScoreDisplayProps {
    score: number | null;
    questionsLength: number;
    level: number | null;
    fetchQuestions: (level: number) => void;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
    score,
    questionsLength,
    level,
    fetchQuestions,
}) => {
    if (score === null || level === null) {
        return null; // Or handle the null case appropriately
    }

    return (
        <div className="text-center mt-12">
            <div className="bg-white rounded-lg p-8 shadow-md border border-gray-200 max-w-md mx-auto">
                <div className="text-6xl mb-4">
                    {score === questionsLength ? '🎉' : score >= questionsLength * 0.7 ? '🌟' : '💪'}
                </div>
                <h2 className="text-4xl font-bold mb-2 text-gray-800">
                    {score} / {questionsLength}
                </h2>
                <p className="text-gray-600 mb-6 font-medium">
                    {score === questionsLength
                        ? 'Perfect! You\'re amazing!'
                        : score >= questionsLength * 0.7
                            ? 'Great job! Keep it up!'
                            : 'Good effort! Practice makes perfect!'}
                </p>
                <button
                    onClick={() => fetchQuestions(level)}
                    className="bg-red-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm"
                >
                    Try Level {level} Again
                </button>
            </div>
        </div>
    );
};

export default ScoreDisplay;
