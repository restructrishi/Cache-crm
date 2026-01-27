import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Building2,
    Contact,
    Briefcase,
    Calendar,
    FileText,
    ShoppingCart,
    Truck,
    Hammer,
    Receipt,
    Ticket,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { getUser } from '../../lib/auth';

const NAV_ITEMS = [
    { name: 'Dashboard', path: '', icon: LayoutDashboard }, // Empty path for index
    { name: 'Leads', path: 'leads', icon: Users },
    { name: 'Accounts', path: 'accounts', icon: Building2 },
    { name: 'Contacts', path: 'contacts', icon: Contact },
    { name: 'Deals', path: 'deals', icon: Briefcase },
    { name: 'Meetings', path: 'meetings', icon: Calendar },
    { name: 'PreSales & Quotes', path: 'quotes', icon: FileText },
    { name: 'Orders (PO)', path: 'orders', icon: ShoppingCart },
    { name: 'SCM & Inventory', path: 'scm', icon: Truck, allowedRoles: ['Super Admin', 'Admin'] },
    { name: 'Deployment', path: 'deployment', icon: Hammer, allowedRoles: ['Super Admin', 'Admin'] },
    { name: 'Finance', path: 'finance', icon: Receipt, allowedRoles: ['Super Admin'] },
    { name: 'Tickets', path: 'tickets', icon: Ticket },
    { name: 'Reports', path: 'reports', icon: BarChart3, allowedRoles: ['Super Admin', 'Admin'] },
];

export const Sidebar: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const user = getUser();
    const role = user?.role || 'User';

    // Determine base path
    let basePath = '/app';
    if (role === 'Super Admin') basePath = '/super-admin';
    else if (role === 'Admin') basePath = '/admin';

    return (
        <aside
            className={cn(
                "relative flex flex-col h-full bg-white dark:bg-black border-r border-gray-100 dark:border-white/10 shadow-2xl shadow-gray-200/50 dark:shadow-none z-20 shrink-0",
                "transition-all duration-300 ease-in-out",
                collapsed ? "w-[80px]" : "w-[260px]"
            )}
        >
            {/* Logo Area */}
            <div className={cn(
                "flex items-center h-16 border-b border-gray-100 dark:border-white/10 overflow-hidden transition-all duration-300 ease-in-out",
                collapsed ? "pl-6" : "p-4"
            )}>
                <div className="flex items-center gap-3 min-w-[260px]">
                     <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 rounded-xl flex items-center justify-center text-white dark:text-black font-bold text-lg shadow-lg shadow-gray-900/20 dark:shadow-white/10 shrink-0">
                        C
                    </div>
                    <span className={cn(
                        "font-bold text-xl tracking-tight text-gray-900 dark:text-white transition-all duration-300",
                        collapsed ? "opacity-0 translate-x-4 pointer-events-none" : "opacity-100 translate-x-0"
                    )}>
                        Cache CRM
                    </span>
                </div>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto py-4 scrollbar-none hover:scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 overflow-x-hidden">
                <nav className="space-y-1 px-3">
                    {NAV_ITEMS.filter(item => !item.allowedRoles || item.allowedRoles.includes(role)).map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path === '' ? basePath : `${basePath}/${item.path}`}
                            end={item.path === ''}
                            data-tour={`nav-${item.path === '' ? 'dashboard' : item.path}`}
                            className={({ isActive }) => cn(
                                "flex items-center rounded-xl transition-all duration-300 group relative overflow-hidden whitespace-nowrap py-2.5",
                                isActive
                                    ? "bg-gray-900 dark:bg-white text-white dark:text-black shadow-lg shadow-gray-900/20 dark:shadow-white/10 font-medium transform scale-[1.02]"
                                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white",
                                collapsed ? "pl-[18px] gap-0" : "px-3 gap-3"
                            )}
                        >
                            <div className="flex items-center justify-center w-5 h-5 shrink-0">
                                <item.icon className="w-5 h-5" strokeWidth={1.5} />
                            </div>

                            <span className={cn(
                                "transition-all duration-300 origin-left",
                                collapsed ? "opacity-0 translate-x-4 w-0 scale-95" : "opacity-100 translate-x-0 w-auto scale-100"
                            )}>
                                {item.name}
                            </span>

                            {/* Tooltip for collapsed state */}
                            {collapsed && (
                                <div className="absolute left-full ml-4 w-max px-2 py-1 bg-gray-900 dark:bg-white text-white dark:text-black text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none shadow-xl font-medium">
                                    {item.name}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Bottom Actions */}
            <div className="p-3 border-t border-gray-100 dark:border-white/10 space-y-1 overflow-hidden">
                <NavLink
                    to="/settings"
                    className={({ isActive }) => cn(
                        "flex items-center rounded-xl transition-all duration-300 whitespace-nowrap py-2.5",
                        isActive
                            ? "bg-gray-900 dark:bg-white text-white dark:text-black shadow-lg shadow-gray-900/20 dark:shadow-white/10"
                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white",
                        collapsed ? "pl-[18px] gap-0" : "px-3 gap-3"
                    )}
                >
                     <div className="flex items-center justify-center w-5 h-5 shrink-0">
                        <Settings className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <span className={cn(
                        "transition-all duration-300 origin-left",
                        collapsed ? "opacity-0 translate-x-4 w-0 scale-95" : "opacity-100 translate-x-0 w-auto scale-100"
                    )}>
                        Settings
                    </span>
                </NavLink>

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={cn(
                        "w-full flex items-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all duration-300 whitespace-nowrap py-2.5",
                        collapsed ? "pl-[18px] gap-0" : "px-3 gap-3"
                    )}
                >
                    <div className="flex items-center justify-center w-5 h-5 shrink-0">
                         {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </div>
                    <span className={cn(
                        "transition-all duration-300 origin-left",
                        collapsed ? "opacity-0 translate-x-4 w-0 scale-95" : "opacity-100 translate-x-0 w-auto scale-100"
                    )}>
                        Collapse
                    </span>
                </button>
            </div>
        </aside>
    );
};
