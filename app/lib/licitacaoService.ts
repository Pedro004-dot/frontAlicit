import { apiClient } from './api';
import { Licitacao, SearchLicitacaoRequest, MatchingRequest } from '../types/licitacao';

export const licitacaoService = {
  async searchLicitacoes(params: SearchLicitacaoRequest & { cnpj: string }): Promise<Licitacao[]> {
    console.log('Enviando busca manual:', params);
    const findRequest = {
      cnpj: params.cnpj,
      palavraChave: params.palavraChave,
      valorMinimo: params.valorMinimo,
      valorMaximo: params.valorMaximo,
      tipoLicitacao: params.tipoLicitacao,
      dataInicio: params.dataInicio,
      dataFim: params.dataFim,
      fonte: params.fonte
    };
    return apiClient.post<Licitacao[]>('/licitacoes/find', findRequest);
  },

  async getRecommendations(cnpjEmpresa: string): Promise<Licitacao[]> {
    console.log('Buscando recomendações para empresa:', cnpjEmpresa);
    const encodedCnpj = encodeURIComponent(cnpjEmpresa);
    const response = await apiClient.get<any>(`/licitacoes/recomendacoes/${encodedCnpj}`);
    
    if (response.success && response.data) {
      // Mapear dados da estrutura do banco para formato do frontend
      return response.data.map((item: any) => {
        const licitacao = item.licitacoes;
        return {
          numeroControlePNCP: licitacao.numero_controle_pncp,
          objetoCompra: licitacao.objeto_compra,
          modalidadeNome: licitacao.modalidade_nome,
          valorTotalEstimado: licitacao.valor_total_estimado,
          dataAberturaPropostas: licitacao.data_abertura_proposta,
          dataEncerramentoProposta: licitacao.data_encerramento_proposta,
          ufSigla: licitacao.uf_sigla,
          municipioNome: licitacao.municipio_nome,
          situacaoCompraNome: licitacao.situacao_compra_nome,
          // Campos específicos das recomendações
          matchScore: Math.round((item.match_score || 0) * 100),
          statusAprovacao: item.status,
          // Campos aninhados
          orgaoEntidade: licitacao.orgao_entidade,
          unidadeOrgao: licitacao.unidade_orgao_completo,
          amparoLegal: licitacao.amparo_legal,
          itens: licitacao.licitacao_itens || [],
          // Campos extras
          processo: licitacao.processo,
          informacaoComplementar: licitacao.informacao_complementar,
          linkSistemaOrigem: licitacao.link_sistema_origem
        };
      });
    }
    
    return [];
  },

  async findLicitacao(numeroControlePNCP: string): Promise<Licitacao> {
    return apiClient.post<Licitacao>('/licitacoes/find', { numeroControlePNCP });
  },
  

  async atualizarStatusLicitacao(params: {
    numeroControlePNCP: string;
    empresaCnpj: string;
    status: string;
  }): Promise<void> {
    console.log('Atualizando status:', params);
    return apiClient.put('/licitacoes/empresa/status', params);
  },

  async processarDecisao(params: {
    numeroControlePNCP: string;
    empresaCnpj: string;
    aprovada: boolean;
    observacoes?: string;
  }): Promise<void> {

    console.log('Processando decisão:', params);
    return apiClient.post('/licitacoes/decisao', { ...params });
  },

  async approveLicitacao(numeroControlePNCP: string, empresaCnpj: string): Promise<void> {
    console.log('Aprovando licitação:', { numeroControlePNCP, empresaCnpj });
    return apiClient.post('/licitacoes/empresa', {
      numeroControlePNCP,
      cnpjEmpresa: empresaCnpj,
      status: 'em_analise'
    });
  }
};