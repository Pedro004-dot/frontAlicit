'use client';

import AuthLayout from '../components/layout/AuthLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { useBi } from '../hooks/useBi';

// Componente de KPI melhorado
interface KPICardProps {
  title: string;
  value: string;
  loading?: boolean;
  className?: string;
}

function KPICard({ title, value, loading, className = '' }: KPICardProps) {
  return (
    <div className={`group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:shadow-orange-100 transition-all duration-300 hover:-translate-y-1 ${className}`}>
      {/* Gradiente sutil de fundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative">
        {/* Conteúdo */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-24"></div>
              <div className="animate-pulse-dot">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              </div>
            </div>
          ) : (
            <p className="text-3xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
              {value}
            </p>
          )}
        </div>

        {/* Efeito de brilho no hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { biData, loading: biLoading, error: biError } = useBi();

  return (
    <ProtectedRoute>
      <AuthLayout>
        <div className="p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-white min-h-screen">
          {/* Header melhorado */}
          <div className="mb-10">
            <div className="flex items-center space-x-4 mb-4">
              <div>
                <p className="text-gray-600 text-lg font-bold">Análise geral do mercado de licitações</p>
              </div>
            </div>
          </div>

          {biError && (
            <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-700 font-medium">Erro ao carregar dados: {biError}</p>
              </div>
            </div>
          )}

          {/* Grid de KPIs - Apenas os dois principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* KPI 1: Total de Licitações */}
            <KPICard
              title="Total de Licitações no Mercado"
              value={biData?.totalLicitacoes.toLocaleString('pt-BR') || '0'}
              loading={biLoading}
            />

            {/* KPI 2: Valor Total Estimado */}
            <KPICard  
              title="Valor Total Estimado"
              value={biData?.valorTotalEstimado 
                ? `R$ ${(biData.valorTotalEstimado / 1000000000).toFixed(1)}B`
                : 'R$ 0'
              }
              
              loading={biLoading}
            />
          </div>
        </div>
      </AuthLayout>
    </ProtectedRoute>
  );
}