import React, { useState } from 'react';
import { Drawer } from '../../ui/Drawer';
import { Save, Plus } from 'lucide-react';

interface LeadFormDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (lead: any) => void;
}

export const LeadFormDrawer: React.FC<LeadFormDrawerProps> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        // Section A: Basic Info
        firstName: '',
        lastName: '',
        company: '',
        email: '',
        phone: '',
        source: 'Website',
        website: '',
        linkedin: '',
        status: 'New',
        owner: 'Current User', // Default to logged-in user

        // Section B: Business Context
        industry: '',
        requirementSummary: '',
        expectedDealType: 'Software',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!formData.firstName?.trim() || !formData.lastName?.trim() || !formData.company?.trim() || !formData.email?.trim()) {
            alert('Please fill in all required fields (First Name, Last Name, Company, Email)');
            return;
        }

        onSave({
            id: Math.random().toString(36).substr(2, 9),
            name: `${formData.firstName?.trim() || ''} ${formData.lastName?.trim() || ''}`,
            firstName: formData.firstName?.trim(),
            lastName: formData.lastName?.trim(),
            company: formData.company?.trim(),
            email: formData.email?.trim() || null,
            phone: formData.phone?.trim() || null,
            source: formData.source || 'Website',
            website: formData.website?.trim() || null,
            linkedin: formData.linkedin?.trim() || null,
            status: formData.status || 'New',
            owner: formData.owner || 'Current User',
            industry: formData.industry?.trim() || null,
            requirementSummary: formData.requirementSummary?.trim() || null,
            expectedDealType: formData.expectedDealType || 'Software',
            createdDate: new Date().toISOString()
        });
        onClose();
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title="Add New Lead"
            width="max-w-2xl"
            actions={
                <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5"
                >
                    <Save className="w-4 h-4" /> Save Lead
                </button>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section A: Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-white/10 pb-2">
                        Basic Information
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">First Name <span className="text-red-500">*</span></label>
                            <input
                                required
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
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
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Company Name <span className="text-red-500">*</span></label>
                        <input
                            required
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
                            placeholder="Acme Corp"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Email <span className="text-red-500">*</span></label>
                            <input
                                required
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Phone</label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Lead Source</label>
                            <select
                                name="source"
                                value={formData.source}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                            >
                                <option value="Website">Website</option>
                                <option value="LinkedIn">LinkedIn</option>
                                <option value="Referral">Referral</option>
                                <option value="Cold Call">Cold Call</option>
                                <option value="Campaign">Campaign</option>
                                <option value="Partner">Partner</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                            >
                                <option value="New">New</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Qualified">Qualified</option>
                            </select>
                        </div>
                    </div>
                    
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Website</label>
                            <input
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                placeholder="https://example.com"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">LinkedIn</label>
                            <input
                                name="linkedin"
                                value={formData.linkedin}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                placeholder="LinkedIn URL"
                            />
                        </div>
                    </div>
                </div>

                {/* Section B: Business Context */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-white/10 pb-2">
                        Business Context
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Industry</label>
                            <input
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                placeholder="e.g. Manufacturing"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Expected Deal Type</label>
                            <select
                                name="expectedDealType"
                                value={formData.expectedDealType}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                            >
                                <option value="Hardware">Hardware</option>
                                <option value="Software">Software</option>
                                <option value="Hardware + Service">Hardware + Service</option>
                                <option value="Software + Service">Software + Service</option>
                                <option value="Managed Services">Managed Services</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Requirement Summary</label>
                        <textarea
                            name="requirementSummary"
                            value={formData.requirementSummary}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400 resize-none"
                            placeholder="Describe the lead's requirements..."
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-white/10">
                    <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5"
                    >
                        Save Lead
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            handleSubmit({ preventDefault: () => {} } as any);
                            setFormData({
                                firstName: '',
                                lastName: '',
                                company: '',
                                email: '',
                                phone: '',
                                source: 'Website',
                                website: '',
                                linkedin: '',
                                status: 'New',
                                owner: 'Current User',
                                industry: '',
                                requirementSummary: '',
                                expectedDealType: 'Software',
                            });
                        }}
                        className="flex-1 bg-white dark:bg-white/5 border border-gray-200/60 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-md"
                    >
                        Save & Add Another
                    </button>
                </div>
            </form>
        </Drawer>
    );
};
