import React, { useState } from 'react';
import Modal from 'react-modal';

interface ApiKeyModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onApiKeySubmit: (apiKey: string) => void;
}

Modal.setAppElement('#__next');

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onRequestClose, onApiKeySubmit }) => {
    const [apiKey, setApiKey] = useState<string>('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (apiKey.trim()) {
            onApiKeySubmit(apiKey.trim());
            onRequestClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Enter API Key"
            className="bg-white p-8 rounded-lg shadow-xl max-w-sm mx-auto mt-20 focus:outline-none"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Enter Your Gemini API Key</h2>
            <p className="mb-4 text-gray-700">To use this app, please enter your Google AI Studio API key.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg mb-4"
                    placeholder="Your API Key"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                    Save Key
                </button>
            </form>
        </Modal>
    );
};

export default ApiKeyModal;