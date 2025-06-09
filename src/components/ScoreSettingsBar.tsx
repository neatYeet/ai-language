import React from 'react';

interface ScoreSettingsBarProps {
    totalScore: number;
    setIsSettingsModalOpen: (isOpen: boolean) => void;
}

const ScoreSettingsBar: React.FC<ScoreSettingsBarProps> = ({ totalScore, setIsSettingsModalOpen }) => {
    return (
        <div className="flex justify-between items-center mb-8 bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <div className="flex items-center space-x-4">
                <div className="bg-red-100 p-3 rounded-lg">
                    <span className="text-2xl">🏆</span>
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Total Score</p>
                    <p className="text-3xl font-bold text-gray-800">{totalScore}</p>
                </div>
            </div>
            <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="bg-red-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm"
            >
                ⚙️ Settings
            </button>
        </div>
    );
};

export default ScoreSettingsBar;
