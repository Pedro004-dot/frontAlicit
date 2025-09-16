Alicit
Objetivo plataforma: Nossos consultores usarem a plataforma para tiverem a maxima producao em encontrar , analisar e particpar de licitacoes publicas

Nossa empresa tenha uma proposta de fazer uma ai full company e para isso vamos começar fazendo uma empresa que tenha o operacional o mais automatizado possivel visando a maxima produção do usuario. O nosso backend faz um processo muito bem feito a buscas sao automatizadas, as analises tambem e a proposta tambem. Agora o nosso frontend precisa acompanhar essa proposta de maxima produtividade, precisamos construir uma plataforma em que a experiencia do usuario seja a mais fluida possivel visando produtividade. 

Detalhes da empresa

CORES DO SOFTWARE
#FF5000
#FF7000
#FF9900
#FFA400
#FFFFFF
#333333

Tipografia
Montserrat
Montserrat Bold
AaBbCcDdEeFfGg
Uso: Títulos principais e destaques
Montserrat Medium
AaBbCcDdEeFfGg
Uso: Subtítulos e destaques secundários
Montserrat Regular
AaBbCcDdEeFfGg
Uso: Corpo de texto e conteúdo geral



Esse é o guia do nosso frontend
Tela 1 ->Login 
Teremos uma pagina de login com email e senha e a logo da nossa empresa 
Tela 2 -> Home
OBjetivo: Visualização rápida para o usuario
Vamos ter nossa sideBar, Essa pagina é mais de dashboards. Vamos ter essa estrutura:
"Dashboard"
"Dados rapidos sobre suas licitações"
3 cards para o consultor ter uma visão dos dados da empresa
1 - Total de matches 2 - Em Analise 3 - Em Proposta

Tela 3 -> Licitações 
Objetivo: O usuario vai poder buscar novas licitações
Sidebar, Vamos ter um input grande para o usuario poder inserir as palavras chaves que ele buscar
Embaixo do input vao ter as recomendações de licitação para a empresa 
E as licitações, vão aparecer em um card e geralmente um card por linha 
Quando o usuario apertar no card, vai abrir um modal com os dados da licitação
Entao o layout seria
Estrutura pagina
Licitacoes 
          input
          filtros

Recomendações 
Card de licitação- ESTRUTURA

Estrutura do card
Id edital  - cidade
Orgao , valor  Data arbetura - data fechamento
Objeto

Estrutura do modal
Id 
Orgao          data inical
               data fechamento
Objeto
Itens
                Aprovar licitação
                [SIM]        [NAO]

Tela 4 -> Minhas licitações 
Objetivo: O usuario vai poder gerir as licitações 
Nesta pagina precisamos da a oportunidadade do usuario gerenciar as licitações.
Layout pagina
Side bar
Input de busca licitações , busca as licitações salvas 
card de licitações com o estagio em que a licitação esta hoje
Destacadas com a cor do estagio 

Tela 5 -> Analise licitação (Essa pagina nao fica na side bar mas ela aparece quando o usuario aperta na licitação quando ela esta em minhas licitações)
Objetivo -> O usuario vai poder analisar toda a licitção aqui
Layout Pagina
Side bar 
Analise licitações 
Resumo tecnico | PDF preview
               |
               |      botaozinho pra abrir o chat da ia do documento


Side bar->
Vai ser um side bar lateral com as paginas para navegação Home, Licitações e Minhas licitações


FUNÇÕES BACKEND

  - CRUD empresa ✓
  - CRUD usuário ✓
  - buscar licitacao ✓
  - matche licitacao ✓
  - analisar um edital ✓
  - chat com edital ✓
  1. Relatórios
    - Gerar relatório PDF de análise de edital
    - Download de relatórios gerados
  2. Upload/Download de documentos
    - Upload de editais (PDF/ZIP)
    - Extração e processamento de documentos
  3. Geolocalização
    - Filtrar licitações por localização/distância
    - Buscar por coordenadas geográficas
  4. Filtros avançados
    - Filtro por valor (mínimo/máximo)
    - Filtro por região
    - Filtro por valor unitário
  5. Autenticação/Autorização
    - Login/logout de usuário
    - Gerenciamento de sessões
    - Controle de acesso
  6. Notificações
    - Alertas sobre novas licitações
    - Status de análises
  7. Dashboard/Analytics
    - Métricas de matching
    - Histórico de análises
    - Performance da empresa em licitações

