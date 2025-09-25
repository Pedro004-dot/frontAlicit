'use client';

interface OrgaoEntidade {
  cnpj?: string;
  razaoSocial?: string;
  poderId?: string;
  esferaId?: string;
}

interface UnidadeOrgao {
  ufNome?: string;
  ufSigla?: string;
  codigoIbge?: string;
  codigoUnidade?: string;
  nomeUnidade?: string;
  municipioNome?: string;
}

interface AmparoLegal {
  codigo?: number;
  nome?: string;
  descricao?: string;
}

interface LicitacaoCompleta {
  numero_controle_pncp: string;
  ano_compra?: number;
  sequencial_compra?: number;
  numero_compra?: string;
  data_inclusao?: string;
  data_publicacao_pncp?: string;
  data_abertura_proposta?: string;
  data_encerramento_proposta?: string;
  modalidade_nome?: string;
  modo_disputa_nome?: string;
  tipo_instrumento_convocatorio_nome?: string;
  srp?: boolean;
  orgao_entidade?: OrgaoEntidade;
  uf_nome?: string;
  uf_sigla?: string;
  municipio_nome?: string;
  unidade_orgao_completo?: UnidadeOrgao;
  amparo_legal?: AmparoLegal;
  processo?: string;
  objeto_compra: string;
  informacao_complementar?: string;
  link_sistema_origem?: string;
  link_processo_eletronico?: string;
  valor_total_estimado?: number;
  valor_total_homologado?: number;
  situacao_compra_nome?: string;
  usuario_nome?: string;
}

interface InformacoesGeraisProps {
  licitacao: LicitacaoCompleta;
}

