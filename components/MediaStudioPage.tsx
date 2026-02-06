
import React, { useState } from 'react';
import { editImage } from '../services/geminiService';
import { AnalyzeIcon, ReloadIcon, SettingsIcon, SparklesIcon, ExportIcon } from './icons';

const MediaStudioPage: React.FC<{ addToast: (message: string, type: 'info' | 'success' | 'error') => void; }> = ({ addToast }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setEditedImage(null);
            const reader = new FileReader();
            reader.onloadend = () => {
                setOriginalImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditImage = async () => {
        if (!imageFile || !prompt || !originalImage) {
            addToast("Please upload an image and provide an edit prompt.", 'error');
            return;
        }
        setIsLoading(true);
        setEditedImage(null);
        addToast("AI is editing your image...", 'info');
        try {
            // The base64 string from FileReader includes the data URL prefix, which we need to remove.
            const base64Data = originalImage.split(',')[1];
            const resultBase64 = await editImage(base64Data, imageFile.type, prompt);
            setEditedImage(`data:${imageFile.type};base64,${resultBase64}`);
            addToast("Image edit complete!", 'success');
        } catch (error) {
            console.error(error);
            const message = error instanceof Error ? error.message : "Failed to edit image.";
            addToast(message, 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="animate-fade-in space-y-12 pt-8">
            <div className="text-center p-8 bg-white dark:bg-[#121214] rounded-2xl shadow-sm border border-slate-200 dark:border-white/5">
                <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-pink-400 flex items-center justify-center shadow-lg">
                        <SettingsIcon className="w-10 h-10 text-white" />
                    </div>
                </div>
                <h2 className="mt-4 text-3xl font-black text-slate-900 dark:text-white tracking-tight">Media Studio</h2>
                <p className="mt-1 text-base text-slate-600 dark:text-zinc-400 font-medium max-w-2xl mx-auto">
                    Use generative AI to edit images with simple text prompts.
                </p>
            </div>

            <div className="p-6 bg-white dark:bg-[#121214] rounded-xl shadow-sm border border-slate-200 dark:border-white/5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Controls */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">1. Upload an Image</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-zinc-700 border-dashed rounded-md bg-slate-50 dark:bg-black/20">
                                <div className="space-y-1 text-center">
                                    <ExportIcon className="mx-auto h-12 w-12 text-slate-400" />
                                    <div className="flex text-sm text-slate-600 dark:text-zinc-400">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-black/10 rounded-md font-medium text-emerald-600 hover:text-emerald-500 dark:text-indigo-400 dark:hover:text-indigo-300 focus-within:outline-none">
                                            <span className="px-2">Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-zinc-500">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="prompt" className="block text-sm font-medium text-slate-700 dark:text-zinc-300">2. Describe Your Edit</label>
                            <input
                                type="text"
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder='e.g., "Add a retro filter" or "Make the sky purple"'
                                className="mt-1 block w-full shadow-sm sm:text-sm border-slate-300 dark:border-zinc-700 rounded-md bg-white dark:bg-black/20 text-slate-900 dark:text-white px-4 py-3"
                            />
                        </div>
                        <button
                            onClick={handleEditImage}
                            disabled={isLoading || !imageFile || !prompt}
                            className="w-full flex justify-center items-center space-x-2 px-4 py-3 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 disabled:bg-slate-500 dark:disabled:bg-zinc-800"
                        >
                            <SparklesIcon className="w-5 h-5" />
                            <span>{isLoading ? 'Generating...' : 'Generate Edit'}</span>
                        </button>
                    </div>

                    {/* Image Display */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                            <h4 className="font-semibold text-slate-700 dark:text-zinc-300 mb-2">Original</h4>
                            <div className="aspect-square bg-slate-100 dark:bg-white/5 rounded-lg flex items-center justify-center">
                                {originalImage ? <img src={originalImage} alt="Original" className="max-h-full max-w-full rounded-lg" /> : <p className="text-slate-500 dark:text-zinc-500 text-sm">Upload an image</p>}
                            </div>
                        </div>
                        <div className="text-center">
                            <h4 className="font-semibold text-slate-700 dark:text-zinc-300 mb-2">Edited</h4>
                            <div className="aspect-square bg-slate-100 dark:bg-white/5 rounded-lg flex items-center justify-center relative">
                                {isLoading && <ReloadIcon className="w-8 h-8 text-emerald-500 dark:text-indigo-500 animate-spin" />}
                                {editedImage && <img src={editedImage} alt="Edited" className="max-h-full max-w-full rounded-lg" />}
                                {!isLoading && !editedImage && <p className="text-slate-500 dark:text-zinc-500 text-sm">AI-edited image will appear here</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediaStudioPage;
