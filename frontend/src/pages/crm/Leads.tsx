import React, { useState } from 'react';
import { DataTable } from '../../components/ui/Table';
import { Plus, Filter, Download } from 'lucide-react';

// Mock Data
const MOCK_LEADS = [
    { id: '1', name: 'John Doe', company: 'Tech Corp', email: 'john@techcorp.com', status: 'New', source: 'Website', owner: 'Sarah Sales' },
    { id: '2', name: 'Jane Smith', company: 'Global Traders', email: 'jane@global.com', status: 'In Progress', source: 'LinkedIn', owner: 'Mike SCM' },
    { id: '3', name: 'Robert Fox', company: 'Logistics Inc', email: 'robert@logistics.com', status: 'Qualified', source: 'Referral', owner: 'Sarah Sales' },
    { id: '4', name: 'Emily Davis', company: 'SoftSystems', email: 'emily@soft.com', status: 'Converted', source: 'Cold Call', owner: 'John Admin' },
    { id: '5', name: 'Michael Brown', company: 'Hardware Hub', email: 'mike@hub.com', status: 'Lost', source: 'Unknown', owner: 'Mike SCM' },
];

export const Leads: React.FC = () => {
    const [leads] = useState(MOCK_LEADS);

    const columns: any[] = [
        { header: 'Name', accessorKey: 'name', className: 'font-medium text-gray-900 dark:text-white' },
        { header: 'Company', accessorKey: 'company' },
        { header: 'Email', accessorKey: 'email' },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (row: any) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${row.status === 'New' ? 'bg-blue-100 text-blue-700' :
                        row.status === 'Qualified' ? 'bg-green-100 text-green-700' :
                            row.status === 'Converted' ? 'bg-indigo-100 text-indigo-700' :
                                row.status === 'Lost' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                    {row.status}
                </span>
            )
        },
        { header: 'Source', accessorKey: 'source' },
        { header: 'Owner', accessorKey: 'owner' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage and track your incoming leads</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20">
                        <Plus className="w-4 h-4" /> Add Lead
                    </button>
                </div>
            </div>

            <DataTable
                data={leads}
                columns={columns}
                onRowClick={(row) => console.log('Clicked', row)}
            />
        </div>
    );
};
