export interface PipelineStep {
  id: string;
  pipelineId: string;
  stepName: string;
  assignedRole: string;
  assignedUserId: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED';
  data: any;
  completedAt: string | null;
}

export interface PipelineLog {
  id: string;
  pipelineId: string;
  stepName: string;
  action: string;
  performedBy: string;
  timestamp: string;
  user?: { fullName: string; email: string };
}

export interface OrderPipeline {
  id: string;
  dealId: string;
  currentStage: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  steps: PipelineStep[];
  logs: PipelineLog[];
  deal?: { name: string; amount: number; owner: { fullName: string } };
  account?: { name: string };
}
