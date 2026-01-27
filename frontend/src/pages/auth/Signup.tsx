import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Building, User, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const Signup: React.FC = () => {
    const [formData, setFormData] = useState({
        orgName: '',
        fullName: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API Call
        setTimeout(() => {
            localStorage.setItem('token', 'super-admin-jwt');
            localStorage.setItem('user', JSON.stringify({
                name: formData.fullName,
                role: 'Super Admin',
                org: formData.orgName
            }));
            setLoading(false);
            navigate('/welcome'); // Goes to Transition -> Dashboard
        }, 1500);
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
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-500/20">
                            C
                        </div>
                        <span className="font-bold text-xl tracking-tight">Cache CRM</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                        Start your journey
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Create your organization workspace in seconds.
                    </p>
                </div>

                <form onSubmit={handleSignup} className="space-y-5 max-w-md">

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-300 ml-1">Organization Name</label>
                        <div className="relative group">
                            <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-emerald-400 transition-colors" />
                            <input
                                type="text"
                                required
                                value={formData.orgName}
                                onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-800 rounded-xl text-gray-100 placeholder-gray-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none"
                                placeholder="Acme Corp"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-emerald-400 transition-colors" />
                            <input
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-800 rounded-xl text-gray-100 placeholder-gray-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-300 ml-1">Work Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-emerald-400 transition-colors" />
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-800 rounded-xl text-gray-100 placeholder-gray-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none"
                                placeholder="john@acme.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-emerald-400 transition-colors" />
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-800 rounded-xl text-gray-100 placeholder-gray-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none"
                                placeholder="Min 8 characters"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 mt-6 bg-white text-black hover:bg-gray-200 font-bold text-lg rounded-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Create Organization'}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>
                </form>

                <p className="mt-8 text-gray-500 text-sm">
                    Already have an account? <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline">Log in</Link>
                </p>
            </motion.div>

            {/* Right Side - Visuals */}
            <div className="hidden lg:flex lg:w-1/2 bg-gray-900 relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-black to-teal-900/40" />
                
                {/* Abstract Shapes */}
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-teal-500/20 rounded-full blur-[100px]" />

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative z-10 max-w-lg p-12"
                >
                    <div className="mb-8 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                        <div className="flex items-center gap-4 mb-4 border-b border-white/10 pb-4">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg">Secure by Default</h3>
                                <p className="text-gray-400 text-sm">Enterprise-grade protection</p>
                            </div>
                        </div>
                        <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
                            <p>Your data is encrypted at rest and in transit. We maintain the highest standards of security compliance to keep your business safe.</p>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-4">Scale with Confidence</h2>
                    <p className="text-gray-400 leading-relaxed">
                        Join over 10,000+ companies using Cache CRM to drive growth and streamline operations.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};
