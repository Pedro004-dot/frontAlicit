'use client';

import { NotificacaoAnalise } from '../../hooks/useGlobalNotifications';

interface GlobalAnaliseNotificationProps {
  notificacao: NotificacaoAnalise;
  onFechar: (id: string) => void;
  onVerAnalise: (numeroControlePNCP: string) => void;
}

/**
 * ✅ Componente de notificação global para análises finalizadas
 * 
 * Aparece no canto superior direito, independente da página atual
 * Design inspirado em notificações do macOS/Windows
 */
export default function GlobalAnaliseNotification({
  notificacao,
  onFechar,
  onVerAnalise
}: GlobalAnaliseNotificationProps) {
  if (!notificacao.isOpen) return null;

  const handleVerAnalise = () => {
    onVerAnalise(notificacao.numeroControlePNCP);
    onFechar(notificacao.id);
  };

  const handleFechar = () => {
    onFechar(notificacao.id);
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden animate-slide-in-right">
        {/* Header */}
        <div className="bg-green-50 px-4 py-3 border-b border-green-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-800">
                🎉 Análise Finalizada
              </span>
            </div>
            <button
              onClick={handleFechar}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-1">
              Licitação analisada com sucesso:
            </p>
            <p className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-800">
              {notificacao.numeroControlePNCP}
            </p>
          </div>

          <div className="text-xs text-gray-500 mb-4">
            {notificacao.timestamp.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleVerAnalise}
              className="flex-1 bg-[#FF7000] hover:bg-[#F57000] text-white text-sm font-medium py-2 px-3 rounded transition-colors"
            >
              Ver Análise
            </button>
            <button
              onClick={handleFechar}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>

        {/* Progress bar para auto-close */}
        <div className="h-1 bg-gray-100">
          <div className="h-full bg-green-500 animate-progress-30s"></div>
        </div>
      </div>
    </div>
  );
}
