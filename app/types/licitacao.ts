export interface Licitacao {
  numeroControlePNCP: string;
  dataAtualizacaoGlobal: string;
  modalidadeId: number;
  srp: boolean;
  orgaoEntidade: {
    cnpj: string;
    razaoSocial: string;
    poderId: string;
    esferaId: string;
  };
  anoCompra: number;
  sequencialCompra: number;
  dataInclusao: string;
  dataPublicacaoPncp: string;
  dataAtualizacao: string;
  numeroCompra: string;
  unidadeOrgao: {
    ufNome: string;
    codigoIbge: string;
    codigoUnidade: string;
    nomeUnidade: string;
    ufSigla: string;
    municipioNome: string;
  };
  amparoLegal: {
    descricao: string;
    nome: string;
    codigo: number;
  };
  dataAberturaProposta: string;
  dataEncerramentoProposta: string;
  informacaoComplementar: string;
  processo: string;
  objetoCompra: string;
  linkSistemaOrigem: string;
  justificativaPresencial: string | null;
  unidadeSubRogada: any;
  orgaoSubRogado: any;
  valorTotalHomologado: number | null;
  modoDisputaId: number;
  linkProcessoEletronico: string | null;
  valorTotalEstimado: number;
  modalidadeNome: string;
  modoDisputaNome: string;
  tipoInstrumentoConvocatorioCodigo: number;
  tipoInstrumentoConvocatorioNome: string;
  fontesOrcamentarias: any[];
  situacaoCompraId: number;
  situacaoCompraNome: string;
  usuarioNome: string;
  itens: LicitacaoItem[];
  // Campos adicionais para frontend
  matchScore?: number;
  status?: 'nova' | 'em_analise' | 'aprovada' | 'rejeitada';
}

export interface LicitacaoItem {
  numeroItem: number;
  descricao: string;
  materialOuServico: string;
  materialOuServicoNome: string;
  valorUnitarioEstimado: number;
  valorTotal: number;
  quantidade: number;
  unidadeMedida: string;
  orcamentoSigiloso: boolean;
  itemCategoriaId: number;
  itemCategoriaNome: string;
  criterioJulgamentoId: number;
  criterioJulgamentoNome: string;
  situacaoCompraItem: number;
  situacaoCompraItemNome: string;
  tipoBeneficio: number;
  tipoBeneficioNome: string;
  incentivoProdutivoBasico: boolean;
  dataInclusao: string;
  dataAtualizacao: string;
  temResultado: boolean;
  imagem: number;
  aplicabilidadeMargemPreferenciaNormal: boolean;
  aplicabilidadeMargemPreferenciaAdicional: boolean;
  ncmNbsCodigo: any;
  ncmNbsDescricao: any;
  informacaoComplementar: any;
  exigenciaConteudoNacional: boolean;
}

export interface MatchResult {
  licitacao: Licitacao;
  matchScore: number;
  matchDetails: {
    regexScore: number;
    levenshteinScore: number;
    tfidfScore: number;
    taxonomiaScore: number;
  };
  semanticScore?: number;
}

export interface SearchLicitacaoRequest {
  palavraChave: string;
  tipoLicitacao?: string;
  dataInicio?: string;
  dataFim?: string;
  valorMinimo?: number;
  valorMaximo?: number;
  fonte?: string;
}

export interface MatchingRequest {
  cnpj: string;
  termosInteresse: string[];
  codigosNCM?: string[];
  regiaoAtuacao?: string[];
  valorMinimo?: number;
  valorMaximo?: number;
  valorMinimoUnitario?: number;
  valorMaximoUnitario?: number;
  modalidadesPreferidas?: string[];
  cidadeRadar?: string;
  raioRadar?: number;
}

// Tipos para Minhas Licitações
export type StatusLicitacao = 'nao_definido' | 'nao_analisado' | 'em_analise' | 'analisado' | 'proposta' | 'enviada' | 'vencida' | 'recusada' | 'perdida';

export interface LicitacaoEmpresa {
  id: number;
  cnpjEmpresa: string;
  numeroControlePNCP: string;
  status: StatusLicitacao;
  dataAtualizacao: string;
  licitacao?: Licitacao;
}

export interface DocumentoPreview {
  id: string;
  nome: string;
  nomeOriginal?: string;
  tipo?: string;
  tamanho?: number;
  preview?: string;
  totalPaginas?: number;
  caminhoArquivo?: string;
  tipoDocumento?: string;
}

export interface RelatorioTecnico {
  id: string;
  empresaCnpj: string;
  numeroControlePNCP: string;
  recomendacao: string;
  pontosCriticos: string[];
  viabilidade: {
    valor: number;
    margem: number;
    score: number;
  };
  riscos: string[];
  created_at: string;
  conteudoCompleto: string;

  // Novos dados estruturados
  dadosFrontend?: DadosRelatorioFrontend;
}

export interface DadosRelatorioFrontend {
  recomendacao: {
    nivel: 'ALTA' | 'MEDIA' | 'BAIXA';
    descricao: string;
    score: number;
  };
  viabilidade: {
    valor: number;
    margem: number;
    score: number;
    justificativa: string;
  };
  pontosCriticos: Array<{
    titulo: string;
    descricao: string;
    impacto: 'alto' | 'medio' | 'baixo';
    categoria: 'tecnico' | 'legal' | 'financeiro';
  }>;
  riscos: Array<{
    titulo: string;
    descricao: string;
    probabilidade: 'alta' | 'media' | 'baixa';
    impacto: 'alto' | 'medio' | 'baixo';
    mitigacao?: string;
  }>;
  requisitos: {
    atendidos: string[];
    nao_atendidos: string[];
    documentos_necessarios: string[];
    certificacoes_exigidas: string[];
  };
  cronograma: Array<{
    evento: string;
    data: string;
    status: 'futuro' | 'proximo' | 'vencido';
  }>;
  metadados: {
    data_analise: string;
    documentos_analisados: number;
    qualidade_analise: number;
    tempo_processamento: number;
  };
}