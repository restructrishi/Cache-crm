import React from 'react';
import { Bell, Search, User, ChevronDown } from 'lucide-react';
import { getUser } from '../../lib/auth';
import { ThemeToggle } from '../common/ThemeToggle';

export const Header: React.FC = () => {
    const user = getUser();
    const name = user?.name || 'Guest';
    
    const roleLabelMap: Record<string, string> = {
        SUPER_ADMIN: 'Super Admin',
        ORG_ADMIN: 'Admin',
        USER: 'User'
    };
    
    const roles = user?.roles || [];
    let userRole = 'USER';
    if (roles.includes('SUPER_ADMIN')) userRole = 'SUPER_ADMIN';
    else if (roles.includes('ORG_ADMIN')) userRole = 'ORG_ADMIN';
    else if (roles.includes('USER')) userRole = 'USER';
    
    const role = roleLabelMap[userRole] || userRole;

    return (
        <header className="h-16 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/10 flex items-center justify-between px-6 z-10 transition-all duration-300 sticky top-0">
            {/* Search Bar */}
            <div className="flex-1 max-w-md" data-tour="header-search">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-gray-900 dark:group-focus-within:text-white transition-colors" />
                    <input
                        type="text"
                        placeholder="Search deals, customers, tickets..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-white/5 border border-transparent focus:border-gray-200 dark:focus:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900/5 dark:focus:ring-white/10 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                <ThemeToggle />
                
                <div className="h-6 w-px bg-gray-100 dark:bg-white/10"></div>

                {/* Notifications */}
                <button className="relative p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10 rounded-xl transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-black"></span>
                </button>

                <div className="h-6 w-px bg-gray-100 dark:bg-white/10"></div>

                {/* User Profile */}
                <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-white/5">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-black rounded-lg flex items-center justify-center shadow-lg shadow-gray-900/20 dark:shadow-white/10">
                        <User className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col items-start hidden md:flex">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{role}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
            </div>
        </header>
    );
};
