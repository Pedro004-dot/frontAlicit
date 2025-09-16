import { useState, useEffect } from 'react';
import { LicitacaoEmpresa, StatusLicitacao } from '../types/licitacao';
import { minhasLicitacoesService } from '../lib/minhasLicitacoesService';

export function useMinhasLicitacoes(empresaCnpj: string) {
  const [licitacoes, setLicitacoes] = useState<LicitacaoEmpresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<StatusLicitacao | 'todas'>('todas');
  const [isClient, setIsClient] = useState(false);

  const buscarLicitacoes = async () => {
    if (!empresaCnpj || !isClient) {
      console.log('🚫 CNPJ não fornecido ou não é cliente, não buscando licitações');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Buscando licitações para CNPJ:', empresaCnpj);
      const data = await minhasLicitacoesService.buscarLicitacoesPorEmpresa(empresaCnpj);
      console.log('✅ Licitações encontradas:', data);
      setLicitacoes(data);
    } catch (error) {
      console.error('❌ Erro ao buscar licitações:', error);
      setError('Erro ao carregar licitações');
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (id: number, novoStatus: StatusLicitacao) => {
    try {
      await minhasLicitacoesService.atualizarStatus(id, novoStatus);
      setLicitacoes(prev => 
        prev.map(licitacao => 
          licitacao.id === id 
            ? { ...licitacao, status: novoStatus }
            : licitacao
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  };

  const licitacoesFiltradas = filtroStatus === 'todas' 
    ? licitacoes 
    : licitacoes.filter(licitacao => licitacao.status === filtroStatus);

  const contarPorStatus = () => {
    const contadores: Record<StatusLicitacao | 'todas', number> = {
      todas: licitacoes.length,
      nao_definido: 0,
      em_analise: 0,
      proposta: 0,
      enviada: 0,
      vencida: 0,
      recusada: 0,
      perdida: 0
    };

    licitacoes.forEach(licitacao => {
      contadores[licitacao.status]++;
    });

    return contadores;
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      buscarLicitacoes();
    }
  }, [empresaCnpj, isClient]);

  return {
    licitacoes: licitacoesFiltradas,
    loading,
    error,
    filtroStatus,
    setFiltroStatus,
    atualizarStatus,
    refetch: buscarLicitacoes,
    contadores: contarPorStatus()
  };
}