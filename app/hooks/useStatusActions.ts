import { useMemo } from 'react';
import { StatusLicitacao } from '../types/licitacao';
import { STATUS_CONFIG, StatusConfig } from '../config/statusConfig';
import { StatusService } from '../lib/services/StatusService';

export interface StatusActions {
  config: StatusConfig;
  canStartAnalysis: boolean;
  canMakeDecision: boolean;
  canNavigateToAnalysis: boolean;
  isAnalysisInProgress: boolean;
  isCompleted: boolean;
  isPending: boolean;
  canEdit: boolean;
  nextStatuses: StatusLicitacao[];
  getNextStatus: (action: 'approve' | 'reject' | 'analyze') => StatusLicitacao;
}

export const useStatusActions = (status: StatusLicitacao): StatusActions => {
  return useMemo(() => {
    const config = STATUS_CONFIG[status];
    const statusFlow = StatusService.getStatusFlow();

    return {
      config,
      canStartAnalysis: StatusService.canStartAnalysis(status),
      canMakeDecision: StatusService.canMakeDecision(status),
      canNavigateToAnalysis: StatusService.canNavigateToAnalysis(status),
      isAnalysisInProgress: StatusService.isAnalysisInProgress(status),
      isCompleted: StatusService.isCompleted(status),
      isPending: StatusService.isPending(status),
      canEdit: StatusService.canEdit(status),
      nextStatuses: statusFlow[status] || [],
      getNextStatus: (action: 'approve' | 'reject' | 'analyze') => 
        StatusService.getNextStatus(status, action)
    };
  }, [status]);
};

export const useStatusConfig = (status: StatusLicitacao) => {
  return useMemo(() => STATUS_CONFIG[status], [status]);
};