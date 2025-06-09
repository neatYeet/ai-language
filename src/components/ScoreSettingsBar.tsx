import React from 'react';

interface ScoreSettingsBarProps {
    totalScore: number;
    setIsSettingsModalOpen: (isOpen: boolean) => void;
}

const ScoreSettingsBar: React.FC<ScoreSettingsBarProps> = ({ totalScore, setIsSettingsModalOpen }) => {
    return (
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
    );
};

export default ScoreSettingsBar;
