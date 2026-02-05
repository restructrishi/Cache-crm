import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Outlet } from 'react-router-dom';
import { OnboardingTour } from '../onboarding/OnboardingTour';

export const MainLayout: React.FC = () => {
    return (
        <div className="flex h-full w-full bg-[#f8f9fa] dark:bg-black text-slate-900 dark:text-gray-100 font-sans overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 relative">
                {/* Subtle Ambient Background - Professional & Luxury */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-100/50 via-transparent to-transparent dark:from-blue-900/5 dark:via-transparent dark:to-transparent pointer-events-none" />
                
                <Header />

                <main className="flex-1 overflow-auto p-6 relative z-0 custom-scrollbar">
                    <div className="w-full max-w-7xl mx-auto h-full">
                        <Outlet />
                    </div>
                </main>
            </div>
            <OnboardingTour />
        </div>
    );
};
