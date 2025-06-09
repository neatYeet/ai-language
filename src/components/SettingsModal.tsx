import React from 'react';
import Modal from 'react-modal';

interface SettingsModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    questionLanguage: 'english' | 'japanese';
    setQuestionLanguage: (language: 'english' | 'japanese') => void;
    answerDisplayFormat: 'japanese' | 'romaji' | 'both';
    setAnswerDisplayFormat: (format: 'japanese' | 'romaji' | 'both') => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onRequestClose,
    questionLanguage,
    setQuestionLanguage,
    answerDisplayFormat,
    setAnswerDisplayFormat,
}) => {
    const customStyles = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
        },
        content: {
            position: 'relative' as const,
            top: 'auto',
            left: 'auto',
            right: 'auto',
            bottom: 'auto',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '24px',
            padding: '0',
            maxWidth: '500px',
            width: '100%',
            maxHeight: 'calc(100vh - 2rem)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            overflow: 'hidden',
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Settings Modal"
            style={customStyles}
            closeTimeoutMS={200}
        >
            <div className="flex flex-col h-full max-h-[calc(100vh-2rem)]">
                {/* Header - Fixed */}
                <div className="flex-shrink-0 p-6 pb-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-red-100 p-3 rounded-lg">
                                <span className="text-2xl">⚙️</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                                Settings
                            </h2>
                        </div>
                        <button
                            onClick={onRequestClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 pt-4">
                    {/* Question Language Section */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="text-xl">🌐</span>
                            <h3 className="text-lg font-bold text-gray-800">Question Language</h3>
                        </div>
                        <div className="space-y-3">
                            <label className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${questionLanguage === 'japanese'
                                    ? 'border-red-500 bg-red-500'
                                    : 'border-gray-300 group-hover:border-red-400'
                                    }`}>
                                    {questionLanguage === 'japanese' && (
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                </div>
                                <input
                                    type="radio"
                                    value="japanese"
                                    checked={questionLanguage === 'japanese'}
                                    onChange={() => setQuestionLanguage('japanese')}
                                    className="sr-only"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 flex-wrap">
                                        <span className="font-semibold text-gray-800">日本語</span>
                                        <span className="text-sm text-gray-500">(Fill-in-the-blank)</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">Questions in Japanese with blanks to fill</p>
                                </div>
                            </label>

                            <label className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${questionLanguage === 'english'
                                    ? 'border-red-500 bg-red-500'
                                    : 'border-gray-300 group-hover:border-red-400'
                                    }`}>
                                    {questionLanguage === 'english' && (
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                </div>
                                <input
                                    type="radio"
                                    value="english"
                                    checked={questionLanguage === 'english'}
                                    onChange={() => setQuestionLanguage('english')}
                                    className="sr-only"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 flex-wrap">
                                        <span className="font-semibold text-gray-800">English</span>
                                        <span className="text-sm text-gray-500">(Translation)</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">Questions in English to translate</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Answer Display Section */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="text-xl">📝</span>
                            <h3 className="text-lg font-bold text-gray-800">Answer Display</h3>
                        </div>
                        <div className="space-y-3">
                            <label className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${answerDisplayFormat === 'japanese'
                                    ? 'border-red-500 bg-red-500'
                                    : 'border-gray-300 group-hover:border-red-400'
                                    }`}>
                                    {answerDisplayFormat === 'japanese' && (
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                </div>
                                <input
                                    type="radio"
                                    value="japanese"
                                    checked={answerDisplayFormat === 'japanese'}
                                    onChange={() => setAnswerDisplayFormat('japanese')}
                                    className="sr-only"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 flex-wrap">
                                        <span className="font-semibold text-gray-800">日本語</span>
                                        <span className="text-sm text-gray-500">(Japanese)</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">Show answers in Japanese characters</p>
                                </div>
                            </label>

                            <label className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${answerDisplayFormat === 'romaji'
                                    ? 'border-red-500 bg-red-500'
                                    : 'border-gray-300 group-hover:border-red-400'
                                    }`}>
                                    {answerDisplayFormat === 'romaji' && (
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                </div>
                                <input
                                    type="radio"
                                    value="romaji"
                                    checked={answerDisplayFormat === 'romaji'}
                                    onChange={() => setAnswerDisplayFormat('romaji')}
                                    className="sr-only"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 flex-wrap">
                                        <span className="font-semibold text-gray-800">Rōmaji</span>
                                        <span className="text-sm text-gray-500">(Romanized)</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">Show answers in Roman alphabet</p>
                                </div>
                            </label>

                            <label className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${answerDisplayFormat === 'both'
                                    ? 'border-red-500 bg-red-500'
                                    : 'border-gray-300 group-hover:border-red-400'
                                    }`}>
                                    {answerDisplayFormat === 'both' && (
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                </div>
                                <input
                                    type="radio"
                                    value="both"
                                    checked={answerDisplayFormat === 'both'}
                                    onChange={() => setAnswerDisplayFormat('both')}
                                    className="sr-only"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 flex-wrap">
                                        <span className="font-semibold text-gray-800">日本語 & Rōmaji</span>
                                        <span className="text-sm text-gray-500">(Both)</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">Show answers in both Japanese and Roman alphabet</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Action Buttons - Fixed */}
                <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onRequestClose}
                            className="px-4 sm:px-6 py-3 text-gray-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onRequestClose}
                            className="px-6 sm:px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default SettingsModal;
