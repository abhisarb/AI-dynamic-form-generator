import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Database, Zap } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <nav className="w-full py-6 px-8 flex justify-between items-center glass sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                        AI
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
                        FormGen
                    </span>
                </div>
                <div className="flex gap-4">
                    <Link href="/login" className="px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors font-medium">
                        Login
                    </Link>
                    <Link href="/register" className="btn-primary">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
                <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-medium border border-primary-100">
                        <Sparkles className="w-4 h-4" />
                        <span>Powered by Gemini AI & Pinecone</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Generate Intelligent Forms <br />
                        <span className="text-primary-600">in Seconds</span>
                    </h1>

                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Create dynamic, context-aware forms just by describing them.
                        Our AI remembers your past forms and adapts to your needs.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                        <Link href="/register" className="btn-primary text-lg px-8 py-4 flex items-center gap-2 group">
                            Start Generating Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/login" className="btn-secondary text-lg px-8 py-4">
                            View Demo
                        </Link>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-32 px-4">
                    <FeatureCard
                        icon={<Zap className="w-6 h-6 text-yellow-500" />}
                        title="Instant Generation"
                        description="Describe your form in plain English and get a production-ready schema instantly."
                    />
                    <FeatureCard
                        icon={<Database className="w-6 h-6 text-blue-500" />}
                        title="Context Memory"
                        description="Our AI remembers your previous forms to maintain consistency across your organization."
                    />
                    <FeatureCard
                        icon={<Shield className="w-6 h-6 text-green-500" />}
                        title="Secure & Scalable"
                        description="Enterprise-grade security with MongoDB Atlas and Pinecone vector search."
                    />
                </div>
            </main>

            {/* Footer */}
            <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-200 mt-20">
                <p>© 2025 AI Form Generator. All rights reserved.</p>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-left">
            <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}
