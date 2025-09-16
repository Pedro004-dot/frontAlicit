'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { authUtils, UserData } from '../../lib/authUtils';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !senha) {
      setError('Email e senha são obrigatórios');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor, insira um email válido');
      return;
    }

    setLoading(true);

    try {
      console.log('Iniciando login...');
      console.log('URL sendo usada:', process.env.NEXT_PUBLIC_API_URL || 'https://alicit-backend-production-ffcd.up.railway.app');
      console.log('Dados sendo enviados:', { email, senha });
      
      const response = await authUtils.login({ email, senha });
      console.log('Login response:', response);
      
      // Salvar dados sem definir empresa padrão (usuário vai selecionar)
      const tokenData: UserData = {
        userId: response.user.id.toString(),
        empresaId: null, // Não definir empresa padrão
        role: 'consultor' as const,
        token: response.token,
        empresas: (response.user.empresas || []).map(emp => ({
          id: emp.id_empresa,
          nome: emp.nome,
          cnpj: emp.cnpj,
          // Campos obrigatórios da interface Empresa (valores temporários)
          razaoSocial: '',
          endereco: '',
          email: '',
          telefone: '',
          cep: '',
          cidade: '',
          cidadeRadar: '',
          raioDistancia: 0,
          agencia: '',
          numeroConta: '',
          nomeTitular: '',
          palavrasChave: '',
          descricao: '',
          produtoServico: '',
          dadosBancarios: { agencia: '', numeroConta: '', nomeTitular: '' },
          documentos: [],
          produtos: [],
          servicos: [],
          porte: '',
          responsavelLegal: '',
          createdAt: '',
          updatedAt: ''
        }))
      };
      
      console.log('Salvando token data:', tokenData);
      authUtils.setToken(tokenData);
      
      console.log('Token salvo, verificando localStorage...');
      console.log('authToken:', localStorage.getItem('authToken'));
      console.log('userData:', localStorage.getItem('userData'));
      
      console.log('Redirecionando para /home...');
      // Recarregar página para garantir dados atualizados
      window.location.href = '/home';
    } catch (err: any) {
      console.error('Erro no login:', err);
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="seu@email.com"
        required
      />
      
      <Input
        label="Senha"
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        placeholder="Sua senha"
        required
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="mt-6"
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  );
}