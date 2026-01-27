import React from 'react';
import { motion } from 'framer-motion';
import { Construction, ArrowLeft, Bell, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ComingSoonProps {
    title: string;
    description?: string;
    features?: string[];
}

export const ComingSoon: React.FC<ComingSoonProps> = ({ 
    title, 
    description = "We're working hard to bring this feature to you. Stay tuned for updates!",
    features = ["Advanced Analytics", "Automated Workflows", "Custom Reporting"]
}) => {
    const navigate = useNavigate();

    return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-3xl p-12 shadow-2xl shadow-gray-200/50 dark:shadow-none relative overflow-hidden"
            >
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gray-900 via-gray-600 to-gray-400 dark:from-white dark:via-gray-400 dark:to-gray-600" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-gray-900/5 dark:bg-white/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gray-900/5 dark:bg-white/5 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-gray-100 dark:border-white/5">
                        <Construction className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                        {title}
                        <span className="block text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-gray-400 dark:from-gray-300 dark:to-gray-500 mt-1">Coming Soon</span>
                    </h1>
                    
                    <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                        {description}
                    </p>

                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 mb-8 text-left border border-gray-100 dark:border-white/5">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-4 flex items-center gap-2">
                            <Rocket className="w-4 h-4 text-gray-900 dark:text-white" /> Planned Features
                        </h3>
                        <ul className="space-y-3">
                            {features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button 
                            onClick={() => navigate(-1)}
                            className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm font-medium flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" /> Go Back
                        </button>
                        <button className="px-6 py-2.5 rounded-xl bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black shadow-lg shadow-gray-900/20 dark:shadow-white/20 transition-all text-sm font-medium flex items-center gap-2">
                            <Bell className="w-4 h-4" /> Notify Me
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
