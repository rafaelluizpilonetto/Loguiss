# Loguiss — frontend

## Tecnologias

Versões principais conforme declaradas em `package.json`:

- React 19, com estado gerenciado por hooks (`useState` e `useEffect`).
- Vite 8 para desenvolvimento e build.
- React Router DOM 7 para navegação.
- Tailwind CSS 4 para estilos.
- Axios 1 para comunicação HTTP.
- Lucide React 1 para ícones e Sonner 2 para notificações.

## Pré-requisitos

- Node.js compatível com Vite 8 (Node.js 20.19+ ou 22.12+).
- npm.
- Backend do Loguiss em execução para as telas que consultam a API.

## Instalação e execução

Na raiz do repositório:

```bash
cd loguiss-frontend
npm install
```

Copie `.env.example` para `.env.local` e ajuste a URL da API se necessário:

```env
VITE_BACK_URL=http://localhost:3000
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O Vite informa no terminal o endereço local da interface. Outros comandos:

```bash
npm run build    # Gera a versão de produção em dist/
npm run preview  # Serve o build localmente para conferência
npm run lint     # Executa o ESLint
```

## Variáveis de ambiente

| Variável | Uso |
| --- | --- |
| `VITE_BACK_URL` | URL base da API, usada pela instância Axios em `src/services/api.js`. |

Variáveis prefixadas com `VITE_` ficam disponíveis no código enviado ao navegador. Não coloque senhas, tokens secretos ou outras credenciais nesse arquivo.