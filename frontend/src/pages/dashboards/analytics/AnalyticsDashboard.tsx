import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Download } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('30'); // Days

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      // Use fallback if no token (dev mode)
      if (!token) {
        console.warn('No token found, using sample data');
        setData(getSampleData());
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3000/analytics/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      
      // Validate result structure
      if (!result || !result.leads || !result.activities) {
        console.warn('Invalid data structure, using sample data');
        setData(getSampleData());
      } else {
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setError('Failed to load analytics data. Showing sample data.');
      setData(getSampleData());
    } finally {
      setLoading(false);
    }
  };

  const getSampleData = () => ({
    leads: {
      total: 124,
      byStatus: [
        { name: 'New', value: 45 },
        { name: 'Contacted', value: 30 },
        { name: 'Qualified', value: 25 },
        { name: 'Proposal', value: 15 },
        { name: 'Closed', value: 9 }
      ],
      bySource: [
        { name: 'Website', value: 40 },
        { name: 'Referral', value: 30 },
        { name: 'LinkedIn', value: 20 },
        { name: 'Cold Call', value: 10 }
      ]
    },
    activities: {
      totalMeetings: 87
    },
    productivity: [
      { user: 'John Doe', leads: 45 },
      { user: 'Jane Smith', leads: 38 },
      { user: 'Mike Johnson', leads: 22 },
      { user: 'Sarah Wilson', leads: 19 }
    ]
  });

  const handleExport = async (type: 'leads' | 'activities' | 'users', format: 'csv' | 'xlsx') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/analytics/export?type=${type}&format=${format}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_report.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again later.');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading Analytics...</div>;
  if (!data) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">No data available</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time insights across your organization</p>
          {error && <p className="text-xs text-amber-500 mt-1">{error}</p>}
        </div>
        <div className="flex gap-2">
            <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white"
            >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
            </select>
            <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white">
                    <Download className="w-4 h-4" /> Export Data
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg hidden group-hover:block z-50">
                    <div className="p-1">
                        <button onClick={() => handleExport('leads', 'csv')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200">Leads (CSV)</button>
                        <button onClick={() => handleExport('leads', 'xlsx')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200">Leads (Excel)</button>
                        <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>
                        <button onClick={() => handleExport('activities', 'xlsx')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200">Activities (Excel)</button>
                        <button onClick={() => handleExport('users', 'xlsx')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200">Users (Excel)</button>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-500">Total Leads</p>
          <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{data.leads?.total || 0}</h3>
        </div>
        <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-500">Total Meetings</p>
          <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{data.activities?.totalMeetings || 0}</h3>
        </div>
        <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-500">Conversion Rate</p>
          <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">12.5%</h3>
        </div>
        <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-500">Avg Deal Size</p>
          <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">$4,200</h3>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Leads by Status */}
        <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Leads by Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.leads?.byStatus || []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', color: '#fff' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leads by Source */}
        <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Leads by Source</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.leads?.bySource || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(data.leads?.bySource || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', color: '#fff' }} />
                <Legend wrapperStyle={{ color: '#888888' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Productivity */}
        <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 md:col-span-2">
          <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Leads per User</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.productivity || []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="user" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', color: '#fff' }} />
                <Bar dataKey="leads" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
