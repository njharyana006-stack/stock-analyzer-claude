
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { SendIcon, BotIcon, UserIcon } from './icons';

interface ChatbotProps {
    ticker: string;
}

// Mock chatbot responses based on keyword matching
function getMockResponse(ticker: string, message: string): string {
    const lower = message.toLowerCase();

    if (lower.includes('risk')) {
        return `Key risks for ${ticker} include: 1) Market volatility and macroeconomic conditions, 2) Sector-specific regulatory changes, 3) Competition from emerging players, and 4) Potential valuation compression if growth slows. Always consider your risk tolerance when investing.`;
    }
    if (lower.includes('news') || lower.includes('latest')) {
        return `Recent developments for ${ticker}: The company has been in the news for strong quarterly performance and strategic partnerships. Analysts are watching upcoming earnings closely. Check the News & Sentiment tab for detailed coverage.`;
    }
    if (lower.includes('competitor') || lower.includes('competition')) {
        return `${ticker}'s main competitors operate in the same sector and include several large-cap companies. The competitive landscape is evolving with new entrants and technological shifts. See the Company Profile tab for more details.`;
    }
    if (lower.includes('buy') || lower.includes('sell') || lower.includes('hold')) {
        return `Based on the mock analysis data, ${ticker} shows mixed signals. Technical indicators suggest monitoring key support and resistance levels. Always do your own research and consider consulting a financial advisor before making investment decisions.`;
    }
    if (lower.includes('price') || lower.includes('target')) {
        return `For ${ticker}, analyst price targets vary. Check the Expert Opinions tab for detailed price target ranges from major Wall Street firms. The consensus view provides high, low, and median targets.`;
    }
    if (lower.includes('dividend')) {
        return `For dividend information on ${ticker}, check the Individual Analysis tab which includes dividend yield data. Not all companies pay dividends - growth companies often reinvest earnings instead.`;
    }

    return `That's a great question about ${ticker}! In this demo mode, I'm providing simulated responses. In the full version, this chatbot would be powered by Gemini AI for real-time, context-aware financial analysis. Try asking about risks, competitors, price targets, or recent news.`;
}

const Chatbot: React.FC<ChatbotProps> = ({ ticker }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const examplePrompts = [
        `What are the key risks for ${ticker}?`,
        `Summarize the latest news about ${ticker}.`,
        `Who are ${ticker}'s main competitors?`
    ];

    useEffect(() => {
        setMessages([{
            role: 'model',
            text: `Hello! How can I help you with ${ticker} today? (Demo mode - responses are simulated)`
        }]);
    }, [ticker]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (prompt?: string) => {
        const textToSend = prompt || input;
        if (!textToSend.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: textToSend };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Simulate typing delay
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

        const response = getMockResponse(ticker, textToSend);
        setMessages(prev => [...prev, { role: 'model', text: response }]);
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col h-[75vh] bg-white rounded-2xl shadow-md border border-[var(--border)]">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-4 animate-fade-in ${msg.role === 'user' ? 'justify-end' : ''}`}>
                       {msg.role === 'model' && <div className="p-2 bg-indigo-100 rounded-full flex-shrink-0"><BotIcon className="w-6 h-6 text-indigo-600" /></div>}
                        <div className={`max-w-xl p-3 px-4 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-lg' : 'bg-slate-100 text-slate-800 rounded-bl-lg'}`}>
                            <p className="prose prose-sm max-w-none leading-relaxed">{msg.text}{isLoading && msg.role === 'model' && index === messages.length -1 && <span className="inline-block w-1 h-4 ml-1 bg-slate-500 rounded-full animate-pulse"></span>}</p>
                        </div>
                        {msg.role === 'user' && <div className="p-2 bg-slate-200 rounded-full flex-shrink-0"><UserIcon className="w-6 h-6 text-slate-600" /></div>}
                    </div>
                ))}

                {messages.length <= 1 && !isLoading && (
                    <div className="pt-4 animate-fade-in">
                         <p className="text-sm text-center text-slate-500 mb-3">Or try one of these:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {examplePrompts.map(prompt => (
                                <button key={prompt} onClick={() => handleSend(prompt)} className="p-2 text-sm text-center text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex items-center gap-4 border-t border-[var(--border)] p-4 bg-white/50 rounded-b-2xl">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask a follow-up question..."
                    className="flex-1 w-full bg-slate-50 border-slate-300 rounded-lg shadow-inner text-slate-800 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    disabled={isLoading}
                />
                <button onClick={() => handleSend()} disabled={isLoading || !input.trim()} className="p-3 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all shadow-sm">
                    <SendIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
