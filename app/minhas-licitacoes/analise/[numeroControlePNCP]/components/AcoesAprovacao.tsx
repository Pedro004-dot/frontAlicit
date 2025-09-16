import { useState } from 'react';
import Button from '../../../../components/ui/Button';

interface AcoesAprovacaoProps {
  onAprovar: () => Promise<void>;
  onRecusar: () => Promise<void>;
  loading: boolean;
}

export default function AcoesAprovacao({ 
  onAprovar, 
  onRecusar, 
  loading 
}: AcoesAprovacaoProps) {
  const [processando, setProcessando] = useState(false);

  const handleAprovar = async () => {
    try {
      setProcessando(true);
      await onAprovar();
    } catch (error) {
      console.error('Erro ao aprovar:', error);
    } finally {
      setProcessando(false);
    }
  };

  const handleRecusar = async () => {
    try {
      setProcessando(true);
      await onRecusar();
    } catch (error) {
      console.error('Erro ao recusar:', error);
    } finally {
      setProcessando(false);
    }
  };

  const isDisabled = loading || processando;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Button
          onClick={handleRecusar}
          disabled={isDisabled}
          className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {processando ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processando...
            </>
          ) : (
            <>
              RECUSAR
            </>
          )}
        </Button>

        <div className="hidden sm:block w-px h-12 bg-gray-200"></div>
        <div className="sm:hidden w-full h-px bg-gray-200"></div>

        <Button
          onClick={handleAprovar}
          disabled={isDisabled}
          className="w-full sm:w-auto px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {processando ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processando...
            </>
          ) : (
            <>
              APROVAR
            </>
          )}
        </Button>
      </div>
    </div>
  );
}