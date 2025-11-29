import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

interface ImageUploadProps {
    onUpload: (url: string) => void;
    disabled?: boolean;
}

export default function ImageUpload({ onUpload, disabled = false }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (!file) return;

            setUploading(true);
            const formData = new FormData();
            formData.append("image", file);

            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/upload/image`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if (response.data.success) {
                    const url = response.data.data.url;
                    setPreview(url);
                    onUpload(url);
                    toast.success("Image uploaded successfully");
                }
            } catch (error) {
                console.error("Upload error:", error);
                toast.error("Failed to upload image");
            } finally {
                setUploading(false);
            }
        },
        [onUpload]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
        },
        maxFiles: 1,
        disabled: disabled || uploading,
    });

    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        onUpload("");
    };

    return (
        <div className="w-full">
            {preview ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group">
                    <img
                        src={preview}
                        alt="Uploaded preview"
                        className="w-full h-full object-cover"
                    />
                    {!disabled && (
                        <button
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            type="button"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive
                            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                            : "border-gray-300 hover:border-primary-400 dark:border-gray-700"
                        } ${disabled || uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
                        {uploading ? (
                            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                        ) : (
                            <Upload className="w-8 h-8" />
                        )}
                        <p className="text-sm font-medium">
                            {uploading
                                ? "Uploading..."
                                : isDragActive
                                    ? "Drop the image here"
                                    : "Drag & drop an image, or click to select"}
                        </p>
                        <p className="text-xs">PNG, JPG, GIF up to 5MB</p>
                    </div>
                </div>
            )}
        </div>
    );
}
