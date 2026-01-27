import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getUser } from '../lib/auth';
import { 
    ArrowRight, 
    LayoutDashboard, 
    Bell, 
    CheckCircle2, 
    Sparkles, 
    Zap,
    Shield
} from 'lucide-react';

export const Welcome: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = getUser();
        if (!userData) {
            navigate('/login');
            return;
        }
        setUser(userData);
        setLoading(false);

        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                proceed();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [navigate]);

    const proceed = () => {
        if (!user) return;
        switch (user.role) {
            case 'Super Admin': navigate('/super-admin'); break;
            case 'Admin': navigate('/admin'); break;
            case 'User': navigate('/app'); break;
            default: navigate('/app');
        }
    };

    if (loading) return null;

    const getTimeGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white relative overflow-hidden flex flex-col transition-colors duration-500">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-900/20 dark:via-black dark:to-purple-900/20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Navbar */}
            <header className="relative z-10 p-6 flex justify-between items-center border-b border-gray-100 dark:border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg">C</div>
                    <span className="font-bold text-lg tracking-tight">Cache CRM</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors relative">
                        <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-black" />
                    </button>
                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-white/10">
                        <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-500/20 rounded-full flex items-center justify-center text-sm font-medium text-indigo-600 dark:text-indigo-300">
                            {user.name.charAt(0)}
                        </div>
                        <div className="hidden md:block">
                            <div className="text-sm font-medium">{user.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{user.role}</div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 relative z-10 w-full px-6 py-12 flex flex-col justify-center max-w-screen-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8"
                >
                    {/* Hero Section */}
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-medium uppercase tracking-wider">
                            <Sparkles className="w-3 h-3" /> Workspace Ready
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {getTimeGreeting()}, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-white dark:to-gray-500">
                                {user.name.split(' ')[0]}
                            </span>
                        </h1>
                        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl">
                            Your command center is ready. You have <span className="text-gray-900 dark:text-white font-semibold">3 pending tasks</span> and <span className="text-gray-900 dark:text-white font-semibold">5 unread messages</span> today.
                        </p>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                        <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-none hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-default">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Quick Actions</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Create leads, schedule meetings, or generate quotes instantly from your dashboard.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-none hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-default">
                            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Security Status</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">System is fully operational. Last security scan completed 2 hours ago.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-none hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-default">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Tasks & Goals</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">You're on track! 85% of weekly goals completed. Keep up the momentum.</p>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-8">
                        <button
                            onClick={proceed}
                            className="group flex items-center gap-4 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all transform hover:scale-[1.02] shadow-2xl shadow-indigo-500/20"
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            Enter Workspace
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <p className="mt-4 text-sm text-gray-500 ml-2">
                            Press <kbd className="px-2 py-1 rounded bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/20 font-mono text-xs text-gray-600 dark:text-gray-400">Enter</kbd> to continue
                        </p>
                    </div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="p-6 text-center text-xs text-gray-600 relative z-10">
                <p>Cache CRM v2.0.1 • Enterprise Edition</p>
            </footer>
        </div>
    );
};
