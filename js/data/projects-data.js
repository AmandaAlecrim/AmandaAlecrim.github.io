/** ============================================================
     Lista de projetos exibidos na seção "Projetos em destaque".
    ============================================================
 */

export const projects = [
  {
    id: "portfolio-high-performance",
    title: "Portfólio · High Performance",
    description:
      "Desenvolvimento de portfólio de alta performance com otimização de código. Alcancei 100/100 em Performance e SEO no PageSpeed Insights, com melhorias avançadas de acessibilidade e Core Web Vitals.",
    tags: ["SEO", "Performance", "Acessibilidade", "Core Web Vitals"],
    year: 2026,
    href: "https://github.com/AmandaAlecrim/AmandaAlecrim.github.io",
    external: true,
    thumbnail: { ext: "png" },
    images: { count: 6, ext: "png" },
  },
  {
    id: "tcc-recomendacao-musical",
    title: "TCC · Recomendação Musical com IA",
    description:
      "Modelo de IA para recomendações personalizadas usando base do Spotify e Machine Learning em Python.",
    tags: ["Python", "Machine Learning", "IA"],
    year: 2026,
    href: "https://www.kaggle.com/code/amandaalecrim/sistema-de-recomenda-o-musical-com-spotify",
    external: true,
  },
  {
    id: "streaming-musical",
    title: "Web App de Streaming Musical",
    description:
      "Aplicação Full Stack com autenticação, gerenciamento de perfis e integração com banco de dados para usuários e playlists.",
    tags: ["Full Stack", "Auth", "SQL"],
    year: null,
    href: "",
    external: true,
  },
  {
    id: "ecommerce-passagens-aereas",
    title: "E-commerce de Passagens Aéreas",
    description:
      "Interface responsiva e dinâmica com foco em UX e fluxo de reserva, construída com HTML5, CSS3 e JavaScript puro.",
    tags: ["HTML5", "CSS3", "JavaScript"],
    year: null,
    href: "",
    external: true,
  },
  {
    id: "gestao-inventario-loja-doces",
    title: "Gestão de Inventário · Loja de Doces",
    description:
      "Sistema para consulta e gerenciamento de produtos de uma loja de doces, aplicando conceitos de Programação Orientada a Objetos.",
    tags: ["Java", "POO"],
    year: 2019,
    href: "https://github.com/AmandaAlecrim/Aps4Semestre",
    external: true,
  },
  {
    id: "api-produtos",
    title: "API de Produtos",
    description:
      "API REST para cadastro e gerenciamento de produtos, utilizando ASP.NET Core Web API, Entity Framework Core e PostgreSQL, com documentação via Swagger e versionamento do schema por migrations.",
    tags: [".NET", "ASP.NET Core", "EF Core", "PostgreSQL", "Swagger"],
    year: 2022,
    href: "https://github.com/AmandaAlecrim/Teste-Especifico",
    external: true,
  },
  {
    id: "simple-task-list",
    title: "Simple Task List (Lista de Tarefas)",
    description:
      "Aplicativo de lista de tarefas desenvolvido em Flutter (Dart), com persistência local em arquivo JSON (data.json) usando path_provider. Permite adicionar e validar tarefas, marcar como concluídas, remover com gesto de swipe e desfazer via SnackBar, além de ordenar pendentes/concluídas com pull-to-refresh.",
    tags: ["Flutter", "Dart", "Mobile", "JSON", "path_provider", "Persistência local"],
    year: 2022,
    href: "https://github.com/AmandaAlecrim/Simple-Task-List",
    external: true,
  },
  {
    id: "gerenciador-dados-pessoais",
    title: "Gerenciador de Dados Pessoais (API REST)",
    description:
      "API REST desenvolvida em Java 17 com Spring Boot, Spring Data JPA e H2 (em memória) para cadastro e gerenciamento de Pessoas e Endereços. Implementa CRUD completo, relacionamento 1:N (Pessoa→Endereços) e endpoint para consulta do endereço principal, com suporte a Actuator e console do H2 para inspeção em ambiente de teste técnico.",
    tags: ["Java", "Spring Boot", "Spring Data JPA", "Hibernate", "H2", "Maven", "Actuator"],
    year: 2023,
    href: "https://github.com/AmandaAlecrim/gerenciador-de-dados-pessoais",
    external: true,
  },
  {
    id: "login-register-page",
    title: "Login & Register Page (UI)",
    description:
      "Página front-end estática com modal de Login e Registro, alternância entre formulários via manipulação de DOM e transições CSS (glassmorphism), usando validações nativas de formulários HTML5 e ícones do Ionicons.",
    tags: ["HTML", "CSS", "JavaScript", "UI", "DOM", "Ionicons"],
    year: 2023,
    href: "https://github.com/AmandaAlecrim/login-and-register-page",
    external: true,
  },
  {
    id: "landing-page-phantom-bot",
    title: "Phantom Bot · Landing Page",
    description:
      "Landing page estática para apresentar o Phantom Bot (bot de Discord), com hero e CTA, seção de benefícios e identidade visual em HTML5 e CSS3 (Flexbox), incluindo tipografia via Google Fonts.",
    tags: ["HTML5", "CSS3", "Flexbox", "Landing Page", "Discord"],
    year: 2023,
    href: "https://github.com/AmandaAlecrim/landing-page-discord-bot",
    thumbnail: { ext: "png" },
    external: true,
  },
  {
    id: "super-trunfo-console",
    title: "Super Trunfo (Console)",
    description:
      "Jogo de Super Trunfo em terminal (jogador vs CPU), implementado em Java 19, com persistência em PostgreSQL via JDBC (DAO com SQL explícito) para armazenar cartas, partidas e cartas utilizadas por partida, incluindo validações de regras (nome único e soma de atributos ≤ 15).",
    tags: ["Java", "Maven", "JDBC", "PostgreSQL", "Console"],
    year: 2024,
    href: "https://github.com/AmandaAlecrim/super-trunfo",
    external: true,
  },
  {
    id: "mines-buddy",
    title: "Mines Buddy",
    description:
      "Ajudante visual para montar e analisar tabuleiros de Campo Minado no browser: grade interativa (HTML/CSS), estado sincronizado com o DOM, solver determinístico com dedução global pelo total de bombas (módulo core isolado), dicas visuais (bandeiras automáticas e casas seguras), persistência em localStorage, navegação por teclado e UI com estética Jirai Kei.",
    tags: ["JavaScript", "HTML5", "CSS3", "ES Modules", "localStorage", "GitHub Pages"],
    year: 2026,
    href: "https://amandaalecrim.github.io/mines-buddy/",
    external: true,
  }
];
