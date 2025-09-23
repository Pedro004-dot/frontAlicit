import { LicitacaoEmpresa } from '../../types/licitacao';
import { useStatusActions } from '../../hooks/useStatusActions';

interface StatusCardProps {
  licitacao: LicitacaoEmpresa;
  onClick: (licitacao: LicitacaoEmpresa) => void;
  isProcessing?: boolean;
}

export default function StatusCard({ licitacao, onClick, isProcessing = false }: StatusCardProps) {
  const { config } = useStatusActions(licitacao.status);

  const formatarData = (data: string | undefined | null) => {
    if (!data) {
      return 'Data não informada';
    }
    try {
      return new Date(data).toLocaleDateString('pt-BR');
    } catch (error) {
      return 'Data inválida';
    }
  };

  const formatarValor = (valor: number | undefined | null) => {
    if (valor === undefined || valor === null) {
      return 'Valor não informado';
    }
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <div
      className={`
        w-full border rounded-lg p-6 cursor-pointer transition-all-smooth hover-lift ${config.bgColor} ${config.color} relative
        ${isProcessing ? 'opacity-75' : ''}
        ${licitacao.status === 'proposta' ? 'ring-2 ring-green-100 border-green-200' : ''}
      `}
      onClick={() => !isProcessing && onClick(licitacao)}
    >
      {/* Overlay de processamento melhorado */}
      {isProcessing && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg z-10 animate-slide-in-right">
          <div className="flex flex-col items-center gap-3 p-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#FF7000]"></div>
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#FF7000] animate-pulse"></div>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-700 font-medium block">
                Analisando licitação...
              </span>
              <span className="text-xs text-gray-500 mt-1 block">
                Isso pode levar alguns minutos
              </span>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-start justify-between">
        {/* Lado esquerdo - Status e conteúdo principal */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <span className="font-medium text-sm uppercase tracking-wide">
                {config.label}
              </span>
              <div className="text-xs text-gray-500 mt-1">
                📄 {licitacao.numeroControlePNCP}
              </div>
            </div>
          </div>

          {licitacao.licitacao ? (
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 text-lg leading-tight">
                {licitacao.licitacao.objetoCompra || 'Objeto não informado'}
              </h3>
              
              <div className="text-sm text-gray-600">
                <div className="mb-2">
                  <span className="font-medium">{licitacao.licitacao.modalidadeNome || 'Modalidade não informada'}</span>
                  {licitacao.licitacao.orgaoEntidade?.razaoSocial && (
                    <span className="ml-2">• {licitacao.licitacao.orgaoEntidade.razaoSocial}</span>
                  )}
                </div>
                
                {licitacao.licitacao.dataEncerramentoProposta && (
                  <div className="text-xs text-gray-500">
                     Encerra: {formatarData(licitacao.licitacao.dataEncerramentoProposta)}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 text-lg leading-tight">
                Dados da licitação sendo carregados...
              </h3>
              <div className="text-sm text-gray-500">
                Aguarde enquanto buscamos as informações completas.
              </div>
            </div>
          )}
        </div>

        {/* Lado direito - Valor e data */}
        <div className="text-right ml-6 flex-shrink-0">
          <div className="font-bold text-lg text-gray-800 mb-2">
            {formatarValor(licitacao.licitacao?.valorTotalEstimado)}
          </div>
          <div className="text-sm text-gray-500">
            {formatarData(licitacao.dataAtualizacao)}
          </div>
        </div>
      </div>
    </div>
  );
}