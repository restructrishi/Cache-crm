import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Outlet } from 'react-router-dom';
import { OnboardingTour } from '../onboarding/OnboardingTour';

export const MainLayout: React.FC = () => {
    return (
        <div className="flex h-full w-full bg-gray-50/50 dark:bg-black text-gray-900 dark:text-gray-100 font-sans overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-900/10 dark:via-transparent dark:to-purple-900/10 pointer-events-none" />
                
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
