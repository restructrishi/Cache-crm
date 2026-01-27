import React, { useState } from 'react';
import { DataTable } from '../../components/ui/Table';
import { Plus, History, Check, X } from 'lucide-react';

// Mock Quotes
const MOCK_QUOTES = [
    { id: '1', quoteNumber: 'Q-2024-001', customer: 'Acme Corp', amount: 45000, version: 1, status: 'Draft', date: '2024-03-01' },
    { id: '2', quoteNumber: 'Q-2024-001', customer: 'Acme Corp', amount: 42000, version: 2, status: 'Sent', date: '2024-03-02' },
    { id: '3', quoteNumber: 'Q-2024-002', customer: 'Global Traders', amount: 120000, version: 1, status: 'Approved', date: '2024-03-05' },
    { id: '4', quoteNumber: 'Q-2024-003', customer: 'Logistics Inc', amount: 15000, version: 1, status: 'Rejected', date: '2024-03-01' },
];

export const Quotes: React.FC = () => {
    const [quotes] = useState(MOCK_QUOTES);

    const columns: any[] = [
        { header: 'Quote #', accessorKey: 'quoteNumber', className: 'font-medium' },
        { header: 'Customer', accessorKey: 'customer' },
        {
            header: 'Amount',
            accessorKey: 'amount',
            cell: (row: any) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.amount)
        },
        {
            header: 'Version',
            accessorKey: 'version',
            cell: (row: any) => (
                <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md w-fit">
                    <History className="w-3 h-3" /> v{row.version}
                </span>
            )
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (row: any) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit
                    ${row.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
                        row.status === 'Sent' ? 'bg-blue-100 text-blue-700' :
                            row.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                row.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                    {row.status === 'Approved' && <Check className="w-3 h-3" />}
                    {row.status === 'Rejected' && <X className="w-3 h-3" />}
                    {row.status}
                </span>
            )
        },
        { header: 'Date', accessorKey: 'date' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quotes & Estimates</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage versioned quotes and proposals</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20">
                    <Plus className="w-4 h-4" /> Create Quote
                </button>
            </div>

            <DataTable
                data={quotes}
                columns={columns}
                onRowClick={(row) => console.log('Clicked', row)}
            />
        </div>
    );
};
