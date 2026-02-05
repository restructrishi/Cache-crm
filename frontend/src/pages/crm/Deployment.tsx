import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/Table';
import { Plus, Filter, Download, Loader2, AlertCircle, Eye, GitBranch } from 'lucide-react';
import { DeploymentDrawer } from '../../components/crm/deployment/DeploymentDrawer';
import { fetchDeployments } from '../../api/deployment';
import { getUser } from '../../lib/auth';

export const Deployment: React.FC = () => {
    const [deployments, setDeployments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedDeployment, setSelectedDeployment] = useState<any>(null);

    const user = getUser();
    const canCreate = user?.roles?.includes('SUPER_ADMIN') || 
                      user?.roles?.includes('ORG_ADMIN') || 
                      user?.department === 'Deployment';

    const loadDeployments = async () => {
        try {
            setIsLoading(true);
            const data = await fetchDeployments();
            setDeployments(data);
            setError(null);
        } catch (err: any) {
            console.error('Error loading deployments:', err);
            setError(err.message || 'Failed to load deployments');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDeployments();
    }, []);

    const handleCreate = () => {
        setSelectedDeployment(null);
        setIsDrawerOpen(true);
    };

    const handleView = (deployment: any) => {
        setSelectedDeployment(deployment);
        setIsDrawerOpen(true);
    };

    const handleSave = () => {
        loadDeployments();
    };

    const columns: any[] = [
        { 
            header: 'Project / Deal', 
            accessorKey: 'deal.name', 
            className: 'font-medium text-gray-900 dark:text-white',
            cell: (row: any) => (
                <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-blue-500" />
                    {row?.deal?.name || 'Unknown Project'}
                </div>
            )
        },
        { 
            header: 'Stage', 
            accessorKey: 'stage',
            cell: (row: any) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-100 dark:border-blue-800`}>
                    {row?.stage || 'Request Initiation'}
                </span>
            )
        },
        { 
            header: 'Environment', 
            accessorKey: 'environment',
            cell: (row: any) => (
                <span className="text-sm text-gray-600 dark:text-gray-300">
                    {row?.environment || '-'}
                </span>
            )
        },
        { 
            header: 'Priority', 
            accessorKey: 'priority',
            cell: (row: any) => {
                const colors = {
                    'Low': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
                    'Medium': 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300',
                    'High': 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300',
                    'Critical': 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                };
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[row?.priority as keyof typeof colors] || colors['Medium']}`}>
                        {row?.priority}
                    </span>
                );
            }
        },
        { 
            header: 'Requester', 
            accessorKey: 'requester.fullName',
            cell: (row: any) => row?.requester?.fullName || row?.requester?.email || '-'
        },
        {
            header: 'Requested On',
            accessorKey: 'createdAt',
            cell: (row: any) => new Date(row.createdAt).toLocaleDateString()
        }
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-red-500 gap-4">
                <AlertCircle className="w-12 h-12" />
                <p className="text-lg font-medium">{error}</p>
                <button 
                    onClick={loadDeployments}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Deployment Workflow</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage deployment requests and execution pipeline</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md text-gray-700 dark:text-gray-200">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md text-gray-700 dark:text-gray-200">
                        <Download className="w-4 h-4" /> Export
                    </button>
                    {canCreate && (
                        <button 
                            onClick={handleCreate}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5"
                        >
                            <Plus className="w-4 h-4" /> New Request
                        </button>
                    )}
                </div>
            </div>

            <DataTable
                data={deployments}
                columns={columns}
                onRowClick={handleView}
                actions={[
                    {
                        label: 'View Workflow',
                        icon: <Eye className="w-4 h-4" />,
                        onClick: handleView
                    }
                ]}
            />

            <DeploymentDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                deployment={selectedDeployment}
                onSave={handleSave}
            />
        </div>
    );
};
