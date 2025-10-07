'use client';

import { useState } from 'react';
import { Licitacao } from '../../types/licitacao';
import { licitacaoService } from '../../lib/licitacaoService';
import { authUtils } from '../../lib/authUtils';
import Button from '../ui/Button';

interface LicitacaoDetailModalProps {
  licitacao: Licitacao;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (numeroControlePNCP: string) => void;
  onReject?: (numeroControlePNCP: string) => void;
  showActions?: boolean;
}

export default function LicitacaoDetailModal({ 
  licitacao, 
  isOpen, 
  onClose, 
  onApprove,
  onReject,
  showActions = true
}: LicitacaoDetailModalProps) {
  console.log('LicitacaoDetailModal renderizando:', { isOpen, licitacao: licitacao?.numeroControlePNCP });
  
  const [activeTab, setActiveTab] = useState('geral');
  const [actionLoading, setActionLoading] = useState<'approve' | 'reject' | null>(null);

  if (!isOpen) {
    console.log('Modal não aberto, retornando null');
    return null;
  }
  
  if (!licitacao) {
    console.log('Licitação não fornecida, retornando null');
    return null;
  }
  
  // Validação básica dos dados necessários
  if (!licitacao.numeroControlePNCP) {
    console.error('Modal: dados de licitação inválidos', licitacao);
    return null;
  }
  
  console.log('Modal vai renderizar normalmente');
  console.log('Dados completos da licitação:', licitacao);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Não informado';
    try {
      return new Date(dateString).toLocaleString('pt-BR');
    } catch (error) {
      return 'Data inválida';
    }
  };

  const handleAprovar = async () => {
    setActionLoading('approve');
    try {
      const userData = authUtils.getUserData();
      if (!userData?.empresaId) {
        console.error('Nenhuma empresa selecionada');
        return;
      }

      console.log(`Licitação ${licitacao.numeroControlePNCP} , empresa ${userData.empresaId} , status em_analise`);
      await licitacaoService.atualizarStatusLicitacao({
        numeroControlePNCP: licitacao.numeroControlePNCP,
        empresaCnpj: userData.empresaId,
        status: 'em_analise'
      });
      
      onApprove?.(licitacao.numeroControlePNCP);
      onClose();
    } catch (error) {
      console.error('Erro ao aprovar licitação:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejeitar = async () => {
    setActionLoading('reject');
    try {
      const userData = authUtils.getUserData();
      if (!userData?.empresaId) {
        console.error('Nenhuma empresa selecionada');
        return;
      }

      await licitacaoService.atualizarStatusLicitacao({
        numeroControlePNCP: licitacao.numeroControlePNCP,
        empresaCnpj: userData.empresaId,
        status: 'recusada'
      });

      onReject?.(licitacao.numeroControlePNCP);
      onClose();
    } catch (error) {
      console.error('Erro ao rejeitar licitação:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const tabs = [
    { id: 'geral', name: 'Informações Gerais', icon: '📋' },
    { id: 'orgao', name: 'Órgão & Local', icon: '🏢' },
    { id: 'cronograma', name: 'Cronograma', icon: '📅' },
    { id: 'financeiro', name: 'Financeiro', icon: '💰' },
    { id: 'itens', name: 'Itens', icon: '📦' },
    { id: 'documentos', name: 'Documentação', icon: '📄' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0  bg-opacity-40 transition-opacity"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden bg-white shadow-xl rounded-xl z-10">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FF7000] to-[#FF5000] px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h2 className="text-2xl font-bold mb-1">
                  Licitação {licitacao.numeroControlePNCP}
                </h2>
                <p className="text-orange-100 text-sm">
                  {licitacao.modalidadeNome} • {licitacao.unidadeOrgao?.municipioNome || 'N/A'} - {licitacao.unidadeOrgao?.ufSigla || 'N/A'}
                </p>
                {licitacao.matchScore && (
                  <div className="flex items-center mt-2">
                    <span className="text-orange-100 text-sm mr-2">Compatibilidade:</span>
                    <span className="bg-white text-[#FF5000] px-2 py-1 rounded-full text-sm font-bold">
                      {licitacao.matchScore}%
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-[#FF5000] text-[#FF5000]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                  {tab.id === 'itens' && licitacao.itens?.length && (
                    <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {licitacao.itens.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {/* Tab: Informações Gerais */}
            {activeTab === 'geral' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-[#333333] mb-4">Identificação</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Número de Controle:</span>
                        <span className="text-[#333333]">{licitacao.numeroControlePNCP}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Ano da Compra:</span>
                        <span className="text-[#333333]">{licitacao.anoCompra || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Sequencial:</span>
                        <span className="text-[#333333]">{licitacao.sequencialCompra || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Número da Compra:</span>
                        <span className="text-[#333333]">{licitacao.numeroCompra || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-[#333333] mb-4">Modalidade & Situação</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Modalidade:</span>
                        <span className="text-[#333333]">{licitacao.modalidadeNome || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Modo de Disputa:</span>
                        <span className="text-[#333333]">{licitacao.modoDisputaNome || 'Não informado'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Situação:</span>
                        <span className="text-[#333333]">{licitacao.situacaoCompraNome || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">SRP:</span>
                        <span className="text-[#333333]">{licitacao.srp ? 'Sim' : 'Não'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#333333] mb-4">Objeto da Compra</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">{licitacao.objetoCompra}</p>
                  </div>
                </div>

                {licitacao.informacaoComplementar && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#333333] mb-4">Informações Complementares</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 leading-relaxed">{licitacao.informacaoComplementar}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Órgão & Local */}
            {activeTab === 'orgao' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-[#333333] mb-4">Órgão Responsável</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-600">Razão Social:</span>
                        <p className="text-[#333333] mt-1">{licitacao.orgaoEntidade?.razaoSocial}</p>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">CNPJ:</span>
                        <span className="text-[#333333]">{licitacao.orgaoEntidade?.cnpj}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Esfera:</span>
                        <span className="text-[#333333]">{licitacao.orgaoEntidade?.esferaId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-[#333333] mb-4">Unidade do Órgão</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-600">Nome da Unidade:</span>
                        <p className="text-[#333333] mt-1">{licitacao.unidadeOrgao?.nomeUnidade}</p>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Código:</span>
                        <span className="text-[#333333]">{licitacao.unidadeOrgao?.codigoUnidade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Município:</span>
                        <span className="text-[#333333]">{licitacao.unidadeOrgao?.municipioNome}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">UF:</span>
                        <span className="text-[#333333]">{licitacao.unidadeOrgao?.ufSigla} - {licitacao.unidadeOrgao?.ufNome}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Código IBGE:</span>
                        <span className="text-[#333333]">{licitacao.unidadeOrgao?.codigoIbge}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Cronograma */}
            {activeTab === 'cronograma' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-[#333333] mb-4">Datas da Licitação</h3>
                    <div className="space-y-3">
                      {/* <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Data de Inclusão:</span>
                        <span className="text-[#333333]">{formatDateTime(licitacao.dataInclusao)}</span>
                      </div> */}
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Data de Publicação PNCP:</span>
                        <span className="text-[#333333]">{formatDateTime(licitacao.dataPublicacaoPncp)}</span>
                      </div>
                      {/* <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Última Atualização:</span>
                        <span className="text-[#333333]">{formatDateTime(licitacao.dataAtualizacao)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Atualização Global:</span>
                        <span className="text-[#333333]">{formatDateTime(licitacao.dataAtualizacaoGlobal)}</span>
                      </div> */}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-[#333333] mb-4">Cronograma de Propostas</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Abertura das Propostas:</span>
                        <span className="text-[#333333] font-semibold">{formatDateTime(licitacao.dataAberturaProposta)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Encerramento das Propostas:</span>
                        <span className="text-[#333333] font-semibold">{formatDateTime(licitacao.dataEncerramentoProposta)}</span>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-orange-700">
                          {new Date(licitacao.dataEncerramentoProposta) > new Date() 
                            ? 'Licitação ainda aberta para propostas' 
                            : 'Prazo para propostas encerrado'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Financeiro */}
            {activeTab === 'financeiro' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-[#333333] mb-4">Valores</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Valor Total Estimado:</span>
                        <span className="text-[#333333] font-bold text-lg">{formatCurrency(licitacao.valorTotalEstimado)}</span>
                      </div>
                      {licitacao.valorTotalHomologado && (
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">Valor Total Homologado:</span>
                          <span className="text-green-600 font-bold text-lg">{formatCurrency(licitacao.valorTotalHomologado)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {licitacao.fontesOrcamentarias && licitacao.fontesOrcamentarias.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-[#333333] mb-4">Fontes Orçamentárias</h3>
                      <div className="space-y-2">
                        {licitacao.fontesOrcamentarias.map((fonte, index) => (
                          <div key={index} className="text-sm text-gray-700">
                            • {fonte.descricao || 'Fonte não especificada'}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Itens */}
            {activeTab === 'itens' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-[#333333]">
                    Itens da Licitação ({licitacao.itens?.length || 0})
                  </h3>
                </div>

                {licitacao.itens && licitacao.itens.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {licitacao.itens.map((item, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="inline-block bg-[#FF5000] text-white px-2 py-1 rounded text-sm font-semibold">
                              Item {item.numeroItem}
                            </span>
                            <span className="ml-2 text-sm text-gray-600">
                              {item.materialOuServicoNome}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-[#333333]">{formatCurrency(item.valorTotal)}</div>
                            <div className="text-sm text-gray-600">Valor Total</div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <h4 className="font-medium text-gray-700 mb-1">Descrição:</h4>
                          <p className="text-gray-600 text-sm leading-relaxed">{item.descricao}</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">Quantidade:</span>
                            <p className="text-[#333333]">{item.quantidade}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Unidade:</span>
                            <p className="text-[#333333]">{item.unidadeMedida}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Valor Unitário:</span>
                            <p className="text-[#333333] font-semibold">{formatCurrency(item.valorUnitarioEstimado)}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Categoria:</span>
                            <p className="text-[#333333]">{item.itemCategoriaNome}</p>
                          </div>
                        </div>

                        {(item.ncmNbsCodigo || item.informacaoComplementar) && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              {item.ncmNbsCodigo && (
                                <div>
                                  <span className="font-medium text-gray-600">NCM/NBS:</span>
                                  <p className="text-[#333333]">{item.ncmNbsCodigo} - {item.ncmNbsDescricao}</p>
                                </div>
                              )}
                              {item.informacaoComplementar && (
                                <div>
                                  <span className="font-medium text-gray-600">Info. Complementar:</span>
                                  <p className="text-[#333333]">{item.informacaoComplementar}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p>Nenhum item encontrado para esta licitação</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Documentação */}
            {activeTab === 'documentos' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-[#333333] mb-4">Documentos e Processos</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-600">Processo:</span>
                        <p className="text-[#333333] mt-1">{licitacao.processo}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Tipo de Instrumento:</span>
                        <p className="text-[#333333] mt-1">{licitacao.tipoInstrumentoConvocatorioNome}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Usuário Responsável:</span>
                        <p className="text-[#333333] mt-1">{licitacao.usuarioNome}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-[#333333] mb-4">Links Externos</h3>
                    <div className="space-y-3">
                      {licitacao.linkSistemaOrigem && (
                        <div>
                          <span className="font-medium text-gray-600">Sistema de Origem:</span>
                          <a 
                            href={licitacao.linkSistemaOrigem} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block text-[#FF5000] hover:underline mt-1"
                          >
                            Acessar Sistema Original ↗
                          </a>
                        </div>
                      )}
                      {licitacao.linkProcessoEletronico && (
                        <div>
                          <span className="font-medium text-gray-600">Processo Eletrônico:</span>
                          <a 
                            href={licitacao.linkProcessoEletronico} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block text-[#FF5000] hover:underline mt-1"
                          >
                            Acessar Processo ↗
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {licitacao.amparoLegal && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-[#333333] mb-4">Amparo Legal</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Nome:</span>
                        <span className="text-[#333333]">{licitacao.amparoLegal.nome}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Código:</span>
                        <span className="text-[#333333]">{licitacao.amparoLegal.codigo}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Descrição:</span>
                        <p className="text-[#333333] mt-1">{licitacao.amparoLegal.descricao}</p>
                      </div>
                    </div>
                  </div>
                )}

                {licitacao.justificativaPresencial && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-[#333333] mb-4">Justificativa Presencial</h3>
                    <p className="text-gray-700 leading-relaxed">{licitacao.justificativaPresencial}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          {showActions && (
            <div className="border-t bg-gray-50 px-6 py-4">
              <div className="flex justify-end space-x-4">
                <Button
                  onClick={handleRejeitar}
                  disabled={actionLoading !== null}
                  variant="secondary"
                  className="px-6 py-2 min-w-[120px]"
                >
                  {actionLoading === 'reject' ? (
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Rejeitando...</span>
                    </div>
                  ) : (
                    'REJEITAR'
                  )}
                </Button>
                
                <Button
                  onClick={handleAprovar}
                  disabled={actionLoading !== null}
                  className="px-6 py-2 min-w-[120px]"
                >
                  {actionLoading === 'approve' ? (
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Aprovando...</span>
                    </div>
                  ) : (
                    'APROVAR'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}