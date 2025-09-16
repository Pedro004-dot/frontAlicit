import { apiClient } from './api';
import { DashboardResponse, LicitacoesResponse } from '../types/dashboard';

class DashboardService {
  async getDashboardData(cnpj: string): Promise<DashboardResponse> {
    // Codificar o CNPJ para URL (substituir / por %2F)
    const cnpjEncoded = encodeURIComponent(cnpj);
    return apiClient.get<DashboardResponse>(`/licitacoes/${cnpjEncoded}/dashboard`);
  }

  async getLicitacoesComEstagios(cnpj: string): Promise<LicitacoesResponse> {
    // Codificar o CNPJ para URL (substituir / por %2F)
    const cnpjEncoded = encodeURIComponent(cnpj);
    return apiClient.get<LicitacoesResponse>(`/licitacoes/${cnpjEncoded}/estagios`);
  }
}

export default new DashboardService();