'use client';

import { useState } from 'react';

interface ItemLicitacao {
  id?: string;
  numero_item: number;
  descricao: string;
  material_ou_servico?: string;
  material_ou_servico_nome?: string;
  item_categoria_nome?: string;
  valor_unitario_estimado?: number;
  valor_total?: number;
  quantidade?: number;
  unidade_medida?: string;
  criterio_julgamento_nome?: string;
  situacao_compra_item_nome?: string;
  ncm_nbs_codigo?: string;
  ncm_nbs_descricao?: string;
  orcamento_sigiloso?: boolean;
  incentivo_produtivo_basico?: boolean;
  exigencia_conteudo_nacional?: boolean;
}

interface ItensLicitacaoProps {
  itens: ItemLicitacao[];
  valorTotalLicitacao?: number;
}

export default function ItensLicitacao({ itens, valorTotalLicitacao }: ItensLicitacaoProps) {
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  if (!itens || itens.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
           Itens da Licitação
        </h2>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-3"></div>
          <p>Nenhum item encontrado para esta licitação</p>
        </div>
      </div>
    );
  }

  const formatarValor = (valor?: number) => {
    if (!valor) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarQuantidade = (quantidade?: number, unidade?: string) => {
    if (!quantidade) return 'Não informado';
    const qtd = new Intl.NumberFormat('pt-BR').format(quantidade);
    return unidade ? `${qtd} ${unidade}` : qtd;
  };

  const itensParaExibir = showAll ? itens : itens.slice(0, 5);
  const valorTotalItens = itens.reduce((total, item) => total + (item.valor_total || 0), 0);

  const toggleExpandItem = (index: number) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
           Itens da Licitação
          <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded">
            {itens.length}
          </span>
        </h2>
        
        {valorTotalLicitacao && (
          <div className="text-right">
            <p className="text-sm text-gray-600">Valor Total Estimado</p>
            <p className="text-lg font-bold text-green-600">
              {formatarValor(valorTotalLicitacao)}
            </p>
          </div>
        )}
      </div>

      {/* Lista de Itens */}
      <div className="space-y-4">
        {itensParaExibir.map((item, index) => (
          <div key={item.id || index} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Header do Item */}
            <div 
              className="bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => toggleExpandItem(index)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-blue-500 text-white text-sm font-semibold px-2 py-1 rounded">
                      Item {item.numero_item}
                    </span>
                    
                    {item.orcamento_sigiloso && (
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                         Sigiloso
                      </span>
                    )}
                    
                    {item.exigencia_conteudo_nacional && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                         Conteúdo Nacional
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                    {item.descricao}
                  </h3>
                  
                  {item.item_categoria_nome && (
                    <p className="text-sm text-gray-600 mb-2">
                       {item.item_categoria_nome}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Quantidade</p>
                    <p className="font-semibold">
                      {formatarQuantidade(item.quantidade, item.unidade_medida)}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Valor Total</p>
                    <p className="font-semibold text-green-600">
                      {formatarValor(item.valor_total)}
                    </p>
                  </div>
                  
                  <div className="text-gray-400">
                    {expandedItem === index ? '▼' : '▶'}
                  </div>
                </div>
              </div>
            </div>

            {/* Detalhes Expandidos */}
            {expandedItem === index && (
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2"> Valores</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-600">Unitário:</span> {formatarValor(item.valor_unitario_estimado)}</p>
                      <p><span className="text-gray-600">Total:</span> {formatarValor(item.valor_total)}</p>
                    </div>
                  </div>

                  {(item.material_ou_servico_nome || item.criterio_julgamento_nome) && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2"> Classificação</h4>
                      <div className="space-y-1 text-sm">
                        {item.material_ou_servico_nome && (
                          <p><span className="text-gray-600">Tipo:</span> {item.material_ou_servico_nome}</p>
                        )}
                        {item.criterio_julgamento_nome && (
                          <p><span className="text-gray-600">Julgamento:</span> {item.criterio_julgamento_nome}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {(item.ncm_nbs_codigo || item.situacao_compra_item_nome) && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2"> Identificação</h4>
                      <div className="space-y-1 text-sm">
                        {item.ncm_nbs_codigo && (
                          <p><span className="text-gray-600">NCM:</span> {item.ncm_nbs_codigo}</p>
                        )}
                        {item.situacao_compra_item_nome && (
                          <p><span className="text-gray-600">Status:</span> {item.situacao_compra_item_nome}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {item.ncm_nbs_descricao && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="font-medium text-gray-700 mb-2"> Descrição NCM</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.ncm_nbs_descricao}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Controles de Paginação */}
      {itens.length > 5 && (
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {showAll ? `Mostrar menos` : `Ver todos os ${itens.length} itens`}
          </button>
          
          {valorTotalItens > 0 && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Total dos Itens Exibidos</p>
              <p className="text-lg font-bold text-green-600">
                {formatarValor(valorTotalItens)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}