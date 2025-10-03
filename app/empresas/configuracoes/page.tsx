'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authUtils, Empresa } from '../../lib/authUtils';
import Button from '../../components/ui/Button';
import ProtectedRoute from '@/app/components/auth/ProtectedRoute';
import AuthLayout from '@/app/components/layout/AuthLayout';
import { empresaService, ProdutoServico } from '@/app/lib/empresaService';
import { documentoService, Documento as DocumentoAPI } from '@/app/lib/documentoService';
import Modal from '@/app/components/ui/Modal';
import { useModal } from '@/app/hooks/useModal';
import TagInput from '@/app/components/ui/TagInput';

interface EmpresaData {
  cnpj: string;
  nome: string;
  razaoSocial: string;
  endereco: string;
  email: string;
  telefone: string;
  cep: string;
  cidade: string;
  cidadeRadar: string;
  raioDistancia: number;
  agencia: string;
  numeroConta: string;
  nomeTitular: string;
  descricao: string;
  dadosBancarios: DadosBancarios;
  documentos: DocumentoLocal[];
  produtos: string[];
  servicos: string[];
  produtosServicos: ProdutoServico[];
  porte: string;
  responsavelLegal: string;
}
interface DadosBancarios {
  agencia: string;
  numeroConta: string;
  nomeTitular: string;
}

interface DocumentoLocal {
  id?: string;
  nomeDocumento: string;
  dataExpiracao: string;
  arquivo?: File;
  isExisting?: boolean;
}

