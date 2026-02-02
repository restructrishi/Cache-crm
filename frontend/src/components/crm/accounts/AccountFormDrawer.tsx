import React, { useState, useEffect } from 'react';
import { Drawer } from '../../ui/Drawer';
import { Save } from 'lucide-react';

interface AccountFormDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    initialData?: any;
}

export const AccountFormDrawer: React.FC<AccountFormDrawerProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        industry: '',
        website: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                name: initialData.name || '',
                industry: initialData.industry || '',
                website: initialData.website || '',
                phone: initialData.phone || '',
                address: initialData.address || ''
            });
        } else if (isOpen && !initialData) {
            setFormData({
                name: '',
                industry: '',
                website: '',
                phone: '',
                address: ''
            });
        }
    }, [isOpen, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            alert('Account Name is required');
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
            title={initialData ? "Edit Account" : "Add New Account"}
            width="max-w-2xl"
            actions={
                <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm"
                >
                    <Save className="w-4 h-4" /> Save Account
                </button>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-white/10 pb-2">
                        Account Details
                    </h3>
                    
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Account Name <span className="text-red-500">*</span></label>
                        <input
                            required
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            placeholder="Acme Corp"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Industry</label>
                            <input
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                placeholder="Technology"
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
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Website</label>
                        <input
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            placeholder="https://example.com"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            placeholder="123 Main St, City, Country"
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
                        <Save className="w-4 h-4" /> Save Account
                    </button>
                </div>
            </form>
        </Drawer>
    );
};
