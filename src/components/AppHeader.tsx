import React from 'react';

const AppHeader: React.FC = () => {
    return (
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
    );
};

export default AppHeader;
