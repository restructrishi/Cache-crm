import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle, FileText, Plus, AlertTriangle } from 'lucide-react';

// Mock Meetings
const MOCK_MEETINGS = [
    { id: '1', title: 'Intro Sync with Acme', date: 'Today, 10:00 AM', status: 'Completed', momSubmitted: false, host: 'Sarah Sales' },
    { id: '2', title: 'Demo for Global Traders', date: 'Today, 2:00 PM', status: 'Scheduled', momSubmitted: false, host: 'Sarah Sales' },
    { id: '3', title: 'Negotiation with Logistics Inc', date: 'Yesterday', status: 'Completed', momSubmitted: true, host: 'Mike SCM' },
];

export const Meetings: React.FC = () => {
    const [meetings, setMeetings] = useState(MOCK_MEETINGS);
    const [showMomModal, setShowMomModal] = useState<string | null>(null); // Meeting ID
    const [momText, setMomText] = useState('');

    const handleSubmitMom = () => {
        setMeetings(prev => prev.map(m => m.id === showMomModal ? { ...m, momSubmitted: true } : m));
        setShowMomModal(null);
        setMomText('');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meetings & MoM</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage calendar and mandatory Minutes of Meeting</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20">
                    <Plus className="w-4 h-4" /> Schedule Meeting
                </button>
            </div>

            <div className="grid gap-4">
                {meetings.map((meeting) => (
                    <div key={meeting.id} className="bg-white dark:bg-[#1e1e1e] p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <CalendarIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">{meeting.title}</h3>
                                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {meeting.date}</span>
                                    <span className="text-gray-300">•</span>
                                    <span>Host: {meeting.host}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {meeting.status === 'Completed' ? (
                                meeting.momSubmitted ? (
                                    <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full text-sm font-medium">
                                        <CheckCircle className="w-4 h-4" /> MoM Submitted
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setShowMomModal(meeting.id)}
                                        className="flex items-center gap-2 text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors animate-pulse"
                                    >
                                        <AlertTriangle className="w-4 h-4" /> Submit MoM (Mandatory)
                                    </button>
                                )
                            ) : (
                                <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                                    Scheduled
                                </span>
                            )}
                            <button className="text-gray-400 hover:text-gray-600">
                                <FileText className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Simple MoM Modal */}
            {showMomModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-lg rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold mb-4">Submit Minutes of Meeting</h2>
                        <textarea
                            className="w-full h-32 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            placeholder="Key discussion points, Action items, Next steps..."
                            value={momText}
                            onChange={(e) => setMomText(e.target.value)}
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setShowMomModal(null)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitMom}
                                disabled={!momText}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                Submit MoM
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
