import { StatusLicitacao } from '../../types/licitacao';
import { minhasLicitacoesService } from '../../lib/minhasLicitacoesService';

interface FiltroStatusProps {
  statusAtivo: StatusLicitacao | 'todas';
  onStatusChange: (status: StatusLicitacao | 'todas') => void;
  contadores: Record<StatusLicitacao | 'todas', number>;
}

export default function FiltroStatus({ 
  statusAtivo, 
  onStatusChange, 
  contadores 
}: FiltroStatusProps) {
  const opcoesFiltro: { value: StatusLicitacao | 'todas'; label: string }[] = [
    { value: 'todas', label: 'Todas' },
    { value: 'nao_definido', label: 'Não Definido' },
    { value: 'em_analise', label: 'Em Análise' },
    { value: 'proposta', label: 'Proposta' },
    { value: 'enviada', label: 'Enviada' },
    { value: 'vencida', label: 'Vencida' },
    { value: 'recusada', label: 'Recusada' },
    { value: 'perdida', label: 'Perdida' }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {opcoesFiltro.map((opcao) => {
        const isAtivo = statusAtivo === opcao.value;
        const contador = contadores[opcao.value] || 0;
        
        let bgClass = 'bg-gray-100 hover:bg-gray-200 text-gray-700';
        
        if (isAtivo) {
          if (opcao.value === 'todas') {
            bgClass = 'bg-blue-500 text-white';
          } else {
            // Usar cores específicas para cada status quando ativo
            const statusColors = {
              nao_definido: 'bg-yellow-500 text-white',
              em_analise: 'bg-blue-500 text-white',
              proposta: 'bg-green-500 text-white',
              enviada: 'bg-purple-500 text-white',
              vencida: 'bg-gray-500 text-white',
              recusada: 'bg-red-500 text-white',
              perdida: 'bg-orange-500 text-white'
            };
            bgClass = statusColors[opcao.value as StatusLicitacao] || 'bg-gray-500 text-white';
          }
        }

        return (
          <button
            key={opcao.value}
            onClick={() => onStatusChange(opcao.value)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${bgClass}
              ${contador === 0 ? 'opacity-50' : ''}
            `}
            disabled={contador === 0}
          >
            {opcao.label} ({contador})
          </button>
        );
      })}
    </div>
  );
}