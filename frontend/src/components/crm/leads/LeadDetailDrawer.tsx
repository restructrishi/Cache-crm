import React, { useState } from 'react';
import { Drawer } from '../../ui/Drawer';
import { 
    User, 
    Building2, 
    Mail, 
    Phone, 
    Calendar, 
    FileText, 
    Clock, 
    Activity,
    CheckCircle2,
    MessageSquare,
    Paperclip,
    MoreVertical,
    Edit3,
    ArrowRightLeft,
    XCircle
} from 'lucide-react';
import { cn } from '../../../lib/utils';

interface LeadDetailDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    lead: any;
}

const TABS = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'activities', label: 'Activities', icon: Activity },
    { id: 'meetings', label: 'Meetings', icon: Calendar },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'timeline', label: 'Timeline', icon: Clock },
];

export const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({ isOpen, onClose, lead }) => {
    const [activeTab, setActiveTab] = useState('overview');

    if (!lead) return null;

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex flex-col">
                    <span className="font-bold text-xl">{lead.name}</span>
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <Building2 className="w-3 h-3" /> {lead.company}
                    </span>
                </div>
            }
            width="max-w-4xl"
            actions={
                <div className="flex items-center gap-2 mr-4">
                    <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Edit Lead">
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title="Convert Lead">
                        <ArrowRightLeft className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Mark Lost">
                        <XCircle className="w-4 h-4" />
                    </button>
                    <div className="h-6 w-px bg-gray-200 dark:bg-white/10 mx-1" />
                    <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium border",
                        lead.status === 'New' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800' :
                        lead.status === 'Qualified' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800' :
                        'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
                    )}>
                        {lead.status}
                    </span>
                </div>
            }
        >
            <div className="flex flex-col h-full">
                {/* Tabs Header */}
                <div className="flex items-center gap-1 border-b border-gray-100 dark:border-white/10 mb-6 overflow-x-auto no-scrollbar">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap",
                                activeTab === tab.id
                                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Contact Details</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-900 dark:text-white">{lead.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-900 dark:text-white">{lead.phone || 'Not provided'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Building2 className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-900 dark:text-white">{lead.company}</span>
                                    </div>
                                </div>

                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider pt-4">Deal Info</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="block text-xs text-gray-500">Source</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{lead.source}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs text-gray-500">Expected Deal</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{lead.expectedDealType || 'Software'}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs text-gray-500">Industry</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{lead.industry || 'Technology'}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs text-gray-500">Owner</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{lead.owner}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Requirement Summary</h3>
                                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/10">
                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {lead.requirementSummary || "No requirements added yet. Click edit to add details about the client's needs."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'meetings' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Scheduled Meetings</h3>
                                <button className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
                                    <PlusIcon /> Schedule Meeting
                                </button>
                            </div>
                            
                            <div className="space-y-3">
                                {/* Mock Meeting Item */}
                                <div className="p-4 border border-gray-200 dark:border-white/10 rounded-xl hover:shadow-md transition-shadow bg-white dark:bg-black group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white">Product Demo & Requirements</h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                <Calendar className="w-3 h-3" /> <span>Oct 24, 2023 • 2:00 PM</span>
                                            </div>
                                        </div>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700 border border-amber-200">
                                            MoM Pending
                                        </span>
                                    </div>
                                    
                                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                                        <div className="flex -space-x-2">
                                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white ring-2 ring-white dark:ring-black">JD</div>
                                            <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-[10px] text-white ring-2 ring-white dark:ring-black">SM</div>
                                        </div>
                                        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium group-hover:underline">
                                            Add MoM Details →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Placeholder for other tabs */}
                    {['activities', 'notes', 'timeline'].includes(activeTab) && (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-3">
                                {activeTab === 'activities' && <Activity className="w-6 h-6" />}
                                {activeTab === 'notes' && <FileText className="w-6 h-6" />}
                                {activeTab === 'timeline' && <Clock className="w-6 h-6" />}
                            </div>
                            <p className="text-sm">No {activeTab} recorded yet.</p>
                            <button className="mt-4 text-sm text-blue-600 hover:underline">
                                + Add {activeTab.slice(0, -1)}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Drawer>
    );
};

const PlusIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5v14"/>
    </svg>
);
