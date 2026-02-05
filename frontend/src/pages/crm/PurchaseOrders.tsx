import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '../../api/orders';
import { DataTable } from '../../components/ui/Table';
import { CreateOrderDrawer } from '../../components/crm/orders/CreateOrderDrawer';
import { Plus, Filter, Download, Loader2, Eye, Search } from 'lucide-react';

const PurchaseOrders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await ordersApi.getAll({ 
        search: searchQuery,
        status: statusFilter
      });
      setOrders(data);
      setError(null);
    } catch (err: any) {
      console.error('Error loading orders:', err);
      setError(err.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      loadOrders();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter]);

  const handleCreateSuccess = () => {
    loadOrders();
    setIsCreateDrawerOpen(false);
  };

  const columns = [
    { 
      header: 'PO Number', 
      accessorKey: 'poNumber',
      className: 'font-medium text-gray-900 dark:text-white'
    },
    { 
      header: 'Vendor', 
      accessorKey: 'vendorName',
      cell: (row: any) => row.vendorName || row.account?.name || '-'
    },
    { 
      header: 'Deal', 
      accessorKey: 'deal',
      cell: (row: any) => row.deal?.name || '-'
    },
    { 
      header: 'Date', 
      accessorKey: 'poDate',
      cell: (row: any) => row.poDate ? new Date(row.poDate).toLocaleDateString() : new Date(row.createdAt).toLocaleDateString()
    },
    { 
      header: 'Amount', 
      accessorKey: 'amount',
      cell: (row: any) => row.amount ? `$${Number(row.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '-'
    },
    { 
      header: 'Stage', 
      accessorKey: 'currentStage',
      cell: (row: any) => <span className="text-blue-600 dark:text-blue-400 font-medium">{row.currentStage}</span>
    },
    { 
      header: 'Status', 
      accessorKey: 'status',
      cell: (row: any) => {
        const colors: any = {
          'Completed': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
          'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
          'Blocked': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
          'Pending': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[row.status] || 'bg-gray-100 text-gray-700'}`}>
            {row.status}
          </span>
        );
      }
    }
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-red-500 gap-4">
        <p className="text-lg font-medium">{error}</p>
        <button onClick={loadOrders} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Purchase Orders</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage procurement and order pipelines</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search POs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 w-64"
            />
          </div>
          <button 
            onClick={() => setIsCreateDrawerOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all"
          >
            <Plus className="w-4 h-4" /> Create PO
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <DataTable
          data={orders}
          columns={columns}
          onRowClick={(row) => navigate(`/admin/orders/${row.id}`)}
          actions={[
            {
              label: 'View Pipeline',
              icon: <Eye className="w-4 h-4" />,
              onClick: (row) => navigate(`/admin/orders/${row.id}`)
            }
          ]}
        />
      )}

      <CreateOrderDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        onSave={handleCreateSuccess}
      />
    </div>
  );
};

export default PurchaseOrders;
