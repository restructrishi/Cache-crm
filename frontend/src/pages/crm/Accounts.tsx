import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../../components/ui/Table';
import { Plus, Filter, Download, Loader2, AlertCircle, Pencil, Trash, Globe, Phone } from 'lucide-react';
import { AccountFormDrawer } from '../../components/crm/accounts/AccountFormDrawer';
import { fetchAccounts, createAccount, updateAccount, deleteAccount } from '../../api/accounts';

export const Accounts: React.FC = () => {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<any>(null);

    const loadAccounts = async () => {
        try {
            setIsLoading(true);
            const data = await fetchAccounts();
            setAccounts(data);
            setError(null);
        } catch (err: any) {
            console.error('Error loading accounts:', err);
            setError(err.message || 'Failed to load accounts');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAccounts();
    }, []);

    const handleSaveAccount = async (accountData: any) => {
        try {
            if (accountData.id) {
                await updateAccount(accountData.id, accountData);
            } else {
                await createAccount(accountData);
            }
            await loadAccounts();
            setIsFormDrawerOpen(false);
            setSelectedAccount(null);
        } catch (err: any) {
            console.error('Error saving account:', err);
            const message = err.message || 'Failed to save account';
            alert(message);
        }
    };

    const handleDeleteAccount = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this account?')) return;
        
        try {
            await deleteAccount(id);
            await loadAccounts();
        } catch (err: any) {
            console.error('Error deleting account:', err);
            const message = err.message || 'Failed to delete account';
            alert(message);
        }
    };

    const handleEdit = (account: any) => {
        setSelectedAccount(account);
        setIsFormDrawerOpen(true);
    };

    const handleAdd = () => {
        setSelectedAccount(null);
        setIsFormDrawerOpen(true);
    };

    const columns: any[] = [
        { 
            header: 'Name', 
            accessorKey: 'name', 
            className: 'font-medium text-gray-900 dark:text-white'
        },
        { header: 'Industry', accessorKey: 'industry' },
        { 
            header: 'Website', 
            accessorKey: 'website',
            cell: (row: any) => row.website ? (
                <a href={row.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                    <Globe className="w-3 h-3" /> {row.website.replace(/^https?:\/\//, '')}
                </a>
            ) : '-'
        },
        { 
            header: 'Phone', 
            accessorKey: 'phone',
            cell: (row: any) => row.phone ? (
                <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-gray-400" /> {row.phone}
                </div>
            ) : '-'
        },
    { 
            header: 'Owner', 
            accessorKey: 'owner',
            cell: (row: any) => row?.owner?.fullName || 'Unassigned'
        },
        {
            header: 'Pipelines',
            accessorKey: 'id',
            cell: (row: any) => (
                <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/admin/account-pipelines/${row.id}`); }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    View Pipelines
                </button>
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

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-red-500 gap-4">
                <AlertCircle className="w-12 h-12" />
                <p className="text-lg font-medium">{error}</p>
                <button 
                    onClick={loadAccounts}
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Accounts</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your customer accounts and companies</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <button 
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Account
                    </button>
                </div>
            </div>

            <DataTable
                data={accounts}
                columns={columns}
                onRowClick={handleEdit}
                actions={[
                    {
                        label: 'Edit',
                        icon: <Pencil className="w-4 h-4" />,
                        onClick: handleEdit
                    },
                    {
                        label: 'Delete',
                        icon: <Trash className="w-4 h-4" />,
                        className: 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20',
                        onClick: (row) => handleDeleteAccount(row.id)
                    }
                ]}
            />

            <AccountFormDrawer
                isOpen={isFormDrawerOpen}
                onClose={() => setIsFormDrawerOpen(false)}
                onSave={handleSaveAccount}
                initialData={selectedAccount}
            />
        </div>
    );
};
