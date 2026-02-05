import React, { useState, useEffect } from 'react';
import { 
    Truck, 
    Package, 
    ClipboardList, 
    AlertTriangle, 
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    Boxes
} from 'lucide-react';
import { fetchPipelines } from '../../api/pipeline';
import { PipelineList } from '../pipeline/PipelineList';
import { ComingSoon } from '../../components/common/ComingSoon';

export const SCM: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'procurement' | 'logistics' | 'inventory'>('overview');
    const [stats, setStats] = useState({
        procurementCount: 0,
        logisticsCount: 0,
        verificationCount: 0,
        totalValue: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await fetchPipelines();
            const procurement = data.filter((p: any) => p.currentStage === 'Procurement / Vendor PO');
            const logistics = data.filter((p: any) => p.currentStage === 'Delivery & Logistics');
            const verification = data.filter((p: any) => p.currentStage === 'Physical Verification');

            setStats({
                procurementCount: procurement.length,
                logisticsCount: logistics.length,
                verificationCount: verification.length,
                totalValue: [...procurement, ...logistics].reduce((acc: number, curr: any) => acc + (curr.deal?.amount || 0), 0)
            });
        } catch (error) {
            console.error('Failed to load SCM stats', error);
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: ClipboardList },
        { id: 'procurement', label: 'Procurement', icon: Package },
        { id: 'logistics', label: 'Logistics', icon: Truck },
        { id: 'inventory', label: 'Inventory', icon: Boxes },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SCM & Inventory</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage procurement, logistics, and inventory.</p>
                </div>
                <div className="flex gap-2">
                     <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                        <Package className="w-4 h-4" /> Add Inventory
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Procurement</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stats.procurementCount}</h3>
                        </div>
                        <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                            <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Transit</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stats.logisticsCount}</h3>
                        </div>
                        <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-lg">
                            <Truck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Verification</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stats.verificationCount}</h3>
                        </div>
                        <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg">
                            <ClipboardList className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pipeline Value</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                                ${stats.totalValue.toLocaleString()}
                            </h3>
                        </div>
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                            <ArrowUpRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-white/10">
                <nav className="flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`
                                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}
                            `}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent SCM Activity</h3>
                            <PipelineList 
                                filterStages={['Procurement / Vendor PO', 'Delivery & Logistics', 'Physical Verification']} 
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'procurement' && (
                    <PipelineList 
                        title="Procurement Pipeline" 
                        filterStages={['Procurement / Vendor PO']} 
                    />
                )}

                {activeTab === 'logistics' && (
                    <PipelineList 
                        title="Logistics & Delivery" 
                        filterStages={['Delivery & Logistics']} 
                    />
                )}

                {activeTab === 'inventory' && (
                    <ComingSoon 
                        title="Inventory Management" 
                        features={[
                            "Real-time Stock Tracking", 
                            "Warehouse Management", 
                            "Stock Movement History", 
                            "Low Stock Alerts"
                        ]} 
                    />
                )}
            </div>
        </div>
    );
};
