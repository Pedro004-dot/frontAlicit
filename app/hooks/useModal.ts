'use client';

import { useState } from 'react';

interface ModalConfig {
  title: string;
  message: string;
  type?: 'confirm' | 'alert' | 'success' | 'error';
  confirmText?: string;
  cancelText?: string;
}

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ModalConfig>({
    title: '',
    message: '',
    type: 'alert'
  });
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

  const showModal = (modalConfig: ModalConfig): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfig(modalConfig);
      setIsOpen(true);
      setResolvePromise(() => resolve);
    });
  };

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'alert' = 'alert') => {
    return showModal({
      title,
      message,
      type
    });
  };

  const showConfirm = (title: string, message: string, confirmText?: string, cancelText?: string) => {
    return showModal({
      title,
      message,
      type: 'confirm',
      confirmText,
      cancelText
    });
  };

  const closeModal = () => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(false);
      setResolvePromise(null);
    }
  };

  const confirmModal = () => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(true);
      setResolvePromise(null);
    }
  };

  return {
    isOpen,
    config,
    showModal,
    showAlert,
    showConfirm,
    closeModal,
    confirmModal
  };
};