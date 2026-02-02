import React, { useEffect, useState } from 'react';
import { getCustomerPos } from '../../api/customer-po';
import { fetchPipelines, updatePipelineStep } from '../../api/pipeline';
import { uploadFile } from '../../api/upload';
import { Eye, FileText, Download, Calendar, Upload, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface CustomerPo {
  id: string;
  poNumber: string;
  poDate: string;
  receivedOn: string;
  status: string;
  documentUrl: string;
  deal: {
    id: string;
    name: string;
    owner: { fullName: string }
  };
  quote: {
    quoteNumber: string;
  } | null;
}

interface Pipeline {
  id: string;
  currentStage: string;
  deal: {
    id: string;
    name: string;
    amount: number;
  };
  account: {
    name: string;
  };
}

const PurchaseOrders = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [pos, setPos] = useState<CustomerPo[]>([]);
  const [pendingPipelines, setPendingPipelines] = useState<Pipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null);
  const [poFile, setPoFile] = useState<File | null>(null);
  const [poNumber, setPoNumber] = useState('');
  const [poDate, setPoDate] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [posData, pipelinesData] = await Promise.all([
        getCustomerPos(),
        fetchPipelines()
      ]);
      
      setPos(posData);
      // Filter pipelines that are waiting for PO
      setPendingPipelines(pipelinesData.filter((p: Pipeline) => p.currentStage === 'Customer PO'));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = (pipeline: Pipeline) => {
    setSelectedPipeline(pipeline);
    setShowUploadModal(true);
    setPoNumber('');
    setPoDate(format(new Date(), 'yyyy-MM-dd'));
    setPoFile(null);
  };

  const handlePoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPipeline || !poFile || !poNumber || !poDate) {
      alert('Please fill all fields and select a file');
      return;
    }

    try {
      setUploading(true);
      // 1. Upload File
      const uploadRes = await uploadFile(poFile);
      
      // 2. Update Pipeline Step (which triggers PO creation in backend)
      await updatePipelineStep(selectedPipeline.id, 'Customer PO', {
        status: 'COMPLETED',
        data: {
          poNumber,
          poDate,
          documentUrl: uploadRes.filePath,
          originalName: uploadRes.originalName,
          uploadedAt: new Date().toISOString()
        }
      });

      // 3. Refresh Data
      await loadData();
      
      // 4. Close Modal
      setShowUploadModal(false);
      setSelectedPipeline(null);
      setPoFile(null);
      
      // Switch to history tab to show the new PO
      setActiveTab('history');
      
    } catch (err: any) {
      alert(err.message || 'Failed to upload PO');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-6 text-white">Loading Purchase Orders...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Purchase Orders</h1>
          <p className="text-gray-400">Manage pending and received customer purchase orders</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 px-2 font-medium transition-colors relative ${
            activeTab === 'pending' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Pending POs
          {pendingPipelines.length > 0 && (
            <span className="ml-2 bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded-full">
              {pendingPipelines.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-2 font-medium transition-colors relative ${
            activeTab === 'history' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          PO Registry (History)
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden min-h-[400px]">
        {activeTab === 'pending' ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-900/50">
                <th className="p-4 font-semibold text-gray-300">Deal Name</th>
                <th className="p-4 font-semibold text-gray-300">Account</th>
                <th className="p-4 font-semibold text-gray-300">Amount</th>
                <th className="p-4 font-semibold text-gray-300">Stage</th>
                <th className="p-4 font-semibold text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {pendingPipelines.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle className="w-8 h-8 text-green-500/50" />
                      <p>No pending POs. All active deals have POs uploaded.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pendingPipelines.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="p-4 font-medium text-white">{p.deal.name}</td>
                    <td className="p-4 text-gray-300">{p.account.name}</td>
                    <td className="p-4 text-gray-300">${p.deal.amount?.toLocaleString()}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                        Waiting for PO
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleUploadClick(p)}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" /> Upload PO
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-900/50">
                <th className="p-4 font-semibold text-gray-300">PO Number</th>
                <th className="p-4 font-semibold text-gray-300">Received Date</th>
                <th className="p-4 font-semibold text-gray-300">Deal / Project</th>
                <th className="p-4 font-semibold text-gray-300">Quote Ref</th>
                <th className="p-4 font-semibold text-gray-300">Status</th>
                <th className="p-4 font-semibold text-gray-300">Document</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {pos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No purchase orders found in registry.
                  </td>
                </tr>
              ) : (
                pos.map((po) => (
                  <tr key={po.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <span className="font-medium text-white">{po.poNumber}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {po.receivedOn ? format(new Date(po.receivedOn), 'MMM d, yyyy') : '-'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-white font-medium">{po.deal?.name || 'Unknown Deal'}</div>
                      <div className="text-xs text-gray-500">{po.deal?.owner?.fullName}</div>
                    </td>
                    <td className="p-4 text-gray-300">
                      {po.quote?.quoteNumber || '-'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        po.status === 'Received' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        po.status === 'Processing' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                      }`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {po.documentUrl ? (
                        <a 
                          href={`http://localhost:3000${po.documentUrl}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm"
                        >
                          <Download className="w-4 h-4" /> Download
                        </a>
                      ) : (
                        <span className="text-gray-500 text-sm">No File</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && selectedPipeline && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Upload Purchase Order</h2>
            <p className="text-sm text-gray-400 mb-4">
              Upload PO for deal: <span className="text-white font-medium">{selectedPipeline.deal.name}</span>
            </p>
            
            <form onSubmit={handlePoSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">PO Number</label>
                <input
                  type="text"
                  required
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. PO-2026-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">PO Date</label>
                <input
                  type="date"
                  required
                  value={poDate}
                  onChange={(e) => setPoDate(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">PO Document (PDF/Image)</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    required
                    onChange={(e) => setPoFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.png,.jpg,.jpeg"
                  />
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-300 font-medium">
                    {poFile ? poFile.name : 'Click to select file'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {uploading ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" /> Upload & Submit
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrders;
