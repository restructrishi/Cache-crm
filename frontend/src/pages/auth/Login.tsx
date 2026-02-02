import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Login failed');
                } else {
                    const errorText = await response.text();
                    throw new Error(errorText || `Login failed with status: ${response.status}`);
                }
            }

            const data = await response.json();

            // Store exactly what backend sends
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            const roles = (data.user.roles || []).map((r: string) => r.toUpperCase());

            setLoading(false);

            // Route dynamically based on roles (Case Insensitive)
            if (roles.includes('SUPER_ADMIN')) {
                navigate('/super-admin');
            } else if (roles.includes('ORG_ADMIN')) {
                navigate('/admin');
            } else {
                navigate('/app');
            }

        } catch (error: any) {
            setLoading(false);
            alert(error.message || 'An error occurred during login');
        }
    };

    return (
        <div className="h-full w-full overflow-auto flex bg-black text-white custom-scrollbar">
            {/* Left Side - Form */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 relative z-10"
            >
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/20">
                            C
                        </div>
                        <span className="font-bold text-xl tracking-tight">Cache CRM</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                        Welcome back
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Enter your credentials to access your workspace.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6 max-w-md">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Email or User ID</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="text"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-800 rounded-xl text-gray-100 placeholder-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
                                placeholder="name@company.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-sm font-medium text-gray-300">Password</label>
                            <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">Forgot password?</a>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-800 rounded-xl text-gray-100 placeholder-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-white text-black hover:bg-gray-200 font-bold text-lg rounded-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-6"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Sign In'}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>
                </form>

                <div className="mt-8 text-gray-500 text-sm">
                    Don't have an account? <Link to="/signup" className="text-white font-medium hover:underline">Contact Sales</Link>
                </div>
            </motion.div>

            {/* Right Side - Visuals */}
            <div className="hidden lg:flex lg:w-1/2 bg-gray-900 relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-black to-purple-900/40" />
                
                {/* Abstract Shapes */}
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative z-10 max-w-lg p-12"
                >
                    <div className="mb-8 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                        <div className="flex items-center gap-4 mb-4 border-b border-white/10 pb-4">
                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg">System Operational</h3>
                                <p className="text-gray-400 text-sm">All services running smoothly</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Uptime</span>
                                <span className="text-white font-mono">99.99%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Latency</span>
                                <span className="text-white font-mono">24ms</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Security</span>
                                <span className="text-emerald-400 font-medium">Optimal</span>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-4">Enterprise-Grade CRM</h2>
                    <p className="text-gray-400 leading-relaxed">
                        Manage leads, automate workflows, and track performance with the most secure and scalable platform built for modern enterprises.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};
