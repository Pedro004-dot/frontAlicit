'use client';

import { DadosConcretos as DadosConcretosType } from '../../types/analise';

interface DadosConcretosProps {
  dados: DadosConcretosType;
}

export default function DadosConcretos({ dados }: DadosConcretosProps) {
  const formatarValor = (valor?: string) => {
    if (!valor) return 'Não informado';
    return valor.includes('R$') ? valor : `R$ ${valor}`;
  };

  const dadosParaExibir = [
    { label: 'Valor Estimado', valor: formatarValor(dados.valorEstimado), icone: '💰' },
    { label: 'Modalidade', valor: dados.modalidade || 'Não informado', icone: '📋' },
    { label: 'Órgão', valor: dados.orgao || 'Não informado', icone: '🏛️' },
    { label: 'Data de Abertura', valor: dados.dataAbertura || 'Não informado', icone: '📅' },
    { label: 'Prazo de Execução', valor: dados.prazoExecucao || 'Não informado', icone: '⏰' },
    { label: 'Local de Entrega', valor: dados.localEntrega || 'Não informado', icone: '📍' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        Dados Concretos da Licitação
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dadosParaExibir.map((item, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">

              <h3 className="font-medium text-gray-700">{item.label}</h3>
            </div>
            <p className="text-gray-900 font-semibold">
              {item.valor}
            </p>
          </div>
        ))}
      </div>

      {/* Objeto da licitação - seção separada por ser mais longo */}
      {dados.objeto && (
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium text-gray-700">Objeto da Licitação</h3>
          </div>
          <p className="text-gray-900 text-sm leading-relaxed">
            {dados.objeto}
          </p>
        </div>
      )}
    </div>
  );
}