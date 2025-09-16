import { useAnaliseQueue } from '../../hooks/useAnaliseQueue';

interface StatusIndicadorProps {
  numeroControlePNCP: string;
  className?: string;
}

export default function StatusIndicador({ numeroControlePNCP, className = '' }: StatusIndicadorProps) {
  const { statusAnalise, loading } = useAnaliseQueue(numeroControlePNCP);

  if (loading || !statusAnalise) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
        <span className="text-gray-600 text-sm">Verificando...</span>
      </div>
    );
  }

  const getStatusDisplay = () => {
    switch (statusAnalise.status) {
      case 'pendente':
        return {
          icon: '⏳',
          text: `Na fila - Posição ${statusAnalise.posicaoFila}`,
          bgColor: 'bg-yellow-50 border-yellow-200',
          textColor: 'text-yellow-800',
          detail: `Estimativa: ${statusAnalise.tempoEstimado} min`
        };
      
      case 'processando':
        return {
          icon: '⚡',
          text: 'Processando agora',
          bgColor: 'bg-blue-50 border-blue-200',
          textColor: 'text-blue-800',
          detail: 'Análise IA em andamento...'
        };
      
      case 'concluida':
        return {
          icon: '✅',
          text: 'Análise concluída',
          bgColor: 'bg-green-50 border-green-200',
          textColor: 'text-green-800',
          detail: 'Relatório disponível'
        };
      
      case 'erro':
        return {
          icon: '❌',
          text: 'Erro na análise',
          bgColor: 'bg-red-50 border-red-200',
          textColor: 'text-red-800',
          detail: statusAnalise.erro || 'Erro desconhecido'
        };
      
      default:
        return {
          icon: '🤖',
          text: 'Status desconhecido',
          bgColor: 'bg-gray-50 border-gray-200',
          textColor: 'text-gray-800',
          detail: ''
        };
    }
  };

  const status = getStatusDisplay();

  return (
    <div className={`border rounded-lg p-3 ${status.bgColor} ${className}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{status.icon}</span>
        <span className={`font-medium ${status.textColor}`}>
          {status.text}
        </span>
      </div>
      {status.detail && (
        <p className={`text-sm ${status.textColor} opacity-75`}>
          {status.detail}
        </p>
      )}
    </div>
  );
}