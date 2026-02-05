import React, { useState, useEffect } from 'react';
import { Drawer } from '../../ui/Drawer';
import { Save, Plus, Trash } from 'lucide-react';

interface MomDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    meetingTitle?: string;
}

export const MomDrawer: React.FC<MomDrawerProps> = ({ isOpen, onClose, onSave, meetingTitle }) => {
    const [formData, setFormData] = useState({
        summary: '',
        discussionPoints: '',
        nextFollowUpDate: '',
        actionItems: [] as any[]
    });

    // Reset form when opened
    useEffect(() => {
        if (isOpen) {
            setFormData({
                summary: '',
                discussionPoints: '',
                nextFollowUpDate: '',
                actionItems: []
            });
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddActionItem = () => {
        setFormData(prev => ({
            ...prev,
            actionItems: [
                ...prev.actionItems,
                { description: '', ownerId: null, dueDate: '' } // TODO: ownerId selection
            ]
        }));
    };

    const handleActionItemChange = (index: number, field: string, value: string) => {
        const newActionItems = [...formData.actionItems];
        newActionItems[index] = { ...newActionItems[index], [field]: value };
        setFormData(prev => ({ ...prev, actionItems: newActionItems }));
    };

    const handleRemoveActionItem = (index: number) => {
        const newActionItems = [...formData.actionItems];
        newActionItems.splice(index, 1);
        setFormData(prev => ({ ...prev, actionItems: newActionItems }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.summary.trim()) {
            alert('Summary is required');
            return;
        }

        onSave({
            ...formData,
            nextFollowUpDate: formData.nextFollowUpDate ? new Date(formData.nextFollowUpDate) : null
        });
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title={`Minutes of Meeting: ${meetingTitle || ''}`}
            width="max-w-3xl"
            actions={
                <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5"
                >
                    <Save className="w-4 h-4" /> Save MOM
                </button>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-white/10 pb-2">
                        Meeting Summary
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Summary <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="summary"
                                value={formData.summary}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Key outcomes and summary of the meeting..."
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400 resize-none"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Discussion Points
                            </label>
                            <textarea
                                name="discussionPoints"
                                value={formData.discussionPoints}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Detailed points discussed..."
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400 resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Next Follow-up Date
                            </label>
                            <input
                                type="date"
                                name="nextFollowUpDate"
                                value={formData.nextFollowUpDate}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-2">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                            Action Items
                        </h3>
                        <button
                            type="button"
                            onClick={handleAddActionItem}
                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                        >
                            <Plus className="w-4 h-4" /> Add Item
                        </button>
                    </div>
                    
                    {formData.actionItems.map((item, index) => (
                        <div key={index} className="flex gap-4 items-start bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                            <div className="flex-1 space-y-2">
                                <input
                                    type="text"
                                    placeholder="Action description"
                                    value={item.description}
                                    onChange={(e) => handleActionItemChange(index, 'description', e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-200/60 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        value={item.dueDate}
                                        onChange={(e) => handleActionItemChange(index, 'dueDate', e.target.value)}
                                        className="w-40 px-3 py-2 bg-white dark:bg-black border border-gray-200/60 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                    />
                                    {/* Placeholder for Owner Selection - future improvement */}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveActionItem(index)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                <Trash className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {formData.actionItems.length === 0 && (
                        <p className="text-sm text-gray-500 italic">No action items added.</p>
                    )}
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
                        <Save className="w-4 h-4" /> Save MOM
                    </button>
                </div>
            </form>
        </Drawer>
    );
};
