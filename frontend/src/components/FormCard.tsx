import Link from "next/link";
import { format } from "date-fns";
import { Copy, Eye, Trash2, ExternalLink, FileText } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

interface FormCardProps {
    form: {
        _id: string;
        title: string;
        description?: string;
        shareableId: string;
        createdAt: string;
    };
    onDelete: (id: string) => void;
}

export default function FormCard({ form, onDelete }: FormCardProps) {
    const copyLink = () => {
        const link = `${window.location.origin}/form/${form.shareableId}`;
        navigator.clipboard.writeText(link);
        toast.success("Link copied to clipboard!");
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this form?")) {
            try {
                await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/forms/${form._id}`);
                onDelete(form._id);
                toast.success("Form deleted successfully");
            } catch (error) {
                toast.error("Failed to delete form");
            }
        }
    };

    return (
        <div className="glass-card p-6 rounded-xl hover:shadow-xl transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-primary-600 dark:text-primary-400">
                    <FileText className="w-6 h-6" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={copyLink}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 hover:text-primary-600 transition-colors"
                        title="Copy Public Link"
                    >
                        <Copy className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-500 hover:text-red-600 transition-colors"
                        title="Delete Form"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                {form.title}
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 h-10">
                {form.description || "No description provided"}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                <span className="text-xs text-gray-400">
                    {format(new Date(form.createdAt), "MMM d, yyyy")}
                </span>

                <div className="flex gap-3">
                    <Link
                        href={`/submissions/${form._id}`}
                        className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors flex items-center gap-1"
                    >
                        <Eye className="w-4 h-4" />
                        Submissions
                    </Link>
                    <Link
                        href={`/form/${form.shareableId}`}
                        target="_blank"
                        className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1"
                    >
                        <ExternalLink className="w-4 h-4" />
                        View
                    </Link>
                </div>
            </div>
        </div>
    );
}
