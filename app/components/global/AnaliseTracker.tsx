'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LicitacaoEmpresa } from '../../types/licitacao';

interface AnaliseEmAndamento {
  licitacao: LicitacaoEmpresa;
  startTime: number;
  progress: number;
}

export default function AnaliseTracker() {
  const router = useRouter();
  const [analisesEmAndamento, setAnalisesEmAndamento] = useState<AnaliseEmAndamento[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const handleAnaliseIniciada = (event: CustomEvent) => {
      const { licitacao } = event.detail;
      setAnalisesEmAndamento(prev => [
        ...prev.filter(a => a.licitacao.numeroControlePNCP !== licitacao.numeroControlePNCP),
        {
          licitacao,
          startTime: Date.now(),
          progress: 0
        }
      ]);
      setIsExpanded(true);
    };

    const handleAnaliseFinalizada = (event: CustomEvent) => {
      const { licitacao } = event.detail;
      setAnalisesEmAndamento(prev => 
        prev.filter(a => a.licitacao.numeroControlePNCP !== licitacao.numeroControlePNCP)
      );
    };

    window.addEventListener('analise:iniciada', handleAnaliseIniciada as EventListener);
    window.addEventListener('analise:finalizada', handleAnaliseFinalizada as EventListener);

    return () => {
      window.removeEventListener('analise:iniciada', handleAnaliseIniciada as EventListener);
      window.removeEventListener('analise:finalizada', handleAnaliseFinalizada as EventListener);
    };
  }, []);

  // Atualizar progresso das análises
  useEffect(() => {
    if (analisesEmAndamento.length === 0) return;

    const interval = setInterval(() => {
      setAnalisesEmAndamento(prev => prev.map(analise => {
        const elapsedTime = Date.now() - analise.startTime;
        const estimatedDuration = 3 * 60 * 1000; // 3 minutos
        const newProgress = Math.min((elapsedTime / estimatedDuration) * 100, 95);
        
        return {
          ...analise,
          progress: newProgress
        };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [analisesEmAndamento.length]);

  const navigateToLicitacoes = () => {
    router.push('/minhas-licitacoes');
  };

  const formatTempoDecorrido = (startTime: number) => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (analisesEmAndamento.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-slide-in-right">
        {/* Header */}
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="font-medium text-sm">
                {analisesEmAndamento.length} análise{analisesEmAndamento.length > 1 ? 's' : ''} em andamento
              </span>
            </div>
            <button className="text-white hover:text-gray-200 transition-colors">
              <svg 
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        {isExpanded && (
          <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
            {analisesEmAndamento.map((analise) => (
              <div 
                key={analise.licitacao.numeroControlePNCP}
                className="bg-gray-50 rounded-lg p-3"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                       Análise em andamento
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {analise.licitacao.numeroControlePNCP}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">
                    {formatTempoDecorrido(analise.startTime)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${analise.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {analise.progress < 30 && '📄 Processando documentos...'}
                      {analise.progress >= 30 && analise.progress < 60 && '🔍 Analisando estratégia...'}
                      {analise.progress >= 60 && analise.progress < 85 && '⚖️ Verificando requisitos...'}
                      {analise.progress >= 85 && '📊 Finalizando relatório...'}
                    </span>
                    <span>{Math.round(analise.progress)}%</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Action Button */}
            <button
              onClick={navigateToLicitacoes}
              className="w-full mt-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Ver em Minhas Licitações →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}