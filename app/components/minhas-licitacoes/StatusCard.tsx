import { LicitacaoEmpresa } from '../../types/licitacao';
import { minhasLicitacoesService } from '../../lib/minhasLicitacoesService';

interface StatusCardProps {
  licitacao: LicitacaoEmpresa;
  onClick: (licitacao: LicitacaoEmpresa) => void;
}

export default function StatusCard({ licitacao, onClick }: StatusCardProps) {
  const statusColor = minhasLicitacoesService.getStatusColor(licitacao.status);
  const statusLabel = minhasLicitacoesService.getStatusLabel(licitacao.status);
  const statusIcon = minhasLicitacoesService.getStatusIcon(licitacao.status);

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <div
      className={`w-full border rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow ${statusColor}`}
      onClick={() => onClick(licitacao)}
    >
      <div className="flex items-start justify-between">
        {/* Lado esquerdo - Status e conteúdo principal */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{statusIcon}</span>
            <div>
              <span className="font-medium text-sm uppercase tracking-wide">
                {statusLabel}
              </span>
              <div className="text-xs text-gray-500 mt-1">
                📄 {licitacao.numeroControlePNCP}
              </div>
            </div>
          </div>

          {licitacao.licitacao && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 text-lg leading-tight">
                {licitacao.licitacao.objetoCompra}
              </h3>
              
              <div className="text-sm text-gray-600">
                <div className="mb-2">
                  <span className="font-medium">{licitacao.licitacao.modalidadeNome}</span>
                  {licitacao.licitacao.orgaoEntidade.razaoSocial && (
                    <span className="ml-2">• {licitacao.licitacao.orgaoEntidade.razaoSocial}</span>
                  )}
                </div>
                
                {licitacao.licitacao.dataEncerramentoProposta && (
                  <div className="text-xs text-gray-500">
                    ⏰ Encerra: {formatarData(licitacao.licitacao.dataEncerramentoProposta)}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Lado direito - Valor e data */}
        <div className="text-right ml-6 flex-shrink-0">
          {licitacao.licitacao && (
            <div className="font-bold text-lg text-gray-800 mb-2">
              {formatarValor(licitacao.licitacao.valorTotalEstimado)}
            </div>
          )}
          <div className="text-sm text-gray-500">
            {formatarData(licitacao.dataAtualizacao)}
          </div>
        </div>
      </div>
    </div>
  );
}