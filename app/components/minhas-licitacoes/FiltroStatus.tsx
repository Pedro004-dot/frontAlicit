import { StatusLicitacao } from '../../types/licitacao';
import { FILTRO_STATUS_OPTIONS, STATUS_CONFIG } from '../../config/statusConfig';

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

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {FILTRO_STATUS_OPTIONS.map((opcao) => {
        const isAtivo = statusAtivo === opcao.value;
        const contador = contadores[opcao.value] || 0;
        
        let bgClass = 'bg-gray-100 hover:bg-gray-200 text-gray-700';
        
        if (isAtivo) {
          if (opcao.value === 'todas') {
            bgClass = 'bg-blue-500 text-white';
          } else {
            const config = STATUS_CONFIG[opcao.value as StatusLicitacao];
            bgClass = `${config.color.replace('text-', 'bg-').replace('-600', '-500')} text-white`;
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