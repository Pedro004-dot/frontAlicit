'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../components/ui/Button';
import ProtectedRoute from '@/app/components/auth/ProtectedRoute';
import AuthLayout from '@/app/components/layout/AuthLayout';
import { CreateEmpresaInput, empresaService } from '@/app/lib/empresaService';
import TagInput from '@/app/components/ui/TagInput';

interface DadosBasicos {
  nome: string;
  cnpj: string;
  razaoSocial: string;
  endereco: string;
  email: string;
  telefone: string;
  cep: string;
  cidade: string; // ✅ Adicionar campo cidade
  cidadeRadar: string;
  raioDistancia: number;
}

interface Documento {
  nomeDocumento: string;
  dataExpiracao: string;
  arquivo?: File;
}

interface DadosBancarios {
  agencia: string;
  numeroConta: string;
  nomeTitular: string;
}

interface DadosBusca {
  palavrasChave: string;
  descricao: string;
  produtoServico: string;
}

interface FormData {
  dadosBasicos: DadosBasicos;
  documentos: Documento[];
  dadosBancarios: DadosBancarios;
  dadosBusca: DadosBusca;
}

export default function CriarEmpresa() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    dadosBasicos: {
      nome: '',
      cnpj: '',
      razaoSocial: '',
      endereco: '',
      email: '',
      telefone: '',
      cep: '',
      cidade: '',
      cidadeRadar: '',
      raioDistancia: 0
    },
    documentos: [],
    dadosBancarios: {
      agencia: '',
      numeroConta: '',
      nomeTitular: ''
    },
    dadosBusca: {
      palavrasChave: '',
      descricao: '',
      produtoServico: ''
    }
  });

  const adicionarDocumento = () => {
    const novoDoc: Documento = {
      nomeDocumento: '',
      dataExpiracao: '',
      arquivo: undefined
    };
    setFormData(prev => ({
      ...prev,
      documentos: [...prev.documentos, novoDoc]
    }));
  };

  const removerDocumento = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documentos: prev.documentos.filter((_, i) => i !== index)
    }));
  };

  const atualizarDocumento = (index: number, campo: keyof Documento, valor: any) => {
    setFormData(prev => ({
      ...prev,
      documentos: prev.documentos.map((doc, i) => 
        i === index ? { ...doc, [campo]: valor } : doc
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Dados da empresa:', formData);
      
      // ✅ Mapear dados para a interface do backend
      const empresaData: CreateEmpresaInput = {
        nome: formData.dadosBasicos.nome,
        cnpj: formData.dadosBasicos.cnpj.replace(/\D/g, ''), // Remover formatação
        razaoSocial: formData.dadosBasicos.razaoSocial,
        endereco: formData.dadosBasicos.endereco,
        email: formData.dadosBasicos.email,
        telefone: formData.dadosBasicos.telefone.replace(/\D/g, ''), // Remover formatação
        CEP: formData.dadosBasicos.cep.replace(/\D/g, ''), // ✅ Usar CEP como no backend
        cidades: formData.dadosBasicos.cidade, // ✅ Usar cidade básica para cidades
        cidadeRadar: formData.dadosBasicos.cidadeRadar,
        raioDistancia: formData.dadosBasicos.raioDistancia,
        dadosBancarios: {
          agencia: formData.dadosBancarios.agencia,
          numeroConta: formData.dadosBancarios.numeroConta,
          nomeTitular: formData.dadosBancarios.nomeTitular
        },
        palavrasChave: formData.dadosBusca.palavrasChave,
        descricao: formData.dadosBusca.descricao,
        produtoServico: formData.dadosBusca.produtoServico,
        documentos: formData.documentos.filter(doc => doc.arquivo).map(doc => ({
          nomeDocumento: doc.nomeDocumento,
          dataExpiracao: doc.dataExpiracao,
          arquivo: doc.arquivo!
        })), // ✅ Filtrar e mapear documentos com arquivo
        produtos: [],
        servicos: [],
        porte: []
      };

      await empresaService.createEmpresa(empresaData);
      
      alert('Empresa criada com sucesso!');
      router.push('/home');
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      alert('Erro ao criar empresa. Tente novamente.');
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

  return (
    <ProtectedRoute>
    <AuthLayout>
          <div className="min-h-screen bg-gray-50 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#FF7000] to-[#FF5000] px-8 py-6">
                <h1 className="text-3xl font-bold text-white font-sans">
                  Cadastrar Nova Empresa
                </h1>
                <p className="text-orange-100 mt-2">
                  Preencha todos os dados necessários para cadastrar sua empresa
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-12">
                
                {/* Seção 1: Dados Básicos */}
                <section>
                  <div className="flex items-center mb-6">
                    <div className="flex items-center justify-center w-10 h-10 bg-[#FF5000] text-white rounded-full mr-4">
                      <span className="text-lg font-bold">1</span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#333333]">Dados Básicos</h2>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Nome da Empresa *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-[#FF5000] transition-all duration-200"
                          value={formData.dadosBasicos.nome}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            dadosBasicos: { ...prev.dadosBasicos, nome: e.target.value }
                          }))}
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-[#FF5000] transition-all duration-200"
                          value={formData.dadosBasicos.cnpj}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            dadosBasicos: { ...prev.dadosBasicos, cnpj: formatCNPJ(e.target.value) }
                          }))}
                        />
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
                        value={formData.dadosBasicos.razaoSocial}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          dadosBasicos: { ...prev.dadosBasicos, razaoSocial: e.target.value }
                        }))}
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
                        value={formData.dadosBasicos.endereco}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          dadosBasicos: { ...prev.dadosBasicos, endereco: e.target.value }
                        }))}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-[#FF5000] transition-all duration-200"
                          value={formData.dadosBasicos.email}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            dadosBasicos: { ...prev.dadosBasicos, email: e.target.value }
                          }))}
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
                          value={formData.dadosBasicos.telefone}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            dadosBasicos: { ...prev.dadosBasicos, telefone: formatTelefone(e.target.value) }
                          }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          CEP *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="00000-000"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-[#FF5000] transition-all duration-200"
                          value={formData.dadosBasicos.cep}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            dadosBasicos: { ...prev.dadosBasicos, cep: formatCEP(e.target.value) }
                          }))}
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
                          value={formData.dadosBasicos.cidade}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            dadosBasicos: { ...prev.dadosBasicos, cidade: e.target.value }
                          }))}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Cidade Radar
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-[#FF5000] transition-all duration-200"
                          value={formData.dadosBasicos.cidadeRadar}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            dadosBasicos: { ...prev.dadosBasicos, cidadeRadar: e.target.value }
                          }))}
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
                        value={formData.dadosBasicos.raioDistancia}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          dadosBasicos: { ...prev.dadosBasicos, raioDistancia: Number(e.target.value) }
                        }))}
                      />
                    </div>
                  </div>
                </section>

                {/* Seção 2: Documentos */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-10 h-10 bg-[#FF5000] text-white rounded-full mr-4">
                        <span className="text-lg font-bold">2</span>
                      </div>
                      <h2 className="text-2xl font-bold text-[#333333]">Documentos</h2>
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
                    {formData.documentos.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p>Nenhum documento adicionado ainda</p>
                        <p className="text-sm">Clique em "Adicionar Documento" para começar</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {formData.documentos.map((documento, index) => (
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

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    )}
                  </div>
                </section>

                {/* Seção 3: Dados Bancários */}
                <section>
                  <div className="flex items-center mb-6">
                    <div className="flex items-center justify-center w-10 h-10 bg-[#FF5000] text-white rounded-full mr-4">
                      <span className="text-lg font-bold">3</span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#333333]">Dados Bancários</h2>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Agência *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-[#FF5000] transition-all duration-200"
                          value={formData.dadosBancarios.agencia}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            dadosBancarios: { ...prev.dadosBancarios, agencia: e.target.value }
                          }))}
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
                          value={formData.dadosBancarios.numeroConta}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            dadosBancarios: { ...prev.dadosBancarios, numeroConta: e.target.value }
                          }))}
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
                        value={formData.dadosBancarios.nomeTitular}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          dadosBancarios: { ...prev.dadosBancarios, nomeTitular: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                </section>

                {/* Seção 4: Dados de Busca */}
                <section>
                  <div className="flex items-center mb-6">
                    <div className="flex items-center justify-center w-10 h-10 bg-[#FF5000] text-white rounded-full mr-4">
                      <span className="text-lg font-bold">4</span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#333333]">Dados de Busca</h2>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                    <TagInput
                      label="Palavras-chave"
                      required
                      placeholder="Ex: construção, tecnologia, consultorias"
                      value={formData.dadosBusca.palavrasChave}
                      onChange={(value) => setFormData(prev => ({
                        ...prev,
                        dadosBusca: { ...prev.dadosBusca, palavrasChave: value }
                      }))}
                    />

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Descrição da Empresa *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Descreva os principais serviços e atividades da empresa"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5000] focus:border-[#FF5000] transition-all duration-200"
                        value={formData.dadosBusca.descricao}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          dadosBusca: { ...prev.dadosBusca, descricao: e.target.value }
                        }))}
                      />
                    </div>

                    <TagInput
                      label="Produto/Serviço Principal"
                      required
                      placeholder="Ex: Desenvolvimento de software, Construção civil"
                      value={formData.dadosBusca.produtoServico}
                      onChange={(value) => setFormData(prev => ({
                        ...prev,
                        dadosBusca: { ...prev.dadosBusca, produtoServico: value }
                      }))}
                    />
                  </div>
                </section>

                {/* Botões de Ação */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.push('/home')}
                  >
                    Cancelar
                  </Button>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="px-8"
                  >
                    {loading ? 'Criando...' : 'Criar Empresa'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
    </AuthLayout>
   
    </ProtectedRoute>
  );
}