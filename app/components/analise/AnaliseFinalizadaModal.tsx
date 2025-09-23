'use client';

import { LicitacaoEmpresa } from '../../types/licitacao';
import Button from '../ui/Button';

interface AnaliseFinalizadaModalProps {
  licitacao: LicitacaoEmpresa | null;
  isOpen: boolean;
  onClose: () => void;
  onVerResultado: () => void;
  onContinuarTrabalhando: () => void;
}

export default function AnaliseFinalizadaModal({ 
  licitacao, 
  isOpen, 
  onClose, 
  onVerResultado,
  onContinuarTrabalhando 
}: AnaliseFinalizadaModalProps) {
  if (!licitacao || !isOpen) return null;

  const formatCurrency = (value: number | undefined | null) => {
    if (value === undefined || value === null) {
      return 'Valor não informado';
    }
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handleVerResultado = () => {
    onVerResultado();
    onClose();
  };

  const handleContinuarTrabalhando = () => {
    onContinuarTrabalhando();
    onClose();
  };

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
              <h2 className="text-2xl font-bold text-[#333333] mb-2">
                Análise Finalizada!
              </h2>
              <p className="text-gray-600">
                O relatório técnico da licitação está pronto para visualização.
              </p>
            </div>

            {/* Resumo da Licitação */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-[#333333] mb-2 line-clamp-2">
                {licitacao.licitacao?.objetoCompra || 'Análise concluída'}
              </h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Modalidade:</span><br />
                  {licitacao.licitacao?.modalidadeNome || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Valor:</span><br />
                  {formatCurrency(licitacao.licitacao?.valorTotalEstimado)}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Número PNCP:</span><br />
                  <code className="text-xs bg-white px-2 py-1 rounded">
                    {licitacao.numeroControlePNCP}
                  </code>
                </div>
              </div>
            </div>



            {/* Ações */}
            <div className="space-y-3">
              <Button
                onClick={handleVerResultado}
                className="w-full py-3 bg-[#FF7000] hover:bg-[#F57000] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Ver Resultado da Análise
              </Button>

              <Button
                onClick={handleContinuarTrabalhando}
                className="w-full py-2 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors"
              >
               <span className="text-[#333333]">Fechar</span>
              </Button>

            </div>


          </div>
        </div>
      </div>
    </div>
  );
}
