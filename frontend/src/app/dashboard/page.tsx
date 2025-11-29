"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Loader2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import FormCard from "@/components/FormCard";

interface Form {
    _id: string;
    title: string;
    description?: string;
    shareableId: string;
    createdAt: string;
}

export default function DashboardPage() {
    const [forms, setForms] = useState<Form[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const { user, logout } = useAuth();

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/forms`);
                if (response.data.success) {
                    setForms(response.data.data.forms);
                }
            } catch (error) {
                console.error("Failed to fetch forms:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchForms();
    }, []);

    const filteredForms = forms.filter((form) =>
        form.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = (id: string) => {
        setForms(forms.filter((f) => f._id !== id));
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Navbar */}
            <nav className="glass sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/dashboard" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
                                AI FormGen
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                                {user?.email}
                            </span>
                            <button
                                onClick={logout}
                                className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Forms</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Manage and track your AI-generated forms
                        </p>
                    </div>
                    <Link href="/generate" className="btn-primary flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Create New Form
                    </Link>
                </div>

                {/* Search and Filter */}
                <div className="mb-8">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search forms..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field pl-10"
                        />
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                    </div>
                ) : filteredForms.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        {filteredForms.map((form) => (
                            <FormCard key={form._id} form={form} onDelete={handleDelete} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No forms created yet
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                            Get started by creating your first AI-powered form. Just describe what you need, and we'll build it for you.
                        </p>
                        <Link href="/generate" className="btn-primary inline-flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            Create Form
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
