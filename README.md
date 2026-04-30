# Portfolio

Portfólio pessoal responsivo, com tema escuro/claro, construído **100% no frontend** seguindo os princípios de Clean Code.

## Recursos

- Tema escuro/claro com persistência em `localStorage`.
- Acessibilidade (estrutura semântica, skip link, foco visível, ARIA, suporte a `prefers-reduced-motion`).
- Seção de projetos alimentada por dados em `js/data/projects-data.js`.
  - **Ordenação na página:** ano mais recente primeiro; projetos sem ano aparecem por último (a ordem do array no arquivo não importa).
  - **Miniatura do card** (opcional): imagem em pasta separada da galeria, exibida **abaixo do título e do ano**.
  - **Galeria** (opcional): imagens em sequência com botão "Ver imagens", via convenção de pastas.
- SEO básico para indexação (canonical, Open Graph/Twitter, Schema.org `Person/WebSite`) e verificação via metatag do Google Search Console.

## Stack

- <img align="left" alt="HTML" width="26px" src="https://raw.githubusercontent.com/devicons/devicon/1119b9f84c0290e0f0b38982099a2bd027a48bf1/icons/html5/html5-original.svg"/> **HTML5** semântico.
- <img align="left" alt="CSS" width="26px" src="https://raw.githubusercontent.com/devicons/devicon/1119b9f84c0290e0f0b38982099a2bd027a48bf1/icons/css3/css3-original.svg"/> **CSS3** com custom properties, grid e flexbox (sem pré-processadores).
- <img align="left" alt="JavaScript" width="26px" src="https://raw.githubusercontent.com/devicons/devicon/1119b9f84c0290e0f0b38982099a2bd027a48bf1/icons/javascript/javascript-original.svg"/> **JavaScript** em ES Modules (sem frameworks, sem build).

## Área de projetos pessoais

- Lista de projetos em `js/data/projects-data.js` (array; a exibição é reordenada por `year` na página).
- Projetos com demo local podem apontar `href` para arquivos em `projects/` (caminho relativo à raiz do site).

**Pastas de mídia**

| Uso | Caminho | Convenção |
| --- | --- | --- |
| Thumbnail do card | `assets/projects/thumbnails/` | Arquivo `{{id}}.{{ext}}` (o `id` do projeto e a extensão de `thumbnail.ext` devem coincidir). |
| Galeria (modal) | `assets/projects/{{id}}/` | `01.png`, `02.png`, … (número com dois dígitos; quantidade e extensão vêm de `images`). |

Campos:
- `id`: Identificador único (kebab-case); define o nome do arquivo da miniatura e o nome da pasta da galeria.
- `title`: Título exibido no card.
- `description`: Descrição.
- `tags`: Tecnologias/temas.
- `year`: Ano de publicação ou conclusão (`number` ou `null`/`""` para "sem data").
- `href`: Caminho local ou URL externa. Se vazio, o card exibe "Em breve".
- `external`: Se `true`, o link abre em nova aba (para URLs externas).
- `thumbnail` (opcional): Exibe a miniatura no card (abaixo do título/ano). Não repete a galeria: o arquivo fica só em `assets/projects/thumbnails/`.
  - `thumbnail.ext`: Extensão do arquivo (ex.: `"png"`, `"webp"`).
- `images` (opcional): Habilita a galeria e o botão "Ver imagens" (não define a imagem do card; use `thumbnail` para isso).
  - `images.count`: Quantidade de imagens na galeria (1 a 6).
  - `images.ext`: Extensão dos arquivos na pasta do projeto (ex.: `"png"`, `"webp"`).

Exemplo de card com miniatura e galeria:

```js
{
  id: "meu-projeto",
  title: "Meu Projeto",
  description: "Descrição do projeto.",
  tags: ["HTML", "CSS"],
  year: 2026,
  href: "./projects/meu-projeto/index.html",
  external: false,
  thumbnail: { ext: "png" },
  images: { count: 2, ext: "png" },
}
```

Arquivos esperados nesse exemplo: `assets/projects/thumbnails/meu-projeto.png`, `assets/projects/meu-projeto/01.png`, `assets/projects/meu-projeto/02.png`.

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
