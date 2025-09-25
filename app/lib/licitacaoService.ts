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
      valorMinimoUnitario: params.valorMinimoUnitario,
      valorMaximoUnitario: params.valorMaximoUnitario,
      cidade_radar: params.cidade_radar,
      raioDistancia: params.raioDistancia
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
        
        // 🐛 DEBUG: Log temporário para verificar dados
        console.log('🔍 DEBUG - Dados da licitação do backend:', {
          numero_controle_pncp: licitacao.numero_controle_pncp,
          ano_compra: licitacao.ano_compra,
          data_inclusao: licitacao.data_inclusao,
          data_publicacao_pncp: licitacao.data_publicacao_pncp,
          data_atualizacao: licitacao.data_atualizacao,
          data_atualizacao_global: licitacao.data_atualizacao_global
        });
        return {
          numeroControlePNCP: licitacao.numero_controle_pncp,
          objetoCompra: licitacao.objeto_compra,
          modalidadeNome: licitacao.modalidade_nome,
          valorTotalEstimado: licitacao.valor_total_estimado,
          dataAberturaProposta: licitacao.data_abertura_proposta,
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
          linkSistemaOrigem: licitacao.link_sistema_origem,
          // ✅ NOVOS CAMPOS ADICIONADOS
          anoCompra: licitacao.ano_compra,
          sequencialCompra: licitacao.sequencial_compra,
          numeroCompra: licitacao.numero_compra,
          dataAtualizacaoGlobal: licitacao.data_atualizacao_global,
          dataInclusao: licitacao.data_inclusao,
          dataPublicacaoPncp: licitacao.data_publicacao_pncp,
          dataAtualizacao: licitacao.data_atualizacao,
          modalidadeId: licitacao.modalidade_id,
          modoDisputaId: licitacao.modo_disputa_id,
          modoDisputaNome: licitacao.modo_disputa_nome,
          tipoInstrumentoConvocatorioCodigo: licitacao.tipo_instrumento_convocatorio_codigo,
          tipoInstrumentoConvocatorioNome: licitacao.tipo_instrumento_convocatorio_nome,
          srp: licitacao.srp,
          ufNome: licitacao.uf_nome,
          codigoIbge: licitacao.codigo_ibge,
          codigoUnidade: licitacao.codigo_unidade,
          nomeUnidade: licitacao.nome_unidade,
          valorTotalHomologado: licitacao.valor_total_homologado,
          situacaoCompraId: licitacao.situacao_compra_id,
          unidadeSubRogada: licitacao.unidade_sub_rogada,
          orgaoSubRogado: licitacao.orgao_sub_rogado,
          fontesOrcamentarias: licitacao.fontes_orcamentarias,
          usuarioNome: licitacao.usuario_nome,
          linkProcessoEletronico: licitacao.link_processo_eletronico,
          justificativaPresencial: licitacao.justificativa_presencial
        };
      });
    }
    
    return [];
  },

  async getUniqueLicitacao(numeroControlePNCP: string): Promise<Licitacao> {
    return apiClient.get<Licitacao>(`/licitacoes/getUniqueLicitacao?numero=${numeroControlePNCP}`);
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
      status: 'nao_analisado'
    });
  }

};