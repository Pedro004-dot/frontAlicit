'use client';

import { useState } from 'react';
import { Licitacao } from '../../types/licitacao';
import Button from '../ui/Button';

interface AprovacaoModalProps {
  licitacao: Licitacao | null;
  isOpen: boolean;
  onClose: () => void;
  onAnalisarAgora: (numeroControlePNCP: string) => void;
  onContinuarAprovando: () => void;
  isProcessando?: boolean;
}

export default function AprovacaoModal({ 
  licitacao, 
  isOpen, 
  onClose, 
  onAnalisarAgora, 
  onContinuarAprovando,
  isProcessando = false
}: AprovacaoModalProps) {
  const [acao, setAcao] = useState<'analisar' | 'continuar' | null>(null);

  if (!licitacao) return null;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handleAnalisarAgora = () => {
    setAcao('analisar');
    onAnalisarAgora(licitacao.numeroControlePNCP);
  };

  const handleContinuarAprovando = () => {
    setAcao('continuar');
    onContinuarAprovando();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 transition-opacity"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="relative w-full max-w-lg bg-white shadow-xl rounded-xl z-10">
          <div className="p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">✅</div>
              <h2 className="text-2xl font-bold text-[#333333] mb-2">
                Licitação Aprovada!
              </h2>
              <p className="text-gray-600">
                A licitação foi salva e está sendo processada para análise.
              </p>
            </div>

            {/* Resumo da Licitação */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-[#333333] mb-2 line-clamp-2">
                {licitacao.objetoCompra}
              </h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Modalidade:</span><br />
                  {licitacao.modalidadeNome}
                </div>
                <div>
                  <span className="font-medium">Valor:</span><br />
                  {formatCurrency(licitacao.valorTotalEstimado)}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Número PNCP:</span><br />
                  <code className="text-xs bg-white px-2 py-1 rounded">
                    {licitacao.numeroControlePNCP}
                  </code>
                </div>
              </div>
            </div>

            {/* Status de Processamento */}
            {isProcessando && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-blue-800 font-medium">
                    Análise IA em andamento...
                  </span>
                </div>
                <p className="text-blue-600 text-sm mt-1">
                  O sistema está processando os documentos e gerando o relatório técnico.
                </p>
              </div>
            )}

            {/* Ações */}
            <div className="space-y-4">
              <Button
                onClick={handleAnalisarAgora}
                disabled={acao === 'analisar'}
                className="w-full py-3 bg-[#FF7000] hover:bg-[#F57000] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {acao === 'analisar' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Redirecionando...
                  </>
                ) : (
                  <>
                    🔍 Analisar Licitação Agora
                  </>
                )}
              </Button>

              <Button
                onClick={handleContinuarAprovando}
                disabled={acao === 'continuar'}
                className="w-full py-3 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {acao === 'continuar' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    Fechando...
                  </>
                ) : (
                  <>
                    📋 Continuar Aprovando Licitações
                  </>
                )}
              </Button>
            </div>

            {/* Informação adicional */}
            <div className="mt-6 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                💡 <strong>Dica:</strong> Você pode continuar aprovando outras licitações enquanto 
                esta é processada em segundo plano. O relatório ficará pronto em alguns minutos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}