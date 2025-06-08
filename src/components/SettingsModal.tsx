import React from 'react';
import Modal from 'react-modal';

interface SettingsModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    questionLanguage: 'english' | 'japanese';
    setQuestionLanguage: (language: 'english' | 'japanese') => void;
    answerDisplayFormat: 'japanese' | 'romaji';
    setAnswerDisplayFormat: (format: 'japanese' | 'romaji') => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onRequestClose,
    questionLanguage,
    setQuestionLanguage,
    answerDisplayFormat,
    setAnswerDisplayFormat,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Settings Modal"
            className="Modal"
            overlayClassName="Overlay"
        >
            <h2 className="text-2xl font-bold mb-4 text-black">Settings</h2>
            <div className="mb-4">
                <span className="font-semibold text-gray-700">Question Language:</span>
                <div className="mt-2">
                    <label className="inline-flex items-center mr-4">
                        <input
                            type="radio"
                            value="japanese"
                            checked={questionLanguage === 'japanese'}
                            onChange={() => setQuestionLanguage('japanese')}
                            className="form-radio text-blue-600"
                        />
                        <span className="ml-2 text-gray-800">Japanese (Fill-in-the-blank)</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            value="english"
                            checked={questionLanguage === 'english'}
                            onChange={() => setQuestionLanguage('english')}
                            className="form-radio text-blue-600"
                        />
                        <span className="ml-2 text-gray-800">English</span>
                    </label>
                </div>
            </div>
            <div className="mb-4">
                <span className="font-semibold text-gray-700">Answer Display:</span>
                <div className="mt-2">
                    <label className="inline-flex items-center mr-4">
                        <input
                            type="radio"
                            value="japanese"
                            checked={answerDisplayFormat === 'japanese'}
                            onChange={() => setAnswerDisplayFormat('japanese')}
                            className="form-radio text-blue-600"
                        />
                        <span className="ml-2 text-gray-800">Japanese</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            value="romaji"
                            checked={answerDisplayFormat === 'romaji'}
                            onChange={() => setAnswerDisplayFormat('romaji')}
                            className="form-radio text-blue-600"
                        />
                        <span className="ml-2 text-gray-800">Rōmaji</span>
                    </label>
                </div>
            </div>
            <div className="flex justify-end">
                <button
                    onClick={onRequestClose}
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Close
                </button>
            </div>
        </Modal>
    );
};

export default SettingsModal;
