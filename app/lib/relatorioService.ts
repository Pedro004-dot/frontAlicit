import { api } from './api';

export interface RelatorioTecnico {
  id: string;
  empresa_cnpj: string;
  numero_controle_pncp: string;
  tipo_relatorio: string;
  url_storage: string;
  nome_arquivo: string;
  path_storage: string;
  status_relatorio: string;
  created_at: string;
  metadados: any;
  dados_pdf: any;
}

export class RelatorioService {
  private baseUrl = '/api/relatorios';

  async buscarRelatorio(empresaCnpj: string, numeroControlePNCP: string): Promise<RelatorioTecnico | null> {
    try {
      const response: any = await api.get(`${this.baseUrl}/${empresaCnpj}/${numeroControlePNCP}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async gerarUrlDownload(relatorioId: string): Promise<string> {
    try {
      const response: any = await api.get(`${this.baseUrl}/${relatorioId}/url`);
      return response.data.url;
    } catch (error) {
      console.error('Erro ao gerar URL de download:', error);
      throw error;
    }
  }

  async downloadRelatorio(relatorioId: string): Promise<Blob> {
    try {
      const response = await api.get(`${this.baseUrl}/${relatorioId}/download`, {
        responseType: 'blob'
      });
      return response as Blob;
    } catch (error) {
      console.error('Erro ao fazer download do relatório:', error);
      throw error;
    }
  }

  async verificarRelatorioExistente(empresaCnpj: string, numeroControlePNCP: string): Promise<boolean> {
    try {
      const response: any = await api.get(`${this.baseUrl}/${empresaCnpj}/${numeroControlePNCP}/verificar`);
      return response.data.existe;
    } catch (error) {
      console.error('Erro ao verificar relatório existente:', error);
      return false;
    }
  }

  async listarRelatoriosEmpresa(empresaCnpj: string): Promise<any[]> {
    try {
      const response: any = await api.get(`${this.baseUrl}/empresa/${empresaCnpj}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar relatórios da empresa:', error);
      throw error;
    }
  }

  // Função para download direto via blob e abrir em nova aba
  async downloadEAbrirRelatorio(relatorioId: string, nomeArquivo: string): Promise<void> {
    try {
      const blob = await this.downloadRelatorio(relatorioId);
      
      // Criar URL temporária para o blob
      const url = window.URL.createObjectURL(blob);
      
      // Criar link temporário e disparar download
      const link = document.createElement('a');
      link.href = url;
      link.download = nomeArquivo;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Também abrir em nova aba para visualização
      const viewUrl = window.URL.createObjectURL(blob);
      window.open(viewUrl, '_blank');
      
      // Cleanup da URL de visualização após um tempo
      setTimeout(() => {
        window.URL.revokeObjectURL(viewUrl);
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao baixar e abrir relatório:', error);
      throw error;
    }
  }

  // Função para apenas abrir o relatório em nova aba (sem download)
  async abrirRelatorio(relatorioId: string): Promise<void> {
    try {
      const blob = await this.downloadRelatorio(relatorioId);
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      // Cleanup após um tempo
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao abrir relatório:', error);
      throw error;
    }
  }
}

export const relatorioService = new RelatorioService();