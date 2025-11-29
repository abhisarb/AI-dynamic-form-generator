"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const schema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
                {
                    email: data.email,
                    password: data.password,
                }
            );

            if (response.data.success) {
                toast.success("Account created successfully!");
                login(response.data.data.token, response.data.data.user);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md glass-card p-8 rounded-2xl animate-slide-up">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
                    <p className="text-gray-600 dark:text-gray-400">Start generating intelligent forms today</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email Address
                        </label>
                        <input
                            {...register("email")}
                            type="email"
                            className="input-field"
                            placeholder="you@example.com"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Password
                        </label>
                        <input
                            {...register("password")}
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Confirm Password
                        </label>
                        <input
                            {...register("confirmPassword")}
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-primary flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Creating Account...
                            </>
                        ) : (
                            "Sign Up"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary-600 hover:underline font-medium">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
