'use client';

import { AnaliseAgente } from '../../types/analise';

interface AgenteCardProps {
  agente: AnaliseAgente | null;
  tipo: 'estrategico' | 'operacional' | 'juridico';
  cor: string;
}

export default function AgenteCard({ agente, tipo, cor }: AgenteCardProps) {
  if (!agente) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-300 min-h-[400px] flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          
          <h3 className="text-lg font-semibold text-gray-500 capitalize">
            Análise {tipo}
          </h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400 text-center">Dados não disponíveis</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 49) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getDecisaoColor = (decisao: string) => {
    if (decisao.toLowerCase().includes('prosseguir')) return 'text-green-700 bg-green-100';
    if (decisao.toLowerCase().includes('não')) return 'text-red-700 bg-red-100';
    return 'text-yellow-700 bg-yellow-100';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${cor} min-h-[400px] flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          
          <h3 className="text-lg font-semibold text-gray-800 capitalize">
            Análise {tipo}
          </h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(agente.score)}`}>
          {agente.score}/100
        </div>
      </div>

      {/* Decisão */}
      <div className="mb-4">
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getDecisaoColor(agente.decisao)}`}>
          {agente.decisao}
        </span>
      </div>

      {/* Análise do Agente */}
      {agente.analise && (
        <div className="flex-1">
          <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap break-words">
            {agente.analise}
          </div>
        </div>
      )}
    </div>
  );
}