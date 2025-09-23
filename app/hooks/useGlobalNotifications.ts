'use client';

import { useState, useCallback } from 'react';
import { LicitacaoEmpresa } from '../types/licitacao';

interface LicitacaoStatus {
  numeroControlePNCP: string;
  status: 'nao_definido' | 'em_analise' | 'proposta';
  relatorioId?: string;
  updatedAt: string;
}

export interface NotificacaoAnalise {
  id: string;
  numeroControlePNCP: string;
  status: string;
  relatorioId?: string;
  timestamp: Date;
  isOpen: boolean;
}

interface UseGlobalNotificationsReturn {
  notificacoes: NotificacaoAnalise[];
  mostrarNotificacao: (status: LicitacaoStatus) => void;
  fecharNotificacao: (id: string) => void;
  limparNotificacoes: () => void;
  navegarParaAnalise: (numeroControlePNCP: string) => void;
}

/**
 * ✅ Hook para gerenciar notificações globais de análises finalizadas
 * 
 * Características:
 * - Notificações aparecem independente da página atual
 * - Auto-remove após tempo determinado
 * - Permite navegação direta para análise
 * - Controle fino sobre exibição
 */
export function useGlobalNotifications(): UseGlobalNotificationsReturn {
  const [notificacoes, setNotificacoes] = useState<NotificacaoAnalise[]>([]);

  /**
   * ✅ Mostrar notificação de análise finalizada
   */
  const mostrarNotificacao = useCallback((status: LicitacaoStatus) => {
    const novaNotificacao: NotificacaoAnalise = {
      id: `${status.numeroControlePNCP}-${Date.now()}`,
      numeroControlePNCP: status.numeroControlePNCP,
      status: status.status,
      relatorioId: status.relatorioId,
      timestamp: new Date(),
      isOpen: true
    };

    console.log('🔔 Mostrando notificação de análise finalizada:', novaNotificacao);

    setNotificacoes(prev => [...prev, novaNotificacao]);

    // ✅ Auto-remover após 30 segundos
    setTimeout(() => {
      fecharNotificacao(novaNotificacao.id);
    }, 30000);
  }, []);

  /**
   * ✅ Fechar notificação específica
   */
  const fecharNotificacao = useCallback((id: string) => {
    setNotificacoes(prev => prev.filter(notif => notif.id !== id));
  }, []);

  /**
   * ✅ Limpar todas as notificações
   */
  const limparNotificacoes = useCallback(() => {
    setNotificacoes([]);
  }, []);

  /**
   * ✅ Navegar para página de análise
   */
  const navegarParaAnalise = useCallback((numeroControlePNCP: string) => {
    // Usar Next.js router
    window.location.href = `/minhas-licitacoes/analise/${encodeURIComponent(numeroControlePNCP)}`;
  }, []);

  return {
    notificacoes,
    mostrarNotificacao,
    fecharNotificacao,
    limparNotificacoes,
    navegarParaAnalise
  };
}
