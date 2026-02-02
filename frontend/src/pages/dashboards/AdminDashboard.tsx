import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building, FileText, UserPlus, Loader2, BarChart3, LayoutDashboard, CheckCircle, XCircle } from 'lucide-react';
import { AddMemberDrawer } from '../../components/dashboards/AddMemberDrawer';
import { fetchUsers, updateUserStatus } from '../../api/admin';

interface User {
    id: string;
    fullName: string;
    email: string;
    department: string;
    isActive: boolean;
    lastLogin: string | null;
    userRoles: { role: { name: string } }[];
}

export const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const loadUsers = async () => {
        try {
            const data = await fetchUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleUpdateStatus = async (id: string, currentStatus: boolean) => {
        if (!window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) return;
        try {
            await updateUserStatus(id, !currentStatus);
            loadUsers();
        } catch (error) {
            alert('Failed to update user status');
        }
    };

    // Stats
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.isActive).length;
    // Count unique roles instead of departments
    const uniqueRoles = new Set(users.flatMap(u => u.userRoles?.map(ur => ur.role.name) || [])).size;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Overview</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your organization's resources and team</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate('/admin/analytics')}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <BarChart3 className="w-4 h-4" /> Analytics Dashboard
                    </button>
                    <button 
                        onClick={() => navigate('/admin/my-dashboard')}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <LayoutDashboard className="w-4 h-4" /> My Dashboard
                    </button>
                    <button 
                        onClick={() => setIsDrawerOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <UserPlus className="w-4 h-4" /> Invite Member
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{totalUsers}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                            <Building className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Roles</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{uniqueRoles}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{activeUsers}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="font-bold text-gray-900 dark:text-white">Team Members</h3>
                </div>
                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800">
                                    <th className="pb-3 font-semibold">Name / Email</th>
                                    <th className="pb-3 font-semibold">Role</th>
                                    <th className="pb-3 font-semibold">Status</th>
                                    <th className="pb-3 font-semibold">Last Active</th>
                                    <th className="pb-3 font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-gray-500">
                                            No users found. Invite your first member!
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="py-4 font-medium text-gray-900 dark:text-white">
                                                <div>{user.fullName || 'N/A'}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </td>
                                            <td className="py-4">
                                                <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                                    {user.userRoles?.[0]?.role?.name || 'USER'}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    user.isActive 
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                    {user.isActive ? 'Active' : 'Disabled'}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                                            </td>
                                            <td className="py-4">
                                                <button
                                                    onClick={() => handleUpdateStatus(user.id, user.isActive)}
                                                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded border transition-colors ${
                                                        user.isActive 
                                                        ? 'border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20' 
                                                        : 'border-green-200 text-green-600 hover:bg-green-50 dark:border-green-900/50 dark:hover:bg-green-900/20'
                                                    }`}
                                                >
                                                    {user.isActive ? (
                                                        <>
                                                            <XCircle className="w-3 h-3" /> Deactivate
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="w-3 h-3" /> Activate
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <AddMemberDrawer 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)}
                onSuccess={loadUsers}
            />
        </div>
    );
};
