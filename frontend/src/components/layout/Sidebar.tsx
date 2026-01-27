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
import { motion } from 'framer-motion';
import { getUser } from '../../lib/auth';

const NAV_ITEMS = [
    { name: 'Dashboard', path: '', icon: LayoutDashboard }, // Empty path for index
    { name: 'Leads', path: 'leads', icon: Users },
    { name: 'Accounts', path: 'accounts', icon: Building2 },
    { name: 'Contacts', path: 'contacts', icon: Contact },
    { name: 'Deals', path: 'deals', icon: Briefcase },
    { name: 'Meetings & MoM', path: 'meetings', icon: Calendar },
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
        <motion.aside
            initial={{ width: 260 }}
            animate={{ width: collapsed ? 80 : 260 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 100 }}
            className={cn(
                "relative flex flex-col h-screen bg-white dark:bg-black border-r border-gray-100 dark:border-white/10 shadow-2xl shadow-gray-200/50 dark:shadow-none z-20",
                "transition-all duration-300 ease-in-out"
            )}
        >
            {/* Logo Area */}
            <div className="flex items-center justify-between p-4 h-16 border-b border-gray-100 dark:border-white/10">
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 rounded-xl flex items-center justify-center text-white dark:text-black font-bold text-lg shadow-lg shadow-gray-900/20 dark:shadow-white/10">
                            C
                        </div>
                        <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
                            Cache CRM
                        </span>
                    </motion.div>
                )}
                {collapsed && (
                    <div className="w-full flex justify-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 rounded-xl flex items-center justify-center text-white dark:text-black font-bold text-lg shadow-lg shadow-gray-900/20 dark:shadow-white/10">
                            C
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto py-4 scrollbar-none hover:scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                <nav className="space-y-1 px-3">
                    {NAV_ITEMS.filter(item => !item.allowedRoles || item.allowedRoles.includes(role)).map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path === '' ? basePath : `${basePath}/${item.path}`}
                            end={item.path === ''}
                            data-tour={`nav-${item.path === '' ? 'dashboard' : item.path}`}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "bg-gray-900 dark:bg-white text-white dark:text-black shadow-lg shadow-gray-900/20 dark:shadow-white/10 font-medium transform scale-[1.02]"
                                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", collapsed ? "mx-auto" : "")} strokeWidth={1.5} />

                            {!collapsed && (
                                <span className="truncate">{item.name}</span>
                            )}

                            {/* Tooltip for collapsed state */}
                            {collapsed && (
                                <div className="absolute left-full ml-2 w-max px-2 py-1 bg-gray-900 dark:bg-white text-white dark:text-black text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none shadow-xl font-medium">
                                    {item.name}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Bottom Actions */}
            <div className="p-3 border-t border-gray-100 dark:border-white/10 space-y-1">
                <NavLink
                    to="/settings"
                    className={({ isActive }) => cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300",
                        isActive
                            ? "bg-gray-900 dark:bg-white text-white dark:text-black shadow-lg shadow-gray-900/20 dark:shadow-white/10"
                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
                    )}
                >
                    <Settings className={cn("w-5 h-5", collapsed ? "mx-auto" : "")} strokeWidth={1.5} />
                    {!collapsed && <span>Settings</span>}
                </NavLink>

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
                >
                    {collapsed ? (
                        <ChevronRight className="w-5 h-5 mx-auto" />
                    ) : (
                        <>
                            <ChevronLeft className="w-5 h-5" />
                            <span>Collapse</span>
                        </>
                    )}
                </button>
            </div>
        </motion.aside>
    );
};
