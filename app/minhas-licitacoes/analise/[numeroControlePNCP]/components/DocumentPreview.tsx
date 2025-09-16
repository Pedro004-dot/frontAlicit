import { DocumentoPreview } from '../../../../types/licitacao';

interface DocumentPreviewProps {
  documentos: DocumentoPreview[];
  documentoAtual: DocumentoPreview | null;
  previewUrl: string | null;
  previewLoading?: boolean;
  onSelecionarDocumento: (documento: DocumentoPreview) => void;
  onDownload: (documentoId: string) => void;
}

export default function DocumentPreview({ 
  documentos, 
  documentoAtual, 
  previewUrl,
  previewLoading = false,
  onSelecionarDocumento,
  onDownload 
}: DocumentPreviewProps) {
  const formatarTamanho = (bytes: number | undefined) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTipoIcon = (tipo: string | undefined) => {
    if (!tipo) return '📁';
    if (tipo.includes('pdf')) return '📄';
    if (tipo.includes('doc')) return '📝';
    if (tipo.includes('xls')) return '📊';
    return '📁';
  };

  const getTipoDescricao = (tipoDocumento: string | undefined, nome: string) => {
    if (!tipoDocumento) return nome;
    
    const tipoMap: { [key: string]: string } = {
      'edital': '📋 Edital',
      'anexo': '📎 Anexo',
      'planilha': '📊 Planilha',
      'termo': '📜 Termo',
      'projeto': '📐 Projeto',
      'documento': '📄 Documento'
    };
    
    const tipoDescricao = tipoMap[tipoDocumento.toLowerCase()] || '📄 Documento';
    return `${tipoDescricao} - ${nome}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 h-full flex flex-col min-h-[800px]">
      <h2 className="text-xl font-bold text-[#333333] mb-6">Preview de Documentos</h2>
      
      <div className="flex-1 flex flex-col min-h-0">
        {/* Preview Principal */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4 flex-1 min-h-[600px] flex flex-col">
          {documentoAtual ? (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-[#333333] truncate">
                  {getTipoDescricao(documentoAtual.tipoDocumento, documentoAtual.nomeOriginal || documentoAtual.nome || 'Documento sem nome')}
                </h3>
                <button
                  onClick={() => onDownload(documentoAtual.id)}
                  className="p-2 text-[#FF7000] hover:text-[#F57000] hover:bg-orange-50 rounded-lg transition-colors"
                  title="Download"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4m-6 2a9 9 0 110-18 9 9 0 010 18z" />
                  </svg>
                </button>
              </div>
              
              {previewLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7000] mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando preview...</p>
                  </div>
                </div>
              ) : previewUrl ? (
                <div className="flex-1 min-h-0">
                  <iframe
                    src={previewUrl}
                    className="w-full h-full border rounded-lg"
                    title="Preview do documento"
                  />
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{getTipoIcon(documentoAtual.tipo)}</div>
                    <p className="text-gray-600 mb-2">Preview não disponível</p>
                    <p className="text-sm text-gray-500">
                      {formatarTamanho(documentoAtual.tamanho)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-4xl mb-4">📋</div>
                <p className="text-gray-600">Selecione um documento para visualizar</p>
              </div>
            </div>
          )}
        </div>

        {/* Lista de Documentos */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-[#333333] mb-3">
            📑 Documentos ({documentos.length})
          </h4>
          
          {documentos.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {documentos.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => onSelecionarDocumento(doc)}
                  className={`w-full p-2 rounded-lg text-left transition-colors ${
                    documentoAtual?.id === doc.id 
                      ? 'bg-[#FF7000] text-white' 
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{getTipoIcon(doc.tipo)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">
                        {getTipoDescricao(doc.tipoDocumento, doc.nomeOriginal || doc.nome || 'Documento sem nome')}
                      </p>
                      <p className={`text-xs ${
                        documentoAtual?.id === doc.id 
                          ? 'text-orange-100' 
                          : 'text-gray-500'
                      }`}>
                        {formatarTamanho(doc.tamanho)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-blue-600 mb-2">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-blue-800 font-medium">Documentos em Processamento</p>
              <p className="text-blue-600 text-sm mt-1">
                Os documentos desta licitação ainda estão sendo processados e indexados.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}