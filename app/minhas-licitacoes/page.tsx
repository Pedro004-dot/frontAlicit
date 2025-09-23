'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '../components/layout/AuthLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import StatusCard from '../components/minhas-licitacoes/StatusCard';
import FiltroStatus from '../components/minhas-licitacoes/FiltroStatus';
import AnaliseIniciadaModal from '../components/analise/AnaliseIniciadaModal';
import AnaliseFinalizadaModal from '../components/analise/AnaliseFinalizadaModal';
import AnaliseEmAndamentoModal from '../components/analise/AnaliseEmAndamentoModal';
import { useMinhasLicitacoes } from '../hooks/useMinhasLicitacoes';
import { useAnaliseModals } from '../hooks/useAnaliseModals';
import { useAnaliseBackground } from '../hooks/useAnaliseBackground';
import { authUtils } from '../lib/authUtils';
import { LicitacaoEmpresa } from '../types/licitacao';

export default function MinhasLicitacoesPage() {
  const router = useRouter();
  const [empresaCnpj, setEmpresaCnpj] = useState('');
  const [empresaNome, setEmpresaNome] = useState('');

  const {
    licitacoes,
    loading,
    error,
    filtroStatus,
    setFiltroStatus,
    contadores,
    refetch
  } = useMinhasLicitacoes(empresaCnpj);

  const {
    analiseIniciadaModal,
    analiseFinalizadaModal,
    abrirModalIniciada,
    fecharModalIniciada,
    abrirModalFinalizada,
    fecharModalFinalizada,
    fecharTodosModais
  } = useAnaliseModals();

  // ✅ NOVO: Estado para modal de análise em andamento
  const [analiseEmAndamentoModal, setAnaliseEmAndamentoModal] = useState<{
    isOpen: boolean;
    licitacao: LicitacaoEmpresa | null;
  }>({ isOpen: false, licitacao: null });

  const {
    iniciarAnalise,
    isAnaliseEmAndamento,
    navegarParaAnalise
  } = useAnaliseBackground({
    empresaCnpj,
    onAnaliseIniciada: abrirModalIniciada,
    onAnaliseFinalizada: abrirModalFinalizada,
    onAnaliseErro: (licitacao, erro) => {
      console.error(`Erro na análise de ${licitacao.numeroControlePNCP}:`, erro);
      // TODO: Mostrar toast de erro
    },
    onDadosAtualizados: refetch,
    // ✅ NOVOS CALLBACKS:
    onNavegarParaResultados: (licitacao) => {
      console.log('Navegando para resultados da análise existente...');
      navegarParaAnalise(licitacao);
    },
    onAnaliseEmAndamento: (licitacao) => {
      console.log('Mostrando modal de análise em andamento...');
      setAnaliseEmAndamentoModal({ isOpen: true, licitacao });
    }
  });

  useEffect(() => {
    const userData = authUtils.getUserData();
    if (userData?.empresaId) {
      setEmpresaCnpj(userData.empresaId);
      
      // Buscar nome da empresa
      const empresa = userData.empresas?.find(emp => emp.cnpj === userData.empresaId);
      setEmpresaNome(empresa?.nome || 'Empresa Selecionada');
    }

    const handleEmpresaChange = () => {
      const updatedUserData = authUtils.getUserData();
      if (updatedUserData?.empresaId) {
        setEmpresaCnpj(updatedUserData.empresaId);
        
        const empresa = updatedUserData.empresas?.find(emp => emp.cnpj === updatedUserData.empresaId);
        setEmpresaNome(empresa?.nome || 'Empresa Selecionada');
        
        refetch();
      }
    };

    window.addEventListener('empresaChanged', handleEmpresaChange);
    return () => window.removeEventListener('empresaChanged', handleEmpresaChange);
  }, [refetch]);

  const handleCardClick = async (licitacao: LicitacaoEmpresa) => {
    if (licitacao.status === 'nao_analisado') {
      try {
        // Verificar se análise já está em andamento
        if (isAnaliseEmAndamento(licitacao.numeroControlePNCP)) {
          console.log('Análise já em andamento para:', licitacao.numeroControlePNCP);
          return;
        }

        // Iniciar análise em background
        await iniciarAnalise(licitacao);
      } catch (error: any) {
        console.error('Erro ao iniciar análise:', error);
        
        if (error.message === 'ANALYSIS_IN_PROGRESS') {
          console.log('Análise em andamento detectada');
        } else {
          console.error('Erro desconhecido:', error);
        }
      }
    } else if (licitacao.status === 'analisado' || licitacao.status === 'proposta') {
      // Navegar para análise (finalizada ou para tomar decisão)
      navegarParaAnalise(licitacao);
    } else {
      console.log('Status não navegável ainda:', licitacao.status);
    }
  };

  // ✅ NOVO: Função para fechar modal de análise em andamento
  const fecharModalAnaliseEmAndamento = () => {
    setAnaliseEmAndamentoModal({ isOpen: false, licitacao: null });
  };

  // ✅ NOVO: Função para ver análise atual
  const verAnaliseAtual = () => {
    if (analiseEmAndamentoModal.licitacao) {
      navegarParaAnalise(analiseEmAndamentoModal.licitacao);
    }
  };

  const handleVerResultado = () => {
    if (analiseFinalizadaModal.licitacao) {
      navegarParaAnalise(analiseFinalizadaModal.licitacao);
    }
  };

  const handleContinuarTrabalhando = () => {
    // Usuário pode continuar navegando normalmente
    // Os modais já foram fechados pelos handlers
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <AuthLayout>
          <div className="p-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7000]"></div>
            </div>
          </div>
        </AuthLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <AuthLayout>
          <div className="p-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-red-800 font-medium mb-2">Erro ao carregar licitações</h3>
              <p className="text-red-600">{error}</p>
              <button
                onClick={refetch}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </AuthLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AuthLayout>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#333333] mb-2">Minhas Licitações</h1>
            <p className="text-gray-600">
              Gerencie suas licitações • {empresaNome}
            </p>
          </div>

          <FiltroStatus
            statusAtivo={filtroStatus}
            onStatusChange={setFiltroStatus}
            contadores={contadores}
          />

          {licitacoes.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filtroStatus === 'todas' ? 'Nenhuma licitação encontrada' : `Nenhuma licitação com status "${filtroStatus}"`}
              </h3>
              <p className="text-gray-500">
                {filtroStatus === 'todas' 
                  ? 'Comece buscando licitações na página de Licitações'
                  : 'Tente alterar o filtro para ver outras licitações'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {licitacoes.map((licitacao) => (
                <StatusCard
                  key={licitacao.id}
                  licitacao={licitacao}
                  onClick={handleCardClick}
                  isProcessing={isAnaliseEmAndamento(licitacao.numeroControlePNCP)}
                />
              ))}
            </div>
          )}

          {/* Modais de Análise */}
          <AnaliseIniciadaModal
            licitacao={analiseIniciadaModal.licitacao}
            isOpen={analiseIniciadaModal.isOpen}
            onClose={fecharModalIniciada}
            onContinuarTrabalhando={handleContinuarTrabalhando}
          />

          <AnaliseFinalizadaModal
            licitacao={analiseFinalizadaModal.licitacao}
            isOpen={analiseFinalizadaModal.isOpen}
            onClose={fecharModalFinalizada}
            onVerResultado={handleVerResultado}
            onContinuarTrabalhando={handleContinuarTrabalhando}
          />

          <AnaliseEmAndamentoModal
            licitacao={analiseEmAndamentoModal.licitacao}
            isOpen={analiseEmAndamentoModal.isOpen}
            onClose={fecharModalAnaliseEmAndamento}
            onVerAnaliseAtual={verAnaliseAtual}
          />
        </div>
      </AuthLayout>
    </ProtectedRoute>
  );
}

