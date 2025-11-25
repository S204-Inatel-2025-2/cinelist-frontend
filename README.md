# CineList

> **Acesse o projeto online:** [CineList](https://mycinelist.vercel.app/home)

O **CineList** é uma aplicação Full Stack interativa para organizar, avaliar e descobrir mídias (filmes, séries e animes). O projeto consome uma API RESTful dedicada, oferecendo funcionalidades sociais e de gerenciamento de catálogo personalizadas.

---

## Funcionalidades

### Autenticação e Conta
* **Login e Cadastro:** Autenticação segura via JWT (JSON Web Tokens).
* **Gestão de Perfil:** Atualização de avatar, alteração de nome de usuário e exclusão definitiva de conta.

### Catálogo e Descoberta
* **Busca Unificada:** Pesquisa integrada filtrando por Filmes, Séries ou Animes.
* **Dados Ricos:** Integração (via Backend) para exibir sinopses, elenco, notas e datas de lançamento.
* **Carrosséis:** Exibição de mídias populares e tendências.

### Listas e Avaliações
* **Listas Personalizadas:** Criação de múltiplas listas (ex: "Para Assistir", "Já Vistos"), com adição e remoção dinâmica de itens.
* **Sistema de Reviews:** Avaliação com nota (0-10) e comentários textuais.
* **Edição:** Funcionalidade completa para editar ou remover avaliações anteriores.

### Social
* **Comunidade:** Visualização de perfis de outros usuários.
* **Listas Públicas:** Acesso às listas e avaliações criadas por outros membros da plataforma.

---

## Arquitetura e Decisões Técnicas

O frontend foi construído seguindo o modelo **SPA (Single Page Application)**, priorizando a performance e a experiência do usuário.

### Organização do Código
O projeto segue uma arquitetura modular focada em escalabilidade:

* **Services Pattern:** Toda a comunicação com o Backend (API Railway) é centralizada na pasta `/services` utilizando **Axios**. Isso desacopla a lógica de negócios da interface.
* **Context API:** O estado global (Sessão do Usuário, Tokens) é gerenciado via `UserContext`, persistindo a autenticação mesmo após o recarregamento da página.
* **Componentização:** Uso extensivo de componentes reutilizáveis (`MediaCard`, `Modal`, `LoadingSpinner`) para manter o código limpo (DRY).


### Estrutura de Pastas

```
src/
├── components/   # Componentes visuais reutilizáveis (UI)
├── config/       # Constantes e configurações (ex: avatares)
├── context/      # Gerenciamento de estado global (Auth)
├── hooks/        # Custom Hooks (ex: useMessage para Toasts)
├── pages/        # Telas e rotas da aplicação
├── services/     # Integração com a API REST
└── App.jsx       # Definição de Rotas Públicas e Privadas
```

---

## Tecnologias utilizadas

* Frontend: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
* Estilização: [Tailwind CSS](https://tailwindcss.com)
* Roteamento: [React Router DOM](https://reactrouter.com/)
* Gerenciamento de estado local: Context API (UserContext)

---

## Como Rodar o Projeto

1. Clone o repositório:

```bash
git clone "https://github.com/S204-Inatel-2025-2/cinelist-frontend"
```

2. Navegue até o diretório:

```bash
cd cinelist-frontend
```

3. Instale as dependências:

```bash
npm install
```

4. Execute o servidor de desenvolvimento:

```bash
npm run dev
```
> Por padrão será iniciado em http://localhost:5173

---

## Licença

Este projeto está licenciado sob os termos da licença [MIT](LICENSE).