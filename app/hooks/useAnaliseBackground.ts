import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LicitacaoEmpresa } from '../types/licitacao';
import { analiseBackgroundService } from '../lib/analiseBackgroundService';
import { NotificationService } from '../lib/services/NotificationService';

interface UseAnaliseBackgroundProps {
  empresaCnpj: string;
  onAnaliseIniciada: (licitacao: LicitacaoEmpresa) => void;
  onAnaliseFinalizada: (licitacao: LicitacaoEmpresa) => void;
  onAnaliseErro: (licitacao: LicitacaoEmpresa, erro: string) => void;
  onDadosAtualizados: () => void;
  // ✅ NOVOS CALLBACKS:
  onNavegarParaResultados: (licitacao: LicitacaoEmpresa) => void;
  onAnaliseEmAndamento: (licitacao: LicitacaoEmpresa) => void;
}

interface UseAnaliseBackgroundReturn {
  iniciarAnalise: (licitacao: LicitacaoEmpresa) => Promise<void>;
  isAnaliseEmAndamento: (numeroControlePNCP: string) => boolean;
  navegarParaAnalise: (licitacao: LicitacaoEmpresa) => void;
}

export function useAnaliseBackground({
  empresaCnpj,
  onAnaliseIniciada,
  onAnaliseFinalizada,
  onAnaliseErro,
  onDadosAtualizados,
  onNavegarParaResultados,
  onAnaliseEmAndamento
}: UseAnaliseBackgroundProps): UseAnaliseBackgroundReturn {
  const router = useRouter();

  const navegarParaAnalise = useCallback((licitacao: LicitacaoEmpresa) => {
    const numeroEncoded = encodeURIComponent(licitacao.numeroControlePNCP);
    router.push(`/minhas-licitacoes/analise/${numeroEncoded}`);
  }, [router]);

  const iniciarAnalise = useCallback(async (licitacao: LicitacaoEmpresa) => {
    try {
      // Configurar callbacks antes de iniciar análise
      analiseBackgroundService.setCallbacks({
        onIniciada: (licitacao) => {
          NotificationService.emitAnaliseIniciada(licitacao);
          onAnaliseIniciada(licitacao);
        },
        onFinalizada: (licitacao) => {
          NotificationService.emitAnaliseFinalizada(licitacao);
          onAnaliseFinalizada(licitacao);
          onDadosAtualizados(); // Recarregar dados após finalização
        },
        onErro: onAnaliseErro,
        // ✅ NOVOS CALLBACKS:
        onNavegarParaResultados: onNavegarParaResultados,
        onAnaliseEmAndamento: (licitacao) => {
          NotificationService.emitAnaliseEmAndamento(licitacao);
          onAnaliseEmAndamento(licitacao);
        }
      });

      await analiseBackgroundService.iniciarAnalise(licitacao, empresaCnpj);
    } catch (error: any) {
      console.error('Erro ao iniciar análise:', error);
      
      // ✅ REMOVIDO: Tratamento de casos especiais movido para o serviço
      throw error;
    }
  }, [empresaCnpj, onAnaliseIniciada, onAnaliseFinalizada, onAnaliseErro, onDadosAtualizados, onNavegarParaResultados, onAnaliseEmAndamento]);

  const isAnaliseEmAndamento = useCallback((numeroControlePNCP: string): boolean => {
    return analiseBackgroundService.isAnaliseEmAndamento(numeroControlePNCP);
  }, []);

  return {
    iniciarAnalise,
    isAnaliseEmAndamento,
    navegarParaAnalise
  };
}