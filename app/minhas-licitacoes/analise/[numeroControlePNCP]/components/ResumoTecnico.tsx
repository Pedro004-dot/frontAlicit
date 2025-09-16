import { RelatorioTecnico, DadosRelatorioFrontend } from '../../../../types/licitacao';

interface ResumoTecnicoProps {
  relatorio: RelatorioTecnico | null;
  numeroControlePNCP: string;
}


export default function ResumoTecnico({ relatorio, numeroControlePNCP }: ResumoTecnicoProps) {
  
  const formartdata = (data: string):string => {
  const dataDate = new Date(data);
  const dia = dataDate.getDate();
  const mes = dataDate.getMonth() + 1; 
  const ano = dataDate.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRecomendacaoColor = (nivel: string) => {
    switch(nivel) {
      case 'ALTA': return 'bg-green-100 text-green-800';
      case 'MEDIA': return 'bg-yellow-100 text-yellow-800';
      case 'BAIXA': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 h-full">
      <h2 className="text-xl font-bold text-[#333333] mb-6">Resumo Técnico</h2>
      
      <div className="space-y-6">
        {/* Informações Básicas */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Status do Relatório</h3>
            <p className="text-lg font-semibold text-[#333333]">Concluído</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Qualidade da Análise</h3>
            <p className={`text-lg font-semibold ${getScoreColor(relatorio?.dadosFrontend?.metadados?.qualidade_analise || 0)}`}>
              {relatorio?.dadosFrontend?.metadados?.qualidade_analise || 0}/100
            </p>
          </div>
        </div>

        {/* Viabilidade e Recomendação */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium text-[#333333] mb-3">Análise de Viabilidade</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Score de Viabilidade</p>
              <p className="text-2xl font-bold text-[#333333]">
                {relatorio?.viabilidade?.score || relatorio?.dadosFrontend?.viabilidade?.score || 0}/10
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Recomendação</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRecomendacaoColor(relatorio?.dadosFrontend?.recomendacao?.nivel || '')}`}>
                {relatorio?.dadosFrontend?.recomendacao?.nivel || relatorio?.recomendacao || 'N/A'}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {relatorio?.dadosFrontend?.viabilidade?.justificativa || 'N/A'}
          </p>
        </div>

        {/* Pontos Críticos */}
        {(relatorio?.dadosFrontend?.pontosCriticos?.length || relatorio?.pontosCriticos?.length) && (
          <div>
            <h3 className="text-lg font-medium text-[#333333] mb-3">Pontos Críticos</h3>
            <div className="space-y-2">
              {(relatorio?.dadosFrontend?.pontosCriticos || relatorio?.pontosCriticos || []).map((ponto: any, index: number) => (
                <div key={index} className="bg-red-50 border-l-4 border-red-400 p-3">
                  <p className="text-sm text-red-800">{typeof ponto === 'object' ? ponto.descricao || ponto.titulo : ponto}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Principais Riscos */}
        {(relatorio?.dadosFrontend?.riscos?.length || relatorio?.riscos?.length) && (
          <div>
            <h3 className="text-lg font-medium text-[#333333] mb-3">Principais Riscos</h3>
            <div className="space-y-2">
              {(relatorio?.dadosFrontend?.riscos || relatorio?.riscos || []).slice(0, 5).map((risco: any, index: number) => (
                <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-yellow-800 flex-1">{typeof risco === 'object' ? risco.descricao || risco.titulo : risco}</p>
                    {(typeof risco === 'object' && risco.probabilidade) && (
                      <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                        {risco.probabilidade}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadados */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-[#333333] mb-3">Informações da Análise</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Documentos Analisados</p>
              <p className="font-medium">{relatorio?.dadosFrontend?.metadados?.documentos_analisados || 0}</p>
            </div>
            <div>
              <p className="text-gray-500">Volume de Dados</p>
              <p className="font-medium">{relatorio?.conteudoCompleto?.length || 0} caracteres</p>
            </div>
            <div>
              <p className="text-gray-500">Tamanho do Arquivo</p>
              <p className="font-medium">
                N/A
              </p>
            </div>
          </div>
        </div>

        {/* Data de Geração */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Relatório gerado em {formartdata(relatorio?.created_at || '')}
          </p>
        </div>
      </div>
    </div>
  );
}