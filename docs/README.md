# Portfolio

Portfólio pessoal responsivo, com tema escuro/claro, construído **100% no frontend** seguindo os princípios de Clean Code.

## Stack

- **HTML5** semântico.
- **CSS3** com custom properties, grid e flexbox (sem pré-processadores).
- **JavaScript** em ES Modules (sem frameworks, sem build).

## Área de projetos pessoais

- Lista de projetos localizada em `js/data/projects-data.js` com organização por meio de array.
- Projetos pessoais locais estão localizados na pasta `projects/` para acesso via link interno.

Campos:
id Identificador único (kebab-case).
title Título exibido no card.
description Descrição.
tags Tecnologias/temas.
year Ano de publicação/conclusão. Quando não houver ano é preenchido com null ou "".
href Caminho local ou URL externa.
external Se true, link abre em nova aba (utilizado para projetos com links externos).

Exemplo de card:

```js
{
  id: "meu-projeto",
  title: "Meu Projeto",
  description: "Descrição do projeto.",
  tags: ["HTML", "CSS"],
  year: 2026,
  href: "./projects/meu-projeto/index.html",
}
```

## Tema

- **Dark é o tema padrão** (definido via `data-theme="dark"` no `<html>` e por um pequeno script inline).
- O tema escolhido é salvo em `localStorage` na chave `portfolio-theme`.

## Acessibilidade

- Estrutura semântica (`header`, `main`, `section`, `footer`, headings hierárquicos).
- "Skip link" para o conteúdo principal.
- Estados de foco visíveis e atributos ARIA no menu, no toggle de tema e nas mensagens do formulário.
- `prefers-reduced-motion` é respeitado (animações são desativadas).

## Princípios de Clean Code Adotados

- **Nomes**: variáveis, funções e arquivos descrevem intenção.
- **Funções**: cada função faz uma única coisa.
- **Separação de responsabilidades**: CSS dividido por propósito (variáveis, base, layout, componentes); JS dividido em módulos por feature.
- **Variáveis**: valores reutilizáveis ficam em variáveis/constantes.
- **Duplicação**: utilitários compartilhados são reaproveitados.
- **Convenções consistentes**: `kebab-case` para arquivos, `camelCase` para JS, BEM para CSS.
