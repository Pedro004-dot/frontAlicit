export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;  // ✅ Backend retorna number
    email: string;
    nome: string;
    empresas?: Array<{
      id_empresa: string;  // ✅ Campo correto do backend
      nome: string;
      cnpj: string;
    }>;
  };
}

export interface AuthError {
  error: string;
}