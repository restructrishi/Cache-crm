import React, { useState } from 'react';
import { DataTable } from '../../components/ui/Table';
import { Plus, Filter, Download } from 'lucide-react';
import { LeadFormDrawer } from '../../components/crm/leads/LeadFormDrawer';
import { LeadDetailDrawer } from '../../components/crm/leads/LeadDetailDrawer';

// Mock Data
const MOCK_LEADS = [
    { id: '1', name: 'John Doe', company: 'Tech Corp', email: 'john@techcorp.com', status: 'New', source: 'Website', owner: 'Sarah Sales', phone: '+1 555-0123', industry: 'Technology', requirementSummary: 'Looking for a CRM solution for 50 users.' },
    { id: '2', name: 'Jane Smith', company: 'Global Traders', email: 'jane@global.com', status: 'In Progress', source: 'LinkedIn', owner: 'Mike SCM', phone: '+1 555-0124', industry: 'Logistics', requirementSummary: 'Need SCM module integration.' },
    { id: '3', name: 'Robert Fox', company: 'Logistics Inc', email: 'robert@logistics.com', status: 'Qualified', source: 'Referral', owner: 'Sarah Sales', phone: '+1 555-0125', industry: 'Transportation', requirementSummary: 'Fleet management software needed.' },
    { id: '4', name: 'Emily Davis', company: 'SoftSystems', email: 'emily@soft.com', status: 'Converted', source: 'Cold Call', owner: 'John Admin', phone: '+1 555-0126', industry: 'Software', requirementSummary: 'Upgrade existing legacy system.' },
    { id: '5', name: 'Michael Brown', company: 'Hardware Hub', email: 'mike@hub.com', status: 'Lost', source: 'Unknown', owner: 'Mike SCM', phone: '+1 555-0127', industry: 'Hardware', requirementSummary: 'Price was too high.' },
];

export const Leads: React.FC = () => {
    const [leads, setLeads] = useState(MOCK_LEADS);
    const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<any>(null);

    const handleSaveLead = (newLead: any) => {
        setLeads(prev => [newLead, ...prev]);
    };

    const columns: any[] = [
        { header: 'Name', accessorKey: 'name', className: 'font-medium text-gray-900 dark:text-white' },
        { header: 'Company', accessorKey: 'company' },
        { header: 'Email', accessorKey: 'email' },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (row: any) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${row.status === 'New' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                        row.status === 'Qualified' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                            row.status === 'Converted' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' :
                                row.status === 'Lost' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 
                                'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
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
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <button 
                        onClick={() => setIsAddDrawerOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Lead
                    </button>
                </div>
            </div>

            <DataTable
                data={leads}
                columns={columns}
                onRowClick={(row) => setSelectedLead(row)}
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
