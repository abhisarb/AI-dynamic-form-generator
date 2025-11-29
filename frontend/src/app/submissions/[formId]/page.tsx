"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Loader2, Calendar } from "lucide-react";
import axios from "axios";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";

export default function SubmissionsPage() {
    const params = useParams();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/submissions/form/${params.formId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (response.data.success) {
                    setData(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch submissions:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (params.formId) {
            fetchSubmissions();
        }
    }, [params.formId, token]);

    const exportToCSV = () => {
        if (!data?.submissions.length) return;

        // Get all unique keys from responses
        const headers = new Set<string>();
        data.submissions.forEach((sub: any) => {
            Object.keys(sub.responses).forEach((key) => headers.add(key));
        });

        const headerArray = Array.from(headers);
        const csvContent = [
            ["Submitted At", ...headerArray].join(","),
            ...data.submissions.map((sub: any) => {
                const row = [
                    format(new Date(sub.submittedAt), "yyyy-MM-dd HH:mm:ss"),
                    ...headerArray.map((key) => {
                        const val = sub.responses[key];
                        return typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : val;
                    }),
                ];
                return row.join(",");
            }),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${data.form.title}_submissions.csv`;
        link.click();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-2"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {data?.form.title}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {data?.count} total submissions
                        </p>
                    </div>

                    {data?.count > 0 && (
                        <button
                            onClick={exportToCSV}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                    )}
                </div>

                {data?.submissions.length > 0 ? (
                    <div className="glass-card rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white font-semibold">
                                    <tr>
                                        <th className="p-4 whitespace-nowrap">Submitted At</th>
                                        {Object.keys(data.submissions[0].responses).map((key) => (
                                            <th key={key} className="p-4 whitespace-nowrap capitalize">
                                                {key.replace(/_/g, " ")}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {data.submissions.map((submission: any) => (
                                        <tr key={submission._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="p-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    {format(new Date(submission.submittedAt), "MMM d, HH:mm")}
                                                </div>
                                            </td>
                                            {Object.entries(submission.responses).map(([key, value]: [string, any]) => (
                                                <td key={key} className="p-4 text-gray-900 dark:text-gray-200">
                                                    {typeof value === "string" && value.startsWith("http") && value.includes("cloudinary") ? (
                                                        <a
                                                            href={value}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary-600 hover:underline inline-flex items-center gap-1"
                                                        >
                                                            View File
                                                        </a>
                                                    ) : (
                                                        <span className="line-clamp-2">{String(value)}</span>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400">
                            No submissions yet. Share your form link to start collecting responses.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
