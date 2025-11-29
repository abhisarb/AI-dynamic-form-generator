"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Loader2, Save } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import DynamicFormRenderer from "@/components/DynamicFormRenderer";
import { useAuth } from "@/context/AuthContext";

export default function GeneratePage() {
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedForm, setGeneratedForm] = useState<any>(null);
    const [contextInfo, setContextInfo] = useState<any>(null);
    const router = useRouter();
    const { token } = useAuth();

    const handleGenerate = async () => {
        if (!prompt.trim() || prompt.length < 10) {
            toast.error("Please enter a detailed prompt (at least 10 characters)");
            return;
        }

        setIsGenerating(true);
        setGeneratedForm(null);

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/forms/generate`,
                { prompt },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success) {
                setGeneratedForm(response.data.data.form);
                setContextInfo(response.data.data.context);
                toast.success("Form generated successfully!");
            }
        } catch (error: any) {
            console.error("Generation error:", error);
            toast.error(error.response?.data?.message || "Failed to generate form");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = () => {
        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Generate New Form
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Describe your form in detail, and our AI will build it for you using context from your past forms.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="space-y-6">
                        <div className="glass-card p-6 rounded-xl">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                What kind of form do you need?
                            </label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="E.g., I need a job application form for a software engineer role. Include fields for personal info, resume upload, GitHub link, and years of experience."
                                className="input-field min-h-[150px] resize-none"
                                disabled={isGenerating}
                            />

                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !prompt.trim()}
                                    className="btn-primary flex items-center gap-2"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            Generate Form
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Context Info */}
                        {contextInfo && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 animate-fade-in">
                                <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">
                                    AI Context Memory
                                </h3>
                                <p className="text-sm text-blue-600 dark:text-blue-400">
                                    {contextInfo.usedRelevantForms
                                        ? `Used ${contextInfo.relevantFormsCount} relevant past forms to inform this generation.`
                                        : "No relevant past forms found. Used general knowledge."}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Preview Section */}
                    <div className="lg:border-l lg:border-gray-200 dark:lg:border-gray-700 lg:pl-8">
                        {generatedForm ? (
                            <div className="animate-fade-in space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Preview
                                    </h2>
                                    <button onClick={handleSave} className="btn-primary flex items-center gap-2 text-sm">
                                        <Save className="w-4 h-4" />
                                        Save & Finish
                                    </button>
                                </div>

                                <div className="glass-card p-8 rounded-xl border-2 border-primary-100 dark:border-primary-900">
                                    <DynamicFormRenderer
                                        schema={generatedForm.schema}
                                        onSubmit={() => { }}
                                        readOnly={true}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-12 min-h-[400px]">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                    <Sparkles className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-center">
                                    Your generated form preview <br /> will appear here
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
