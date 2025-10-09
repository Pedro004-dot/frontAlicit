'use client';

import { useState, useRef } from 'react';
import Button from './Button';
import { apiClient } from '@/app/lib/api';

interface ImportResult {
  sucesso: boolean;
  totalLinhas: number;
  importados: number;
  erros: number;
  detalhesErros: Array<{ linha: number; erro: string }>;
  tempoProcessamento: string;
}

interface ProdutoServicoImportProps {
  cnpj?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function ProdutoServicoImport({ cnpj, onSuccess, onError }: ProdutoServicoImportProps) {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [resultado, setResultado] = useState<ImportResult | null>(null);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file || !cnpj) {
      return;
    }

    // Iniciar loading ANTES das validações para melhor UX
    setLoading(true);
    setLoadingMessage('Validando arquivo...');

    try {
      // Validar tipo de arquivo
      const allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];

      if (!allowedTypes.includes(file.type)) {
        onError?.('Apenas arquivos XLS e XLSX são permitidos');
        return;
      }

      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        onError?.('Arquivo muito grande. Tamanho máximo: 5MB');
        return;
      }

      // Pequeno delay para mostrar o loading
      setLoadingMessage('Preparando upload...');
      await new Promise(resolve => setTimeout(resolve, 300));

      const formData = new FormData();
      formData.append('planilha', file);
      
      // Remover formatação do CNPJ (pontos, barras, hífens)
      const cnpjLimpo = cnpj.replace(/[.\-/]/g, '');
      const endpoint = `/empresa/${cnpjLimpo}/produtos-servicos/import`;

      setLoadingMessage('Enviando arquivo...');
      const result: ImportResult = await apiClient.postFormData(endpoint, formData);
      
      setLoadingMessage('Processando planilha...');
      
      setResultado(result);
      setShowModal(true);

      if (result.sucesso && result.importados > 0) {
        onSuccess?.();
      }

    } catch (error: any) {
      onError?.(error.message || 'Erro ao importar planilha');
    } finally {
      setLoading(false);
      setLoadingMessage('');
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const downloadTemplate = () => {
    // Criar template simples em formato CSV para facilitar
    const csvContent = 'Tipo,Nome,Descrição,Valor\nproduto,Exemplo Produto,Descrição do produto,100.00\nservico,Exemplo Serviço,Descrição do serviço,50.00';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template-produtos-servicos.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-blue-900">Importação em Lote</h3>
            <p className="text-xs text-blue-700">Importe vários produtos/serviços de uma planilha</p>
          </div>
          <button
            onClick={downloadTemplate}
            className="text-blue-600 hover:text-blue-800 text-xs underline"
          >
            Baixar Template
          </button>
        </div>

        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xls,.xlsx"
            onChange={handleFileUpload}
            disabled={loading || !cnpj}
            className="text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 file:cursor-pointer"
          />
          {loading && (
            <div className="flex items-center text-sm text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              {loadingMessage || 'Processando...'}
            </div>
          )}
        </div>

        <div className="mt-2 text-xs text-gray-600">
          <p>• Formatos aceitos: XLS, XLSX</p>
          <p>• Tamanho máximo: 5MB</p>
          <p>• Colunas: Tipo (obrigatório), Nome (obrigatório), Descrição, Valor</p>
        </div>
      </div>

      {/* Modal de Resultado */}
      {showModal && resultado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              {resultado.sucesso ? (
                <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full mr-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-full mr-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
              <h3 className="text-lg font-bold text-gray-900">Resultado da Importação</h3>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total de linhas:</span>
                <span className="font-medium">{resultado.totalLinhas}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Importados com sucesso:</span>
                <span className="font-medium text-green-600">{resultado.importados}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Erros:</span>
                <span className="font-medium text-red-600">{resultado.erros}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tempo de processamento:</span>
                <span className="font-medium">{resultado.tempoProcessamento}</span>
              </div>
            </div>

            {resultado.detalhesErros.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-900 mb-2">Detalhes dos Erros:</h4>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-h-32 overflow-y-auto">
                  {resultado.detalhesErros.map((erro, index) => (
                    <div key={index} className="text-xs text-red-700 mb-1">
                      Linha {erro.linha}: {erro.erro}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={() => setShowModal(false)}
                className="px-4 py-2"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}