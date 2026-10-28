# CLAUDE.md: JS Contabilidade (protótipo)

## Visão geral

Protótipo de landing page da JS Contabilidade, para apresentar ao cliente. Objetivo: captar orçamentos (formulário e WhatsApp) e gerar confiança com serviços e depoimentos. O escopo completo está em @PRD.md. O contexto do negócio está em @CLAUDEINFO.md.

## Arquitetura em uma página

- **Stack:** HTML, CSS e JavaScript vanilla. Sem framework, sem build, sem npm.
- **Arquivos na raiz:** `index.html` (estrutura e conteúdo), `style.css` (estilos), `script.js` (menu, máscara, validação e envio).
- **Pasta `assets/`:** logos e ícones SVG já existentes.
- **Envio do formulário:** URL do endpoint em uma constante no topo de `script.js`. Fica vazia no protótipo e será o webhook do n8n depois.
- **Fora desta fase:** SEO, GEO e schema.

## Escopo do projeto

Ver @PRD.md, em especial a seção 4 (dentro e fora do escopo), a seção 5 (ordem das seções) e a seção 12 (critérios de aceite). Se houver dúvida sobre o que entra, o PRD vale.

## Regras de comportamento

1. Antes de qualquer mudança não-trivial (que toque mais de um arquivo ou mude comportamento existente), proponha um plano e aguarde aprovação antes de executar.
2. Nunca adicione biblioteca externa, CDN ou pacote sem consultar antes. O projeto é vanilla por design. (O PRD prevê Google Fonts na seção 11. Confirmar antes de usar.)
3. Comentários em português. Explique o "porquê" do código, não o "o quê".
4. Antes de criar arquivo além de `index.html`, `style.css` e `script.js`, justifique por que ele precisa existir.
5. Se eu pedir uma feature que conflite com o `PRD.md`, avise antes de implementar.

## Convenções de código

- **Idioma:** textos da interface e comentários em pt-BR. Nomes de variáveis, funções e classes em inglês.
- **HTML:** semântico (`header`, `nav`, `main`, `section`, `footer`). Um único `h1`. Todo campo de formulário com `label` associado.
- **CSS:** cores só por variáveis em `:root`, com a paleta da seção 8.3 do PRD. Mobile-first. Animações desligadas sob `prefers-reduced-motion`.
- **JS:** `const` e `let`, nunca `var`. Funções pequenas com um propósito. Sem `innerHTML` com dados digitados pelo usuário.
- **Conteúdo repetível** (serviços, FAQ, depoimentos) em blocos delimitados e nomeados, para facilitar a migração de stack.
- **Formatação:** indentação de 2 espaços e ponto e vírgula em JS.
- **Acessibilidade:** WCAG 2.1 AA, conforme PRD seção 9.

## Como rodar

- Abra `index.html` no navegador (duplo clique). Não há instalação nem build.
- Teste em largura de 360px (modo celular das DevTools) antes de considerar pronto.
- Não há testes automatizados. A validação é feita pelos critérios de aceite do PRD (seção 12).

---

Atualizado em 2026-10-27 · versão 1.0
