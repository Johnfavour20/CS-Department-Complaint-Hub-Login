import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob as GenAI_Blob, LiveSession } from "@google/genai";
import { useAuth } from '../contexts/AuthContext';
import { encode, decode, decodeAudioData } from '../utils/audioUtils';
import { XMarkIcon, MicrophoneIcon, StopIcon, UserIcon } from './icons';

interface Message {
    id: number;
    sender: 'user' | 'model';
    text: string;
}

interface LiveChatModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LiveChatModal: React.FC<LiveChatModalProps> = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [isRecording, setIsRecording] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
    const messageContainerRef = useRef<HTMLDivElement>(null);

    const sessionPromise = useRef<Promise<LiveSession> | null>(null);
    const inputAudioContext = useRef<AudioContext | null>(null);
    const outputAudioContext = useRef<AudioContext | null>(null);
    const nextStartTime = useRef(0);
    const outputSources = useRef(new Set<AudioBufferSourceNode>());
    const scriptProcessor = useRef<ScriptProcessorNode | null>(null);
    const mediaStream = useRef<MediaStream | null>(null);
    const mediaStreamSource = useRef<MediaStreamAudioSourceNode | null>(null);

    const currentInputTranscription = useRef('');
    const currentOutputTranscription = useRef('');

    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]);
    
    const stopConversation = useCallback(async () => {
        setIsRecording(false);
        if (sessionPromise.current) {
            try {
                const session = await sessionPromise.current;
                session.close();
            } catch (e) {
                console.error("Error closing session:", e);
            }
            sessionPromise.current = null;
        }

        if (scriptProcessor.current) {
            scriptProcessor.current.disconnect();
            scriptProcessor.current = null;
        }
        if (mediaStreamSource.current) {
            mediaStreamSource.current.disconnect();
            mediaStreamSource.current = null;
        }
        if (mediaStream.current) {
            mediaStream.current.getTracks().forEach(track => track.stop());
            mediaStream.current = null;
        }
        if (inputAudioContext.current && inputAudioContext.current.state !== 'closed') {
            await inputAudioContext.current.close();
            inputAudioContext.current = null;
        }
        if (outputAudioContext.current && outputAudioContext.current.state !== 'closed') {
            await outputAudioContext.current.close();
            outputAudioContext.current = null;
        }

        outputSources.current.forEach(source => source.stop());
        outputSources.current.clear();
        nextStartTime.current = 0;
        
        setStatus('idle');
    }, []);

    const handleClose = useCallback(() => {
        if (isRecording) {
            stopConversation();
        }
        onClose();
    }, [isRecording, onClose, stopConversation]);
    
    const startConversation = async () => {
        if (isRecording) return;
        
        setIsRecording(true);
        setStatus('connecting');
        setMessages([{ id: Date.now(), sender: 'model', text: 'Connecting to live support... Please allow microphone access.' }]);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStream.current = stream;

            // FIX: Cast window to `any` to allow access to `webkitAudioContext` for older browser compatibility without TypeScript errors.
            inputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            // FIX: Cast window to `any` to allow access to `webkitAudioContext` for older browser compatibility without TypeScript errors.
            outputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

            sessionPromise.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setStatus('connected');
                        setMessages(prev => prev.map(m => m.text.includes('Connecting') ? { ...m, text: 'Connected! How can I help you today?' } : m));
                        
                        mediaStreamSource.current = inputAudioContext.current!.createMediaStreamSource(mediaStream.current!);
                        scriptProcessor.current = inputAudioContext.current!.createScriptProcessor(4096, 1, 1);
                        
                        scriptProcessor.current.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob: GenAI_Blob = {
                                data: encode(new Uint8Array(new Int16Array(inputData.map(v => v * 32768)).buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            if (sessionPromise.current) {
                                sessionPromise.current.then((session) => {
                                    session.sendRealtimeInput({ media: pcmBlob });
                                });
                            }
                        };
                        mediaStreamSource.current.connect(scriptProcessor.current);
                        scriptProcessor.current.connect(inputAudioContext.current!.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            const text = message.serverContent.inputTranscription.text;
                            currentInputTranscription.current += text;
                            setMessages(prev => {
                                const lastMessage = prev[prev.length - 1];
                                if (lastMessage?.sender === 'user') {
                                    lastMessage.text = currentInputTranscription.current;
                                    return [...prev.slice(0, -1), lastMessage];
                                } else {
                                    return [...prev, { id: Date.now(), sender: 'user', text: currentInputTranscription.current }];
                                }
                            });
                        }

                        if (message.serverContent?.outputTranscription) {
                            const text = message.serverContent.outputTranscription.text;
                            currentOutputTranscription.current += text;
                             setMessages(prev => {
                                const lastMessage = prev[prev.length - 1];
                                if (lastMessage?.sender === 'model') {
                                    lastMessage.text = currentOutputTranscription.current;
                                    return [...prev.slice(0, -1), lastMessage];
                                } else {
                                    return [...prev, { id: Date.now(), sender: 'model', text: currentOutputTranscription.current }];
                                }
                            });
                        }
                        
                        const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                        if (audioData && outputAudioContext.current) {
                             const oac = outputAudioContext.current;
                             nextStartTime.current = Math.max(nextStartTime.current, oac.currentTime);
                             const audioBuffer = await decodeAudioData(decode(audioData), oac, 24000, 1);
                             const source = oac.createBufferSource();
                             source.buffer = audioBuffer;
                             source.connect(oac.destination);
                             source.addEventListener('ended', () => {
                                 outputSources.current.delete(source);
                             });
                             source.start(nextStartTime.current);
                             nextStartTime.current += audioBuffer.duration;
                             outputSources.current.add(source);
                        }

                        if (message.serverContent?.turnComplete) {
                            currentInputTranscription.current = '';
                            currentOutputTranscription.current = '';
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live session error:', e);
                        setStatus('error');
                        setMessages(prev => [...prev, { id: Date.now(), sender: 'model', text: 'Sorry, a connection error occurred.' }]);
                        stopConversation();
                    },
                    onclose: (e: CloseEvent) => {
                        console.log('Live session closed');
                        stopConversation();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    systemInstruction: `You are a friendly and helpful AI support agent for the university's STUDENT'S COMPLAINTS MANAGEMENT SYSTEM. Your goal is to assist students and administrators. Be concise, empathetic, and professional. Greet the user and ask how you can help. The user's name is ${user?.name}.`,
                },
            });

        } catch (error) {
            console.error("Failed to start conversation:", error);
            setStatus('error');
            setMessages(prev => prev.map(m => m.text.includes('Connecting') ? { ...m, text: 'Could not start the session. Please check your microphone permissions and try again.' } : m));
            setIsRecording(false);
        }
    };
    
    const toggleConversation = () => {
        if (isRecording) {
            stopConversation();
        } else {
            startConversation();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in" onClick={handleClose}>
            <div className="bg-white rounded-lg shadow-2xl flex flex-col w-full max-w-lg h-[70vh] m-4" onClick={e => e.stopPropagation()}>
                <header className="flex-shrink-0 flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-brand-primary">Live Support Chat</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>
                
                <div ref={messageContainerRef} className="flex-grow p-4 space-y-4 overflow-y-auto bg-gray-50">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'model' && (
                                <div className="flex-shrink-0 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-bold">AI</div>
                            )}
                            <div className={`max-w-[80%] rounded-xl px-4 py-2 ${msg.sender === 'user' ? 'bg-brand-secondary text-white rounded-br-none' : 'bg-gray-200 text-brand-dark rounded-bl-none'}`}>
                                <p className="text-sm">{msg.text || '...'}</p>
                            </div>
                             {msg.sender === 'user' && (
                                <div className="flex-shrink-0">
                                    {user?.profilePictureUrl ? (
                                        <img src={user.profilePictureUrl} alt="You" className="w-8 h-8 rounded-full object-cover"/>
                                    ) : (
                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                            <UserIcon className="w-5 h-5 text-gray-500" />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <footer className="flex-shrink-0 p-4 border-t flex flex-col items-center gap-2">
                     <button
                        onClick={toggleConversation}
                        disabled={status === 'connecting'}
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-colors duration-300 shadow-lg ${
                            isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                        } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                        aria-label={isRecording ? 'Stop conversation' : 'Start conversation'}
                    >
                         {isRecording ? <StopIcon className="w-8 h-8" /> : <MicrophoneIcon className="w-8 h-8" />}
                    </button>
                    <p className="text-xs text-gray-500 capitalize">{status}</p>
                </footer>
            </div>
        </div>
    );
};

export default LiveChatModal;