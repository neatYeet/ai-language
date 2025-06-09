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
                <div className="w-20 h-20 border-4 border-gray-200 rounded-full animate-spin border-t-red-600"></div>
            </div>
            <div className="text-center space-y-2">
                <p className="text-xl font-bold text-gray-800">
                    AI is crafting your questions...
                </p>
                <p className="text-lg text-gray-600">
                    This might take a few moments
                </p>
                <div className="flex items-center justify-center space-x-1 mt-4">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-red-300 rounded-full animate-bounce delay-200"></div>
                </div>
            </div>
            {/* Extra spacing to make scroll more noticeable */}
            <div className="h-32"></div>
        </div>
    );
};

export default LoadingState;