export default function ConfiguracoesEmpresa() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [empresaAtual, setEmpresaAtual] = useState<string>('');
  const [documentos, setDocumentos] = useState<DocumentoLocal[]>([]);
  const [documentosExistentes, setDocumentosExistentes] = useState<DocumentoAPI[]>([]);
  const [empresaId, setEmpresaId] = useState<string>('');
  const { isOpen, config, showAlert, showConfirm, closeModal, confirmModal } = useModal();
  
  const [empresaData, setEmpresaData] = useState<EmpresaData>({
    cnpj: '',
    nome: '',
    razaoSocial: '',
    endereco: '',
    email: '',
    telefone: '',
    cep: '',
    cidade: '',
    cidadeRadar: '',
    raioDistancia: 0,
    agencia: '',
    numeroConta: '',
    nomeTitular: '',
    descricao: '',
    dadosBancarios: {
      agencia: '',
      numeroConta: '',
      nomeTitular: ''
    },
    documentos: [],
    produtos: [],
    servicos: [],
    produtosServicos: [],
    porte: '',
    responsavelLegal: ''
  });
 

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        // ✅ Usar apenas CNPJ
        const empresaCNPJ = authUtils.getSelectedEmpresaCnpjSimples();
        
        if (!empresaCNPJ) {
          await showAlert('Erro', 'Nenhuma empresa selecionada', 'error');
          router.push('/home');
          return;
        }

        console.log('🔍 Carregando dados da empresa CNPJ:', empresaCNPJ);
        setEmpresaAtual(empresaCNPJ);
        
        // ✅ Buscar dados completos por CNPJ
        const data = await empresaService.getEmpresaCompletaByCnpj(empresaCNPJ);
        
        // ✅ Mapear dados da API para o formulário (considerando snake_case do banco)
        const dataWithSnakeCase = data as any; // Type assertion para acessar campos snake_case
        
        setEmpresaData({
          cnpj: data.cnpj || '',
          nome: data.nome || '',
          razaoSocial: dataWithSnakeCase.razao_social || data.razaoSocial || '',
          endereco: data.endereco || '',
          email: data.email || '',  
          telefone: data.telefone || '',
          cep: data.cep || dataWithSnakeCase.CEP || '',
          cidade: data.cidade || dataWithSnakeCase.cidades || '',
          cidadeRadar: dataWithSnakeCase.cidade_radar || data.cidadeRadar || '',
          raioDistancia: dataWithSnakeCase.raio_distancia || data.raioDistancia || 0,
          agencia: data.agencia || '',
          numeroConta: data.numeroConta || '',
          nomeTitular: data.nomeTitular || '',
          descricao: data.descricao || '',
          dadosBancarios: data.dadosBancarios || {
            agencia: '',
            numeroConta: '',
            nomeTitular: ''
          },
          documentos: dataWithSnakeCase.empresa_documentos || data.documentos || [],
          produtos: dataWithSnakeCase.empresa_produtos ? dataWithSnakeCase.empresa_produtos.map((p: any) => p.produto) : (data.produtos || []),
          servicos: dataWithSnakeCase.empresa_servicos ? dataWithSnakeCase.empresa_servicos.map((s: any) => s.servico) : (data.servicos || []),
          produtosServicos: dataWithSnakeCase.empresas_produtos || data.produtosServicos || [],
          porte: data.porte || '',
          responsavelLegal: dataWithSnakeCase.responsavel_legal || data.responsavelLegal || ''
        });

        // ✅ Definir empresa ID para operações futuras
        if (data.id) {
          setEmpresaId(data.id);
          // Documentos já carregados na resposta principal via empresa_documentos
          const docsExistentes = dataWithSnakeCase.empresa_documentos || [];
          setDocumentosExistentes(docsExistentes.map((doc: any) => ({
            id: doc.id,
            nome_documento: doc.nome_documento,
            data_vencimento: doc.data_vencimento,
            status_documento: doc.status_documento || 'ativo'
          })));
        }

      } catch (error) {
        console.error('❌ Erro ao carregar dados da empresa:', error);
        await showAlert('Erro', 'Erro ao carregar dados da empresa. Tente novamente.', 'error');
        router.push('/home');
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();

    // ✅ Escutar mudanças de empresa na sidebar
    const handleEmpresaChanged = () => {
      console.log('📡 Página recebeu evento: empresaChanged - recarregando dados');
      fetchData();
    };

    window.addEventListener('empresaChanged', handleEmpresaChanged);
    
    // Cleanup
    return () => {
      window.removeEventListener('empresaChanged', handleEmpresaChanged);
    };
  }, [router]);

  const carregarDocumentosExistentes = async (idEmpresa: string) => {
    try {
      const docs = await documentoService.getDocumentosByEmpresa(idEmpresa);
      setDocumentosExistentes(docs);
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
    }
  };

  const uploadDocumento = async (doc: DocumentoLocal) => {
    if (!doc.arquivo || !empresaId) return;
    
    try {
      await documentoService.uploadDocumento(
        empresaId,
        doc.nomeDocumento,
        doc.dataExpiracao,
        doc.arquivo
      );
      await carregarDocumentosExistentes(empresaId);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      throw error;
    }
  };

  const deletarDocumento = async (docId: string) => {
    try {
      await documentoService.deleteDocumento(docId);
      await carregarDocumentosExistentes(empresaId);
    } catch (error) {
      console.error('Erro ao deletar documento:', error);
      throw error;
    }
  };

  const adicionarDocumento = () => {
    const novoDoc: DocumentoLocal = {
      nomeDocumento: '',
      dataExpiracao: '',
      arquivo: undefined
    };
    setDocumentos(prev => [...prev, novoDoc]);
  };

  const removerDocumento = (index: number) => {
    setDocumentos(prev => prev.filter((_, i) => i !== index));
  };

  const atualizarDocumento = (index: number, campo: keyof DocumentoLocal, valor: any) => {
    setDocumentos(prev => prev.map((doc, i) => 
      i === index ? { ...doc, [campo]: valor } : doc
    ));
  };

  const adicionarProdutoServico = () => {
    const novo: ProdutoServico = {
      nome: '',
      descricao: '',
      valor: undefined,
      tipo: 'produto'
    };
    setEmpresaData(prev => ({
      ...prev,
      produtosServicos: [...prev.produtosServicos, novo]
    }));
  };

  const removerProdutoServico = (index: number) => {
    setEmpresaData(prev => ({
      ...prev,
      produtosServicos: prev.produtosServicos.filter((_, i) => i !== index)
    }));
  };

  const atualizarProdutoServico = (index: number, campo: keyof ProdutoServico, valor: any) => {
    setEmpresaData(prev => ({
      ...prev,
      produtosServicos: prev.produtosServicos.map((item, i) => 
        i === index ? { ...item, [campo]: valor } : item
      )
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // ✅ Fazer upload dos novos documentos PRIMEIRO
      for (const doc of documentos) {
        if (doc.arquivo && doc.nomeDocumento) {
          await uploadDocumento(doc);
        }
      }
      
      // ✅ Limpar documentos locais após upload
      setDocumentos([]);
      
      // ✅ Preparar dados para envio (formato snake_case para o backend)
      const dadosParaSalvar = {
        nome: empresaData.nome,
        razao_social: empresaData.razaoSocial,
        endereco: empresaData.endereco,
        email: empresaData.email,
        telefone: empresaData.telefone,
        cep: empresaData.cep,
        cidade: empresaData.cidade,
        cidade_radar: empresaData.cidadeRadar,
        raio_distancia: empresaData.raioDistancia,
        descricao: empresaData.descricao,
        produtosServicos: empresaData.produtosServicos
      };
      
      // ✅ Usar CNPJ da empresa selecionada
      const empresaCNPJ = authUtils.getSelectedEmpresaCnpjSimples();
      if (!empresaCNPJ) {
        throw new Error('Nenhuma empresa selecionada');
      }
      
      // ✅ Chamar endpoint PUT para salvar alterações por CNPJ
      await empresaService.updateEmpresaByCnpj(empresaCNPJ, dadosParaSalvar as unknown as Partial<Empresa>);
      
      console.log('✅ Dados salvos com sucesso!', dadosParaSalvar);
      await showAlert('Sucesso', 'Dados salvos com sucesso!', 'success');
      
      // ✅ Disparar evento para atualizar sidebar se nome mudou
      window.dispatchEvent(new CustomEvent('empresaListChanged'));
      
    } catch (error) {
      console.error('❌ Erro ao salvar:', error);
      await showAlert('Erro', `Erro ao salvar dados: ${error instanceof Error ? error.message : 'Tente novamente.'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  };

  const formatCEP = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 9);
  };

  const formatTelefone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  };

  if (loadingData || !empresaAtual) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5000] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados da empresa...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <AuthLayout>
           <div className="min-h-screen bg-gray-50 py-8 px-6">
            <div className="w-full">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#FF7000] to-[#FF5000] px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-white font-sans">
                        Configurações da Empresa
                      </h1>
                      <p className="text-orange-100 mt-2">
                        {empresaData.nome ? `${empresaData.nome} • CNPJ: ${formatCNPJ(empresaData.cnpj)}` : 'Carregando...'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-8">
                  
                  {/* Seção 1: Dados Básicos */}
                  <section>
                    <div className="flex items-center mb-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-[#FF5000] text-white rounded-full mr-3">
                        <span className="text-sm font-bold">1</span>
                      </div>
                      <h2 className="text-xl font-bold text-[#333333]">Dados Básicos</h2>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Nome da Empresa *
                          </label>
                          <input
                            type="text"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-[#FF5000] transition-all duration-200"
                            value={empresaData?.nome || ''}
                            onChange={(e) => setEmpresaData(prev => ({ ...prev, nome: e.target.value }))}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            CNPJ *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="00.000.000/0000-00"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-[#FF5000] transition-all duration-200 bg-gray-100"
                            value={formatCNPJ(empresaData?.cnpj || '')}
                            onChange={(e) => setEmpresaData(prev => ({ ...prev, cnpj: e.target.value.replace(/\D/g, '') }))}
                            disabled
                          />
                          <p className="text-xs text-gray-500 mt-1">CNPJ não pode ser alterado</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Razão Social *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-[#FF5000] transition-all duration-200"
                                                      value={empresaData?.razaoSocial || ''}
                            onChange={(e) => setEmpresaData(prev => ({ ...prev, razaoSocial: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Endereço Completo *
                        </label>
                        <textarea
                          required
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-[#FF5000] transition-all duration-200"
                                                      value={empresaData?.endereco || ''}
                            onChange={(e) => setEmpresaData(prev => ({ ...prev, endereco: e.target.value }))}
                        />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-[#FF5000] transition-all duration-200"
                            value={empresaData?.email || ''}
                            onChange={(e) => setEmpresaData(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Telefone *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="(11) 99999-9999"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-[#FF5000] transition-all duration-200"
                            value={empresaData?.telefone || ''}
                            onChange={(e) => setEmpresaData(prev => ({ ...prev, telefone: formatTelefone(e.target.value) }))}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            CEP *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="00000-000"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-[#FF5000] transition-all duration-200"
                            value={empresaData?.cep || ''}
                            onChange={(e) => setEmpresaData(prev => ({ ...prev, cep: formatCEP(e.target.value) }))}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Cidade *
                          </label>
                          <input
                            type="text"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-[#FF5000] transition-all duration-200"
                            value={empresaData?.cidade || ''}
                            onChange={(e) => setEmpresaData(prev => ({ ...prev, cidade: e.target.value }))}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Cidade Radar
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-[#FF5000] transition-all duration-200"
                            value={empresaData?.cidadeRadar || ''}
                            onChange={(e) => setEmpresaData(prev => ({ ...prev, cidadeRadar: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Raio de Distância (km)
                        </label>
                        <input
                          type="number"
                          min="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-[#FF5000] transition-all duration-200"
                          value={empresaData?.raioDistancia || 0}
                          onChange={(e) => setEmpresaData(prev => ({ ...prev, raioDistancia: Number(e.target.value) }))}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Descrição da Empresa *
                        </label>
                        <textarea
                          required
                          rows={4}
                          placeholder="Descreva os principais serviços e atividades da empresa"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-[#FF5000] transition-all duration-200"
                          value={empresaData?.descricao || ''}
                          onChange={(e) => setEmpresaData(prev => ({ ...prev, descricao: e.target.value }))}
                        />
                      </div>
                    </div>
                  </section>

                  {/* Seção 2: Documentos */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-[#FF5000] text-white rounded-full mr-3">
                          <span className="text-sm font-bold">2</span>
                        </div>
                        <h2 className="text-xl font-bold text-[#333333]">Documentos</h2>
                      </div>
                      <Button
                        type="button"
                        onClick={adicionarDocumento}
                        className="px-4 py-2"
                      >
                        + Adicionar Documento
                      </Button>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      {/* Documentos Existentes */}
                      {documentosExistentes.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-lg font-bold text-[#333333] mb-4">Documentos Salvos</h3>
                          <div className="space-y-3">
                            {documentosExistentes.map((doc) => (
                              <div key={doc.id} className="bg-white p-4 rounded-lg border flex justify-between items-center">
                                <div>
                                  <p className="font-semibold text-[#333333]">{doc.nome_documento}</p>
                                  <p className="text-sm text-gray-600">Vencimento: {new Date(doc.data_vencimento).toLocaleDateString('pt-BR')}</p>
                                  <p className="text-xs text-gray-500">Status: {doc.status_documento}</p>
                                </div>
                                <button
                                  onClick={async () => {
                                    const confirmed = await showConfirm(
                                      'Confirmar Exclusão',
                                      'Tem certeza que deseja deletar este documento?',
                                      'Deletar',
                                      'Cancelar'
                                    );
                                    
                                    if (confirmed) {
                                      try {
                                        await deletarDocumento(doc.id);
                                        await showAlert('Sucesso', 'Documento deletado com sucesso!', 'success');
                                      } catch (error) {
                                        await showAlert('Erro', 'Erro ao deletar documento', 'error');
                                      }
                                    }
                                  }}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Novos Documentos */}
                      {documentos.length === 0 && documentosExistentes.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p>Nenhum documento cadastrado ainda</p>
                          <p className="text-sm">Clique em "Adicionar Documento" para começar</p>
                        </div>
                      ) : documentos.length > 0 && (
                        <div>
                          <h3 className="text-lg font-bold text-[#333333] mb-4">Novos Documentos</h3>
                          <div className="space-y-4">
                            {documentos.map((documento, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg border">
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-[#333333]">Documento {index + 1}</h3>
                                <button
                                  type="button"
                                  onClick={() => removerDocumento(index)}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Nome do Documento *
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-[#FF5000] transition-all duration-200"
                                    value={documento.nomeDocumento}
                                    onChange={(e) => atualizarDocumento(index, 'nomeDocumento', e.target.value)}
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Data de Expiração *
                                  </label>
                                  <input
                                    type="date"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-[#FF5000] transition-all duration-200"
                                    value={documento.dataExpiracao}
                                    onChange={(e) => atualizarDocumento(index, 'dataExpiracao', e.target.value)}
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Arquivo
                                  </label>
                                  <input
                                    type="file"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-[#FF5000] transition-all duration-200"
                                    onChange={(e) => atualizarDocumento(index, 'arquivo', e.target.files?.[0])}
                                  />
                                </div>
                              </div>
                            </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Seção 3: Dados Bancários */}
                  <section>
                    <div className="flex items-center mb-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-[#FF5000] text-white rounded-full mr-3">
                        <span className="text-sm font-bold">3</span>
                      </div>
                      <h2 className="text-xl font-bold text-[#333333]">Dados Bancários</h2>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Agência *
                          </label>
                          <input
                            type="text"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-[#FF5000] transition-all duration-200"
                            value={empresaData?.agencia || ''}
                            onChange={(e) => setEmpresaData(prev => ({ ...prev, agencia: e.target.value }))}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Número da Conta *
                          </label>
                          <input
                            type="text"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-[#FF5000] transition-all duration-200"
                            value={empresaData?.numeroConta || ''}
                            onChange={(e) => setEmpresaData(prev => ({ ...prev, numeroConta: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Nome do Titular da Conta *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-[#FF5000] transition-all duration-200"
                                                      value={empresaData?.nomeTitular || ''}
                            onChange={(e) => setEmpresaData(prev => ({ ...prev, nomeTitular: e.target.value }))}
                        />
                      </div>
                    </div>
                  </section>

                  {/* Seção 4: Produtos e Serviços */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-[#FF5000] text-white rounded-full mr-3">
                          <span className="text-sm font-bold">4</span>
                        </div>
                        <h2 className="text-xl font-bold text-[#333333]">Produtos e Serviços</h2>
                      </div>
                      <Button
                        type="button"
                        onClick={adicionarProdutoServico}
                        className="px-4 py-2"
                      >
                        + Adicionar Produto/Serviço
                      </Button>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      {empresaData.produtosServicos.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <p>Nenhum produto ou serviço cadastrado ainda</p>
                          <p className="text-sm">Clique em "Adicionar Produto/Serviço" para começar</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {empresaData.produtosServicos.map((item, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="flex justify-between items-center mb-4">
                                  <h3 className="text-lg font-bold text-[#333333]">{item.nome}</h3>
                                  <button
                                    type="button"
                                    onClick={() => removerProdutoServico(index)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>

                                <div className="space-y-4 mb-4">
                                  <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                      Tipo *
                                    </label>
                                    <select
                                      required
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-[#FF5000] transition-all duration-200"
                                      value={item.tipo}
                                      onChange={(e) => atualizarProdutoServico(index, 'tipo', e.target.value as 'produto' | 'servico')}
                                    >
                                      <option value="produto">Produto</option>
                                      <option value="servico">Serviço</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                      Nome *
                                    </label>
                                    <input
                                      type="text"
                                      required
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-[#FF5000] transition-all duration-200"
                                      value={item.nome}
                                      onChange={(e) => atualizarProdutoServico(index, 'nome', e.target.value)}
                                      placeholder="Nome do produto/serviço"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                      Descrição
                                    </label>
                                    <textarea
                                      rows={3}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-[#FF5000] transition-all duration-200"
                                      value={item.descricao || ''}
                                      onChange={(e) => atualizarProdutoServico(index, 'descricao', e.target.value)}
                                      placeholder="Descrição detalhada (opcional)"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                      Valor (R$)
                                    </label>
                                    <input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-[#FF5000] transition-all duration-200"
                                      value={item.valor || ''}
                                      onChange={(e) => atualizarProdutoServico(index, 'valor', e.target.value ? parseFloat(e.target.value) : undefined)}
                                      placeholder="Valor unitário (opcional)"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </section>


                  {/* Botão de Salvar no Final */}
                  <div className="flex justify-center mt-6 pt-6 border-t border-gray-200">
                    <Button
                      onClick={handleSave}
                      disabled={loading}
                      className="bg-[#FF5000] text-white px-8 py-4 text-lg font-bold hover:bg-[#E04000] min-w-[200px]"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Salvando...</span>
                          
                        </div>
                      ) : (
                        'Salvar Todas as Alterações'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </AuthLayout> 
      
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={config.type === 'confirm' ? confirmModal : undefined}
        title={config.title}
        message={config.message}
        type={config.type}
        confirmText={config.confirmText}
        cancelText={config.cancelText}
      />
    </ProtectedRoute>

  );
}