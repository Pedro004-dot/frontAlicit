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
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-300">
        <div className="flex items-center gap-3 mb-4">
          
          <h3 className="text-lg font-semibold text-gray-500 capitalize">
            Análise {tipo}
          </h3>
        </div>
        <p className="text-gray-400">Dados não disponíveis</p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getDecisaoColor = (decisao: string) => {
    if (decisao.toLowerCase().includes('prosseguir')) return 'text-green-700 bg-green-100';
    if (decisao.toLowerCase().includes('não')) return 'text-red-700 bg-red-100';
    return 'text-yellow-700 bg-yellow-100';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${cor}`}>
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

      {/* Dados Extraídos */}
      {agente.dadosExtraidos && Object.keys(agente.dadosExtraidos).length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Dados Identificados:</h4>
          <div className="space-y-1">
            {agente.dadosExtraidos.valorEstimado && (
              <div className="text-sm">
                <span className="font-medium">Valor:</span> R$ {agente.dadosExtraidos.valorEstimado}
              </div>
            )}
            {agente.dadosExtraidos.modalidade && (
              <div className="text-sm">
                <span className="font-medium">Modalidade:</span> {agente.dadosExtraidos.modalidade}
              </div>
            )}
            {agente.dadosExtraidos.prazoExecucao && (
              <div className="text-sm">
                <span className="font-medium">Prazo:</span> {agente.dadosExtraidos.prazoExecucao}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Documentos (para agente jurídico) */}
      {agente.documentos && agente.documentos.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Documentos Necessários:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {agente.documentos.slice(0, 3).map((doc, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>{doc}</span>
              </li>
            ))}
            {agente.documentos.length > 3 && (
              <li className="text-gray-500 text-xs">
                +{agente.documentos.length - 3} documentos...
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Análise resumida */}
      {agente.analise && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Análise:</h4>
          <p className="text-sm text-gray-600 line-clamp-4">
            {agente.analise}
          </p>
        </div>
      )}
    </div>
  );
}