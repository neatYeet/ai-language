import React, { RefObject } from 'react';

interface LoadingStateProps {
    loadingRef: RefObject<HTMLDivElement | null>;
}

const LoadingState: React.FC<LoadingStateProps> = ({ loadingRef }) => {
    return (
        <div
            ref={loadingRef}
            className="flex flex-col items-center justify-center py-16 min-h-[400px]"
        >
            <div className="relative mb-8">
                <div className="w-20 h-20 border-4 border-indigo-200 rounded-full animate-spin border-t-indigo-600"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-ping border-t-purple-400"></div>
            </div>
            <div className="text-center space-y-2">
                <p className="text-xl font-bold text-gray-800 animate-pulse">
                    🤖 AI is crafting your questions...
                </p>
                <p className="text-lg text-gray-600 animate-pulse delay-500">
                    ✨ This might take a few moments
                </p>
                <div className="flex items-center justify-center space-x-1 mt-4">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-200"></div>
                </div>
            </div>
            {/* Extra spacing to make scroll more noticeable */}
            <div className="h-32"></div>
        </div>
    );
};

export default LoadingState;
