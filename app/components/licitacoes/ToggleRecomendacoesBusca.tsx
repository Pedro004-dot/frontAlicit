'use client';

interface ToggleRecomendacoesBuscaProps {
  tipoAtivo: 'recomendacoes' | 'busca';
  onToggle: (tipo: 'recomendacoes' | 'busca') => void;
}

export default function ToggleRecomendacoesBusca({ tipoAtivo, onToggle }: ToggleRecomendacoesBuscaProps) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onToggle('recomendacoes')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          tipoAtivo === 'recomendacoes'
            ? 'bg-[#1B4D3E] text-white'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        Recomendações
      </button>
      <button
        onClick={() => onToggle('busca')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          tipoAtivo === 'busca'
            ? 'bg-[#1B4D3E] text-white'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        Busca Manual
      </button>
    </div>
  );
}