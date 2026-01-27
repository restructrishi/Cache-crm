import React, { useState } from 'react';
import { Plus, MoreHorizontal, DollarSign, Calendar } from 'lucide-react';

// Mock Data for Deals
const MOCK_DEALS = [
    { id: '1', title: 'Acme Hardware Upgrade', amount: 45000, company: 'Acme Corp', owner: 'Sarah Sales', stage: 'Qualifying' },
    { id: '2', title: 'Global Logistics ERP', amount: 120000, company: 'Global Traders', owner: 'Mike SCM', stage: 'Proposal' },
    { id: '3', title: 'Server Maintenance', amount: 15000, company: 'Logistics Inc', owner: 'Sarah Sales', stage: 'Negotiation' },
    { id: '4', title: 'Cloud Migration', amount: 85000, company: 'SoftSystems', owner: 'John Admin', stage: 'Qualifying' },
    { id: '5', title: 'Office 365 License', amount: 5000, company: 'Startup Hub', owner: 'Mike SCM', stage: 'Closed Won' },
];

const STAGES = ['Qualifying', 'Value Creation', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

export const Deals: React.FC = () => {
    const [deals] = useState(MOCK_DEALS);

    const getDealsByStage = (stage: string) => deals.filter(d => d.stage === stage);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Deals Pipeline</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Track and manage your sales opportunities</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20">
                    <Plus className="w-4 h-4" /> New Deal
                </button>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden">
                <div className="flex h-full gap-4 min-w-[1200px] pb-4">
                    {STAGES.map((stage) => {
                        const stageDeals = getDealsByStage(stage);
                        const totalValue = stageDeals.reduce((acc, curr) => acc + curr.amount, 0);

                        return (
                            <div key={stage} className="flex-1 min-w-[280px] flex flex-col bg-gray-50/50 dark:bg-[#1e1e1e]/50 rounded-xl border border-gray-100 dark:border-gray-800">
                                {/* Column Header */}
                                <div className="p-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-[#1e1e1e] rounded-t-xl">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{stage}</span>
                                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-500 rounded-full">{stageDeals.length}</span>
                                    </div>
                                    <span className="text-xs font-medium text-gray-500">{formatCurrency(totalValue)}</span>
                                </div>

                                {/* Deals List */}
                                <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                                    {stageDeals.map((deal) => (
                                        <div
                                            key={deal.id}
                                            className="bg-white dark:bg-[#252525] p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-2">{deal.title}</h4>
                                                <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                                    <DollarSign className="w-3 h-3" />
                                                    {formatCurrency(deal.amount)}
                                                </span>
                                                {/* User Avatar Placeholder */}
                                                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center font-medium">
                                                    {deal.owner.charAt(0)}
                                                </div>
                                            </div>
                                            <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
                                                <span>{deal.company}</span>
                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> 2d ago</span>
                                            </div>
                                        </div>
                                    ))}
                                    {stageDeals.length === 0 && (
                                        <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg text-xs text-gray-400">
                                            No deals
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
