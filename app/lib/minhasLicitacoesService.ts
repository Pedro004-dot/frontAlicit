import { LicitacaoEmpresa, StatusLicitacao } from '../types/licitacao';
import { api } from './api';

class MinhasLicitacoesService {
  async buscarLicitacoesPorEmpresa(cnpj: string): Promise<LicitacaoEmpresa[]> {
    // Usar CNPJ no formato original com pontos e barra
    const response = await api.get(`/licitacoes/empresa/${encodeURIComponent(cnpj)}`) as any[];
    
    // Mapear status do banco para frontend
    return response.map((item: any) => ({
      ...item,
      status: this.mapearStatusBancoParaFrontend(item.status)
    }));
  }

  private mapearStatusBancoParaFrontend(statusBanco: string): StatusLicitacao {
    const mapeamento: Record<string, StatusLicitacao> = {
      'aprovado': 'em_analise',
      'em_analise': 'em_analise',  // Mapeamento direto para status correto
      'recusado': 'recusada',
      'analise': 'em_analise',
      'impugnacao': 'em_analise',
      'proposta': 'proposta',
      'vencida': 'vencida',
      'perdida': 'perdida',
      'nao_definido': 'nao_definido'
    };
    
    return mapeamento[statusBanco] || 'nao_definido';
  }

  async atualizarStatus(id: number, status: StatusLicitacao): Promise<void> {
    await api.put(`/licitacoes/empresa/${id}/status`, { status });
  }

  async atualizarStatusPorChaves(numeroControlePNCP: string, empresaCnpj: string, status: StatusLicitacao): Promise<void> {
    await api.put('/licitacoes/empresa/status', { 
      numeroControlePNCP, 
      empresaCnpj, 
      status 
    });
  }

  getStatusColor(status: StatusLicitacao): string {
    const cores = {
      nao_definido: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      em_analise: 'bg-blue-100 border-blue-300 text-blue-800',
      proposta: 'bg-green-100 border-green-300 text-green-800',
      enviada: 'bg-purple-100 border-purple-300 text-purple-800',
      vencida: 'bg-gray-100 border-gray-300 text-gray-800',
      recusada: 'bg-red-100 border-red-300 text-red-800',
      perdida: 'bg-orange-100 border-orange-300 text-orange-800'
    };
    return cores[status] || cores.nao_definido;
  }

  getStatusLabel(status: StatusLicitacao): string {
    const labels = {
      nao_definido: 'Não Definido',
      em_analise: 'Em Análise',
      proposta: 'Proposta',
      enviada: 'Enviada',
      vencida: 'Vencida',
      recusada: 'Recusada',
      perdida: 'Perdida'
    };
    return labels[status] || 'Não Definido';
  }

  getStatusIcon(status: StatusLicitacao): string {
    const icons = {
      nao_definido: '🟡',
      em_analise: '🔵',
      proposta: '🟢',
      enviada: '🟣',
      vencida: '⚫',
      recusada: '🔴',
      perdida: '🟠'
    };
    return icons[status] || '🟡';
  }
}

export const minhasLicitacoesService = new MinhasLicitacoesService();