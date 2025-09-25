'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '../components/layout/AuthLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import SearchBar from '../components/licitacoes/SearchBar';
import FilterPanel, { FilterOptions } from '../components/licitacoes/FilterPanel';
import LicitacaoCard from '../components/licitacoes/LicitacaoCard';
import LicitacaoDetailModal from '../components/licitacoes/LicitacaoDetailModal';
import AprovacaoModal from '../components/licitacoes/AprovacaoModal';
import ToggleRecomendacoesBusca from '../components/licitacoes/ToggleRecomendacoesBusca';
import { Licitacao, SearchLicitacaoRequest } from '../types/licitacao';
import { licitacaoService } from '../lib/licitacaoService';
import { authUtils } from '../lib/authUtils';

export default function LicitacoesPage() {
  const router = useRouter();
  const [licitacoesRecomendadas, setLicitacoesRecomendadas] = useState<Licitacao[]>([]);
  const [licitacoesBuscaManual, setLicitacoesBuscaManual] = useState<Licitacao[]>([]);
  const [tipoVisualizacao, setTipoVisualizacao] = useState<'recomendacoes' | 'busca'>('recomendacoes');
  const [selectedLicitacao, setSelectedLicitacao] = useState<Licitacao | null>(null);
  const [loadingBusca, setLoadingBusca] = useState(false);
  const [loadingRecomendacoes, setLoadingRecomendacoes] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [aprovacaoModalOpen, setAprovacaoModalOpen] = useState(false);
  const [licitacaoAprovada, setLicitacaoAprovada] = useState<Licitacao | null>(null);
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>({
    valorMinimo: '',
    valorMaximo: '',
    valorMinimoUnitario: '',
    valorMaximoUnitario: '',
    cidade_radar: '',
    raioDistancia: ''
  });


  const handleSearch = async (query: string) => {
    setLoadingBusca(true);
    setTipoVisualizacao('busca');
    try {
      const userData = authUtils.getUserData();
      const cnpj = userData?.empresaId;
      
      if (!cnpj) {
        console.error('Nenhuma empresa selecionada');
        setLicitacoesBuscaManual([]);
        return;
      }

      const searchParams: SearchLicitacaoRequest & { cnpj: string } = {
        cnpj: cnpj,
        palavraChave: query,
        ...(currentFilters.valorMinimo && { valorMinimo: Number(currentFilters.valorMinimo) }),
        ...(currentFilters.valorMaximo && { valorMaximo: Number(currentFilters.valorMaximo) }),
        ...(currentFilters.valorMinimoUnitario && { valorMinimoUnitario: Number(currentFilters.valorMinimoUnitario) }),
        ...(currentFilters.valorMaximoUnitario && { valorMaximoUnitario: Number(currentFilters.valorMaximoUnitario) }),
        ...(currentFilters.cidade_radar && { cidade_radar: currentFilters.cidade_radar }),
        ...(currentFilters.raioDistancia && { raioDistancia: Number(currentFilters.raioDistancia) })
      };
      
      console.log('Parâmetros de busca manual:', searchParams);
      const response = await licitacaoService.searchLicitacoes(searchParams);
      
      if (Array.isArray(response)) {
        setLicitacoesBuscaManual(response);
      } else {
        setLicitacoesBuscaManual([]);
      }
    } catch (error) {
      console.error('Erro na busca manual:', error);
      setLicitacoesBuscaManual([]);
    } finally {
      setLoadingBusca(false);
    }
  };

  const handleApplyFilters = async (filters: FilterOptions) => {
    setCurrentFilters(filters);
    if (tipoVisualizacao === 'busca' && licitacoesBuscaManual.length > 0) {
      await handleSearch('');
    }
  };

  const handleCardClick = (licitacao: Licitacao) => {
    console.log('Card clicado:', licitacao.numeroControlePNCP);
    console.log('Dados da licitação:', licitacao);
    try {
      console.log('Definindo selectedLicitacao...');
      setSelectedLicitacao(licitacao);
      console.log('Abrindo modal...');
      setModalOpen(true);
      console.log('Modal deveria estar aberto agora');
    } catch (error) {
      console.error('Erro ao abrir modal:', error);
    }
  };

  const handleApproveLicitacao = async (numeroControlePNCP: string) => {
    try {
      const licitacao = [...licitacoesRecomendadas, ...licitacoesBuscaManual]
        .find(l => l.numeroControlePNCP === numeroControlePNCP);
      
      if (!licitacao) {
        console.error('Licitação não encontrada');
        return;
      }

      // Salvar licitação na tabela licitacoes_empresa
      const userData = authUtils.getUserData();
      const empresaCnpj = userData?.empresaId;
      
      if (!empresaCnpj) {
        console.error('Empresa não selecionada');
        return;
      }

      await licitacaoService.approveLicitacao(numeroControlePNCP, empresaCnpj);

      // Mostrar modal de aprovação
      setLicitacaoAprovada(licitacao);
      setAprovacaoModalOpen(true);
      setModalOpen(false);

      // Recarregar dados
      if (tipoVisualizacao === 'recomendacoes') {
        await carregarRecomendacoes();
      }

    } catch (error) {
      console.error('Erro ao aprovar licitação:', error);
    }
  };

  const handleRejectLicitacao = async (numeroControlePNCP: string) => {
    console.log('Licitação rejeitada:', numeroControlePNCP);
    if (tipoVisualizacao === 'recomendacoes') {
      await carregarRecomendacoes();
    }
  };

  const carregarRecomendacoes = async () => {
    setLoadingRecomendacoes(true);
    try {
      const userData = authUtils.getUserData();
      const cnpj = userData?.empresaId;
      
      
      if (!cnpj) {
        console.error('Nenhuma empresa selecionada');
        setLicitacoesRecomendadas([]);
        return;
      }

      console.log('Carregando recomendações para CNPJ:', cnpj);
      const recomendacoes = await licitacaoService.getRecommendations(cnpj);
      setLicitacoesRecomendadas(recomendacoes);
    } catch (error) {
      console.error('Erro ao carregar recomendações:', error);
      setLicitacoesRecomendadas([]);
    } finally {
      setLoadingRecomendacoes(false);
    }
  };

  useEffect(() => {
    carregarRecomendacoes();
  }, []);

  // Listener para mudança de empresa
  useEffect(() => {
    const handleStorageChange = () => {
      carregarRecomendacoes();
    };

    // Escutar mudanças no localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Escutar evento customizado para mudanças internas
    window.addEventListener('empresaChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('empresaChanged', handleStorageChange);
    };
  }, []);

  // Handlers do modal de aprovação
  const handleAnalisarAgora = (numeroControlePNCP: string) => {
    setAprovacaoModalOpen(false);
    const numeroEncoded = encodeURIComponent(numeroControlePNCP);
    router.push(`/minhas-licitacoes/analise/${numeroEncoded}`);
  };

  const handleContinuarAprovando = () => {
    setAprovacaoModalOpen(false);
    setLicitacaoAprovada(null);
  };

  return (
    <ProtectedRoute>
      <AuthLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#333333] mb-2">Licitações</h1>
          <p className="text-gray-600">Busque e encontre novas oportunidades</p>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} loading={loadingBusca} />

        {/* Filters */}
        <FilterPanel onApplyFilters={handleApplyFilters} loading={loadingBusca} />

        {/* Toggle e Licitações */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#333333]">
              {tipoVisualizacao === 'recomendacoes' ? 'Recomendações para sua empresa' : 'Resultados da Busca'}
            </h2>
            <ToggleRecomendacoesBusca 
              tipoAtivo={tipoVisualizacao} 
              onToggle={setTipoVisualizacao} 
            />
          </div>
          
          {/* Renderização condicional baseada no toggle */}
          {tipoVisualizacao === 'recomendacoes' ? (
            // Aba Recomendações
            loadingRecomendacoes ? (
              <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : licitacoesRecomendadas.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {licitacoesRecomendadas.map((licitacao) => (
                  <LicitacaoCard
                    key={licitacao.numeroControlePNCP}
                    licitacao={licitacao}
                    onClick={() => handleCardClick(licitacao)}
                    showMatchingScore={true}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg border p-6 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Nenhuma recomendação disponível
                </h3>
                <p className="text-gray-500">
                  As recomendações são atualizadas diariamente com base no perfil da sua empresa
                </p>
              </div>
            )
          ) : (
            // Aba Busca Manual
            loadingBusca ? (
              <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-5 bg-gray-200 rounded w-48"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : licitacoesBuscaManual.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                <div className="text-sm text-gray-600 mb-2">
                  {licitacoesBuscaManual.length} resultado{licitacoesBuscaManual.length !== 1 ? 's' : ''} encontrado{licitacoesBuscaManual.length !== 1 ? 's' : ''}
                </div>
                {licitacoesBuscaManual.map((licitacao) => (
                  <LicitacaoCard
                    key={licitacao.numeroControlePNCP}
                    licitacao={licitacao}
                    onClick={() => handleCardClick(licitacao)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border p-12 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Nenhuma licitação encontrada
                </h3>
                <p className="text-gray-500">
                  Use a barra de busca para encontrar licitações específicas
                </p>
              </div>
            )
          )}
        </div>

        {/* Modal de Detalhes */}
        {(() => {
          
          return selectedLicitacao && (
            <LicitacaoDetailModal
              licitacao={selectedLicitacao}
              isOpen={modalOpen}
              onClose={() => {
                console.log('Modal fechando...');
                setModalOpen(false);
              }}
              onApprove={handleApproveLicitacao}
              onReject={handleRejectLicitacao}
              showActions={true}
            />
          );
        })()}

        {/* Modal de Aprovação */}
        <AprovacaoModal
          licitacao={licitacaoAprovada}
          isOpen={aprovacaoModalOpen}
          onClose={() => setAprovacaoModalOpen(false)}
          onAnalisarAgora={handleAnalisarAgora}
          onContinuarAprovando={handleContinuarAprovando}
        />
      </div>
      </AuthLayout>
    </ProtectedRoute>
  );
}