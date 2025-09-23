import { StatusLicitacao } from '../../types/licitacao';

export class StatusService {
  static canStartAnalysis(status: StatusLicitacao): boolean {
    return status === 'nao_analisado';
  }

  static canMakeDecision(status: StatusLicitacao): boolean {
    return status === 'analisado';
  }

  static canNavigateToAnalysis(status: StatusLicitacao): boolean {
    return ['analisado', 'proposta', 'recusada'].includes(status);
  }

  static isAnalysisInProgress(status: StatusLicitacao): boolean {
    return status === 'em_analise';
  }

  static isCompleted(status: StatusLicitacao): boolean {
    return ['proposta', 'enviada', 'vencida', 'recusada', 'perdida'].includes(status);
  }

  static isPending(status: StatusLicitacao): boolean {
    return ['nao_analisado', 'em_analise'].includes(status);
  }

  static canEdit(status: StatusLicitacao): boolean {
    return ['nao_analisado', 'analisado'].includes(status);
  }

  static getNextStatus(currentStatus: StatusLicitacao, action: 'approve' | 'reject' | 'analyze'): StatusLicitacao {
    switch (action) {
      case 'analyze':
        return currentStatus === 'nao_analisado' ? 'em_analise' : currentStatus;
      case 'approve':
        return currentStatus === 'analisado' ? 'proposta' : currentStatus;
      case 'reject':
        return currentStatus === 'analisado' ? 'recusada' : currentStatus;
      default:
        return currentStatus;
    }
  }

  static getStatusFlow(): Record<StatusLicitacao, StatusLicitacao[]> {
    return {
      nao_definido: ['nao_analisado'],
      nao_analisado: ['em_analise'],
      em_analise: ['analisado'],
      analisado: ['proposta', 'recusada'],
      proposta: ['enviada'],
      enviada: ['vencida', 'perdida'],
      vencida: [],
      recusada: [],
      perdida: []
    };
  }
}