export default function InformacoesGerais({ licitacao }: InformacoesGeraisProps) {
  
  const formatarData = (data?: string) => {
    if (!data) return 'Não informado';
    try {
      return new Date(data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Data inválida';
    }
  };

  const formatarValor = (valor?: number) => {
    if (!valor) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarNumeroCompra = (ano?: number, sequencial?: number, numero?: string) => {
    if (numero) return numero;
    if (ano && sequencial) return `${ano}/${sequencial.toString().padStart(6, '0')}`;
    return 'Não informado';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
         Informações Gerais da Licitação
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Coluna Esquerda - Identificação */}
        <div className="space-y-6">
          
          {/* Identificação Principal */}
          <div className="rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
               Identificação
            </h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Número PNCP:</span>
                <p className="font-semibold text-blue-700">{licitacao.numero_controle_pncp}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Número da Compra:</span>
                <p className="font-semibold">{formatarNumeroCompra(licitacao.ano_compra, licitacao.sequencial_compra, licitacao.numero_compra)}</p>
              </div>
              {licitacao.processo && (
                <div>
                  <span className="text-sm text-gray-600">Processo:</span>
                  <p className="font-semibold">{licitacao.processo}</p>
                </div>
              )}
            </div>
          </div>

          {/* Modalidade e Tipo */}
          <div className="rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
               Modalidade e Disputa
            </h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Modalidade:</span>
                <p className="font-semibold text-green-700">{licitacao.modalidade_nome || 'Não informado'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Modo de Disputa:</span>
                <p className="font-semibold">{licitacao.modo_disputa_nome || 'Não informado'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Instrumento Convocatório:</span>
                <p className="font-semibold">{licitacao.tipo_instrumento_convocatorio_nome || 'Não informado'}</p>
              </div>
              {licitacao.srp && (
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                     Sistema de Registro de Preços
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Cronograma */}
          <div className=" rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
               Cronograma
            </h3>
            <div className="space-y-2">
            
              <div>
                <span className="text-sm text-gray-600">Publicação PNCP:</span>
                <p className="font-semibold">{formatarData(licitacao.data_publicacao_pncp)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Abertura das Propostas:</span>
                <p className="font-semibold text-orange-700">{formatarData(licitacao.data_abertura_proposta)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Encerramento das Propostas:</span>
                <p className="font-semibold text-red-700">{formatarData(licitacao.data_encerramento_proposta)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita - Órgão e Localização */}
        <div className="space-y-6">
          
          {/* Órgão Responsável */}
          <div className="rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
               Órgão Responsável
            </h3>
            <div className="space-y-2">
              {licitacao.orgao_entidade?.razaoSocial && (
                <div>
                  <span className="text-sm text-gray-600">Razão Social:</span>
                  <p className="font-semibold text-purple-700">{licitacao.orgao_entidade.razaoSocial}</p>
                </div>
              )}
              {licitacao.orgao_entidade?.cnpj && (
                <div>
                  <span className="text-sm text-gray-600">CNPJ:</span>
                  <p className="font-semibold">{licitacao.orgao_entidade.cnpj}</p>
                </div>
              )}
              {licitacao.unidade_orgao_completo?.nomeUnidade && (
                <div>
                  <span className="text-sm text-gray-600">Unidade:</span>
                  <p className="font-semibold">{licitacao.unidade_orgao_completo.nomeUnidade}</p>
                </div>
              )}
              {licitacao.usuario_nome && (
                <div>
                  <span className="text-sm text-gray-600">Responsável:</span>
                  <p className="font-semibold">{licitacao.usuario_nome}</p>
                </div>
              )}
            </div>
          </div>

          {/* Localização */}
          <div className="rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
               Localização
            </h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Estado:</span>
                <p className="font-semibold text-teal-700">
                  {licitacao.uf_nome} ({licitacao.uf_sigla})
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Município:</span>
                <p className="font-semibold">{licitacao.municipio_nome || 'Não informado'}</p>
              </div>
              {licitacao.unidade_orgao_completo?.codigoIbge && (
                <div>
                  <span className="text-sm text-gray-600">Código IBGE:</span>
                  <p className="font-semibold">{licitacao.unidade_orgao_completo.codigoIbge}</p>
                </div>
              )}
            </div>
          </div>

          {/* Valores e Status */}
          <div className="rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
               Valores e Status
            </h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Valor Total Estimado:</span>
                <p className="font-semibold text-yellow-700 text-lg">
                  {formatarValor(licitacao.valor_total_estimado)}
                </p>
              </div>
              {licitacao.valor_total_homologado && (
                <div>
                  <span className="text-sm text-gray-600">Valor Homologado:</span>
                  <p className="font-semibold text-green-700">
                    {formatarValor(licitacao.valor_total_homologado)}
                  </p>
                </div>
              )}
              <div>
                <span className="text-sm text-gray-600">Situação:</span>
                <p className="font-semibold">{licitacao.situacao_compra_nome || 'Não informado'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Objeto da Compra - Largura Total */}
      <div className="mt-6 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
           Objeto da Compra
        </h3>
        <p className="text-gray-800 leading-relaxed">
          {licitacao.objeto_compra}
        </p>
      </div>

      {/* Informações Complementares */}
      {(licitacao.informacao_complementar || licitacao.amparo_legal?.descricao) && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {licitacao.informacao_complementar && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3"> Informações Complementares</h3>
              <p className="text-gray-800 text-sm leading-relaxed">
                {licitacao.informacao_complementar}
              </p>
            </div>
          )}

          {licitacao.amparo_legal?.descricao && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3"> Amparo Legal</h3>
              <div className="space-y-1">
                <p className="font-semibold text-sm">{licitacao.amparo_legal.nome}</p>
                <p className="text-gray-700 text-sm">{licitacao.amparo_legal.descricao}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Links */}
      {(licitacao.link_sistema_origem || licitacao.link_processo_eletronico) && (
        <div className="mt-6 flex flex-wrap gap-4">
          {licitacao.link_sistema_origem && (
            <a 
              href={licitacao.link_sistema_origem}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
               Sistema de Origem
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
          
          {licitacao.link_processo_eletronico && (
            <a 
              href={licitacao.link_processo_eletronico}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
               Processo Eletrônico
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      )}
    </div>
  );
}