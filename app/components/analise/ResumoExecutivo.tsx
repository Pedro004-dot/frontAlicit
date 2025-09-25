'use client';

interface ResumoExecutivoProps {
  score?: number;
  decisao?: 'PROSSEGUIR' | 'NAO_PROSSEGUIR';
  recomendacao?: string;
  numeroControlePNCP: string;
  empresa?: string;
  dataAnalise?: string;
}

export default function ResumoExecutivo({
  score = 0,
  decisao = 'NAO_PROSSEGUIR',
  recomendacao = 'Análise em andamento...',
  numeroControlePNCP,
  empresa,
  dataAnalise
}: ResumoExecutivoProps) {
  
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-100 border-green-300';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    return 'text-red-600 bg-red-100 border-red-300';
  };

  const getDecisaoColor = (decisao: string) => {
    return decisao === 'PROSSEGUIR' 
      ? 'text-green-700 bg-green-50 border-green-200' 
      : 'text-red-700 bg-red-50 border-red-200';
  };

  const getDecisaoIcon = (decisao: string) => {
    return decisao === 'PROSSEGUIR' ? '✅' : '❌';
  };

  const getRiscoNivel = (score: number) => {
    if (score >= 70) return { nivel: 'BAIXO', cor: 'green' };
    if (score >= 40) return { nivel: 'MÉDIO', cor: 'yellow' };
    return { nivel: 'ALTO', cor: 'red' };
  };

  const risco = getRiscoNivel(score);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8 mb-8 border border-blue-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            📊 Resumo Executivo
          </h2>
          <p className="text-gray-600 text-sm">
            Análise automatizada para tomada de decisão
          </p>
        </div>
        
        {dataAnalise && (
          <div className="text-right text-sm text-gray-500">
            <p>Analisado em</p>
            <p className="font-medium">{new Date(dataAnalise).toLocaleDateString('pt-BR')}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Score Principal */}
        <div className={`rounded-xl p-6 border-2 ${getScoreColor(score)}`}>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {score}/100
            </div>
            <div className="text-sm font-medium uppercase tracking-wide">
              Score Consolidado
            </div>
          </div>
        </div>

        {/* Decisão */}
        <div className={`rounded-xl p-6 border-2 ${getDecisaoColor(decisao)}`}>
          <div className="text-center">
            <div className="text-3xl mb-2">
              {getDecisaoIcon(decisao)}
            </div>
            <div className="text-lg font-bold mb-1">
              {decisao === 'PROSSEGUIR' ? 'PROSSEGUIR' : 'NÃO PROSSEGUIR'}
            </div>
            <div className="text-sm font-medium">
              Recomendação Final
            </div>
          </div>
        </div>

        {/* Nível de Risco */}
        <div className={`rounded-xl p-6 border-2 text-${risco.cor}-600 bg-${risco.cor}-100 border-${risco.cor}-300`}>
          <div className="text-center">
            <div className="text-2xl mb-2">
              {risco.nivel === 'BAIXO' ? '🟢' : risco.nivel === 'MÉDIO' ? '🟡' : '🔴'}
            </div>
            <div className="text-lg font-bold mb-1">
              {risco.nivel}
            </div>
            <div className="text-sm font-medium">
              Nível de Risco
            </div>
          </div>
        </div>
      </div>

      {/* Informações da Licitação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="font-medium text-gray-700 mb-1">Licitação</h3>
          <p className="text-gray-900 font-semibold text-sm">
            {numeroControlePNCP}
          </p>
        </div>
        
        {empresa && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="font-medium text-gray-700 mb-1">Empresa</h3>
            <p className="text-gray-900 font-semibold text-sm">
              {empresa}
            </p>
          </div>
        )}
      </div>

      {/* Recomendação */}
      {recomendacao && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="flex items-center gap-2 font-medium text-gray-700 mb-3">
            💡 Recomendação Detalhada
          </h3>
          <p className="text-gray-800 leading-relaxed">
            {recomendacao}
          </p>
        </div>
      )}
    </div>
  );
}