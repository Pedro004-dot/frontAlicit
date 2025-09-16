'use client';

import { useState } from 'react';
import Button from '../ui/Button';

export interface FilterOptions {
  tipoLicitacao: string;
  valorMinimo: string;
  valorMaximo: string;
  dataInicio: string;
  dataFim: string;
  fonte: string;
}

interface FilterPanelProps {
  onApplyFilters: (filters: FilterOptions) => void;
  loading?: boolean;
}

export default function FilterPanel({ onApplyFilters, loading = false }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    tipoLicitacao: '',
    valorMinimo: '',
    valorMaximo: '',
    dataInicio: '',
    dataFim: '',
    fonte: ''
  });

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    const emptyFilters: FilterOptions = {
      tipoLicitacao: '',
      valorMinimo: '',
      valorMaximo: '',
      dataInicio: '',
      dataFim: '',
      fonte: ''
    };
    setFilters(emptyFilters);
    onApplyFilters(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value.trim() !== '');

  return (
    <div className="mb-6">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 text-[#FF5000] hover:text-[#FF7000] border border-[#FF5000] hover:border-[#FF7000] rounded-lg transition-colors duration-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
        </svg>
        <span>Filtros Avançados</span>
        {hasActiveFilters && (
          <span className="bg-[#FF5000] text-white text-xs px-2 py-1 rounded-full">
            Ativo
          </span>
        )}
        <svg className={`w-4 h-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="mt-4 p-6 bg-white rounded-lg border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Tipo de Licitação */}
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">
                Tipo de Licitação
              </label>
              <select
                value={filters.tipoLicitacao}
                onChange={(e) => handleFilterChange('tipoLicitacao', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5000] focus:border-transparent"
              >
                <option value="">Todos os tipos</option>
                <option value="pregao">Pregão</option>
                <option value="concorrencia">Concorrência</option>
                <option value="tomada_preco">Tomada de Preço</option>
                <option value="convite">Convite</option>
              </select>
            </div>

            {/* Valor Mínimo */}
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">
                Valor Mínimo (R$)
              </label>
              <input
                type="number"
                value={filters.valorMinimo}
                onChange={(e) => handleFilterChange('valorMinimo', e.target.value)}
                placeholder="Ex: 10000"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5000] focus:border-transparent"
              />
            </div>

            {/* Valor Máximo */}
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">
                Valor Máximo (R$)
              </label>
              <input
                type="number"
                value={filters.valorMaximo}
                onChange={(e) => handleFilterChange('valorMaximo', e.target.value)}
                placeholder="Ex: 1000000"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5000] focus:border-transparent"
              />
            </div>

            {/* Fonte */}
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">
                Fonte
              </label>
              <select
                value={filters.fonte}
                onChange={(e) => handleFilterChange('fonte', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5000] focus:border-transparent"
              >
                <option value="">Todas as fontes</option>
                <option value="pncp">PNCP</option>
                <option value="compras_net">Compras.net</option>
              </select>
            </div>

            {/* Data Início */}
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">
                Data Início
              </label>
              <input
                type="date"
                value={filters.dataInicio}
                onChange={(e) => handleFilterChange('dataInicio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5000] focus:border-transparent"
              />
            </div>

            {/* Data Fim */}
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">
                Data Fim
              </label>
              <input
                type="date"
                value={filters.dataFim}
                onChange={(e) => handleFilterChange('dataFim', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5000] focus:border-transparent"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleClearFilters}
              disabled={loading}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              Limpar
            </button>
            <Button
              onClick={handleApplyFilters}
              disabled={loading}
              className="px-6"
            >
              {loading ? 'Aplicando...' : 'Aplicar Filtros'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}