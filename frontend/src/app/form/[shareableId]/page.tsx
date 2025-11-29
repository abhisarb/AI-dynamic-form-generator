"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Loader2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import DynamicFormRenderer from "@/components/DynamicFormRenderer";

export default function PublicFormPage() {
    const params = useParams();
    const [form, setForm] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/public/form/${params.shareableId}`
                );
                if (response.data.success) {
                    setForm(response.data.data.form);
                }
            } catch (error) {
                setError("Form not found or unavailable");
            } finally {
                setIsLoading(false);
            }
        };

        if (params.shareableId) {
            fetchForm();
        }
    }, [params.shareableId]);

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            // Separate image URLs from other data if needed
            // For now, we assume image URLs are already in the data object from the renderer

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/public/form/${params.shareableId}/submit`,
                {
                    responses: data,
                    // Extract image URLs if they are top-level fields, or let backend handle it
                }
            );

            if (response.data.success) {
                setIsSuccess(true);
                toast.success("Form submitted successfully!");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Submission failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error</h1>
                    <p className="text-gray-600 dark:text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                <div className="max-w-md w-full glass-card p-8 rounded-2xl text-center animate-fade-in">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Thank You!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Your submission has been received successfully.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-primary"
                    >
                        Submit Another Response
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="glass-card p-8 rounded-2xl shadow-xl animate-slide-up">
                    <DynamicFormRenderer
                        schema={form.schema}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                    />
                </div>

                <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    Powered by <span className="font-semibold text-primary-600">AI FormGen</span>
                </div>
            </div>
        </div>
    );
}
