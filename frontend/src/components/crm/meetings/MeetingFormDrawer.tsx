import React, { useState, useEffect } from 'react';
import { Drawer } from '../../ui/Drawer';
import { Save } from 'lucide-react';
import { fetchAccounts } from '../../../api/accounts'; // Indirectly to get deals/contacts if needed, but we probably need separate fetches
import { fetchDeals } from '../../../api/deals';
// We don't have a fetchLeads exposed yet in api/leads.ts? I should check.
// Assuming fetchLeads exists or I need to add it. I'll check after this.

interface MeetingFormDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    initialData?: any;
}

export const MeetingFormDrawer: React.FC<MeetingFormDrawerProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [deals, setDeals] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        dealId: '',
        leadId: '', // TODO: Add Lead support
        status: 'Scheduled'
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const dealsData = await fetchDeals();
                setDeals(dealsData);
            } catch (err) {
                console.error('Failed to load deals', err);
            }
        };
        if (isOpen) {
            loadData();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                startTime: initialData.startTime ? new Date(initialData.startTime).toISOString().slice(0, 16) : '',
                endTime: initialData.endTime ? new Date(initialData.endTime).toISOString().slice(0, 16) : '',
                dealId: initialData.dealId || '',
                leadId: initialData.leadId || '',
                status: initialData.status || 'Scheduled'
            });
        } else if (isOpen && !initialData) {
            setFormData({
                title: '',
                description: '',
                startTime: '',
                endTime: '',
                dealId: '',
                leadId: '',
                status: 'Scheduled'
            });
        }
    }, [isOpen, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.title.trim()) {
            alert('Meeting Title is required');
            return;
        }
        if (!formData.startTime || !formData.endTime) {
            alert('Start and End times are required');
            return;
        }

        const cleanedData = {
            ...formData,
            dealId: formData.dealId || null,
            leadId: formData.leadId || null,
            id: initialData?.id
        };

        onSave(cleanedData);
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? "Edit Meeting" : "Schedule Meeting"}
            width="max-w-2xl"
            actions={
                <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5"
                >
                    <Save className="w-4 h-4" /> Save Meeting
                </button>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-white/10 pb-2">
                        Meeting Details
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Weekly Sync with Client"
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    Start Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    End Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Related Deal
                            </label>
                            <select
                                name="dealId"
                                value={formData.dealId}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
                            >
                                <option value="">Select Deal</option>
                                {deals.map(deal => (
                                    <option key={deal.id} value={deal.id}>
                                        {deal.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400 resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
                            >
                                <option value="Scheduled">Scheduled</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-white/10">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5"
                    >
                        <Save className="w-4 h-4" /> Save Meeting
                    </button>
                </div>
            </form>
        </Drawer>
    );
};
