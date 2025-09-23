import { LicitacaoEmpresa, StatusLicitacao } from '../types/licitacao';
import { StatusAdapter } from './adapters/StatusAdapter';
import { api } from './api';

class MinhasLicitacoesService {
  async buscarLicitacoesPorEmpresa(cnpj: string): Promise<LicitacaoEmpresa[]> {
    const response = await api.get(`/licitacoes/empresa/${encodeURIComponent(cnpj)}`) as any[];
    
    return response.map((item: any) => ({
      ...item,
      status: StatusAdapter.toFrontend(item.status)
    }));
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
}

export const minhasLicitacoesService = new MinhasLicitacoesService();