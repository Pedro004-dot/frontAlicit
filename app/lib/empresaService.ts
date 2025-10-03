import { apiClient } from "./api";

export interface ProdutoServico {
    id?: string;
    nome: string;
    descricao?: string;
    valor?: number;
    tipo: 'produto' | 'servico';
}

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
    produtosServicos?: ProdutoServico[];
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

// ✅ Interface para criação de empresa alinhada com o backend
export interface CreateEmpresaInput {
    nome: string;
    cnpj: string;
    razaoSocial: string;
    endereco: string;
    email: string;
    telefone: string;
    CEP: string;
    cidades?: string;
    cidadeRadar?: string;
    raioDistancia?: number;
    dadosBancarios: DadosBancarios;
    descricao: string;
    documentos?: Documento[];
    produtos?: string[];
    servicos?: string[];
    produtosServicos?: ProdutoServico[];
    porte?: string[];
    responsavelLegal?: string;
}

export const empresaService = {
    async getEmpresas(): Promise<Empresa[]> {
        // ✅ Usar resposta direta do apiClient (mais limpo)
        const response = await apiClient.get<Empresa[]>(`/empresa`);
        return response;
    },

    // ✅ Buscar empresas do usuário logado (banco de dados em tempo real)
    async getMinhasEmpresas(): Promise<Array<{id_empresa: string, nome: string, cnpj: string}>> {
        const response = await apiClient.get<{success: boolean, empresas: Array<{id_empresa: string, nome: string, cnpj: string}>}>('/user/me/empresas');
        return response.empresas;
    },
    
    async getEmpresaById(cnpj: string): Promise<Empresa> {
        const encodedCnpj = encodeURIComponent(cnpj);
        // ✅ Usar endpoint de busca completa por CNPJ
        const response = await apiClient.get<Empresa>(`/empresa/cnpj/${encodedCnpj}/completa`);
        return response;
    },
    
    async getEmpresaCompletaByCnpj(cnpj: string): Promise<Empresa> {
        // ✅ Buscar empresa completa por CNPJ
        const encodedCnpj = encodeURIComponent(cnpj);
        const response = await apiClient.get<Empresa>(`/empresa/cnpj/${encodedCnpj}/completa`);
        return response;
    },
    
    async updateEmpresaByCnpj(cnpj: string, empresaData: Partial<Empresa>): Promise<Empresa> {
        // ✅ Usar endpoint PUT simples por CNPJ
        const encodedCnpj = encodeURIComponent(cnpj);
        const response = await apiClient.put<Empresa>(`/empresa/${encodedCnpj}`, empresaData);
        return response;
    },
    
    async createEmpresa(empresaData: CreateEmpresaInput): Promise<Empresa> {
        // ✅ usuario_id agora é extraído do JWT no backend automaticamente
        const response = await apiClient.post<Empresa>('/empresa', empresaData);
        
        // ✅ Disparar evento para atualizar sidebar (que busca do banco automaticamente)
        window.dispatchEvent(new CustomEvent('empresaListChanged'));
        
        return response;
    }
};