import React, { useState } from 'react';
import { Drawer } from '../ui/Drawer';
import { Loader2 } from 'lucide-react';
import { createUser } from '../../api/admin';

interface AddMemberDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddMemberDrawer: React.FC<AddMemberDrawerProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    roleName: 'USER',
  });
  const [error, setError] = useState('');

  const roles = [
    { value: 'USER', label: 'User' },
    { value: 'ORG_ADMIN', label: 'Admin' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await createUser({
        email: formData.email,
        fullName: formData.fullName,
        password: formData.password,
        roleName: formData.roleName
      });

      onSuccess();
      onClose();
      // Reset form
      setFormData({
        email: '',
        fullName: '',
        password: '',
        confirmPassword: '',
        roleName: 'USER',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Invite New Member" width="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg dark:bg-red-900/20 dark:text-red-400">
                {error}
            </div>
        )}
        
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
                    placeholder="John Doe"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
                    placeholder="colleague@company.com"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Department</label>
                <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
                    placeholder="Sales, Engineering, etc."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Role</label>
                    <select
                        value={formData.roleName}
                        onChange={(e) => setFormData({...formData, roleName: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
                    >
                        {roles.map(role => (
                            <option key={role.value} value={role.value}>{role.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                    <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
                    <input
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
                    />
                </div>
            </div>
        </div>

        <div className="flex gap-3 pt-4">
            <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-white dark:bg-white/5 border border-gray-200/60 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors font-medium"
            >
                Cancel
            </button>
            <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Send Invitation
            </button>
        </div>
      </form>
    </Drawer>
  );
};
