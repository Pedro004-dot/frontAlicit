import { useState, useCallback } from 'react';
import { LicitacaoEmpresa } from '../types/licitacao';

interface AnaliseModalState {
  isOpen: boolean;
  licitacao: LicitacaoEmpresa | null;
}

interface UseAnaliseModalsReturn {
  analiseIniciadaModal: AnaliseModalState;
  analiseFinalizadaModal: AnaliseModalState;
  abrirModalIniciada: (licitacao: LicitacaoEmpresa) => void;
  fecharModalIniciada: () => void;
  abrirModalFinalizada: (licitacao: LicitacaoEmpresa) => void;
  fecharModalFinalizada: () => void;
  fecharTodosModais: () => void;
}

export function useAnaliseModals(): UseAnaliseModalsReturn {
  const [analiseIniciadaModal, setAnaliseIniciadaModal] = useState<AnaliseModalState>({
    isOpen: false,
    licitacao: null
  });

  const [analiseFinalizadaModal, setAnaliseFinalizadaModal] = useState<AnaliseModalState>({
    isOpen: false,
    licitacao: null
  });

  const abrirModalIniciada = useCallback((licitacao: LicitacaoEmpresa) => {
    setAnaliseIniciadaModal({ isOpen: true, licitacao });
  }, []);

  const fecharModalIniciada = useCallback(() => {
    setAnaliseIniciadaModal({ isOpen: false, licitacao: null });
  }, []);

  const abrirModalFinalizada = useCallback((licitacao: LicitacaoEmpresa) => {
    setAnaliseFinalizadaModal({ isOpen: true, licitacao });
  }, []);

  const fecharModalFinalizada = useCallback(() => {
    setAnaliseFinalizadaModal({ isOpen: false, licitacao: null });
  }, []);

  const fecharTodosModais = useCallback(() => {
    setAnaliseIniciadaModal({ isOpen: false, licitacao: null });
    setAnaliseFinalizadaModal({ isOpen: false, licitacao: null });
  }, []);

  return {
    analiseIniciadaModal,
    analiseFinalizadaModal,
    abrirModalIniciada,
    fecharModalIniciada,
    abrirModalFinalizada,
    fecharModalFinalizada,
    fecharTodosModais
  };
}
