import { api } from './api';
import { LicitacaoEmpresa } from '../types/licitacao';

interface AnaliseBackgroundCallbacks {
  onIniciada?: (licitacao: LicitacaoEmpresa) => void;
  onFinalizada?: (licitacao: LicitacaoEmpresa, notificationData?: any) => void;
  onErro?: (licitacao: LicitacaoEmpresa, erro: string) => void;
  // ✅ NOVOS CALLBACKS:
  onNavegarParaResultados?: (licitacao: LicitacaoEmpresa) => void;
  onAnaliseEmAndamento?: (licitacao: LicitacaoEmpresa) => void;
}

class AnaliseBackgroundService {
  private analisesEmAndamento: Set<string> = new Set();
  private callbacks: AnaliseBackgroundCallbacks = {};

  /**
   * Define os callbacks para eventos de análise
   */
  setCallbacks(callbacks: AnaliseBackgroundCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  /**
   * Verifica se uma análise está em andamento
   */
  isAnaliseEmAndamento(numeroControlePNCP: string): boolean {
    return this.analisesEmAndamento.has(numeroControlePNCP);
  }

  /**
   * Inicia uma análise em background
   */
  async iniciarAnalise(
    licitacao: LicitacaoEmpresa, 
    empresaCnpj: string
  ): Promise<void> {
    const { numeroControlePNCP } = licitacao;
    
    if (this.isAnaliseEmAndamento(numeroControlePNCP)) {
      console.log(`Análise já em andamento para ${numeroControlePNCP}`);
      return;
    }

    try {
      // Marcar como em andamento
      this.analisesEmAndamento.add(numeroControlePNCP);
      
      // ✅ NOVO: Executar análise e aguardar resposta completa
      console.log(`✅ Análise iniciada com sucesso para ${numeroControlePNCP}`);
      this.callbacks.onIniciada?.(licitacao);
      
      const result = await this.executarAnalise(numeroControlePNCP, empresaCnpj);
      
      // ✅ NOVO: Se análise retornou notificação, processar
      if (result && result.notification) {
        console.log(`🔔 Notificação de análise recebida:`, result.notification);
        this.callbacks.onFinalizada?.(licitacao, result.notification);
      } else {
        // Fallback para análises que não retornam notificação
        this.callbacks.onFinalizada?.(licitacao);
      }

    } catch (error) {
      console.error(`❌ Erro capturado na análise de ${numeroControlePNCP}:`, error);
      
      // ✅ NOVO: Tratar casos especiais ANTES de mostrar erro genérico
      if (error instanceof Error) {
        if (error.message === 'ANALYSIS_ALREADY_EXISTS') {
          // Navegar direto para resultados (sem pop-up)
          console.log('🎯 Análise já existe, navegando para resultados...');
          this.callbacks.onNavegarParaResultados?.(licitacao);
          return;
        } else if (error.message === 'ANALYSIS_IN_PROGRESS') {
          // Mostrar pop-up de bloqueio
          console.log('⏳ Análise em andamento, mostrando modal de bloqueio...');
          this.callbacks.onAnaliseEmAndamento?.(licitacao);
          return;
        } else {
          // Outros erros
          console.error('💥 Erro inesperado:', error.message);
          this.callbacks.onErro?.(licitacao, error.message);
        }
      } else {
        const mensagemErro = 'Erro desconhecido';
        console.error('💥 Erro não identificado:', error);
        this.callbacks.onErro?.(licitacao, mensagemErro);
      }
    } finally {
      // Remover da lista de análises em andamento
      this.analisesEmAndamento.delete(numeroControlePNCP);
    }
  }

  /**
   * Executa a análise chamando a API
   */
  private async executarAnalise(
    numeroControlePNCP: string, 
    empresaCnpj: string
  ): Promise<any> {
    try {
      console.log(`🔍 Iniciando análise para ${numeroControlePNCP}`);
      
      const response = await api.post('/edital/analysis', {
        numeroControlePNCP,
        empresaCNPJ: empresaCnpj
      });
      
      console.log(`✅ Análise concluída para ${numeroControlePNCP}:`, response);
      return response; // ✅ NOVO: Retornar resposta completa
    } catch (error: any) {
      console.error(`❌ Erro na análise de ${numeroControlePNCP}:`, error);
      
      // ✅ NOVO: Tratar erros específicos da API (Status HTTP + Código)
      if (error.response?.status === 409 && error.response?.data?.code === 'ANALYSIS_ALREADY_EXISTS') {
        // Análise já existe - não é erro, é informação
        console.log('✅ Análise já existe, tratando como sucesso...');
        throw new Error('ANALYSIS_ALREADY_EXISTS');
      } else if (error.response?.status === 423 && error.response?.data?.code === 'ANALYSIS_IN_PROGRESS') {
        // Análise em andamento
        console.log('⚠️ Análise em andamento detectada...');
        throw new Error('ANALYSIS_IN_PROGRESS');
      } else {
        // Outros erros
        console.error('❌ Erro inesperado na análise:', error.response?.data || error.message);
        throw error;
      }
    }
  }

  /**
   * Limpa todas as análises em andamento (útil para logout)
   */
  limparAnalises(): void {
    this.analisesEmAndamento.clear();
  }

  /**
   * Retorna lista de análises em andamento
   */
  getAnalisesEmAndamento(): string[] {
    return Array.from(this.analisesEmAndamento);
  }
}

export const analiseBackgroundService = new AnaliseBackgroundService();
