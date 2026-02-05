import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/Table';
import { Plus, Filter, Download, Loader2, AlertCircle, Pencil, Trash } from 'lucide-react';
import { LeadFormDrawer } from '../../components/crm/leads/LeadFormDrawer';
import { LeadDetailDrawer } from '../../components/crm/leads/LeadDetailDrawer';
import { fetchLeads, createLead, deleteLead } from '../../api/leads';

export const Leads: React.FC = () => {
    const [leads, setLeads] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<any>(null);

    const loadLeads = async () => {
        try {
            setIsLoading(true);
            const data = await fetchLeads();
            setLeads(data);
            setError(null);
        } catch (err: any) {
            console.error('Error loading leads:', err);
            setError(err.message || 'Failed to load leads');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadLeads();
    }, []);

    const handleSaveLead = async (leadData: any) => {
        try {
            if (!leadData) return;
            await createLead(leadData);
            await loadLeads();
            setIsAddDrawerOpen(false);
        } catch (err: any) {
            console.error('Error creating lead:', err);
            const message = err.response?.data?.message || err.message || 'Failed to create lead';
            alert(message);
        }
    };

    const handleDeleteLead = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this lead?')) return;
        
        try {
            await deleteLead(id);
            await loadLeads();
        } catch (err: any) {
            console.error('Error deleting lead:', err);
            const message = err.response?.data?.message || err.message || 'Failed to delete lead';
            alert(message);
        }
    };

    const columns: any[] = [
        { 
            header: 'Name', 
            accessorKey: 'name', 
            className: 'font-medium text-gray-900 dark:text-white',
            cell: (row: any) => `${row?.firstName || ''} ${row?.lastName || ''}`.trim() || row?.company || 'Unknown'
        },
        { header: 'Company', accessorKey: 'company' },
        { header: 'Email', accessorKey: 'email' },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (row: any) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${row?.status === 'New' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                        row?.status === 'Qualified' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                            row?.status === 'Converted' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' :
                                row?.status === 'Lost' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 
                                'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                    {row?.status || 'New'}
                </span>
            )
        },
        { header: 'Source', accessorKey: 'source' },
        { 
            header: 'Owner', 
            accessorKey: 'owner',
            cell: (row: any) => row?.owner?.fullName || 'Unassigned'
        },
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
                    onClick={loadLeads}
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage and track your incoming leads</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md text-gray-700 dark:text-gray-200">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md text-gray-700 dark:text-gray-200">
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <button 
                        onClick={() => setIsAddDrawerOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5"
                    >
                        <Plus className="w-4 h-4" /> Add Lead
                    </button>
                </div>
            </div>

            <DataTable
                data={leads}
                columns={columns}
                onRowClick={(row) => setSelectedLead(row)}
                actions={[
                    {
                        label: 'Edit',
                        icon: <Pencil className="w-4 h-4" />,
                        onClick: (row) => setSelectedLead(row)
                    },
                    {
                        label: 'Delete',
                        icon: <Trash className="w-4 h-4" />,
                        className: 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20',
                        onClick: (row) => handleDeleteLead(row.id)
                    }
                ]}
            />

            <LeadFormDrawer
                isOpen={isAddDrawerOpen}
                onClose={() => setIsAddDrawerOpen(false)}
                onSave={handleSaveLead}
            />

            <LeadDetailDrawer
                isOpen={!!selectedLead}
                onClose={() => setSelectedLead(null)}
                lead={selectedLead}
            />
        </div>
    );
};
