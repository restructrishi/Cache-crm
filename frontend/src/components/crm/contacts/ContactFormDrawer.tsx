import React, { useState, useEffect } from 'react';
import { Drawer } from '../../ui/Drawer';
import { Save } from 'lucide-react';
import { fetchAccounts } from '../../../api/accounts';

interface ContactFormDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    initialData?: any;
}

export const ContactFormDrawer: React.FC<ContactFormDrawerProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        designation: '',
        accountId: ''
    });

    useEffect(() => {
        // Load accounts for dropdown
        const loadAccounts = async () => {
            try {
                const data = await fetchAccounts();
                setAccounts(data);
            } catch (err) {
                console.error('Failed to load accounts for dropdown', err);
            }
        };
        if (isOpen) {
            loadAccounts();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                firstName: initialData.firstName || '',
                lastName: initialData.lastName || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                designation: initialData.designation || '',
                accountId: initialData.accountId || ''
            });
        } else if (isOpen && !initialData) {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                designation: '',
                accountId: ''
            });
        }
    }, [isOpen, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            alert('First Name and Last Name are required');
            return;
        }

        onSave({
            ...formData,
            id: initialData?.id // Pass ID if editing
        });
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? "Edit Contact" : "Add New Contact"}
            width="max-w-2xl"
            actions={
                <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm"
                >
                    <Save className="w-4 h-4" /> Save Contact
                </button>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-white/10 pb-2">
                        Contact Details
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">First Name <span className="text-red-500">*</span></label>
                            <input
                                required
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                placeholder="John"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Last Name <span className="text-red-500">*</span></label>
                            <input
                                required
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Account (Company)</label>
                        <select
                            name="accountId"
                            value={formData.accountId}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        >
                            <option value="">-- Select Account --</option>
                            {accounts.map(acc => (
                                <option key={acc.id} value={acc.id}>{acc.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Phone</label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>
                    
                     <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Designation / Title</label>
                        <input
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            placeholder="VP of Sales"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-white/10">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/10"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm"
                    >
                        <Save className="w-4 h-4" /> Save Contact
                    </button>
                </div>
            </form>
        </Drawer>
    );
};
