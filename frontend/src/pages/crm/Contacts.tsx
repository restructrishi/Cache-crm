import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/Table';
import { Plus, Filter, Download, Loader2, AlertCircle, Pencil, Trash, Mail, Phone, Building2 } from 'lucide-react';
import { ContactFormDrawer } from '../../components/crm/contacts/ContactFormDrawer';
import { fetchContacts, createContact, updateContact, deleteContact } from '../../api/contacts';

export const Contacts: React.FC = () => {
    const [contacts, setContacts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<any>(null);

    const loadContacts = async () => {
        try {
            setIsLoading(true);
            const data = await fetchContacts();
            setContacts(data);
            setError(null);
        } catch (err: any) {
            console.error('Error loading contacts:', err);
            setError(err.message || 'Failed to load contacts');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadContacts();
    }, []);

    const handleSaveContact = async (contactData: any) => {
        try {
            if (contactData.id) {
                await updateContact(contactData.id, contactData);
            } else {
                await createContact(contactData);
            }
            await loadContacts();
            setIsFormDrawerOpen(false);
            setSelectedContact(null);
        } catch (err: any) {
            console.error('Error saving contact:', err);
            const message = err.message || 'Failed to save contact';
            alert(message);
        }
    };

    const handleDeleteContact = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this contact?')) return;
        
        try {
            await deleteContact(id);
            await loadContacts();
        } catch (err: any) {
            console.error('Error deleting contact:', err);
            const message = err.message || 'Failed to delete contact';
            alert(message);
        }
    };

    const handleEdit = (contact: any) => {
        setSelectedContact(contact);
        setIsFormDrawerOpen(true);
    };

    const handleAdd = () => {
        setSelectedContact(null);
        setIsFormDrawerOpen(true);
    };

    const columns: any[] = [
        { 
            header: 'Name', 
            accessorKey: 'name', 
            className: 'font-medium text-gray-900 dark:text-white',
            cell: (row: any) => (
                <div>
                    <div className="font-medium">{row.firstName} {row.lastName}</div>
                    {row.designation && <div className="text-xs text-gray-500">{row.designation}</div>}
                </div>
            )
        },
        { 
            header: 'Account', 
            accessorKey: 'account',
            cell: (row: any) => row.account ? (
                <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                    <Building2 className="w-3 h-3" /> {row.account.name}
                </div>
            ) : '-'
        },
        { 
            header: 'Email', 
            accessorKey: 'email',
            cell: (row: any) => row.email ? (
                <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-gray-400" /> {row.email}
                </div>
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
                    onClick={loadContacts}
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contacts</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your people and relationships</p>
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
                        <Plus className="w-4 h-4" /> Add Contact
                    </button>
                </div>
            </div>

            <DataTable
                data={contacts}
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
                        onClick: (row) => handleDeleteContact(row.id)
                    }
                ]}
            />

            <ContactFormDrawer
                isOpen={isFormDrawerOpen}
                onClose={() => setIsFormDrawerOpen(false)}
                onSave={handleSaveContact}
                initialData={selectedContact}
            />
        </div>
    );
};
