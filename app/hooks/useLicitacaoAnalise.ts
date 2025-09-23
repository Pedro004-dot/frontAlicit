import { useState, useEffect } from 'react';
import { DocumentoPreview, RelatorioTecnico, StatusLicitacao } from '../types/licitacao';
import { AnaliseDetalhada } from '../types/analise';
import { analiseService } from '../lib/analiseService';
import { minhasLicitacoesService } from '../lib/minhasLicitacoesService';

export function useLicitacaoAnalise(numeroControlePNCP: string, empresaCnpj: string) {
  const [relatorio, setRelatorio] = useState<RelatorioTecnico | null>(null);
  const [analiseDetalhada, setAnaliseDetalhada] = useState<AnaliseDetalhada | null>(null);
  const [documentos, setDocumentos] = useState<DocumentoPreview[]>([]);
  const [documentoAtual, setDocumentoAtual] = useState<DocumentoPreview | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarDados = async () => {
    if (!numeroControlePNCP || !empresaCnpj) return;

    try {
      setLoading(true);
      setError(null);

      const [relatorioData, documentosData, analiseDetalhadaData] = await Promise.all([
        analiseService.buscarRelatorioTecnico(empresaCnpj, numeroControlePNCP),
        analiseService.buscarDocumentosLicitacao(numeroControlePNCP),
        analiseService.buscarAnaliseDetalhada(empresaCnpj, numeroControlePNCP)
      ]);

      setRelatorio(relatorioData);
      setDocumentos(documentosData);
      setAnaliseDetalhada(analiseDetalhadaData);
      
      if (documentosData.length > 0) {
        setDocumentoAtual(documentosData[0]);
        // Carregar preview do primeiro documento automaticamente apenas no cliente
        if (typeof window !== 'undefined') {
          try {
            const url = await analiseService.gerarPreviewDocumento(documentosData[0].id);
            setPreviewUrl(url);
          } catch (error) {
            console.error('Erro ao carregar preview do primeiro documento:', error);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dados da análise:', error);
      setError('Erro ao carregar dados da análise');
    } finally {
      setLoading(false);
    }
  };

  const selecionarDocumento = async (documento: DocumentoPreview) => {
    try {
      setDocumentoAtual(documento);
      setPreviewLoading(true);
      setError(null);
      
      // Limpar preview anterior se existir
      if (previewUrl && typeof window !== 'undefined') {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      
      const url = await analiseService.gerarPreviewDocumento(documento.id);
      setPreviewUrl(url);
    } catch (error) {
      console.error('Erro ao gerar preview:', error);
      setError('Erro ao carregar preview do documento');
      setPreviewUrl(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  const aprovarLicitacao = async () => {
    try {
      await minhasLicitacoesService.atualizarStatusPorChaves(
        numeroControlePNCP, 
        empresaCnpj, 
        'proposta'
      );
    } catch (error) {
      console.error('Erro ao aprovar licitação:', error);
      throw error;
    }
  };

  const recusarLicitacao = async () => {
    try {
      await minhasLicitacoesService.atualizarStatusPorChaves(
        numeroControlePNCP, 
        empresaCnpj, 
        'recusada'
      );
    } catch (error) {
      console.error('Erro ao recusar licitação:', error);
      throw error;
    }
  };

  const downloadDocumento = async (documentoId: string) => {
    try {
      await analiseService.downloadDocumento(documentoId);
    } catch (error) {
      console.error('Erro ao fazer download:', error);
      setError('Erro ao baixar documento');
    }
  };

  useEffect(() => {
    buscarDados();
  }, [numeroControlePNCP, empresaCnpj]);

  useEffect(() => {
    return () => {
      if (previewUrl && typeof window !== 'undefined') {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return {
    relatorio,
    analiseDetalhada,
    documentos,
    documentoAtual,
    previewUrl,
    loading,
    previewLoading,
    error,
    selecionarDocumento,
    aprovarLicitacao,
    recusarLicitacao,
    downloadDocumento,
    refetch: buscarDados
  };
}