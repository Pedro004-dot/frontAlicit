'use client';

import { useState, useEffect } from 'react';

interface BiData {
  totalLicitacoes: number;
  valorTotalEstimado: number;
}

export function useBi() {
  const [biData, setBiData] = useState<BiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBiData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar dados gerais do Brasil (sem filtros) via modalidades
        const response = await fetch('http://localhost:8080/bi/modalidades');
        
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Usar dados do Brasil
        const brasilData = data.geral?.Brasil;
        if (brasilData) {
          setBiData({
            totalLicitacoes: brasilData.total,
            valorTotalEstimado: brasilData.valor_total
          });
        } else {
          // Fallback: usar seção 'geral' por modalidades
          const modalidadesGeral = Object.values(data.geral || {});
          const totalLicitacoes = modalidadesGeral.reduce((sum: number, item: any) => sum + (item.total || 0), 0);
          const valorTotalEstimado = modalidadesGeral.reduce((sum: number, item: any) => sum + ((item.valor_medio || 0) * (item.total || 0)), 0);
          
          setBiData({
            totalLicitacoes,
            valorTotalEstimado
          });
        }

      } catch (err) {
        console.error('Erro ao buscar dados BI:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchBiData();
  }, []);

  return { biData, loading, error };
}