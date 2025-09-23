import { LicitacaoEmpresa } from '../../types/licitacao';

export class NotificationService {
  static emitAnaliseIniciada(licitacao: LicitacaoEmpresa) {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('analise:iniciada', {
        detail: { licitacao }
      });
      window.dispatchEvent(event);
    }
  }

  static emitAnaliseEmAndamento(licitacao: LicitacaoEmpresa) {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('analise:em_andamento', {
        detail: { licitacao }
      });
      window.dispatchEvent(event);
    }
  }

  static emitAnaliseFinalizada(licitacao: LicitacaoEmpresa) {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('analise:finalizada', {
        detail: { licitacao }
      });
      window.dispatchEvent(event);
    }
  }

  static emitStatusUpdate(licitacao: LicitacaoEmpresa, oldStatus: string, newStatus: string) {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('licitacao:status_update', {
        detail: { licitacao, oldStatus, newStatus }
      });
      window.dispatchEvent(event);
    }
  }
}