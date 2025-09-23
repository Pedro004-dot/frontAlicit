import { StatusLicitacao } from '../types/licitacao';

export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
  description: string;
}

export const STATUS_CONFIG: Record<StatusLicitacao, StatusConfig> = {
  nao_definido: {
    label: 'Não Definido',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    icon: 'question-mark-circle',
    description: 'Status não definido'
  },
  nao_analisado: {
    label: 'Não Analisado',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: 'clock',
    description: 'Aguardando análise de IA'
  },
  em_analise: {
    label: 'Em Análise',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    icon: 'cog',
    description: 'Análise em andamento'
  },
  analisado: {
    label: 'Analisado',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    icon: 'check-circle',
    description: 'Análise concluída, aguardando decisão'
  },
  proposta: {
    label: 'Proposta',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: 'document-text',
    description: 'Aprovado para elaboração de proposta'
  },
  enviada: {
    label: 'Enviada',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    icon: 'paper-airplane',
    description: 'Proposta enviada'
  },
  vencida: {
    label: 'Vencida',
    color: 'text-green-700',
    bgColor: 'bg-green-200',
    icon: 'trophy',
    description: 'Licitação vencida'
  },
  recusada: {
    label: 'Recusada',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: 'x-circle',
    description: 'Recusada após análise'
  },
  perdida: {
    label: 'Perdida',
    color: 'text-gray-700',
    bgColor: 'bg-gray-200',
    icon: 'x-mark',
    description: 'Licitação perdida'
  }
};

export const FILTRO_STATUS_OPTIONS = [
 
  { value: 'nao_analisado', label: 'Não Analisado' },
  { value: 'analisado', label: 'Analisado' },
  { value: 'proposta', label: 'Proposta' },
  { value: 'enviada', label: 'Enviada' },
  { value: 'vencida', label: 'Vencida' },
  { value: 'recusada', label: 'Recusada' },
  { value: 'perdida', label: 'Perdida' },
  { value: 'todas', label: 'Todas' },
] as const;