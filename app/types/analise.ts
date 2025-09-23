export interface DadosConcretos {
  valorEstimado?: string;
  modalidade?: string;
  objeto?: string;
  orgao?: string;
  dataAbertura?: string;
  prazoExecucao?: string;
  localEntrega?: string;
  cronograma?: string;
}

export interface AnaliseAgente {
  score: number;
  decisao: string;
  analise: string;
  dadosExtraidos?: DadosConcretos;
  documentos?: string[];
}

export interface AnalisesAgentes {
  estrategico: AnaliseAgente | null;
  operacional: AnaliseAgente | null;
  juridico: AnaliseAgente | null;
}

export interface AnaliseDetalhada {
  scoreGeral: number;
  decisaoFinal: string;
  nivelRisco: string;
  dadosConcretos: DadosConcretos;
  agentes: AnalisesAgentes;
  pontosCriticos: any[];
  riscos: any[];
  cronograma: any[];
  requisitos: {
    atendidos: string[];
    nao_atendidos: string[];
  };
  viabilidade: any;
  metadados: {
    dataAnalise: string;
    qualidadeAnalise: number;
    documentosAnalisados: number;
  };
}