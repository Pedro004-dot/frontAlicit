'use client';

import { useState, useEffect } from 'react';
import { LicitacaoEmpresa } from '../../types/licitacao';

interface NotificationData {
  id: string;
  tipo: 'analise_iniciada' | 'analise_em_andamento' | 'analise_finalizada';
  licitacao: LicitacaoEmpresa;
  timestamp: number;
  mostrar: boolean;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  useEffect(() => {
    const handleAnaliseIniciada = (event: CustomEvent) => {
      const { licitacao } = event.detail;
      addNotification({
        id: `iniciada_${licitacao.numeroControlePNCP}_${Date.now()}`,
        tipo: 'analise_iniciada',
        licitacao,
        timestamp: Date.now(),
        mostrar: true
      });
    };

    const handleAnaliseEmAndamento = (event: CustomEvent) => {
      const { licitacao } = event.detail;
      addNotification({
        id: `andamento_${licitacao.numeroControlePNCP}_${Date.now()}`,
        tipo: 'analise_em_andamento',
        licitacao,
        timestamp: Date.now(),
        mostrar: true
      });
    };

    const handleAnaliseFinalizada = (event: CustomEvent) => {
      const { licitacao } = event.detail;
      addNotification({
        id: `finalizada_${licitacao.numeroControlePNCP}_${Date.now()}`,
        tipo: 'analise_finalizada',
        licitacao,
        timestamp: Date.now(),
        mostrar: true
      });
      
      // Remover notificações antigas desta licitação
      removeNotificationsByLicitacao(licitacao.numeroControlePNCP);
    };

    window.addEventListener('analise:iniciada', handleAnaliseIniciada as EventListener);
    window.addEventListener('analise:em_andamento', handleAnaliseEmAndamento as EventListener);
    window.addEventListener('analise:finalizada', handleAnaliseFinalizada as EventListener);

    return () => {
      window.removeEventListener('analise:iniciada', handleAnaliseIniciada as EventListener);
      window.removeEventListener('analise:em_andamento', handleAnaliseEmAndamento as EventListener);
      window.removeEventListener('analise:finalizada', handleAnaliseFinalizada as EventListener);
    };
  }, []);

  const addNotification = (notification: NotificationData) => {
    setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Máximo 5 notificações
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const removeNotificationsByLicitacao = (numeroControlePNCP: string) => {
    setNotifications(prev => prev.filter(n => 
      n.licitacao.numeroControlePNCP !== numeroControlePNCP || 
      n.tipo === 'analise_finalizada'
    ));
  };

  const getNotificationConfig = (tipo: NotificationData['tipo']) => {
    switch (tipo) {
      case 'analise_iniciada':
        return {
          icon: '🤖',
          title: 'Análise Iniciada',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          progressColor: 'bg-blue-500'
        };
      case 'analise_em_andamento':
        return {
          icon: '⚙️',
          title: 'Análise em Andamento',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          progressColor: 'bg-yellow-500'
        };
      case 'analise_finalizada':
        return {
          icon: '✅',
          title: 'Análise Finalizada',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          progressColor: 'bg-green-500'
        };
    }
  };

  const navigateToAnalysis = (numeroControlePNCP: string) => {
    const encodedNumber = encodeURIComponent(numeroControlePNCP);
    window.location.href = `/minhas-licitacoes/analise/${encodedNumber}`;
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => {
        const config = getNotificationConfig(notification.tipo);
        
        return (
          <div
            key={notification.id}
            className={`
              ${config.bgColor} ${config.borderColor} ${config.textColor}
              border rounded-lg p-4 shadow-lg animate-slide-in-right
              transform transition-all duration-300 hover:scale-105
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <span className="text-2xl">{config.icon}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm mb-1">
                    {config.title}
                  </h4>
                  <p className="text-xs opacity-75 truncate">
                    {notification.licitacao.numeroControlePNCP}
                  </p>
                  
                  {notification.tipo === 'analise_em_andamento' && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`${config.progressColor} h-1.5 rounded-full animate-pulse`}
                          style={{ width: '60%' }}
                        />
                      </div>
                      <p className="text-xs mt-1 opacity-60">
                        Isso pode levar alguns minutos...
                      </p>
                    </div>
                  )}
                  
                  {notification.tipo === 'analise_finalizada' && (
                    <button
                      onClick={() => navigateToAnalysis(notification.licitacao.numeroControlePNCP)}
                      className="mt-2 text-xs font-medium underline hover:no-underline"
                    >
                      Ver resultados →
                    </button>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}