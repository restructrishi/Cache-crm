import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../../components/ui/Table';
import { Plus, Loader2, AlertCircle, Pencil, Trash, Play, Eye } from 'lucide-react';
import { DealFormDrawer } from '../../components/crm/deals/DealFormDrawer';
import { fetchDeals, createDeal, updateDeal, deleteDeal } from '../../api/deals';
import { createPipeline } from '../../api/pipeline';

export const Deals: React.FC = () => {
    const navigate = useNavigate();
    const [deals, setDeals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState<any>(null);

    const loadDeals = async () => {
        try {
            setIsLoading(true);
            const data = await fetchDeals();
            setDeals(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err: any) {
            console.error('Error loading deals:', err);
            setError(err.message || 'Failed to load deals');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDeals();
    }, []);

    const handleSaveDeal = async (dealData: any) => {
        try {
            if (dealData.id) {
                await updateDeal(dealData.id, dealData);
            } else {
                await createDeal(dealData);
            }
            await loadDeals();
            setIsFormDrawerOpen(false);
            setSelectedDeal(null);
        } catch (err: any) {
            console.error('Error saving deal:', err);
            const message = err.message || 'Failed to save deal';
            alert(message);
        }
    };

    const handleDeleteDeal = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this deal?')) return;
        
        try {
            await deleteDeal(id);
            await loadDeals();
        } catch (err: any) {
            console.error('Error deleting deal:', err);
            const message = err.message || 'Failed to delete deal';
            alert(message);
        }
    };

    const handleEdit = (deal: any) => {
        setSelectedDeal(deal);
        setIsFormDrawerOpen(true);
    };

    const handleAdd = () => {
        setSelectedDeal(null);
        setIsFormDrawerOpen(true);
    };

    const handleCreatePipeline = async (deal: any) => {
        if (!window.confirm(`Create Order Pipeline for ${deal.name}?`)) return;
        try {
            const pipeline = await createPipeline(deal.id, deal.account?.id);
            navigate(`/admin/pipeline/${pipeline.id}`);
        } catch (err: any) {
            console.error('Error creating pipeline:', err);
            alert(err.message || 'Failed to create pipeline');
        }
    };

    const columns: any[] = [
        { 
            header: 'Name', 
            accessorKey: 'name', 
            className: 'font-medium text-gray-900 dark:text-white'
        },
        { 
            header: 'Account', 
            accessorKey: 'account',
            cell: (row: any) => row.account?.name || '-'
        },
        { 
            header: 'Amount', 
            accessorKey: 'amount',
            cell: (row: any) => row.amount ? `$${parseFloat(row.amount).toLocaleString()}` : '-'
        },
        { header: 'Stage', accessorKey: 'stage' },
        { 
            header: 'Probability', 
            accessorKey: 'probability',
            cell: (row: any) => row.probability ? `${row.probability}%` : '-'
        },
        { 
            header: 'Close Date', 
            accessorKey: 'expectedCloseDate',
            cell: (row: any) => row.expectedCloseDate ? new Date(row.expectedCloseDate).toLocaleDateString() : '-'
        },
        { 
            header: 'Owner', 
            accessorKey: 'owner',
            cell: (row: any) => row?.owner?.fullName || 'Unassigned'
        },
        {
            header: 'Pipeline',
            accessorKey: 'orderPipeline',
            cell: (row: any) => {
                if (row.orderPipeline) {
                     return (
                        <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/admin/pipeline/${row.orderPipeline.id}`); }}
                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 border border-blue-200"
                            title="View Pipeline"
                        >
                            <Eye className="w-3 h-3" /> View
                        </button>
                     );
                } else if (row.stage === 'Closed Won') {
                     return (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleCreatePipeline(row); }}
                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100 border border-green-200"
                            title="Create Pipeline"
                        >
                            <Play className="w-3 h-3" /> Create
                        </button>
                     );
                }
                return <span className="text-gray-400 text-sm">-</span>;
            }
        },
        {
            header: 'Actions',
            accessorKey: 'id',
            className: 'w-[100px]',
            cell: (row: any) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(row); }}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit Deal"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteDeal(row.id); }}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Deal"
                    >
                        <Trash className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Deals</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your sales pipeline and opportunities</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" /> Add Deal
                </button>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-4 text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={deals}
                    searchKey="name"
                />
            </div>

            <DealFormDrawer
                isOpen={isFormDrawerOpen}
                onClose={() => setIsFormDrawerOpen(false)}
                onSave={handleSaveDeal}
                initialData={selectedDeal}
            />
        </div>
    );
};
