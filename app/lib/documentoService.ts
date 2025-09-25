import { apiClient } from "./api";

export interface Documento {
    id: string;
    nome_documento: string;
    data_vencimento: string;
    url_storage: string;
    status_documento: 'pendente' | 'aprovado' | 'rejeitado';
    created_at: string;
    updated_at: string;
}

export const documentoService = {
    async getDocumentosByEmpresa(empresaId: string): Promise<Documento[]> {
        const response = await apiClient.get<Documento[]>(`/empresa/${empresaId}/documentos`);
        return response;
    },

    async uploadDocumento(empresaId: string, nomeDocumento: string, dataExpiracao: string, arquivo: File): Promise<Documento> {
        const formData = new FormData();
        formData.append('nomeDocumento', nomeDocumento);
        formData.append('dataExpiracao', dataExpiracao);
        formData.append('arquivo', arquivo);

        const response = await apiClient.postFormData<Documento>(`/empresa/${empresaId}/documentos`, formData);
        return response;
    },

    async deleteDocumento(documentoId: string): Promise<{message: string}> {
        const response = await apiClient.delete<{message: string}>(`/empresa/documentos/${documentoId}`);
        return response;
    },

    async updateStatusDocumento(documentoId: string, status: string): Promise<Documento> {
        const response = await apiClient.put<Documento>(`/empresa/documentos/${documentoId}/status`, { status });
        return response;
    }
};