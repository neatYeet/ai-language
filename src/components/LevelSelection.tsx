import React from 'react';

interface LevelSelectionProps {
    level: number | null;
    totalScore: number;
    loading: boolean;
    submitted: boolean;
    fetchQuestions: (level: number) => void;
}

const LevelSelection: React.FC<LevelSelectionProps> = ({
    level,
    totalScore,
    loading,
    submitted,
    fetchQuestions,
}) => {
    return (
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
                            className={`relative group p-6 rounded-lg font-semibold transition-all duration-200 ${isActive
                                ? 'bg-red-600 text-white shadow-md border-2 border-red-700'
                                : isLevelLocked
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200'
                                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <div className="text-2xl mb-2">
                                {isLevelLocked ? '🔒' : isActive ? '📖' : '📚'}
                            </div>
                            <div className="text-lg">Level {lvl}</div>
                            {isLevelLocked && (
                                <div className="text-xs mt-1 opacity-70">{requiredScore} pts needed</div>
                            )}
                            {isActive && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default LevelSelection;
