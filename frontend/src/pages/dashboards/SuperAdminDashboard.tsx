import React, { useState, useEffect } from 'react';
import { Shield, Server, Users, Activity, Lock, Globe, Plus, MoreVertical, CheckCircle, XCircle, UserPlus } from 'lucide-react';
import { fetchOrganizations, createOrganization, createOrgAdmin } from '../../api/super-admin';
import { Drawer } from '../../components/ui/Drawer';

export const SuperAdminDashboard: React.FC = () => {
    const [orgs, setOrgs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateOrgOpen, setIsCreateOrgOpen] = useState(false);
    const [isCreateAdminOpen, setIsCreateAdminOpen] = useState(false);
    const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

    // Form States
    const [orgForm, setOrgForm] = useState({ name: '', domain: '', address: '', phone: '', subscriptionPlan: 'FREE' });
    const [orgAdminForm, setOrgAdminForm] = useState({ email: '', password: '', fullName: '' });
    const [adminForm, setAdminForm] = useState({ email: '', fullName: '', password: '' });

    const loadOrgs = async () => {
        try {
            const data = await fetchOrganizations();
            setOrgs(data);
        } catch (error) {
            console.error('Failed to load orgs', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadOrgs();
    }, []);

    const handleCreateOrg = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!orgForm.name?.trim() || !orgForm.domain?.trim()) {
            alert('Organization Name and Domain are required.');
            return;
        }
        if (!orgAdminForm.email?.trim() || !orgAdminForm.password?.trim()) {
            alert('Admin Email and Password are required.');
            return;
        }

        try {
            const payload = {
                organization: orgForm,
                admin: orgAdminForm
            };
            
            await createOrganization(payload);
            setIsCreateOrgOpen(false);
            setOrgForm({ name: '', domain: '', address: '', phone: '', subscriptionPlan: 'FREE' });
            setOrgAdminForm({ email: '', password: '', fullName: '' });
            loadOrgs();
        } catch (error: any) {
            // Show backend error message
            alert(error.response?.data?.message || error.message || 'Failed to create organization');
        }
    };

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrgId) return;
        try {
            await createOrgAdmin({ ...adminForm, organizationId: selectedOrgId });
            setIsCreateAdminOpen(false);
            setAdminForm({ email: '', fullName: '', password: '' });
            alert('Admin created successfully');
        } catch (error) {
            alert('Failed to create admin');
        }
    };

    const openAdminModal = (orgId: string) => {
        setSelectedOrgId(orgId);
        setIsCreateAdminOpen(true);
    };

    return (
        <div className="h-full w-full overflow-auto bg-zinc-950 text-zinc-100 p-8 custom-scrollbar">
            <header className="mb-10 flex items-center justify-between border-b border-zinc-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Platform Command Center</h1>
                    <p className="text-zinc-500 mt-2">Super Admin Control Panel</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setIsCreateOrgOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Create Organization
                    </button>
                    <div className="px-4 py-2 bg-red-900/20 text-red-400 border border-red-900/50 rounded-lg text-sm font-mono flex items-center gap-2">
                        <Activity className="w-4 h-4" /> System Critical
                    </div>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
                            <Globe className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Organizations</h3>
                            <p className="text-sm text-zinc-500">Active Tenants</p>
                        </div>
                    </div>
                    <div className="text-4xl font-bold text-white mb-2">{orgs.length}</div>
                    <div className="text-xs text-green-400 flex items-center gap-1">
                        +2 this week
                    </div>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
                            <Server className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">System Status</h3>
                            <p className="text-sm text-zinc-500">Node.js Services</p>
                        </div>
                    </div>
                    <div className="text-xl font-bold text-emerald-400 mb-2">Operational</div>
                    <div className="text-xs text-zinc-500">
                        Uptime: 99.99%
                    </div>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-rose-500/10 rounded-lg text-rose-400">
                            <Lock className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Security Alerts</h3>
                            <p className="text-sm text-zinc-500">Pending Review</p>
                        </div>
                    </div>
                    <div className="text-4xl font-bold text-white mb-2">0</div>
                    <div className="text-xs text-rose-400">
                        All systems secure
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Organization List */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Users className="w-5 h-5 text-zinc-400" /> Organizations
                    </h3>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                        {orgs.map((org) => (
                            <div key={org.id} className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-white">
                                        {org.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-medium text-white">{org.name}</div>
                                        <div className="text-xs text-zinc-500">
                                            Plan: {org.subscriptionPlan} • Users: {org._count?.users || 0}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => openAdminModal(org.id)}
                                        className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                        title="Add Admin"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                    </button>
                                    <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300 px-3 py-1.5 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/10">
                                        Manage
                                    </button>
                                </div>
                            </div>
                        ))}
                        {orgs.length === 0 && (
                            <div className="text-center text-zinc-500 py-8">No organizations found.</div>
                        )}
                    </div>
                </div>

                {/* Backend Control */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Server className="w-5 h-5 text-zinc-400" /> Backend Control
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
                            <div>
                                <div className="font-medium text-white">Auth Service (Node.js)</div>
                                <div className="text-xs text-emerald-500">Running • Port 3000</div>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            </div>
                        </div>
                         <div className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
                            <div>
                                <div className="font-medium text-white">Database (PostgreSQL)</div>
                                <div className="text-xs text-emerald-500">Connected</div>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Org Drawer/Modal */}
            {isCreateOrgOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Create Organization</h2>
                        <form onSubmit={handleCreateOrg} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Name</label>
                                <input 
                                    required
                                    value={orgForm.name}
                                    onChange={e => setOrgForm({...orgForm, name: e.target.value})}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Domain</label>
                                <input 
                                    value={orgForm.domain}
                                    onChange={e => setOrgForm({...orgForm, domain: e.target.value})}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="acme.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Subscription Plan</label>
                                <select 
                                    value={orgForm.subscriptionPlan}
                                    onChange={e => setOrgForm({...orgForm, subscriptionPlan: e.target.value})}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option value="FREE">Free</option>
                                    <option value="STARTER">Starter</option>
                                    <option value="ENTERPRISE">Enterprise</option>
                                </select>
                            </div>

                            <div className="pt-4 border-t border-zinc-800">
                                <h3 className="text-sm font-semibold text-white mb-3">Initial Administrator</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1">Admin Email</label>
                                        <input 
                                            required
                                            type="email"
                                            value={orgAdminForm.email}
                                            onChange={e => setOrgAdminForm({...orgAdminForm, email: e.target.value})}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="admin@company.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1">Admin Password</label>
                                        <input 
                                            required
                                            type="password"
                                            value={orgAdminForm.password}
                                            onChange={e => setOrgAdminForm({...orgAdminForm, password: e.target.value})}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Secure Password"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button 
                                    type="button"
                                    onClick={() => setIsCreateOrgOpen(false)}
                                    className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
                                >
                                    Create Organization
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Admin Modal */}
            {isCreateAdminOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Add Org Admin</h2>
                        <form onSubmit={handleCreateAdmin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Full Name</label>
                                <input 
                                    required
                                    value={adminForm.fullName}
                                    onChange={e => setAdminForm({...adminForm, fullName: e.target.value})}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
                                <input 
                                    required
                                    type="email"
                                    value={adminForm.email}
                                    onChange={e => setAdminForm({...adminForm, email: e.target.value})}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
                                <input 
                                    required
                                    type="password"
                                    value={adminForm.password}
                                    onChange={e => setAdminForm({...adminForm, password: e.target.value})}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Leave blank for default: Welcome@123"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button 
                                    type="button"
                                    onClick={() => setIsCreateAdminOpen(false)}
                                    className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
                                >
                                    Create Admin
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
