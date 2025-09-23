'use client';

import { LicitacaoEmpresa } from '../../types/licitacao';
import Button from '../ui/Button';

interface AnaliseEmAndamentoModalProps {
  licitacao: LicitacaoEmpresa | null;
  isOpen: boolean;
  onClose: () => void;
  onVerAnaliseAtual: () => void;
}

export default function AnaliseEmAndamentoModal({ 
  licitacao, 
  isOpen, 
  onClose, 
  onVerAnaliseAtual 
}: AnaliseEmAndamentoModalProps) {
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

  const handleVerAnaliseAtual = () => {
    onVerAnaliseAtual();
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
                Análise em Andamento
              </h2>
              <p className="text-gray-600">
                Já existe uma análise sendo processada para sua empresa.
              </p>
            </div>


            {/* Informação importante */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <div className="text-blue-600 text-lg">ℹ️</div>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Por que não posso iniciar outra análise?</p>
                  <p>O sistema processa uma análise por vez para garantir a qualidade e evitar sobrecarga. Aguarde a conclusão da análise atual para iniciar uma nova.</p>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="space-y-3">
              <Button
                onClick={handleVerAnaliseAtual}
                className="w-full py-3 bg-[#FF7000] hover:bg-[#F57000] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Ver Análise Atual
              </Button>

              <Button
                onClick={onClose}
                className="w-full py-2 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors"
              >
                <span className="text-[#333333]">Fechar</span>
              </Button>
            </div>

            {/* Informação adicional */}
            <div className="mt-6 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
               Você pode continuar navegando pelo sistema. 
                A análise continuará rodando em background e você será notificado quando estiver pronta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
