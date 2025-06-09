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
    );
};

export default LevelSelection;
