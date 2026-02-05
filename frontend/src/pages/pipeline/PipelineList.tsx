import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPipelines } from '../../api/pipeline';
import { DataTable } from '../../components/ui/Table';
import { Loader2, AlertCircle, Eye } from 'lucide-react';

interface PipelineListProps {
  title?: string;
  filterStages?: string[];
  filterRole?: string;
  filterAccountId?: string;
}

export const PipelineList: React.FC<PipelineListProps> = ({ title, filterStages, filterRole, filterAccountId }) => {
  const navigate = useNavigate();
  const [pipelines, setPipelines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPipelines();
  }, [filterAccountId]);

  const loadPipelines = async () => {
    try {
      setIsLoading(true);
      const data = await fetchPipelines();
      
      let filtered = Array.isArray(data) ? data : [];
      if (filterStages && filterStages.length > 0) {
        filtered = filtered.filter((p: any) => filterStages.includes(p.currentStage));
      }

      if (filterAccountId) {
        filtered = filtered.filter((p: any) => p.accountId === filterAccountId);
      }
      
      setPipelines(filtered);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: any[] = [
    {
      header: 'Deal',
      accessorKey: 'deal',
      cell: (row: any) => row.deal?.name || 'Unknown'
    },
    {
      header: 'Account',
      accessorKey: 'account',
      cell: (row: any) => row.account?.name || 'Unknown'
    },
    {
      header: 'Current Stage',
      accessorKey: 'currentStage',
      cell: (row: any) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {row.currentStage}
        </span>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Last Updated',
      accessorKey: 'updatedAt',
      cell: (row: any) => new Date(row.updatedAt).toLocaleDateString()
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row: any) => (
        <button
          onClick={() => navigate(`/admin/pipeline/${row.id}`)}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
        >
          <Eye className="w-4 h-4" /> View
        </button>
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title || 'Pipelines'}</h1>
          <p className="text-sm text-gray-500">Manage order pipelines</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 text-red-700 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <DataTable
            columns={columns}
            data={pipelines}
        />
      </div>
    </div>
  );
};

export const AccountPipelineList: React.FC = () => {
    const { accountId } = useParams<{ accountId: string }>();
    return <PipelineList title="Account Pipelines" filterAccountId={accountId} />;
};
