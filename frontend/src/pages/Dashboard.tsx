import React from 'react';
import {
    Users,
    Briefcase,
    DollarSign,
    AlertCircle,
    Truck,
    CheckCircle2,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

const Card = ({ title, value, subtitle, icon: Icon, trend, color, delay = 0 }: any) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-white/10 space-y-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group backdrop-blur-xl"
    >
        <div className="flex items-center justify-between">
            <div className={cn("p-3 rounded-xl transition-colors bg-opacity-10", color.replace('text-', 'bg-').replace('500', '500/10'))}>
                <Icon className={cn("w-6 h-6", color)} />
            </div>
            {trend && (
                <span className={cn(
                    "flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border border-transparent", 
                    trend > 0 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
                )}>
                    {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(trend)}%
                </span>
            )}
        </div>
        <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
            <div className="flex items-baseline gap-2 mt-2">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</h2>
            </div>
            {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
    </motion.div>
);

export const Dashboard: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">Dashboard Overview</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Real-time insights and performance metrics</p>
                </div>
                <div className="flex items-center gap-3">
                    <select className="px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-600 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all hover:border-gray-300 dark:hover:border-white/20">
                        <option>Last 30 Days</option>
                        <option>This Quarter</option>
                        <option>This Year</option>
                    </select>
                    <button className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-medium shadow-lg shadow-gray-900/20 dark:shadow-white/10 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-2">
                        Download Report
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card
                    title="Total Revenue"
                    value="$1.2M"
                    subtitle="vs $980k last month"
                    icon={DollarSign}
                    trend={12.5}
                    color="text-emerald-500"
                    delay={0.1}
                />
                <Card
                    title="Active Deals"
                    value="45"
                    subtitle="Pipeline value: $3.4M"
                    icon={Briefcase}
                    trend={8.2}
                    color="text-blue-500"
                    delay={0.2}
                />
                <Card
                    title="Pending Invoices"
                    value="$120k"
                    subtitle="9 Overdue > 30 days"
                    icon={AlertCircle}
                    trend={-2.4}
                    color="text-orange-500"
                    delay={0.3}
                />
                <Card
                    title="Active Deployments"
                    value="12"
                    subtitle="3 scheduled this week"
                    icon={Activity}
                    trend={5.0}
                    color="text-indigo-500"
                    delay={0.4}
                />
            </div>

            {/* Advanced Widgets Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Funnel */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="lg:col-span-2 bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sales Pipeline</h3>
                            <p className="text-sm text-gray-500">Conversion rates by stage</p>
                        </div>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="h-64 flex items-end justify-between px-4 gap-4">
                        {[
                            { label: 'Lead', val: 40, color: 'bg-blue-400' }, 
                            { label: 'Meeting', val: 70, color: 'bg-blue-500' }, 
                            { label: 'Quote', val: 50, color: 'bg-indigo-500' }, 
                            { label: 'Negotiation', val: 90, color: 'bg-purple-500' }, 
                            { label: 'PO Recv', val: 30, color: 'bg-purple-600' }, 
                            { label: 'Won', val: 80, color: 'bg-emerald-500' }
                        ].map((item, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end group">
                                <div className="relative w-full bg-gray-100 dark:bg-gray-800 rounded-t-xl overflow-hidden h-full">
                                    <div 
                                        className={cn("absolute bottom-0 w-full rounded-t-xl transition-all duration-700 ease-out group-hover:opacity-90", item.color)}
                                        style={{ height: `${item.val}%` }}
                                    />
                                </div>
                                <div className="mt-3 text-center">
                                    <div className="text-xs font-medium text-gray-900 dark:text-white mb-1">{item.val}</div>
                                    <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">{item.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Activity Feed */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col"
                >
                    <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Recent Activities</h3>
                    <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                        {[
                            { user: 'Sarah Sales', action: 'Created new deal', target: 'Acme Corp Hardware', time: '2 mins ago', icon: Briefcase, color: 'text-blue-500 bg-blue-500/10' },
                            { user: 'Mike SCM', action: 'Received GRN', target: 'PO-9921 Dell Servers', time: '1 hour ago', icon: Truck, color: 'text-orange-500 bg-orange-500/10' },
                            { user: 'John Admin', action: 'Approved Quote', target: 'Q-2024-001 v2', time: '3 hours ago', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
                            { user: 'System', action: 'Payment received', target: 'Inv-1002 ($45,000)', time: '5 hours ago', icon: DollarSign, color: 'text-green-500 bg-green-500/10' },
                            { user: 'Support', action: 'Ticket Resolved', target: 'T-1001 Network Issue', time: '6 hours ago', icon: AlertCircle, color: 'text-purple-500 bg-purple-500/10' },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 group">
                                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", item.color)}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        <span className="font-bold">{item.user}</span> {item.action}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5 truncate">{item.target}</p>
                                </div>
                                <span className="text-xs text-gray-400 whitespace-nowrap">{item.time}</span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors border border-dashed border-gray-200 dark:border-gray-700">
                        View All Activity
                    </button>
                </motion.div>
            </div>
        </div>
    );
};
