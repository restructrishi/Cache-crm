import React from 'react';
import { Shield, Server, Users, Activity, Lock, Globe } from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
            <header className="mb-10 flex items-center justify-between border-b border-zinc-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Platform Command Center</h1>
                    <p className="text-zinc-500 mt-2">Super Admin Control Panel</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-red-900/20 text-red-400 border border-red-900/50 rounded-lg text-sm font-mono flex items-center gap-2">
                        <Activity className="w-4 h-4" /> System Critical
                    </div>
                </div>
            </header>

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
                    <div className="text-4xl font-bold text-white mb-2">12</div>
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
                    <div className="text-4xl font-bold text-white mb-2">3</div>
                    <div className="text-xs text-rose-400">
                        Critical updates required
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Users className="w-5 h-5 text-zinc-400" /> Recent Signups
                    </h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold">AC</div>
                                    <div>
                                        <div className="font-medium text-white">Acme Corp</div>
                                        <div className="text-xs text-zinc-500">Enterprise Plan • ID: org_{1000 + i}</div>
                                    </div>
                                </div>
                                <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300">Manage</button>
                            </div>
                        ))}
                    </div>
                </div>

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
                                <button className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-xs text-white">Restart</button>
                                <button className="px-3 py-1 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded text-xs">Stop</button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
                            <div>
                                <div className="font-medium text-white">Data Processor (Python)</div>
                                <div className="text-xs text-emerald-500">Running • Worker #1</div>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-xs text-white">Restart</button>
                                <button className="px-3 py-1 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded text-xs">Stop</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
