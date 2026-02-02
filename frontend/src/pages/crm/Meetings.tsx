import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/Table';
import { Plus, Loader2, AlertCircle, Pencil, Trash, FileText, Calendar } from 'lucide-react';
import { MeetingFormDrawer } from '../../components/crm/meetings/MeetingFormDrawer';
import { MomDrawer } from '../../components/crm/meetings/MomDrawer';
import { fetchMeetings, createMeeting, updateMeeting, deleteMeeting, createMom } from '../../api/meetings';

export const Meetings: React.FC = () => {
    const [meetings, setMeetings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Drawers state
    const [isMeetingDrawerOpen, setIsMeetingDrawerOpen] = useState(false);
    const [isMomDrawerOpen, setIsMomDrawerOpen] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState<any>(null);

    const loadMeetings = async () => {
        try {
            setIsLoading(true);
            const data = await fetchMeetings();
            setMeetings(data);
            setError(null);
        } catch (err: any) {
            console.error('Error loading meetings:', err);
            setError(err.message || 'Failed to load meetings');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadMeetings();
    }, []);

    // Meeting Operations
    const handleSaveMeeting = async (meetingData: any) => {
        try {
            if (meetingData.id) {
                await updateMeeting(meetingData.id, meetingData);
            } else {
                await createMeeting(meetingData);
            }
            await loadMeetings();
            setIsMeetingDrawerOpen(false);
            setSelectedMeeting(null);
        } catch (err: any) {
            console.error('Error saving meeting:', err);
            alert(err.message || 'Failed to save meeting');
        }
    };

    const handleDeleteMeeting = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this meeting?')) return;
        try {
            await deleteMeeting(id);
            await loadMeetings();
        } catch (err: any) {
            console.error('Error deleting meeting:', err);
            alert(err.message || 'Failed to delete meeting');
        }
    };

    // MOM Operations
    const handleSaveMom = async (momData: any) => {
        try {
            if (!selectedMeeting) return;
            await createMom(selectedMeeting.id, momData);
            await loadMeetings();
            setIsMomDrawerOpen(false);
            setSelectedMeeting(null);
        } catch (err: any) {
            console.error('Error saving MOM:', err);
            alert(err.message || 'Failed to save MOM');
        }
    };

    const openEditMeeting = (meeting: any) => {
        setSelectedMeeting(meeting);
        setIsMeetingDrawerOpen(true);
    };

    const openAddMeeting = () => {
        setSelectedMeeting(null);
        setIsMeetingDrawerOpen(true);
    };

    const openAddMom = (meeting: any) => {
        setSelectedMeeting(meeting);
        setIsMomDrawerOpen(true);
    };

    const columns: any[] = [
        { 
            header: 'Title', 
            accessorKey: 'title', 
            className: 'font-medium text-gray-900 dark:text-white'
        },
        { 
            header: 'Date & Time', 
            accessorKey: 'startTime',
            cell: (row: any) => (
                <div className="flex flex-col">
                    <span className="text-sm font-medium">
                        {new Date(row.startTime).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-gray-500">
                        {new Date(row.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                        {new Date(row.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                </div>
            )
        },
        { 
            header: 'Related To', 
            accessorKey: 'related',
            cell: (row: any) => {
                if (row.deal) return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">Deal: {row.deal.name}</span>;
                if (row.lead) return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Lead: {row.lead.firstName} {row.lead.lastName}</span>;
                return '-';
            }
        },
        { 
            header: 'Host', 
            accessorKey: 'host',
            cell: (row: any) => row.host?.fullName || 'Unknown'
        },
        { 
            header: 'Status', 
            accessorKey: 'status',
            cell: (row: any) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    row.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    row.status === 'Cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                    {row.status}
                </span>
            )
        },
        {
            header: 'Actions',
            accessorKey: 'id',
            className: 'w-[150px]',
            cell: (row: any) => (
                <div className="flex items-center gap-2">
                    {!row.momSubmitted && row.status !== 'Cancelled' && (
                        <button
                            onClick={(e) => { e.stopPropagation(); openAddMom(row); }}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title="Add MOM"
                        >
                            <FileText className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={(e) => { e.stopPropagation(); openEditMeeting(row); }}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit Meeting"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteMeeting(row.id); }}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Meeting"
                    >
                        <Trash className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meetings & MOM</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Schedule meetings and track minutes</p>
                </div>
                <button
                    onClick={openAddMeeting}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" /> Schedule Meeting
                </button>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-4 text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={meetings}
                    searchKey="title"
                />
            </div>

            <MeetingFormDrawer
                isOpen={isMeetingDrawerOpen}
                onClose={() => setIsMeetingDrawerOpen(false)}
                onSave={handleSaveMeeting}
                initialData={selectedMeeting}
            />

            <MomDrawer
                isOpen={isMomDrawerOpen}
                onClose={() => setIsMomDrawerOpen(false)}
                onSave={handleSaveMom}
                meetingTitle={selectedMeeting?.title}
            />
        </div>
    );
};
