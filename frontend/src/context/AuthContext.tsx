"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

interface User {
    id: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Check for stored token on mount
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            // Configure axios default header
            axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        }
        setLoading(false);
    }, []);

    const login = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(newUser));
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        router.push("/dashboard");
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
        router.push("/login");
    };

    // Protected routes check
    useEffect(() => {
        const publicRoutes = ["/", "/login", "/register"];
        const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith("/form/");

        if (!loading && !token && !isPublicRoute) {
            router.push("/login");
        }
    }, [token, loading, pathname, router]);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                logout,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
