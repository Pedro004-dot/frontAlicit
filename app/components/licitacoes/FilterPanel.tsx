'use client';

import { useState } from 'react';
import Button from '../ui/Button';

export interface FilterOptions {
  valorMinimo: string;
  valorMaximo: string;
  valorMinimoUnitario: string;
  valorMaximoUnitario: string;
  cidade_radar: string;
  raioDistancia: string;
}

interface FilterPanelProps {
  onApplyFilters: (filters: FilterOptions) => void;
  loading?: boolean;
}

export default function FilterPanel({ onApplyFilters, loading = false }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    valorMinimo: '',
    valorMaximo: '',
    valorMinimoUnitario: '',
    valorMaximoUnitario: '',
    cidade_radar: '',
    raioDistancia: ''
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
      valorMinimo: '',
      valorMaximo: '',
      valorMinimoUnitario: '',
      valorMaximoUnitario: '',
      cidade_radar: '',
      raioDistancia: ''
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Seção Valor Total */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#333333] border-b pb-1">Valor Total da Licitação</h3>
              
              {/* Valor Mínimo */}
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-2">
                  Valor Mínimo (R$)
                </label>
                <input
                  type="number"
                  value={filters.valorMinimo}
                  onChange={(e) => handleFilterChange('valorMinimo', e.target.value)}
                  placeholder="Ex: 10.000"
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
                  placeholder="Ex: 1.000.000"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5000] focus:border-transparent"
                />
              </div>
            </div>

            {/* Seção Valor Unitário */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#333333] border-b pb-1">Valor Unitário dos Itens</h3>
              
              {/* Valor Mínimo Unitário */}
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-2">
                  Valor Mínimo (R$)
                </label>
                <input
                  type="number"
                  value={filters.valorMinimoUnitario}
                  onChange={(e) => handleFilterChange('valorMinimoUnitario', e.target.value)}
                  placeholder="Ex: 100"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5000] focus:border-transparent"
                />
              </div>

              {/* Valor Máximo Unitário */}
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-2">
                  Valor Máximo (R$)
                </label>
                <input
                  type="number"
                  value={filters.valorMaximoUnitario}
                  onChange={(e) => handleFilterChange('valorMaximoUnitario', e.target.value)}
                  placeholder="Ex: 5.000"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5000] focus:border-transparent"
                />
              </div>
            </div>

            {/* Seção Localização */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#333333] border-b pb-1">Filtros Geográficos</h3>
              
              {/* Cidade Radar */}
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-2">
                  Cidade de Referência
                </label>
                <input
                  type="text"
                  value={filters.cidade_radar}
                  onChange={(e) => handleFilterChange('cidade_radar', e.target.value)}
                  placeholder="Ex: São Paulo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5000] focus:border-transparent"
                />
              </div>

              {/* Raio Distância */}
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-2">
                  Raio de Distância (km)
                </label>
                <input
                  type="number"
                  value={filters.raioDistancia}
                  onChange={(e) => handleFilterChange('raioDistancia', e.target.value)}
                  placeholder="Ex: 50"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5000] focus:border-transparent"
                />
              </div>
            </div>
          </div>
          <span className="text-sm text-gray-500">* Coloque o nome da cidade corretamente para que o filtro funcione corretamente</span>

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