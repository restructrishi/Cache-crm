import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPipelineById, updatePipelineStep } from '../../api/pipeline';
import { uploadFile } from '../../api/upload';
import type { OrderPipeline, PipelineStep } from '../../types/pipeline';
import { 
  ArrowLeft, CheckCircle, Clock, AlertCircle, User, 
  FileText, Truck, CheckSquare, Settings, DollarSign,
  ChevronRight, ArrowRight, Upload, X
} from 'lucide-react';
import { cn } from '../../lib/utils';

const PipelineDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pipeline, setPipeline] = useState<OrderPipeline | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // PO Upload State
  const [showPoModal, setShowPoModal] = useState(false);
  const [poFile, setPoFile] = useState<File | null>(null);
  const [poNumber, setPoNumber] = useState('');
  const [poDate, setPoDate] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
    loadPipeline();
  }, [id]);

  const loadPipeline = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await fetchPipelineById(id);
      setPipeline(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStepUpdate = async (stepName: string, status: string, additionalData?: any) => {
    if (!pipeline) return;
    try {
      await updatePipelineStep(pipeline.id, stepName, { status, data: additionalData });
      await loadPipeline(); // Refresh
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handlePoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pipeline || !poFile || !poNumber || !poDate) {
      alert('Please fill all fields and select a file');
      return;
    }

    try {
      setUploading(true);
      // 1. Upload File
      const uploadRes = await uploadFile(poFile);
      
      // 2. Update Step
      await updatePipelineStep(pipeline.id, 'Customer PO', {
        status: 'COMPLETED',
        data: {
          poNumber,
          poDate,
          documentUrl: uploadRes.filePath,
          originalName: uploadRes.originalName,
          uploadedAt: new Date().toISOString()
        }
      });

      await loadPipeline();
      setShowPoModal(false);
      setPoFile(null);
      setPoNumber('');
      setPoDate('');
    } catch (err: any) {
      alert(err.message || 'Failed to upload PO');
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'BLOCKED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'IN_PROGRESS': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'BLOCKED': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const canEditStep = (step: PipelineStep) => {
    if (!currentUser) return false;
    const userRoles = currentUser.roles || [];
    
    // Super Admin override
    if (userRoles.includes('SUPER_ADMIN') || userRoles.includes('Super Admin')) return true;

    // Role match
    const stepRole = step.assignedRole?.toLowerCase();
    const hasRole = userRoles.some((r: string) => r.toLowerCase() === stepRole || r.toLowerCase().includes(stepRole));
    
    // Assigned user match
    if (step.assignedUserId === currentUser.id) return true;

    // Sales override for basic user if not specified
    if (stepRole === 'sales' && (userRoles.includes('User') || userRoles.includes('Sales'))) return true;

    return hasRole;
  };

  const renderStageNode = (step: PipelineStep, index: number, total: number) => {
    const isCompleted = step.status === 'COMPLETED';
    const isInProgress = step.status === 'IN_PROGRESS';
    const isBlocked = step.status === 'BLOCKED';
    
    let bgColor = 'bg-gray-200';
    let borderColor = 'border-gray-300';
    let textColor = 'text-gray-500';

    if (isCompleted) {
        bgColor = 'bg-green-500';
        borderColor = 'border-green-600';
        textColor = 'text-white';
    } else if (isInProgress) {
        bgColor = 'bg-blue-500';
        borderColor = 'border-blue-600';
        textColor = 'text-white';
    } else if (isBlocked) {
        bgColor = 'bg-red-500';
        borderColor = 'border-red-600';
        textColor = 'text-white';
    }

    return (
        <div key={step.id} className="flex flex-col items-center min-w-[120px] relative group">
            {/* Connecting Line */}
            {index < total - 1 && (
                <div className={cn(
                    "absolute top-4 left-[50%] w-full h-1 z-0",
                    isCompleted ? "bg-green-500" : "bg-gray-200"
                )} />
            )}
            
            {/* Node */}
            <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 transition-all duration-300 shadow-sm",
                bgColor, borderColor, textColor
            )}>
                {isCompleted ? <CheckCircle className="w-5 h-5" /> : 
                 isInProgress ? <Clock className="w-5 h-5 animate-pulse" /> :
                 isBlocked ? <AlertCircle className="w-5 h-5" /> :
                 <span className="text-xs font-bold">{index + 1}</span>}
            </div>

            {/* Label */}
            <div className="mt-2 text-center px-1">
                <p className={cn(
                    "text-xs font-semibold truncate max-w-[110px]",
                    isInProgress ? "text-blue-600" : "text-gray-700"
                )}>
                    {step.stepName}
                </p>
                <p className="text-[10px] text-gray-400">{step.assignedRole}</p>
            </div>
            
            {/* Hover Details */}
            <div className="absolute top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs p-2 rounded shadow-lg z-50 pointer-events-none w-48 text-center">
                <p className="font-bold mb-1">{step.stepName}</p>
                <p>Status: {step.status}</p>
                {step.completedAt && <p>Completed: {new Date(step.completedAt).toLocaleDateString()}</p>}
            </div>
        </div>
    );
  };

  const renderStepContent = (step: PipelineStep) => {
    const isEditable = canEditStep(step);

    return (
      <div key={step.id} className={`flex gap-4 p-4 mb-4 bg-white rounded-lg border ${step.status === 'IN_PROGRESS' ? 'border-blue-300 ring-1 ring-blue-100' : 'border-gray-200'} shadow-sm`}>
        <div className="flex-shrink-0 mt-1">
          {getStatusIcon(step.status)}
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{step.stepName}</h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <span className={`px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600`}>
                  {step.assignedRole}
                </span>
                {step.completedAt && (
                  <span>Completed: {new Date(step.completedAt).toLocaleDateString()}</span>
                )}
              </div>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(step.status)}`}>
              {step.status}
            </div>
          </div>

          {/* Step specific data display */}
          {step.data && Object.keys(step.data as object).length > 0 && (
            <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-700">
               {step.stepName === 'Customer PO' && (step.data as any).documentUrl ? (
                 <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">PO Number:</span> {(step.data as any).poNumber}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">PO Date:</span> {(step.data as any).poDate}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <a 
                        href={`http://localhost:3000${(step.data as any).documentUrl}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                      >
                        <Upload className="w-4 h-4" /> View/Download PO Document
                      </a>
                    </div>
                 </div>
               ) : (
                 <pre className="whitespace-pre-wrap font-sans">{JSON.stringify(step.data, null, 2)}</pre>
               )}
            </div>
          )}

          {/* Actions */}
          {isEditable && step.status !== 'COMPLETED' && (
            <div className="mt-4 flex gap-2">
              {step.status === 'PENDING' && (
                <button
                  onClick={() => handleStepUpdate(step.stepName, 'IN_PROGRESS')}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Start
                </button>
              )}
              {step.status === 'IN_PROGRESS' && (
                <>
                  {step.stepName === 'Customer PO' ? (
                    <button
                      onClick={() => setShowPoModal(true)}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 flex items-center gap-1"
                    >
                      <Upload className="w-4 h-4" /> Upload PO & Complete
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const data = prompt('Enter details (e.g. PO Number, Vendor Name):');
                        if (data) handleStepUpdate(step.stepName, 'COMPLETED', { note: data });
                      }}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
                    >
                      Mark Complete
                    </button>
                  )}
                  <button
                    onClick={() => handleStepUpdate(step.stepName, 'BLOCKED')}
                    className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded hover:bg-red-100"
                  >
                    Block
                  </button>
                </>
              )}
              {step.status === 'BLOCKED' && (
                <button
                  onClick={() => handleStepUpdate(step.stepName, 'IN_PROGRESS')}
                  className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                >
                  Resume
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-full mb-4"></div>
              <div className="text-gray-500">Loading pipeline...</div>
          </div>
      </div>
  );
  
  if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  if (!pipeline) return <div className="p-8 text-center">Pipeline not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to List
          </button>
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Order Pipeline <span className="text-gray-400 font-normal">#{pipeline.id.slice(0, 8)}</span>
              </h1>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                 <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Account: <span className="font-medium text-gray-900">{pipeline.account?.name || 'N/A'}</span>
                 </div>
                 <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Deal Value: <span className="font-medium text-gray-900">${pipeline.deal?.amount?.toLocaleString() || '0'}</span>
                 </div>
              </div>
            </div>
            <div className="flex flex-col items-end bg-white p-3 rounded-lg shadow-sm border border-gray-100">
               <span className="text-xs text-gray-500 uppercase tracking-wide">Current Stage</span>
               <span className="text-lg font-bold text-blue-600">{pipeline.currentStage}</span>
            </div>
          </div>
        </div>

        {/* Jenkins-style Stage View */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 overflow-x-auto">
            <h2 className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-wider flex items-center gap-2">
                <Settings className="w-4 h-4" /> Pipeline Stages
            </h2>
            <div className="flex items-start justify-between min-w-[800px] pb-4">
                {pipeline.steps.map((step, index) => renderStageNode(step, index, pipeline.steps.length))}
            </div>
        </div>

        {/* Detailed Steps */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Stage Details & Actions</h2>
          {pipeline.steps.map(renderStepContent)}
        </div>
      </div>

      {/* PO Upload Modal */}
      {showPoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button 
              onClick={() => setShowPoModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-bold text-gray-900 mb-4">Upload Customer PO</h3>
            
            <form onSubmit={handlePoSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PO Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. PO-2023-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PO Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={poDate}
                  onChange={(e) => setPoDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PO Document (PDF/Image) <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                  <input
                    type="file"
                    required
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setPoFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="po-file-upload"
                  />
                  <label htmlFor="po-file-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      {poFile ? poFile.name : 'Click to upload file'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPoModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {uploading ? 'Uploading...' : 'Submit & Complete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PipelineDetail;
