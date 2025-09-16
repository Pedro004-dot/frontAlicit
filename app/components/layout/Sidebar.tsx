'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { authUtils } from '../../lib/authUtils';
import { empresaService } from '../../lib/empresaService';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
}


const menuItems = [
  {
    name: 'Home',
    path: '/home',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  {
    name: 'Licitações',
    path: '/licitacoes',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    name: 'Minhas Licitações',
    path: '/minhas-licitacoes',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    name: 'Configurações da Empresa',
    path: '/empresas/configuracoes',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
];

export default function Sidebar({ isOpen, onClose, isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [selectedCnpj, setSelectedCnpj] = useState<string>('');
  const [empresas, setEmpresas] = useState<any[]>([]);

  useEffect(() => {
    const loadEmpresas = async () => {
      try {
        // ✅ Buscar empresas diretamente do banco de dados
        const empresasList = await empresaService.getMinhasEmpresas();
        console.log('🏢 Empresas carregadas do banco:', empresasList);
        
        // Mapear para formato esperado pela sidebar
        const empresasFormatted = empresasList.map(emp => ({
          id_empresa: emp.id_empresa,
          nome: emp.nome,
          cnpj: emp.cnpj
        }));
        
        setEmpresas(empresasFormatted);
        
        // Manter empresa selecionada do localStorage
        const userData = authUtils.getUserData();
        if (userData?.empresaId) {
          setSelectedCnpj(userData.empresaId);
        }
      } catch (error) {
        console.error('❌ Erro ao carregar empresas:', error);
        
        // Fallback: usar localStorage se API falhar
        const userData = authUtils.getUserData();
        if (userData) {
          setEmpresas(userData.empresas || []);
          setSelectedCnpj(userData.empresaId || '');
        }
      }
    };

    // Carregar inicialmente
    loadEmpresas();

    // ✅ Escutar eventos de mudança na lista de empresas
    const handleEmpresaListChanged = () => {
      console.log('📡 Sidebar recebeu evento: empresaListChanged');
      loadEmpresas();
    };

    window.addEventListener('empresaListChanged', handleEmpresaListChanged);
    
    // Cleanup
    return () => {
      window.removeEventListener('empresaListChanged', handleEmpresaListChanged);
    };
  }, []);

  const handleEmpresaChange = (cnpj: string) => {
    setSelectedCnpj(cnpj);
    // Atualizar localStorage
    authUtils.updateSelectedEmpresa(cnpj);
    
    // Disparar evento para notificar outras páginas
    window.dispatchEvent(new CustomEvent('empresaChanged'));
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
         className={`fixed top-0 left-0 h-full bg-[#FF7000] z-30 transform transition-all duration-300 ease-in-out 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0
          shadow-lg rounded-r-4xl`}
        style={{ width: isCollapsed ? '105px' : '280px' }}
      >
        <div className="flex flex-col h-full p-6">
          {/* Header com Logo e Toggle */}
          <div className="flex items-center justify-between mb-8">
            <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : ''}`}>
              <h1 className="text-white font-bold text-2xl font-sans">Alicit</h1>
            </div>
            {!isCollapsed && (
              <button
                onClick={onToggle}
                className="hidden lg:block p-2 rounded-lg text-white hover:bg-white hover:bg-opacity-20 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            {isCollapsed && (
              <button
                onClick={onToggle}
                className="hidden lg:block absolute top-6 right-[-12px] p-2 bg-[#F78F20] rounded-full text-white hover:bg-[#F57000] transition-colors duration-200 shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Seletor de Empresa */}
          {!isCollapsed && (
            <div className="mb-8">
              <label className="block text-white text-lg font-bold mb-3 font-sans">
                Empresa
              </label>
              <div className="space-y-3">
                <select 
                  value={selectedCnpj}
                  onChange={(e) => handleEmpresaChange(e.target.value)}
                  className="w-full px-4 py-4 bg-[#FDD29B] text-white rounded-full border-none focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 font-sans font-bold shadow-lg hover:bg-[#FEE4B8] transition-all duration-300"
                >
                  {empresas.map((empresa) => (
                    <option key={empresa.id_empresa} value={empresa.cnpj} className="text-[#333333] font-sans font-bold">
                      {empresa.nome}
                    </option>
                  ))}
                </select>
                
                <Link 
                  href="/empresas/criar"
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-white text-[#FF7000] rounded-full font-sans font-bold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Nova Empresa</span>
                </Link>
              </div>
            </div>
          )}

          {/* Navigation Menu */}
          <nav className="flex-1">
            <ul className="space-y-4">
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          onClose();
                        }
                      }}
                      className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-4'} px-6 py-4 transition-all duration-300 group relative
                        ${isActive 
                          ? 'bg-[#FDD29B] text-white rounded-full shadow-lg' 
                          : 'text-white hover:bg-[#FDD29B] hover:text-white rounded-full'
                        }`}
                      title={isCollapsed ? item.name : ''}
                    >
                      <span className={`transition-all duration-300 ${isActive ? 'text-white' : 'text-white group-hover:text-white'}`}>
                        {item.icon}
                      </span>
                      {!isCollapsed && (
                        <span className={`font-sans font-bold text-base transition-all duration-300 ${isActive ? 'text-white' : 'text-white group-hover:text-white'}`}>
                          {item.name}
                        </span>
                      )}
                      {isCollapsed && (
                        <div className="absolute left-full ml-3 px-3 py-2 bg-[#333333] text-white text-sm font-sans font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 shadow-lg">
                          {item.name}
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Info / Logout */}
          <div className="mt-auto pt-6">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-20 mb-6"></div>
            
            {/* User Info */}
            {/* <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 mb-4`}>
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              {!isCollapsed && (
                <span className="text-white font-sans font-bold text-sm">Pedro Torresani</span>
              )}
            </div>
             */}
            {/* Logout Button */}
            <button 
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-4'} px-6 py-4 w-full rounded-full text-white hover:bg-[#FDD29B] hover:text-white hover:shadow-lg transition-all duration-300 group relative`}
              title={isCollapsed ? 'Sair' : ''}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {!isCollapsed && (
                <span className="font-sans font-bold text-lg">Sair</span>
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-3 py-2 bg-[#333333] text-white text-base font-sans font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 shadow-lg">
                  Sair
                </div>
              )}
            </button>
            
          </div>
        </div>
      </div>
    </>
  );
}