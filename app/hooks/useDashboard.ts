import { useState, useEffect } from 'react';
import dashboardService from '../lib/dashboardService';
import { DashboardData, LicitacaoComEstagio } from '../types/dashboard';

export const useDashboard = (cnpj: string) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [licitacoes, setLicitacoes] = useState<LicitacaoComEstagio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    if (!cnpj) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [dashboardResponse, licitacoesResponse] = await Promise.all([
        dashboardService.getDashboardData(cnpj),
        dashboardService.getLicitacoesComEstagios(cnpj)
      ]);

      setDashboardData(dashboardResponse.data);
      setLicitacoes(licitacoesResponse.data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [cnpj]);

  const refreshData = () => {
    fetchDashboardData();
  };

  return {
    dashboardData,
    licitacoes,
    loading,
    error,
    refreshData
  };
};