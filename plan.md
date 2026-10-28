# Plano de implementação: JS Contabilidade (protótipo)

## Contexto

O `PRD.md` e o `CLAUDE.md` já definem o quê e como: landing page em HTML, CSS e JS vanilla (`index.html`, `style.css`, `script.js` na raiz), com sete seções, formulário de orçamento e acessibilidade WCAG AA. Hoje a pasta só tem `assets/` (3 SVGs), `CLAUDEINFO.md`, `PRD.md` e `CLAUDE.md`. Este plano divide a construção em fases pequenas, cada uma deixando algo visível no navegador.

Cores dos logos verificadas: `logo-coracao.svg` usa traço branco (`#FFFFFF`) e `logo-coracao-preto.svg` usa traço preto (`#09090b`). O certificado usa âmbar (`#ffb940`) e `#cc860d`.

## Decisões a tomar antes de começar

| # | Decisão | Recomendação |
|---|---|---|
| 1 | **Fontes**: Google Fonts (CDN, proibido pela regra 2 sem consulta) ou fontes locais/fallback do sistema | **Aprovado pelo cliente: usar CDN (Google Fonts)** via `<link>`, com fallback `system-ui`. É a única dependência externa. |
| 2 | **Ícones dos serviços**: SVG inline desenhados à mão ou sem ícones | SVG inline simples, sem biblioteca. |
| 3 | **Texto do FAQ e das descrições de serviço**: eu redijo um rascunho ou você fornece | Eu redijo (temas do Instagram em `CLAUDEINFO.md`) e você aprova antes de mostrar ao cliente. |
| 4 | **Endereço no contato**: Santana do Paraíso ou Ipatinga | Mostrar só "Santana do Paraíso, MG" até o cliente confirmar. |
| 5 | **Botão de envio desabilitado enquanto houver erro** (PRD 7.2) | **Aprovado pelo cliente: botão travado só até o consentimento LGPD estar marcado** (e durante o envio). Erros de campo aparecem em texto. Desvia do PRD 7.2, que pedia desabilitar com qualquer erro. |
| 6 | **Duas cópias do formulário** (após o hero e no fim) | Um único `<template>` clonado por JS, com ids únicos. Evita ids duplicados. |
| 7 | **Autorização do plano**: cada fase abaixo toca mais de um arquivo (regra 1 do CLAUDE.md) | Considerar este plano aprovado para todas as fases, e eu só paro nos pontos de consulta listados. |

## Fases

Complexidade: B = baixa, M = média, A = alta.

| Fase | Entrega visível | Arquivos | Compl. | Modelo |
|---|---|---|---|---|
| 1. Fundação ✅ | Página abre com fundo, tipografia, paleta em variáveis `:root` e esqueleto das 7 seções (títulos vazios). | `index.html`, `style.css` | B | Haiku |
| 2. Navbar, hero e WhatsApp ✅ | Navbar fixa, menu hambúrguer, hero com título e CTA, botão flutuante de WhatsApp com `wa.me`. | `index.html`, `style.css`, `script.js` | M | Opus |
| 3. Serviços e Sobre ✅ | 4 cards de serviço com ícones e logo/ícone de certificado digital. Seção Sobre com espaço reservado para foto. | `index.html`, `style.css` | B | Haiku |
| 4. Depoimentos e destaques ✅ | Cards com as citações do Google, selo "5,0 · 59 avaliações" e contadores. | `index.html`, `style.css`, `script.js` | M | Sonnet |
| 5. Formulário (visual) ✅ | Formulário com 6 campos e consentimento LGPD, renderizado nas duas posições a partir de um `<template>`. | `index.html`, `style.css`, `script.js` | M | Sonnet |
| 6. Lógica do formulário ✅ | Máscara de telefone, validação em tempo real, normalização de entrada, estado "Enviando...", mensagem de sucesso, constante de endpoint vazia. | `script.js` (+ `style.css` para estados) | A | Sonnet |
| 7. FAQ, contato e rodapé ✅ | Acordeão acessível, contato completo, rodapé com ano dinâmico. | `index.html`, `style.css`, `script.js` | B | Haiku |
| 8. Animações de entrada ✅ | Fade e slide ao rolar com `IntersectionObserver`, desligados em `prefers-reduced-motion`. | `style.css`, `script.js` | M | Sonnet |
| 9. Polimento e QA | Revisão em 360px, tablet e desktop, contraste, teclado, foco, rolagem horizontal e checklist da seção 12 do PRD. | os três | A | Opus |

### Por que cada modelo

- **Haiku (fases 1, 3, 7):** marcação e CSS direto, com padrão repetível e pouco risco de decisão.
- **Opus (fase 2):** o hero e a navbar definem a linguagem visual "premium" que o resto herda. Vale o modelo mais forte aqui.
- **Sonnet (fases 4, 5, 6, 8):** lógica e interação de complexidade média, boa relação custo e qualidade. Na fase 6, se aparecer bug de máscara ou foco, subir para Opus.
- **Opus (fase 9):** revisão final cruza PRD, acessibilidade e responsividade ao mesmo tempo, onde um modelo mais forte detecta mais problemas.

## Riscos e pontos de consulta

1. **Contraste do âmbar (#FFB940):** sobre branco o contraste é cerca de 1,7:1 e reprova WCAG AA. Plano: usar âmbar só em fundos escuros, em decoração e como fundo de botão com texto escuro (#1B1B1B). Se o cliente quiser âmbar em texto sobre claro, preciso consultar.
2. **Google Fonts:** exige sua aprovação (decisão 1).
3. **Botão desabilitado com erro:** esconde o motivo do bloqueio a leitores de tela e usuários. Sugiro mensagens de erro por campo e botão ativo, e só travar o envio sem LGPD. Consulto antes da fase 6.
4. **Navbar fixa cobrindo âncoras:** exige `scroll-margin-top` nas seções. Verificar na fase 2 e 9.
5. **Botão flutuante de WhatsApp** pode cobrir o botão de envio no celular. Posicionar com margem e testar na fase 9.
6. **Sem JS, o formulário some** (vem de `<template>`). Aceitável para protótipo, já registrado no PRD 7.4.
7. **Conteúdo não confirmado** (endereço, CRC, foto, política de privacidade) continua como placeholder. Nada aparece como fato sem confirmação.
8. **PRD diz "arquivo único" em 4.1 e permite arquivos separados em 11.** Seguimos os três arquivos, como o CLAUDE.md define.

## Verificação

- Após cada fase: abrir `index.html` no navegador, conferir o console sem erros e testar em 360px nas DevTools.
- Fase 6: testar casos de borda (espaços, telefone colado com símbolos, e-mail inválido, LGPD desmarcado, duplo clique no envio).
- Fase 9: percorrer o checklist da seção 12 do PRD e navegar a página inteira só com teclado.
- Contraste: medir texto sobre os fundos claro e escuro com as DevTools.

## Ordem de execução sugerida

1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9. Após a fase 2 o cliente já pode ver direção visual, e após a 6 o fluxo principal de orçamento funciona.

---

Atualizado em 2026-10-27 · versão 1.8 (fases 1 a 8 concluídas)
