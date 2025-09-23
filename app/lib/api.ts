import { authUtils } from './authUtils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://alicit-backend-production-ffcd.up.railway.app';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // ✅ Verificar se o token existe e não está expirado
    const token = authUtils.getToken();
    if (token && !authUtils.isTokenExpired()) {
      headers.Authorization = `Bearer ${token}`;
    } else if (authUtils.isTokenExpired()) {
      // ✅ Token expirado - redirecionar para login
      console.warn('Token expirado. Redirecionando para login...');
      authUtils.clearAuth();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return headers;
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    console.log('Making request to:', `${this.baseUrl}${endpoint}`);
    console.log('Request data:', data);
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      // ✅ Tratar erro 401 apenas se for problema de token
      if (response.status === 401) {
        const error = await response.json().catch(() => ({ error: 'Erro na requisição' }));
        
        // Só remover token se for erro de autenticação/token
        if (error.error === 'Token não fornecido' || error.error === 'Token inválido' || error.error === 'Sessão expirada') {
          console.warn('Token rejeitado pelo servidor. Redirecionando para login...');
          authUtils.clearAuth();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          throw new Error('Sessão expirada');
        }
        
        // Para outros erros 401, não remover token
        throw new Error(error.error || 'Não autorizado');
      }
      
      const error = await response.json().catch(() => ({ error: 'Erro na requisição' }));
      console.log('Error response:', error);
      
      
      const customError = new Error(error.error || 'Erro na requisição');
      (customError as any).response = {
        status: response.status,
        data: error
      };
      throw customError;
    }

    const result = await response.json();
    console.log('Success response:', result);
    return result;
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    console.log('Making PUT request to:', `${this.baseUrl}${endpoint}`);
    console.log('Request data:', data);
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      // ✅ Tratar erro 401 apenas se for problema de token
      if (response.status === 401) {
        const error = await response.json().catch(() => ({ error: 'Erro na requisição' }));
        
        // Só remover token se for erro de autenticação/token
        if (error.error === 'Token não fornecido' || error.error === 'Token inválido' || error.error === 'Sessão expirada') {
          console.warn('Token rejeitado pelo servidor. Redirecionando para login...');
          authUtils.clearAuth();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          throw new Error('Sessão expirada');
        }
        
        // Para outros erros 401, não remover token
        throw new Error(error.error || 'Não autorizado');
      }
      
      const error = await response.json().catch(() => ({ error: 'Erro na requisição' }));
      console.log('Error response:', error);
      
      // ✅ NOVO: Criar erro que preserva a resposta completa
      const customError = new Error(error.error || 'Erro na requisição');
      (customError as any).response = {
        status: response.status,
        data: error
      };
      throw customError;
    }

    const result = await response.json();
    console.log('Success response:', result);
    return result;
  }

  async get<T>(endpoint: string): Promise<T> {
    console.log('Making GET request to:', `${this.baseUrl}${endpoint}`);

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      // ✅ Tratar erro 401 apenas se for problema de token - GET  
      if (response.status === 401) {
        const error = await response.json().catch(() => ({ error: 'Erro na requisição' }));
        
        // Só remover token se for erro de autenticação/token
        if (error.error === 'Token não fornecido' || error.error === 'Token inválido' || error.error === 'Sessão expirada') {
          console.warn('Token rejeitado pelo servidor. Redirecionando para login...');
          authUtils.clearAuth();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          throw new Error('Sessão expirada');
        }
        
        // Para outros erros 401, não remover token
        throw new Error(error.error || 'Não autorizado');
      }
      
      const error = await response.json().catch(() => ({ error: 'Erro na requisição' }));
      throw new Error(error.error || 'Erro na requisição');
    }

    return response.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    console.log('Making DELETE request to:', `${this.baseUrl}${endpoint}`);

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        const error = await response.json().catch(() => ({ error: 'Erro na requisição' }));
        
        if (error.error === 'Token não fornecido' || error.error === 'Token inválido' || error.error === 'Sessão expirada') {
          console.warn('Token rejeitado pelo servidor. Redirecionando para login...');
          authUtils.clearAuth();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          throw new Error('Sessão expirada');
        }
        
        throw new Error(error.error || 'Não autorizado');
      }
      
      const error = await response.json();
      throw new Error(error.error || 'Erro na requisição');
    }

    return response.json();
  }

  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    console.log('Making FormData POST request to:', `${this.baseUrl}${endpoint}`);
    
    const headers: HeadersInit = {};
    
    const token = authUtils.getToken();
    if (token && !authUtils.isTokenExpired()) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401) {
        const error = await response.json().catch(() => ({ error: 'Erro na requisição' }));
        
        if (error.error === 'Token não fornecido' || error.error === 'Token inválido' || error.error === 'Sessão expirada') {
          console.warn('Token rejeitado pelo servidor. Redirecionando para login...');
          authUtils.clearAuth();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          throw new Error('Sessão expirada');
        }
        
        throw new Error(error.error || 'Não autorizado');
      }
      
      const error = await response.json().catch(() => ({ error: 'Erro na requisição' }));
      throw new Error(error.error || 'Erro na requisição');
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();

// Export compatível com o código existente
export const api = apiClient;