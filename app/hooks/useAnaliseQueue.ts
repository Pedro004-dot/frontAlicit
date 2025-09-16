import { useState, useEffect } from 'react';
import { api } from '../lib/api';

interface StatusAnalise {
  status: 'pendente' | 'processando' | 'concluida' | 'erro';
  posicaoFila?: number;
  tempoEstimado?: number;
  erro?: string;
}

export function useAnaliseQueue(numeroControlePNCP?: string) {
  const [statusAnalise, setStatusAnalise] = useState<StatusAnalise | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verificarStatus = async () => {
    if (!numeroControlePNCP) return;

    try {
      setLoading(true);
      setError(null);
      
      const numeroEncoded = encodeURIComponent(numeroControlePNCP);
      const response = await api.get(`/edital/status/${numeroEncoded}`) as StatusAnalise;
      setStatusAnalise(response);
      
    } catch (error) {
      console.error('Erro ao verificar status da análise:', error);
      setError('Erro ao verificar status');
    } finally {
      setLoading(false);
    }
  };

  const iniciarAnalise = async (numeroControlePNCP: string, empresaCnpj: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await api.post('/edital/iniciar', {
        numeroControlePNCP,
        empresaCnpj
      });
      
      // Verificar status imediatamente após iniciar
      await verificarStatus();
      
    } catch (error) {
      console.error('Erro ao iniciar análise:', error);
      setError('Erro ao iniciar análise');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Polling automático quando há número de controle
  useEffect(() => {
    if (!numeroControlePNCP) return;

    // Verificar status imediatamente
    verificarStatus();

    // Configurar polling apenas se não estiver concluída ou com erro
    const shouldPoll = (status: StatusAnalise | null) => {
      return status?.status === 'pendente' || status?.status === 'processando';
    };

    let interval: NodeJS.Timeout;

    const startPolling = () => {
      interval = setInterval(() => {
        if (shouldPoll(statusAnalise)) {
          verificarStatus();
        } else {
          clearInterval(interval);
        }
      }, 10000); // Verificar a cada 10 segundos
    };

    // Iniciar polling após primeira verificação
    const timer = setTimeout(startPolling, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [numeroControlePNCP]);

  // Parar polling quando análise estiver concluída ou com erro
  useEffect(() => {
    if (statusAnalise?.status === 'concluida' || statusAnalise?.status === 'erro') {
      // Polling será parado automaticamente pelo useEffect anterior
    }
  }, [statusAnalise?.status]);

  return {
    statusAnalise,
    loading,
    error,
    iniciarAnalise,
    verificarStatus
  };
}