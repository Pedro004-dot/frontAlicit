'use client';

import { Licitacao } from '../../types/licitacao';

interface LicitacaoCardProps {
  licitacao: Licitacao;
  onClick: () => void;
  showMatchingScore?: boolean;
}

export default function LicitacaoCard({ licitacao, onClick, showMatchingScore = false }: LicitacaoCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'nova':
        return 'bg-blue-100 text-blue-800';
      case 'em_analise':
        return 'bg-[#FF9900] bg-opacity-10 text-[#FF9900]';
      case 'aprovada':
        return 'bg-green-100 text-green-800';
      case 'rejeitada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Campos mapeados do backend
  const id = licitacao.numeroControlePNCP;
  const orgao = licitacao.orgaoEntidade.razaoSocial;
  const cidade = licitacao.unidadeOrgao.municipioNome;
  const valor = licitacao.valorTotalEstimado;
  const dataAbertura = licitacao.dataAberturaProposta;
  const dataFechamento = licitacao.dataEncerramentoProposta;
  const objeto = licitacao.objetoCompra;
  const matchingScore = licitacao.matchScore;

  const getMatchingScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-[#FF9900]';
    return 'text-red-600';
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('LicitacaoCard onClick chamado para:', licitacao.numeroControlePNCP);
    onClick();
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg border shadow-sm p-6 hover:shadow-md hover:border-[#FF5000] hover:border-opacity-50 transition-all duration-200 cursor-pointer group"
    >
      {/* Header com ID e Cidade */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-sm font-semibold text-[#FF5000]">
              {id}
            </span>
            <span className="text-sm text-gray-600">•</span>
            <span className="text-sm text-gray-600">{cidade} - {licitacao.unidadeOrgao.ufSigla}</span>
            {licitacao.status && (
              <>
                <span className="text-sm text-gray-600">•</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(licitacao.status)}`}>
                  {licitacao.status.replace('_', ' ').toUpperCase()}
                </span>
              </>
            )}
          </div>
          <h3 className="font-semibold text-[#333333] group-hover:text-[#FF5000] transition-colors duration-200">
            {orgao}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {licitacao.modalidadeNome} • {licitacao.situacaoCompraNome}
          </p>
        </div>
        
        {showMatchingScore && matchingScore && (
          <div className="text-right">
            <div className={`text-lg font-bold ${getMatchingScoreColor(matchingScore)}`}>
              {matchingScore}%
            </div>
            <div className="text-xs text-gray-500">compatibilidade</div>
          </div>
        )}
      </div>

      {/* Valor e Datas */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-bold text-[#333333]">
          {formatCurrency(valor)}
        </div>
        <div className="text-right text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div>
              <span className="font-medium">Abertura:</span> {formatDate(dataAbertura)}
            </div>
            <div>
              <span className="font-medium">Encerramento:</span> {formatDate(dataFechamento)}
            </div>
          </div>
        </div>
      </div>

      {/* Objeto */}
      <div className="mb-4">
        <p className="text-sm text-gray-700 line-clamp-2">
          <span className="font-medium">Objeto:</span> {objeto}
        </p>
      </div>

      {/* Footer com indicação de clique */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Clique para ver detalhes
        </div>
        <svg className="w-4 h-4 text-gray-400 group-hover:text-[#FF5000] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}