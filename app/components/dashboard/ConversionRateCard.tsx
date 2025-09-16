interface ConversionRateCardProps {
  matches: number;
  analise: number;
  aguardandoConfirmacao: number;
  enviada: number;
  vencida: number;
  perdida: number;
  loading?: boolean;
}

export default function ConversionRateCard({ 
  matches, 
  analise, 
  aguardandoConfirmacao, 
  enviada, 
  vencida, 
  perdida,
  loading = false 
}: ConversionRateCardProps) {
  const finalizadas = vencida + perdida;
  const conversaoRate = matches > 0 ? Math.round((finalizadas / matches) * 100) : 0;
  const progressoRate = matches > 0 ? Math.round((finalizadas / matches) * 100) : 0;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-10 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-2 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#333333] mb-2">Taxa de Conversão</h2>
        <p className="text-gray-600">Matches convertidos em eventos públicos</p>
      </div>
      
      <div className="mb-6">
        <div className="text-4xl font-bold text-[#333333] mb-4">{conversaoRate}%</div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Progresso</span>
            <span className="text-sm text-gray-600">{finalizadas} de {matches} Matches</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden relative">
            {/* Barra de progresso com gradiente */}
            <div 
              className="h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
              style={{ width: `${progressoRate}%` }}
            >
              {/* Gradiente com cores da Alicit */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF5000] via-[#FF7000] to-[#FF9900]"></div>
              
              {/* Efeito de brilho animado */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
              
              {/* Sombra interna para profundidade */}
              <div className="absolute inset-0 shadow-inner"></div>
            </div>
            
            {/* Efeito de brilho sutil na barra vazia quando 0% */}
            {progressoRate === 0 && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-20 animate-pulse"></div>
            )}
          </div>
          
          {/* Indicador de porcentagem */}
          <div className="flex justify-center mt-2">
            <span className={`text-xs font-medium px-3 py-1 rounded-full transition-all duration-300 ${
              progressoRate > 0 
                ? 'text-white bg-gradient-to-r from-[#FF5000] to-[#FF9900] shadow-md' 
                : 'text-gray-500 bg-gray-100'
            }`}>
              {progressoRate}% convertido
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-5 gap-4">
        <div className="text-center">
          <div className="text-lg font-bold text-[#333333]">{matches}</div>
          <div className="text-xs text-gray-600">Matches</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-[#333333]">{analise}</div>
          <div className="text-xs text-gray-600">Em análise</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-[#333333]">{aguardandoConfirmacao}</div>
          <div className="text-xs text-gray-600">Aguard. Conf.</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-[#333333]">{enviada}</div>
          <div className="text-xs text-gray-600">Enviadas</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-[#333333]">{finalizadas}</div>
          <div className="text-xs text-gray-600">Finalizadas</div>
        </div>
      </div>
    </div>
  );
}
