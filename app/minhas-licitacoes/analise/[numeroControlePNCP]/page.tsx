'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AuthLayout from '../../../components/layout/AuthLayout';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import ResumoTecnico from './components/ResumoTecnico';
import DocumentPreview from './components/DocumentPreview';
import AcoesAprovacao from './components/AcoesAprovacao';
import StatusIndicador from '../../../components/analise/StatusIndicador';
import AgenteCard from '../../../components/analise/AgenteCard';
import DadosConcretos from '../../../components/analise/DadosConcretos';
import ResumoExecutivo from '../../../components/analise/ResumoExecutivo';
import ItensLicitacao from '../../../components/analise/ItensLicitacao';
import InformacoesGerais from '../../../components/analise/InformacoesGerais';
import { useLicitacaoAnalise } from '../../../hooks/useLicitacaoAnalise';
import { authUtils } from '../../../lib/authUtils';
import { analiseService } from '../../../lib/analiseService';
import { licitacaoService } from '../../../lib/licitacaoService';

export default function AnaliseePage() {
  const params = useParams();
  const router = useRouter();
  // Decodificar o número de controle da URL
  const numeroControlePNCP = decodeURIComponent(params.numeroControlePNCP as string);
  const [empresaCnpj, setEmpresaCnpj] = useState('');
  const [licitacaoCompleta, setLicitacaoCompleta] = useState<any>(null);
  const [loadingLicitacao, setLoadingLicitacao] = useState(true);

  const {
    relatorio,
    analiseDetalhada,
    documentos,
    documentoAtual,
    previewUrl,
    loading,
    previewLoading,
    error,
    selecionarDocumento,
    aprovarLicitacao,
    recusarLicitacao,
    downloadDocumento
  } = useLicitacaoAnalise(numeroControlePNCP, empresaCnpj);

  useEffect(() => {
    const userData = authUtils.getUserData();
    if (userData?.empresaId) {
      setEmpresaCnpj(userData.empresaId);
    }
  }, []);

  // Carregar dados completos da licitação
  useEffect(() => {
    const carregarLicitacaoCompleta = async () => {
      try {
        setLoadingLicitacao(true);
        const dados = await licitacaoService.getUniqueLicitacao(numeroControlePNCP);
        setLicitacaoCompleta(dados);
      } catch (error) {
        console.error('Erro ao carregar licitação completa:', error);
      } finally {
        setLoadingLicitacao(false);
      }
    };

    if (numeroControlePNCP) {
      carregarLicitacaoCompleta();
    }
  }, [numeroControlePNCP]);

  // Verificar se análise está finalizada
  useEffect(() => {
    if (!empresaCnpj) return;
    
    verificarStatusAnalise();
  }, [empresaCnpj]);

  const verificarStatusAnalise = async () => {
    try {
      const relatorioExiste = await analiseService.buscarRelatorioTecnico(empresaCnpj, numeroControlePNCP);
      
      if (!relatorioExiste) {
        // Análise não finalizada - redirecionar para minhas licitações
        router.push('/minhas-licitacoes');
        return;
      }
      
      // Análise finalizada - carregar dados normalmente
      // O hook useLicitacaoAnalise já fará isso automaticamente
      
    } catch (error) {
      console.error('Erro ao verificar status da análise:', error);
      router.push('/minhas-licitacoes');
    }
  };

  const handleAprovar = async () => {
    try {
      await aprovarLicitacao();
      router.push('/minhas-licitacoes');
    } catch (error) {
      console.error('Erro ao aprovar licitação:', error);
    }
  };

  const handleRecusar = async () => {
    try {
      await recusarLicitacao();
      router.push('/minhas-licitacoes');
    } catch (error) {
      console.error('Erro ao recusar licitação:', error);
    }
  };

  if (loading || loadingLicitacao) {
    return (
      <ProtectedRoute>
        <AuthLayout>
          <div className="p-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7000]"></div>
              <p className="ml-4 text-gray-600">Carregando dados da licitação...</p>
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
              <h3 className="text-red-800 font-medium mb-2">Erro ao carregar análise</h3>
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => router.push('/minhas-licitacoes')}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Voltar para Minhas Licitações
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
          <div className="mb-6">
            <button
              onClick={() => router.push('/minhas-licitacoes')}
              className="flex items-center gap-2 text-[#FF7000] hover:text-[#F57000] transition-colors mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar para Minhas Licitações
            </button>
            
            <h1 className="text-3xl font-bold text-[#333333] mb-2">
              Análise da Licitação
            </h1>
            <p className="text-gray-600">
              {numeroControlePNCP}
            </p>
          </div>

  
          {/* Informações Gerais da Licitação */}
          {licitacaoCompleta && (
            <InformacoesGerais licitacao={licitacaoCompleta} />
          )}

          {/* Itens da Licitação */}
          {licitacaoCompleta?.licitacao_itens && (
            <ItensLicitacao 
              itens={licitacaoCompleta.licitacao_itens}
              valorTotalLicitacao={licitacaoCompleta.valor_total_estimado}
            />
          )}

          {/* Análises dos Agentes */}
          {analiseDetalhada?.agentes && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Análises dos Agentes Especializados</h2>
              <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-6">
                <AgenteCard
                  agente={analiseDetalhada.agentes.estrategico || null}
                  tipo="estrategico"
                  cor="border-blue-500"
                />
                <AgenteCard
                  agente={analiseDetalhada.agentes.operacional || null}
                  tipo="operacional"
                  cor="border-green-500"
                />
                <AgenteCard
                  agente={analiseDetalhada.agentes.juridico || null}
                  tipo="juridico"
                  cor="border-purple-500"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8">
            <DocumentPreview
              documentos={documentos}
              documentoAtual={documentoAtual}
              previewUrl={previewUrl}
              previewLoading={previewLoading}
              onSelecionarDocumento={selecionarDocumento}
              onDownload={downloadDocumento}
            />
          </div>

          <AcoesAprovacao
            onAprovar={handleAprovar}
            onRecusar={handleRecusar}
            loading={loading}
          />
        </div>
      </AuthLayout>
    </ProtectedRoute>
  );
}