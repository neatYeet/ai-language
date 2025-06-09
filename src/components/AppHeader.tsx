import React from 'react';

const AppHeader: React.FC = () => {
    return (
        <header className="text-center mb-12">
            <div className="inline-block mb-4">
                <h1 className="text-4xl sm:text-6xl font-bold text-gray-800 mb-2">
                    日本語 AI
                </h1>
                <div className="h-0.5 w-full bg-red-600 rounded-full"></div>
            </div>
            <p className="text-lg text-gray-600 font-medium">Master Japanese with intelligent AI questions</p>
            <div className="mt-4 inline-flex items-center space-x-2 bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg shadow-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Powered by Gemini AI</span>
            </div>
        </header>
    );
};

export default AppHeader;
