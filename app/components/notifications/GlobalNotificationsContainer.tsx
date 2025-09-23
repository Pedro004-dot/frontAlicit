'use client';

import { useGlobalNotifications } from '../../hooks/useGlobalNotifications';
import GlobalAnaliseNotification from './GlobalAnaliseNotification';

/**
 * ✅ Container global para todas as notificações
 * 
 * Este componente deve ser renderizado no layout principal
 * para que as notificações apareçam em todas as páginas
 */
export default function GlobalNotificationsContainer() {
  const { notificacoes, fecharNotificacao, navegarParaAnalise } = useGlobalNotifications();

  return (
    <div className="fixed top-0 right-0 z-50 p-4 pointer-events-none">
      <div className="space-y-4">
        {notificacoes.map((notificacao) => (
          <div key={notificacao.id} className="pointer-events-auto">
            <GlobalAnaliseNotification
              notificacao={notificacao}
              onFechar={fecharNotificacao}
              onVerAnalise={navegarParaAnalise}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

