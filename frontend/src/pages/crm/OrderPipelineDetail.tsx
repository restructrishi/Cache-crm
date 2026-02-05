import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersApi } from '../../api/orders';
import { uploadFile } from '../../api/upload';
import { 
  ArrowLeft, CheckCircle, Clock, FileText, Upload, User, Shield, 
  Calendar, DollarSign, Building, AlertTriangle, Send, ShoppingCart, List
} from 'lucide-react';
import { format } from 'date-fns';

interface OrderStep {
  id: string;
  stepName: string;
  assignedRole: string;
  status: string;
  data: any;
  completedAt: string | null;
  assignedUser: {
    fullName: string;
  } | null;
  documents: {
    fileName: string;
    fileUrl: string;
  }[];
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  poDate: string;
  amount: number;
  currentStage: string;
  status: string;
  deal: {
    name: string;
  };
  account: {
    name: string;
  };
  vendorName?: string;
  vendorEmail?: string;
  vendorPhone?: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  terms?: string;
  notes?: string;
  steps: OrderStep[];
}

const OrderPipelineDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState<OrderStep | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'step'>('overview');
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [file, setFile] = useState<File | null>(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userRoles = currentUser.roles || [];

  useEffect(() => {
    if (id) loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await ordersApi.getById(id!);
      setOrder(data);
      
      // Default to overview, but if needed we can default to current step
      // const current = data.steps.find((s: OrderStep) => s.status !== 'Completed') || data.steps[data.steps.length - 1];
      // setActiveStep(current);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const canEditStep = (step: OrderStep) => {
    if (userRoles.includes('SUPER_ADMIN')) return true;
    if (step.status === 'Completed') return false;
    
    const roleMap: Record<string, string[]> = {
      'SALES': ['SALES', 'ADMIN'],
      'FINANCE': ['FINANCE', 'ADMIN'],
      'SCM': ['SCM', 'ADMIN'],
      'FIELD_ENGINEER': ['FIELD_ENGINEER', 'ADMIN'],
      'DEPLOYMENT': ['DEPLOYMENT', 'ADMIN'],
      'ADMIN': ['ADMIN', 'SUPER_ADMIN']
    };

    const allowedRoles = roleMap[step.assignedRole] || [];
    return userRoles.some((r: string) => allowedRoles.includes(r));
  };

  const validateFile = (file: File) => {
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png'
    ];

    if (file.size > MAX_SIZE) {
      throw new Error('File size exceeds 10MB limit');
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Invalid file format. Allowed: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG');
    }
  };

  const handleUpdateStep = async (status: string) => {
    if (!activeStep || !order) return;

    try {
      setUploading(true);
      
      let fileData = null;
      if (file) {
        validateFile(file);
        const uploadRes = await uploadFile(file);
        fileData = {
          type: 'step_document',
          fileName: uploadRes.originalName,
          fileUrl: uploadRes.filePath
        };
        
        await ordersApi.uploadDocument(order.id, activeStep.id, fileData);
      }

      await ordersApi.updateStep(activeStep.id, activeStep.stepName, {
        status,
        data: { ...activeStep.data, ...formData, ...(fileData ? { fileUrl: fileData.fileUrl } : {}) }
      });

      await loadOrder();
      setFile(null);
      setFormData({});
      
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const renderStepForm = (step: OrderStep) => {
    const isEditable = canEditStep(step);
    
    switch (step.stepName) {
      case 'Customer PO Received':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">PO Number</label>
              <input
                type="text"
                disabled={!isEditable}
                value={formData.poNumber || step.data?.poNumber || ''}
                onChange={e => setFormData({...formData, poNumber: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">PO Amount</label>
              <input
                type="number"
                disabled={!isEditable}
                value={formData.amount || step.data?.amount || ''}
                onChange={e => setFormData({...formData, amount: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              />
            </div>
          </div>
        );
      
      case 'Internal Approval':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Approval Comments</label>
              <textarea
                disabled={!isEditable}
                value={formData.comments || step.data?.comments || ''}
                onChange={e => setFormData({...formData, comments: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white h-24"
              />
            </div>
          </div>
        );

      case 'Vendor PO':
        return (
           <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Vendor Name</label>
              <input
                type="text"
                disabled={!isEditable}
                value={formData.vendorName || step.data?.vendorName || ''}
                onChange={e => setFormData({...formData, vendorName: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Vendor PO Number</label>
              <input
                type="text"
                disabled={!isEditable}
                value={formData.vendorPoNumber || step.data?.vendorPoNumber || ''}
                onChange={e => setFormData({...formData, vendorPoNumber: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Notes / Details</label>
              <textarea
                disabled={!isEditable}
                value={formData.notes || step.data?.notes || ''}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white h-24"
              />
            </div>
          </div>
        );
    }
  };

  const renderOverview = () => {
    if (!order) return null;
    return (
      <div className="p-8 space-y-8 overflow-y-auto">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <ShoppingCart className="text-blue-400" size={20} />
            Order Information
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className="text-sm text-gray-400">PO Number</label>
              <p className="font-medium text-white text-lg">{order.poNumber}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Date</label>
              <p className="font-medium text-white">
                {order.poDate ? new Date(order.poDate).toLocaleDateString() : '-'}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Total Amount</label>
              <p className="font-medium text-green-400 text-lg">
                ${Number(order.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Status</label>
              <span className="inline-block px-2 py-1 mt-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {order.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
             <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building className="text-purple-400" size={20} />
              Vendor Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Name</span>
                <span className="text-white">{order.vendorName || '-'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Email</span>
                <span className="text-white">{order.vendorEmail || '-'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Phone</span>
                <span className="text-white">{order.vendorPhone || '-'}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
             <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="text-yellow-400" size={20} />
              Terms & Notes
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase">Terms</label>
                <p className="text-sm text-gray-300 mt-1">{order.terms || 'No terms specified'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase">Notes</label>
                <p className="text-sm text-gray-300 mt-1">{order.notes || 'No notes'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-4 bg-gray-800 border-b border-gray-700">
             <h3 className="font-semibold flex items-center gap-2">
              <List className="text-blue-400" size={20} />
              Line Items
            </h3>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-900/50 text-gray-400">
              <tr>
                <th className="p-4 font-medium">Description</th>
                <th className="p-4 font-medium text-center">Qty</th>
                <th className="p-4 font-medium text-right">Unit Price</th>
                <th className="p-4 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {(order.items || []).map((item, i) => (
                <tr key={i} className="hover:bg-gray-700/30">
                  <td className="p-4 text-white">{item.description}</td>
                  <td className="p-4 text-center text-gray-300">{item.quantity}</td>
                  <td className="p-4 text-right text-gray-300">${Number(item.unitPrice).toFixed(2)}</td>
                  <td className="p-4 text-right font-medium text-white">${Number(item.totalPrice).toFixed(2)}</td>
                </tr>
              ))}
              {(!order.items || order.items.length === 0) && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">No items listed</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (loading) return <div className="p-8 text-white">Loading pipeline details...</div>;
  if (error || !order) return <div className="p-8 text-red-500">{error || 'Order not found'}</div>;

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Sidebar - Steps List */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <button 
            onClick={() => navigate('/admin/orders')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={16} /> Back to List
          </button>
          <h2 className="font-bold text-lg truncate" title={order.poNumber}>{order.poNumber}</h2>
          <p className="text-sm text-gray-400 truncate">{order.vendorName || order.account?.name}</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {/* Overview Item */}
          <div
            onClick={() => {
              setViewMode('overview');
              setActiveStep(null);
            }}
            className={`p-3 rounded-lg cursor-pointer transition-all border ${
              viewMode === 'overview'
                ? 'bg-blue-600/20 border-blue-500/50' 
                : 'bg-gray-800 border-transparent hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                <FileText size={16} />
              </div>
              <div>
                <h3 className={`font-medium text-sm ${viewMode === 'overview' ? 'text-blue-300' : 'text-gray-300'}`}>
                  Order Overview
                </h3>
                <p className="text-xs text-gray-500">Details & Items</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-700 my-2 mx-2" />

          {/* Steps */}
          {order.steps.map((step, index) => (
            <div
              key={step.id}
              onClick={() => {
                setActiveStep(step);
                setViewMode('step');
              }}
              className={`p-3 rounded-lg cursor-pointer transition-all border ${
                activeStep?.id === step.id && viewMode === 'step'
                  ? 'bg-blue-600/20 border-blue-500/50' 
                  : 'bg-gray-800 border-transparent hover:bg-gray-700'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-mono text-gray-500">STEP {index + 1}</span>
                {step.status === 'Completed' ? (
                  <CheckCircle size={14} className="text-green-400" />
                ) : step.status === 'In Progress' ? (
                  <Clock size={14} className="text-blue-400" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-gray-600" />
                )}
              </div>
              <h3 className={`font-medium text-sm ${activeStep?.id === step.id && viewMode === 'step' ? 'text-blue-300' : 'text-gray-300'}`}>
                {step.stepName}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded text-gray-400">
                  {step.assignedRole}
                </span>
                {step.assignedUser && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <User size={10} /> {step.assignedUser.fullName}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {viewMode === 'overview' ? (
          renderOverview()
        ) : activeStep ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-700 bg-gray-800/50 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold mb-1">{activeStep.stepName}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Shield size={14} /> Assigned to: <span className="text-white">{activeStep.assignedRole}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${
                      activeStep.status === 'Completed' ? 'bg-green-500' :
                      activeStep.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-500'
                    }`} />
                    Status: <span className="text-white">{activeStep.status}</span>
                  </span>
                </div>
              </div>
              
              {canEditStep(activeStep) && activeStep.status !== 'Completed' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdateStep('Completed')}
                    disabled={uploading}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {uploading ? 'Saving...' : <> <CheckCircle size={16} /> Mark Completed </>}
                  </button>
                </div>
              )}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-3xl mx-auto space-y-8">
                
                {/* Form Section */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="text-blue-400" size={20} />
                    Step Details
                  </h3>
                  {renderStepForm(activeStep)}
                </div>

                {/* File Upload Section */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Upload className="text-purple-400" size={20} />
                    Documents
                  </h3>
                  
                  {/* Existing Documents */}
                  {activeStep.documents && activeStep.documents.length > 0 && (
                     <div className="mb-4 space-y-2">
                       {activeStep.documents.map((doc, i) => (
                         <div key={i} className="flex items-center justify-between bg-gray-900 p-3 rounded border border-gray-700">
                           <div className="flex items-center gap-3">
                             <FileText className="text-blue-400" size={16} />
                             <span className="text-sm text-gray-300">{doc.fileName}</span>
                           </div>
                           <a 
                             href={`http://localhost:3000${doc.fileUrl}`} 
                             target="_blank" 
                             rel="noreferrer"
                             className="text-xs text-blue-400 hover:text-blue-300 underline"
                           >
                             View
                           </a>
                         </div>
                       ))}
                     </div>
                  )}

                  {/* Upload New */}
                  {canEditStep(activeStep) && activeStep.status !== 'Completed' && (
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer relative bg-gray-900/50">
                      <input
                        type="file"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center gap-2 pointer-events-none">
                        <Upload className="w-8 h-8 text-gray-500" />
                        <span className="text-sm text-gray-400">
                          {file ? file.name : 'Upload relevant documents (Drag & Drop)'}
                          <br/>
                          <span className="text-xs text-gray-500">Max 10MB. PDF, DOC, XLS, Images.</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {!canEditStep(activeStep) && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="text-yellow-500 shrink-0 mt-0.5" size={18} />
                    <div>
                      <h4 className="text-yellow-400 font-medium text-sm">Read-Only Mode</h4>
                      <p className="text-yellow-500/70 text-sm mt-1">
                        You do not have the required role ({activeStep.assignedRole}) to edit this step.
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a step to view details
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPipelineDetail;
