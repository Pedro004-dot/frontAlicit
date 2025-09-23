'use client';

import { useEffect, useState } from 'react';
import AuthLayout from '../components/layout/AuthLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import StatCard from '../components/dashboard/StatCard';
import ConversionRateCard from '../components/dashboard/ConversionRateCard';
import GraphCard from '../components/dashboard/GraphCard';
import { useDashboard } from '../hooks/useDashboard';
import { authUtils } from '../lib/authUtils';

export default function HomePage() {
  const [cnpj, setCnpj] = useState<string>(''); // Iniciar vazio para evitar SSR mismatch
  const { dashboardData, loading, error } = useDashboard(cnpj);

  useEffect(() => {
    // Só executar no cliente
    if (typeof window !== 'undefined') {
      // Buscar CNPJ da empresa selecionada
      const selectedCnpj = authUtils.getSelectedEmpresaCnpj();
      if (selectedCnpj) {
        setCnpj(selectedCnpj);
      }

      // Escutar mudanças na seleção de empresa
      const handleEmpresaChanged = () => {
        const newCnpj = authUtils.getSelectedEmpresaCnpj();
        if (newCnpj) {
          setCnpj(newCnpj);
        }
      };

      window.addEventListener('empresaChanged', handleEmpresaChanged);
      
      return () => {
        window.removeEventListener('empresaChanged', handleEmpresaChanged);
      };
    }
  }, []);

  const getStatCardValue = (value: number | undefined, loading: boolean): string => {
    if (loading) return '...';
    return value?.toString() || '0';
  };

  return (
    <ProtectedRoute>
      <AuthLayout>
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#333333] mb-2">Dashboard</h1>
            <p className="text-gray-600">Dados rápidos sobre suas licitações</p>
          </div>

          {!cnpj && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-600">Selecione uma empresa na sidebar para visualizar o dashboard</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">Erro: {error}</p>
            </div>
          )}
          
          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard 
              title="Matches"
              value={getStatCardValue(dashboardData?.total, loading)}
              trend="100%"
              trendText="Todas aprovadas"
              icon="check"
              color="orange"
            />
        
            <StatCard 
              title="Propostas"
              value={getStatCardValue(dashboardData?.enviada, loading)}
              trend={dashboardData?.total ? `${Math.round((dashboardData.enviada / dashboardData.total) * 100)}%` : '0%'}
              trendText="Enviadas"
              icon="check"
              color="orange"
            />
          </div>

          {/* Seção de Taxa de Conversão */}
          <div className="mb-8">
            <ConversionRateCard 
              matches={dashboardData?.total || 0}
              analise={dashboardData?.analise || 0}
              aguardandoConfirmacao={dashboardData?.aguardando_confirmacao || 0}
              enviada={dashboardData?.enviada || 0}
              vencida={dashboardData?.vencida || 0}
              perdida={dashboardData?.perdida || 0}
              loading={loading}
            />
          </div>

          {/* Seção do Gráfico */}
          <div className="mb-8">
            <GraphCard />
          </div>
        </div>
      </AuthLayout>
    </ProtectedRoute>
  );
}