import React from "react";
import { useForm } from "react-hook-form";
import { Upload, X } from "lucide-react";
import ImageUpload from "./ImageUpload";

interface FormField {
    id: string;
    label: string;
    type: string;
    placeholder?: string;
    required?: boolean;
    options?: string[];
    validation?: any;
}

interface FormSchema {
    title: string;
    description?: string;
    fields: FormField[];
}

interface DynamicFormRendererProps {
    schema: FormSchema;
    onSubmit: (data: any) => void;
    isSubmitting?: boolean;
    readOnly?: boolean;
}

export default function DynamicFormRenderer({
    schema,
    onSubmit,
    isSubmitting = false,
    readOnly = false,
}: DynamicFormRendererProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm();

    const renderField = (field: FormField) => {
        const commonProps = {
            disabled: readOnly || isSubmitting,
            className: "input-field",
            placeholder: field.placeholder,
        };

        const validationRules = {
            required: field.required ? "This field is required" : false,
            ...field.validation,
        };

        switch (field.type) {
            case "textarea":
                return (
                    <textarea
                        {...register(field.id, validationRules)}
                        {...commonProps}
                        rows={4}
                    />
                );

            case "select":
                return (
                    <select {...register(field.id, validationRules)} {...commonProps}>
                        <option value="">Select an option</option>
                        {field.options?.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                );

            case "radio":
                return (
                    <div className="space-y-2">
                        {field.options?.map((option) => (
                            <label key={option} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value={option}
                                    {...register(field.id, validationRules)}
                                    disabled={readOnly || isSubmitting}
                                    className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                                />
                                <span className="text-gray-700 dark:text-gray-300">{option}</span>
                            </label>
                        ))}
                    </div>
                );

            case "checkbox":
                return (
                    <div className="space-y-2">
                        {field.options?.map((option) => (
                            <label key={option} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    value={option}
                                    {...register(field.id, validationRules)}
                                    disabled={readOnly || isSubmitting}
                                    className="rounded text-primary-600 border-gray-300 focus:ring-primary-500"
                                />
                                <span className="text-gray-700 dark:text-gray-300">{option}</span>
                            </label>
                        ))}
                    </div>
                );

            case "file":
                return (
                    <ImageUpload
                        onUpload={(url) => setValue(field.id, url)}
                        disabled={readOnly || isSubmitting}
                    />
                );

            default:
                return (
                    <input
                        type={field.type}
                        {...register(field.id, validationRules)}
                        {...commonProps}
                    />
                );
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {schema.title}
                </h2>
                {schema.description && (
                    <p className="text-gray-600 dark:text-gray-400">{schema.description}</p>
                )}
            </div>

            {schema.fields.map((field) => (
                <div key={field.id} className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>

                    {renderField(field)}

                    {errors[field.id] && (
                        <p className="text-red-500 text-sm">
                            {errors[field.id]?.message as string}
                        </p>
                    )}
                </div>
            ))}

            {!readOnly && (
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary mt-8"
                >
                    {isSubmitting ? "Submitting..." : "Submit"}
                </button>
            )}
        </form>
    );
}
