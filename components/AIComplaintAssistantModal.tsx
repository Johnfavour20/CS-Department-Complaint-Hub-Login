import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { XMarkIcon, SparklesIcon } from './icons';

interface AIComplaintAssistantModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyDescription: (description: string) => void;
}

const AIComplaintAssistantModal: React.FC<AIComplaintAssistantModalProps> = ({ isOpen, onClose, onApplyDescription }) => {
    const [keywords, setKeywords] = useState('');
    const [generatedDescription, setGeneratedDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!keywords.trim()) {
            setError('Please provide some keywords or a short sentence about your complaint.');
            return;
        }

        setIsLoading(true);
        setError('');
        setGeneratedDescription('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `You are a helpful assistant for a university student. Your task is to write a formal and detailed complaint for the Computer Science department based on the student's keywords. The tone should be respectful but firm, clearly stating the problem and what the student has observed. Expand on the following points: "${keywords}". Provide only the complaint description text, without any introductory phrases like 'Here is the description:'.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            setGeneratedDescription(response.text.trim());
        } catch (err) {
            console.error(err);
            setError('Failed to generate description. Please check your connection or try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = () => {
        onApplyDescription(generatedDescription);
    };
    
    const handleClose = () => {
        // Reset state on close
        setKeywords('');
        setGeneratedDescription('');
        setError('');
        setIsLoading(false);
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60] animate-fade-in" onClick={handleClose}>
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl m-4 transform transition-all" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                        <SparklesIcon className="w-7 h-7 text-brand-secondary" />
                        <h2 className="text-2xl font-bold text-brand-primary">AI Complaint Assistant</h2>
                    </div>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="ai-keywords" className="block text-sm font-medium text-gray-700">Describe your issue in a few words</label>
                        <textarea
                            id="ai-keywords"
                            rows={2}
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-secondary focus:border-brand-secondary"
                            placeholder="e.g., wrong grade for COS 301, AC in lecture hall 2 is not working..."
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex justify-end">
                         <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="flex items-center space-x-2 py-2 px-4 bg-brand-secondary text-white rounded-lg hover:bg-brand-primary transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Generating...</span>
                                </>
                            ) : (
                                <>
                                    <SparklesIcon className="w-5 h-5" />
                                    <span>Generate Description</span>
                                </>
                            )}
                        </button>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    
                    {generatedDescription && !isLoading && (
                        <div className="animate-fade-in">
                            <label htmlFor="ai-generated" className="block text-sm font-medium text-gray-700">Generated Description</label>
                            <textarea
                                id="ai-generated"
                                rows={8}
                                value={generatedDescription}
                                readOnly
                                className="mt-1 block w-full bg-gray-50 border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-4 pt-6 mt-6 border-t">
                    <button type="button" onClick={handleClose} className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                    <button
                        type="button"
                        onClick={handleApply}
                        disabled={!generatedDescription || isLoading}
                        className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Use This Description
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIComplaintAssistantModal;
