export interface DashboardData {
  analise: number;
  aguardando_confirmacao: number;
  impugnacao: number;
  enviada: number;
  vencida: number;
  perdida: number;
  total: number;
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
  message: string;
}

export interface LicitacaoComEstagio {
  id: string;
  numeroControlePNCP: string;
  statusAprovacao: string;
  dataAprovacao: string;
  objetoCompra: string;
  valorTotalEstimado: number;
  dataAberturaProposta: string;
  dataEncerramentoProposta: string;
  modalidadeNome: string;
  situacaoCompraNome: string;
  estagioAtual: {
    id: string;
    estagio: string;
    dataInicio: string;
    dataFim: string | null;
    observacoes: string | null;
  };
}

export interface LicitacoesResponse {
  success: boolean;
  data: LicitacaoComEstagio[];
  total: number;
}