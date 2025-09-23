import { StatusLicitacao } from '../../types/licitacao';

export class StatusAdapter {
  private static readonly STATUS_MAPPING = {
    'aprovado': 'nao_analisado',
    'nao_analisado': 'nao_analisado',
    'em_analise': 'em_analise',
    'analise': 'em_analise',
    'impugnacao': 'nao_analisado',
    'analisado': 'analisado',
    'proposta': 'proposta',
    'enviada': 'enviada',
    'vencida': 'vencida',
    'recusado': 'recusada',
    'recusada': 'recusada',
    'perdida': 'perdida',
    'nao_definido': 'nao_definido'
  } as const;

  static toFrontend(statusBanco: string): StatusLicitacao {
    const statusMapeado = this.STATUS_MAPPING[statusBanco as keyof typeof this.STATUS_MAPPING];
    return statusMapeado || 'nao_definido';
  }

  static isValidStatus(status: string): status is StatusLicitacao {
    return Object.values(this.STATUS_MAPPING).includes(status as StatusLicitacao);
  }
}