import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
    title: "AI Form Generator",
    description: "Generate dynamic forms with AI and context-aware memory",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
                <AuthProvider>
                    {children}
                    <Toaster position="bottom-right" />
                </AuthProvider>
            </body>
        </html>
    );
}
