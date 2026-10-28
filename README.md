# Loguiss

O Loguiss é um sistema de gerenciamento de estoque pensado para micro e pequenas empresas dos setores de comércio e indústria, especialmente negócios em fase inicial. Seu objetivo é ajudar a evitar perdas e decisões baseadas em informações incompletas, oferecendo mais visibilidade sobre os produtos e os processos da operação.

## Visão geral

O sistema busca apoiar o acompanhamento do fluxo de produtos, desde matérias-primas e insumos até os produtos finais. A proposta inclui controle de estoque, produção e perdas, além de análises que ajudem a identificar necessidades de reposição e apoiar decisões do dia a dia.

A visão do produto também prevê integração com sistemas de ponto de venda (PDV), para reduzir lançamentos duplicados, e recursos de inteligência artificial que possam estimar quando o estoque está perto de acabar, sugerir compras e destacar situações que mereçam atenção.

Gerenciar estoque de forma inadequada pode parecer secundário para empresas que estão começando, mas pode levar a desperdício, falta de produtos e dificuldades para planejar a operação. O Loguiss pretende tornar esse controle mais acessível e útil para negócios de pequeno porte.

## Arquitetura geral

O projeto está dividido em dois módulos:

- **Frontend:** aplicação web em React, responsável pelas telas, formulários e experiência de uso.
- **Backend:** API HTTP em Node.js e Express, responsável pelas operações de negócio e pela comunicação com o banco PostgreSQL usando Prisma.

O frontend envia requisições HTTP para a API. O backend processa as requisições, consulta ou altera os dados no PostgreSQL e devolve respostas para a interface.

```text
Pessoa usuária
      │
      ▼
Frontend web (React + Vite)
      │  Requisições HTTP/JSON
      ▼
API (Node.js + Express)
      │  Prisma
      ▼
Banco de dados (PostgreSQL)

API ── serviço de e-mail ──► envio de códigos de verificação
```

A interface usa `VITE_BACK_URL` para definir a URL base da API. No desenvolvimento local, o valor padrão documentado é `http://localhost:3000`. O backend também possui integração com serviço de e-mail para o fluxo de verificação de conta/recuperação de senha.

## Módulos e documentação

- [Frontend — interface web](./loguiss-frontend/README.md): tecnologias, configuração local e organização das telas.
- [Backend — API](./loguiss-backend/README.md): arquitetura, rotas, variáveis de ambiente, banco de dados e migrations.
