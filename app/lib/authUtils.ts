export interface Empresa {
  id: string;
  nome: string;
  cnpj: string;
  razaoSocial: string;
  endereco: string;
  email: string;
  telefone: string;
  cep: string;
  cidade: string;
  cidadeRadar: string;
  raioDistancia: number;
  agencia: string;
  numeroConta: string;
  nomeTitular: string;
  palavrasChave: string;
  descricao: string;
  produtoServico: string;
  dadosBancarios: DadosBancarios;
  documentos: Documento[];
  produtos: string[];
  servicos: string[];
  porte: string;
  responsavelLegal: string;
  createdAt: string;
  updatedAt: string;
}

export interface DadosBancarios {
  agencia: string;
  numeroConta: string;
  nomeTitular: string;
}

export interface Documento {
  nomeDocumento: string;
  dataExpiracao: string;
  arquivo: File;
}

export interface UserData {
  userId: string;
  empresaId: string | null;
  role: 'consultor' | 'admin';
  token: string;
  empresas?: Empresa[];
}

// ✅ Importar tipos existentes
import { LoginRequest, LoginResponse } from '../types/auth';

export const authUtils = {
  // ✅ Método de login
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erro na requisição' }));
      throw new Error(error.error || 'Erro ao fazer login');
    }

    return response.json();
  },
  setToken: (userData: UserData) => {
    console.log('authUtils.setToken chamado com:', userData);
    try {
      localStorage.setItem('authToken', userData.token);
      localStorage.setItem('userData', JSON.stringify({
        userId: userData.userId,
        empresaId: userData.empresaId,
        role: userData.role,
        empresas: userData.empresas || []
      }));
      console.log('Token salvo com sucesso no localStorage');
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  },

  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  },

  getUserData: (): Omit<UserData, 'token'> | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  },

  clearAuth: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  },

  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('authToken');
  },

  isAdmin: (): boolean => {
    const userData = authUtils.getUserData();
    return userData?.role === 'admin';
  },

  updateSelectedEmpresa: (cnpj: string): void => {
    if (typeof window === 'undefined') return;
    const userData = authUtils.getUserData();
    if (userData) {
      localStorage.setItem('userData', JSON.stringify({
        ...userData,
        empresaId: cnpj
      }));
    }
  },

  getSelectedEmpresaCnpj: (): string | null => {
    const userData = authUtils.getUserData();
    return userData?.empresaId || null;
  },

  // ✅ Método simples para obter CNPJ da empresa selecionada
  getSelectedEmpresaCnpjSimples: (): string | null => {
    const userData = authUtils.getUserData();
    return userData?.empresaId || null;
  },

  getSelectedEmpresa: (): Empresa | null => {
    const userData = authUtils.getUserData();
    if (!userData || !userData.empresas || !userData.empresaId) return null;
    
    return userData.empresas.find(emp => emp.cnpj === userData.empresaId) || null;
  },

  getAllEmpresas: (): Empresa[] => {
    const userData = authUtils.getUserData();
    return userData?.empresas || [];
  },

  // ✅ Função para decodificar JWT (sem verificar assinatura - apenas para leitura)
  decodeJWT: (): any => {
    const token = authUtils.getToken();
    return authUtils.decodeJWTFromToken(token);
  },
  
  // ✅ Função auxiliar para decodificar qualquer token JWT
  decodeJWTFromToken: (token: string | null): any => {
    if (!token) return null;
    
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Erro ao decodificar JWT:', error);
      return null;
    }
  },

  // ✅ Verificar se o token JWT está expirado
  isTokenExpired: (): boolean => {
    const decoded = authUtils.decodeJWT();
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  }
};