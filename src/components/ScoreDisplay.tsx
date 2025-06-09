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
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30 max-w-md mx-auto">
                <div className="text-6xl mb-4">
                    {score === questionsLength ? '🎉' : score >= questionsLength * 0.7 ? '🌟' : '💪'}
                </div>
                <h2 className="text-4xl font-black mb-2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {score} / {questionsLength}
                    </span>
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
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-8 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                    🔄 Try Level {level} Again
                </button>
            </div>
        </div>
    );
};

export default ScoreDisplay;
