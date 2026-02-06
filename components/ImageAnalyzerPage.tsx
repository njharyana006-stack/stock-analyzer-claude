
import React, { useState } from 'react';
import { analyzeImage } from '../services/geminiService';
import { AnalyzeIcon, BotIcon, ReloadIcon } from './icons';

const ImageAnalyzerPage: React.FC<{ addToast: (message: string, type: 'info' | 'success' | 'error') => void; }> = ({ addToast }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setAnalysisResult(null);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleAnalyze = async () => {
        if (!imageFile || !prompt || !imagePreview) {
            addToast("Please upload an image and provide a question.", 'error');
            return;
        }
        setIsLoading(true);
        setAnalysisResult(null);
        addToast(`AI is analyzing your image...`, 'info');
        try {
            const base64Data = imagePreview.split(',')[1];
            const result = await analyzeImage(base64Data, imageFile.type, prompt);
            setAnalysisResult(result);
            addToast("Analysis complete!", 'success');
        } catch (error) {
            const message = error instanceof Error ? error.message : `Failed to analyze image.`;
            addToast(message, 'error');
            setAnalysisResult(message);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="animate-fade-in space-y-12 pt-8">
            <div className="text-center p-8 bg-white dark:bg-[#121214] rounded-2xl shadow-sm border border-slate-200 dark:border-white/5">
                <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-400 flex items-center justify-center shadow-lg">
                        <AnalyzeIcon className="w-10 h-10 text-white" />
                    </div>
                </div>
                <h2 className="mt-4 text-3xl font-black text-slate-900 dark:text-white tracking-tight">Image Analyzer</h2>
                <p className="mt-1 text-base text-slate-600 dark:text-zinc-400 font-medium max-w-2xl mx-auto">
                    Upload an image and ask Gemini questions about its content.
                </p>
            </div>
            
            <div className="p-6 bg-white dark:bg-[#121214] rounded-xl shadow-sm border border-slate-200 dark:border-white/5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Upload & Preview */}
                    <div className="space-y-4">
                         <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">1. Upload Image</label>
                            <input id="file-upload" type="file" onChange={handleFileChange} accept="image/*" className="block w-full text-sm text-slate-500 dark:text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-500/20 file:text-indigo-700 dark:file:text-indigo-400 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-500/30"/>
                        </div>
                        <div className="aspect-video bg-slate-100 dark:bg-white/5 rounded-lg flex items-center justify-center">
                            {imagePreview && <img src={imagePreview} alt="Preview" className="max-h-full max-w-full rounded-lg" />}
                            {!imagePreview && <p className="text-slate-500 dark:text-zinc-500 text-sm">Upload a file to see preview</p>}
                        </div>
                    </div>
                    {/* Prompt & Result */}
                     <div className="space-y-4">
                        <div>
                            <label htmlFor="prompt" className="block text-sm font-medium text-slate-700 dark:text-zinc-300">2. Ask a Question</label>
                            <textarea
                                id="prompt"
                                rows={3}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={'e.g., "What is happening in this image?"'}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-slate-300 dark:border-zinc-700 rounded-md bg-white dark:bg-black/20 text-slate-900 dark:text-white p-3"
                            />
                        </div>
                        <button
                            onClick={handleAnalyze}
                            disabled={isLoading || !imageFile || !prompt}
                            className="w-full flex justify-center items-center space-x-2 px-4 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-slate-500 dark:disabled:bg-zinc-800"
                        >
                            <AnalyzeIcon className="w-5 h-5" />
                            <span>{isLoading ? 'Analyzing...' : 'Analyze'}</span>
                        </button>
                         <div className="pt-4">
                             <h4 className="font-semibold text-slate-700 dark:text-zinc-300 mb-2">AI Analysis</h4>
                             <div className="p-4 bg-slate-50 dark:bg-black/20 rounded-lg border border-slate-200 dark:border-white/10 h-48 overflow-y-auto">
                                 {isLoading && <div className="flex items-center space-x-2 text-slate-500 dark:text-zinc-400 text-sm"><ReloadIcon className="w-4 h-4 animate-spin" /><span>Analyzing...</span></div>}
                                 {analysisResult ? <p className="text-slate-700 dark:text-zinc-200 text-sm whitespace-pre-wrap">{analysisResult}</p> : !isLoading && <p className="text-slate-400 dark:text-zinc-600 text-sm">Result will appear here.</p>}
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageAnalyzerPage;
