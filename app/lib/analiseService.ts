import { DocumentoPreview, RelatorioTecnico } from '../types/licitacao';
import { api } from './api';

class AnaliseService {
  async buscarRelatorioTecnico(empresaCnpj: string, numeroControlePNCP: string): Promise<RelatorioTecnico | null> {
    try {
      // Codificar parâmetros para URL
      const cnpjEncoded = encodeURIComponent(empresaCnpj);
      const numeroEncoded = encodeURIComponent(numeroControlePNCP);
      const response = await api.get(`/relatorios/${cnpjEncoded}/${numeroEncoded}`) as { success: boolean; data: RelatorioTecnico } | RelatorioTecnico;
      
      // Verificar se a resposta tem o formato novo (com success) ou antigo (dados diretos)
      if (typeof response === 'object' && response !== null && 'success' in response) {
        if (response.success && response.data) {
          return response.data;
        } else {
          console.warn('Resposta da API não contém dados válidos:', response);
          return null;
        }
      } else {
        // Formato antigo - dados diretos
        return response as RelatorioTecnico;
      }
    } catch (error) {
      console.error('Erro ao buscar relatório técnico:', error);
      return null;
    }
  }

  async buscarDocumentosLicitacao(numeroControlePNCP: string): Promise<DocumentoPreview[]> {
    try {
      const numeroEncoded = encodeURIComponent(numeroControlePNCP);
      const response = await api.get(`/licitacoes-documentos/${numeroEncoded}/documentos`) as { success: boolean; data: DocumentoPreview[]; total: number };
      
      if (response.success && response.data) {
        return response.data;
      } else {
        console.warn('Resposta da API não contém dados válidos:', response);
        return [];
      }
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
      return [];
    }
  }

  async gerarPreviewDocumento(documentoId: string): Promise<string> {
    try {
      const response = await api.get(`/licitacoes-documentos/documentos/${documentoId}/preview`) as { success: boolean; data: { previewUrl: string; expiresIn: number } };
      
      if (response.success && response.data.previewUrl) {
        return response.data.previewUrl;
      } else {
        throw new Error('URL de preview não encontrada na resposta');
      }
    } catch (error) {
      console.error('Erro ao gerar preview do documento:', error);
      throw new Error('Erro ao gerar preview do documento');
    }
  }

  async downloadDocumento(documentoId: string): Promise<void> {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://alicit-backend-production-ffcd.up.railway.app';
      
      // Verificar se estamos no cliente antes de acessar localStorage
      if (typeof window === 'undefined') {
        throw new Error('Download só pode ser executado no cliente');
      }
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token de autorização não encontrado');
      }
      
      const downloadUrl = `${API_BASE_URL}/licitacoes-documentos/documentos/${documentoId}/download`;
      
      // Adicionar headers de autorização via fetch
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Erro ao baixar documento');
      }
      
      // Obter o blob do arquivo
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Criar link temporário para download
      const tempLink = document.createElement('a');
      tempLink.href = url;
      tempLink.download = `documento-${documentoId}`;
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      
      // Limpar URL temporária
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao fazer download do documento:', error);
      throw new Error('Erro ao fazer download do documento');
    }
  }
}

export const analiseService = new AnaliseService();