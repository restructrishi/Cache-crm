import React, { useState, useEffect } from 'react';
import { Drawer } from '../../ui/Drawer';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  ShieldCheck, 
  ArrowRight,
  Plus,
  Trash2
} from 'lucide-react';
import { 
  createDeployment, 
  updateDeployment, 
  addDeploymentTask, 
  updateDeploymentTask, 
  deleteDeploymentTask 
} from '../../../api/deployment';
import { fetchDeals } from '../../../api/deals';
import { getUser } from '../../../lib/auth';

interface DeploymentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  deployment?: any; // If null, create mode
  onSave?: () => void;
}

const STAGES = [
  'Request Initiation',
  'Pre-Deployment Checklist',
  'Approval',
  'Scheduling',
  'Execution',
  'Validation',
  'Sign-off',
  'Closure'
];

export const DeploymentDrawer: React.FC<DeploymentDrawerProps> = ({
  isOpen,
  onClose,
  deployment,
  onSave
}) => {
  const [formData, setFormData] = useState<any>({
    dealId: '',
    deploymentType: 'Standard',
    environment: 'Production',
    priority: 'Medium',
    description: ''
  });
  const [tasks, setTasks] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);
  const user = getUser();
  const canEdit = user?.roles?.includes('SUPER_ADMIN') || 
                  user?.roles?.includes('ORG_ADMIN') || 
                  user?.department === 'Deployment';

  useEffect(() => {
    if (isOpen) {
      fetchDeals().then(setDeals).catch(console.error);
    }
  }, [isOpen]);

  useEffect(() => {
    if (deployment) {
      setFormData({
        dealId: deployment.dealId,
        deploymentType: deployment.deploymentType,
        environment: deployment.environment,
        priority: deployment.priority,
        description: deployment.description
      });
      setTasks(deployment.tasks || []);
    } else {
      setFormData({
        dealId: '',
        deploymentType: 'Standard',
        environment: 'Production',
        priority: 'Medium',
        description: ''
      });
      setTasks([]);
    }
  }, [deployment]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (deployment) {
        await updateDeployment(deployment.id, formData);
      } else {
        await createDeployment(formData);
      }
      onSave?.();
      onClose();
    } catch (error) {
      console.error('Error saving deployment:', error);
      alert('Failed to save deployment');
    } finally {
      setLoading(false);
    }
  };

  const handleStageChange = async (newStage: string) => {
    if (!deployment) return;
    if (!confirm(`Are you sure you want to move to ${newStage}?`)) return;
    
    try {
      setLoading(true);
      await updateDeployment(deployment.id, { stage: newStage });
      onSave?.(); // Refresh parent
      // Update local state if needed, or rely on parent refresh
      // For now, close drawer to force refresh or just reload
      onSave?.(); 
    } catch (error) {
      alert('Failed to update stage');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.trim() || !deployment) return;
    try {
      const task = await addDeploymentTask(deployment.id, { 
        taskName: newTask, 
        stage: deployment.stage 
      });
      setTasks([...tasks, task]);
      setNewTask('');
    } catch (error) {
      alert('Failed to add task');
    }
  };

  const handleToggleTask = async (task: any) => {
    try {
      const updated = await updateDeploymentTask(task.id, { 
        isCompleted: !task.isCompleted,
        completionDate: !task.isCompleted ? new Date() : null
      });
      setTasks(tasks.map(t => t.id === task.id ? updated : t));
    } catch (error) {
      alert('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteDeploymentTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (error) {
      alert('Failed to delete task');
    }
  };

  const currentStageIndex = deployment ? STAGES.indexOf(deployment.stage) : 0;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={deployment ? `Deployment: ${deployment.deal?.name || 'Unknown Deal'}` : 'New Deployment Request'}
      width="w-[800px]"
    >
      <div className="space-y-8 p-1">
        
        {/* Workflow Visualizer */}
        {deployment && (
          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -z-10" />
            <div className="flex justify-between">
              {STAGES.map((stage, index) => {
                const isCompleted = index < currentStageIndex;
                const isCurrent = index === currentStageIndex;
                
                return (
                  <div key={stage} className="flex flex-col items-center gap-2 group relative">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                      ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 
                        isCurrent ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110' : 
                        'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'}
                    `}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : 
                       isCurrent ? <Clock className="w-5 h-5" /> : 
                       <Circle className="w-5 h-5" />}
                    </div>
                    
                    {/* Tooltip for stage name */}
                    <span className={`
                      absolute top-10 text-[10px] font-medium whitespace-nowrap px-2 py-1 rounded bg-gray-900 text-white opacity-0 group-hover:opacity-100 transition-opacity
                    `}>
                      {stage}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm font-medium text-gray-500">Current Stage</p>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{deployment.stage}</h3>
            </div>
          </div>
        )}

        {/* Create/Edit Form */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Deal / Project
            </label>
            <select
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={formData.dealId}
              onChange={e => setFormData({...formData, dealId: e.target.value})}
              disabled={!!deployment}
            >
              <option value="">Select a Deal</option>
              {deals.map((deal: any) => (
                <option key={deal.id} value={deal.id}>
                  {deal.name} ({deal.company})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={formData.deploymentType}
              onChange={e => setFormData({...formData, deploymentType: e.target.value})}
              disabled={!canEdit}
            >
              <option>Standard</option>
              <option>Emergency</option>
              <option>Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Environment
            </label>
            <select
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={formData.environment}
              onChange={e => setFormData({...formData, environment: e.target.value})}
              disabled={!canEdit}
            >
              <option>Production</option>
              <option>Staging</option>
              <option>UAT</option>
            </select>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={formData.priority}
              onChange={e => setFormData({...formData, priority: e.target.value})}
              disabled={!canEdit}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>
        </div>

        {/* Checklist Section (Only visible if deployment exists) */}
        {deployment && (
          <>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                Checklist & Tasks
              </h4>
              
              <div className="space-y-3 mb-4">
                {tasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => canEdit && handleToggleTask(task)}
                        className={`
                          w-5 h-5 rounded border flex items-center justify-center transition-colors
                          ${task.isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'}
                        `}
                      >
                        {task.isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                      <span className={task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'}>
                        {task.taskName}
                      </span>
                    </div>
                    {canEdit && (
                      <button onClick={() => handleDeleteTask(task.id)} className="text-gray-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {canEdit && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Add new task..."
                    value={newTask}
                    onChange={e => setNewTask(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddTask()}
                  />
                  <button 
                    onClick={handleAddTask}
                    className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>

            {/* Audit Logs */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-500" />
                Workflow Logs
              </h4>
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {deployment.workflowLogs?.map((log: any, index: number) => (
                  <div key={index} className="flex gap-3 text-sm">
                    <div className="min-w-[4px] bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="pb-4 border-b border-gray-100 dark:border-gray-700/50 last:border-0 w-full">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                        <span className="font-medium">{log.action}</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{log.details}</p>
                      {log.from && log.to && (
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-100 dark:border-gray-700 inline-flex">
                          <span>{log.from}</span>
                          <ArrowRight className="w-3 h-3" />
                          <span className="text-blue-600 dark:text-blue-400 font-medium">{log.to}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {(!deployment.workflowLogs || deployment.workflowLogs.length === 0) && (
                  <p className="text-gray-500 text-sm italic">No logs available.</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
          {deployment && canEdit && currentStageIndex < STAGES.length - 1 && (
            <button
              onClick={() => handleStageChange(STAGES[currentStageIndex + 1])}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all"
            >
              Move to {STAGES[currentStageIndex + 1]} <ArrowRight className="w-4 h-4" />
            </button>
          )}
          
          <div className="flex gap-3 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
            >
              {deployment ? 'Save Changes' : 'Create Request'}
            </button>
          </div>
        </div>

      </div>
    </Drawer>
  );
};
