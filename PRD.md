# PRD: Landing Page JS Contabilidade (Protótipo)

**Versão:** 1.0
**Status:** Aprovado para protótipo
**Fonte de contexto:** `CLAUDEINFO.md`

---

## 1. Visão geral

Criar uma landing page moderna para a JS Contabilidade, escritório de contabilidade de Santana do Paraíso, MG. A página tem dois objetivos:

1. **Captar orçamentos** por formulário e WhatsApp.
2. **Gerar confiança** apresentando a empresa, a responsável e os serviços.

Esta primeira entrega é um **protótipo para apresentar ao cliente**: um único `index.html` com HTML, CSS e JS puros. A migração para uma stack será feita depois.

---

## 2. Objetivos e métricas de sucesso

| Objetivo | Métrica (a acompanhar após publicação) |
|---|---|
| Captar orçamentos | Número de envios do formulário e cliques no WhatsApp |
| Gerar confiança | Tempo na página e rolagem até a seção de serviços |
| Modernizar a identidade | Aprovação visual do cliente no protótipo |

---

## 3. Público-alvo

Foco do topo da página: **abertura de empresa e MEI**.

Segmentos de apoio, com blocos próprios:

- Empresários e donos de pequenas empresas que precisam abrir, manter ou encerrar um CNPJ.
- MEIs que precisam de declarações anuais e orientação sobre obrigações.
- Profissionais PJ (prestadores de serviço, médicos, dentistas, engenheiros) avaliando abrir uma PJ.
- Pessoas físicas com dúvidas de imposto de renda, incluindo MEIs.
- Empresas que precisam de certificado digital.

---

## 4. Escopo desta versão

### 4.1 Dentro do escopo

- Arquivo único `index.html` com CSS e JS.
- Layout responsivo, com foco em celular.
- Seções 1 a 7 (ver seção 5).
- Formulário de orçamento com validação e estado de envio.
- Comportamentos de UX listados na seção 6.
- Acessibilidade WCAG AA (ver seção 9).
- Identidade visual atual, atualizada para um layout moderno (ver seção 8).

### 4.2 Fora do escopo (nesta versão)

- **SEO, GEO, schema e copy de marketing.** Serão tratados em fase posterior.
- Integração real com n8n, e-mail ou WhatsApp (o envio só mostra mensagem de sucesso).
- Backend, banco de dados e painel administrativo.
- Página de política de privacidade (o link fica como placeholder).
- Blog e integração com o conteúdo do Instagram.
- Área de login ou portal do cliente.
- Modo escuro automático pela preferência do sistema.
- **Agendamento online:** escolha de data e horário numa agenda, com a consulta marcada no calendário.

---

## 5. Estrutura da página

Ordem das seções, de cima para baixo:

1. **Hero:** título "A Contabilidade mais completa e bem pertinho de você!", subtítulo com os quatro serviços principais e botão "Agende uma consultoria gratuita".
2. **Serviços:** cards para abertura e baixa de empresas (CNPJ e MEI), assessoria contábil, fiscal e DP, certificado digital e planejamento tributário.
3. **Sobre:** apresentação da Sherryne Vasconcelos, contadora, e da proposta de atendimento. Espaço reservado para foto (ver seção 10).
4. **Depoimentos:** avaliações do Google, nota 5,0 e 59 avaliações. Usar as citações de `CLAUDEINFO.md`.
5. **Formulário de orçamento.**
6. **Dúvidas frequentes (FAQ).** Acordeão.
7. **Contato:** WhatsApp, e-mail, Instagram, Facebook, horário de atendimento (seg a sex, 8h às 18h) e endereço (ver pendências).

O formulário aparece **duas vezes**: após o hero e no fim da página, junto ao contato.

---

## 6. Funcionalidades e comportamentos de UX

### 6.1 Navegação

- **Barra de navegação fixa** no topo, com links para as seções e botão "Consultoria gratuita" que leva ao formulário.
- **Menu hambúrguer** no celular, com fechamento ao clicar em um link ou ao pressionar Esc.
- Rolagem suave até as seções.

### 6.2 WhatsApp

- **Botão flutuante de WhatsApp** fixo na tela, em todas as resoluções.
- Número: (31) 98845-7407.
- Ao clicar, abre `wa.me` com mensagem pré-preenchida ("Olá! Gostaria de um orçamento.").

### 6.3 Animações

- Animações de entrada suaves (fade e slide) ao rolar a página.
- **Respeitar `prefers-reduced-motion`:** com essa preferência ativa, as animações são desligadas.

### 6.4 Destaques

- Contadores e destaques: "5,0 no Google", "59 avaliações", e outros números confirmados pelo cliente.

### 6.5 FAQ

- Acordeão com perguntas frequentes. As perguntas serão definidas no conteúdo, com base nos temas do Instagram (IRPF, DASN-SIMEI, abertura de empresa, certificado digital).

---

## 7. Formulário de orçamento

### 7.1 Campos

| Campo | Tipo | Obrigatório |
|---|---|---|
| Nome | texto | sim |
| WhatsApp | telefone, com máscara `(31) 98845-7407` | sim |
| E-mail | e-mail | sim |
| Tipo de cliente | seleção: CNPJ, MEI, PJ, PF | sim |
| Serviço de interesse | seleção: abertura de empresa, assessoria contábil, certificado digital, planejamento tributário, IR, outro | sim |
| Consentimento LGPD | checkbox com link para política de privacidade (placeholder) | sim |

### 7.2 Validação

- Validação **em tempo real**, com mensagem de erro abaixo de cada campo.
- Telefone aceita apenas formato válido com DDD.
- E-mail validado no formato padrão.
- Botão de envio permanece desabilitado enquanto houver erro ou o checkbox não estiver marcado.

### 7.3 Envio

- Durante o envio: botão desabilitado, com texto "Enviando...".
- **No protótipo:** após o envio, mostrar mensagem de sucesso na própria página ("Recebemos seu pedido. Nossa equipe entra em contato em breve.") e limpar o formulário.
- **Integração futura:** o formulário deve enviar os dados para um **endpoint configurável** (webhook do n8n). A URL fica em uma constante no topo do script, vazia no protótipo. O envio para e-mail ou WhatsApp será definido na fase de integração.
- Mensagem de erro amigável se o envio falhar.

### 7.4 Edge cases

- Campos com espaços no início ou no fim: remover antes de validar.
- Telefone colado com caracteres não numéricos: normalizar para dígitos.
- Usuário que fecha a aba durante o envio: nada a tratar no protótipo, mas o endpoint futuro deve aceitar reenvio.
- Usuário com JavaScript desabilitado: o formulário não funciona. Aceitável para o protótipo, a registrar como risco.

---

## 8. Layout e identidade visual

### 8.1 Direção

**Híbrido:** mantém a alternância entre seções claras e escuras do site atual, com mais espaço em branco, tipografia maior e animações sutis.

### 8.2 Tipografia

- Títulos: **Montserrat**, peso 700.
- Texto corrido: **Open Sans**, peso 400.

### 8.3 Paleta (de `CLAUDEINFO.md`)

| Papel | Cor | Hex |
|---|---|---|
| Destaque em títulos e logotipo | Âmbar | #FFB940 |
| Fundo de rodapé e botões escuros | Grafite | #303033 |
| Fundo da barra superior e seções escuras | Preto suave | #1B1B1B |
| Texto de apoio em tons escuros | Azul-acinzentado escuro | #212A34 |
| Texto principal sobre fundo claro | Quase preto | #212121 |
| Texto de apoio sobre fundo claro | Cinza | #5F6368 |
| Divisores e fundos suaves | Bege-cinza | #E1DFDB |
| Bordas e textos auxiliares | Cinza claro | #BDBDBD |
| Bordas finas | Cinza muito claro | #DADCE0 |
| Fundo principal | Branco | #FFFFFF |

Definir as cores como variáveis CSS em `:root`, para facilitar a migração e futuros ajustes.

### 8.4 Logotipo e ícones

- Usar `assets\logo-coracao.svg` (versão colorida) no fundo claro e `assets\logo-coracao-preto.svg` no fundo escuro, se for o caso na validação visual.
- Ícone `assets\certificado-digital-icone.svg` no card de certificado digital.

---

## 9. Acessibilidade e compatibilidade

### 9.1 Acessibilidade (WCAG 2.1 AA)

- Contraste mínimo de 4,5:1 para texto normal e 3:1 para texto grande.
- Navegação completa por teclado, com foco visível.
- Textos alternativos em imagens e ícones informativos.
- Labels associados a todos os campos do formulário, com mensagens de erro lidas por leitores de tela (`aria-live`).
- Hierarquia de títulos correta (um `h1` por página).
- Respeitar `prefers-reduced-motion`.

### 9.2 Compatibilidade

- Últimas duas versões de Chrome, Edge, Safari e Firefox.
- Layout testado em celular (largura mínima de 360px), tablet e desktop.
- Sem rolagem horizontal em nenhuma largura.
- Margem lateral de 16px no celular.

---

## 10. Conteúdo e imagens

- **Logos e ícones:** disponíveis em `assets\`.
- **Foto da Sherryne e do escritório:** não disponíveis agora. Usar espaço reservado com as dimensões e a proporção definidas, para troca futura sem mudar o layout.
- **Textos:** usar os textos já existentes em `CLAUDEINFO.md`. Novos textos (FAQ, descrições dos serviços) devem ser revisados pelo cliente antes da publicação.

---

## 11. Arquitetura para o protótipo

- `index.html`: estrutura e conteúdo.
- CSS e JS podem ficar **no mesmo arquivo** ou em arquivos separados, a critério de implementação, desde que seja mantido apenas o `index.html` como ponto de entrada.
- Conteúdo (serviços, FAQ, depoimentos) em **blocos bem delimitados**, com nomes claros, para facilitar a extração para componentes na migração.
- Sem dependências externas obrigatórias. Se usar Google Fonts para Montserrat e Open Sans, carregar via link e prever fallback.
- Constante de configuração no topo do script: número do WhatsApp, URL do endpoint (vazia no protótipo).

---

## 12. Critérios de aceite

- [ ] Página abre em `index.html` sem erros no console.
- [ ] Todas as seções 1 a 7 estão presentes, na ordem da seção 5.
- [ ] Formulário valida em tempo real, aplica máscara de telefone e mostra mensagem de sucesso após o envio.
- [ ] Botão de envio fica desabilitado sem consentimento LGPD.
- [ ] Botão flutuante de WhatsApp e navbar fixa funcionam em desktop e celular.
- [ ] Menu hambúrguer abre, fecha e não prende o foco.
- [ ] Animações de entrada respeitam `prefers-reduced-motion`.
- [ ] Sem rolagem horizontal em 360px.
- [ ] Contraste de texto atende WCAG AA nas duas alternâncias de fundo.
- [ ] Navegação completa por teclado.
- [ ] Cores vindas de variáveis CSS, sem valores soltos no código.

---

## 13. Pendências a confirmar com o cliente

| Item | Situação |
|---|---|
| Endereço do escritório | **Resolvido:** R. José de Alencar, 72 - Cidade Nova, Santana do Paraíso - MG, 35179-000. O mapa do site antigo apontava para Ipatinga. Atende Ipatinga, Coronel Fabriciano, Timóteo e todo o Vale do Aço. |
| Número do CRC da Sherryne | Não encontrado nas fontes. Confirmar se deve aparecer na página. |
| Foto da Sherryne e do escritório | Não disponível. Espaço reservado. |
| Política de privacidade | Link placeholder. Cliente precisa fornecer o texto ou aprovar um modelo. |
| Destino dos envios do formulário | Definir na fase de integração (n8n: e-mail ou WhatsApp). |
| Textos novos (FAQ e descrições de serviço) | Revisão e aprovação do cliente. |
| Contadores e destaques | Confirmar os números que podem ser exibidos. |

---

## 14. Próximos passos

1. Construir o protótipo `index.html` conforme este PRD.
2. Validar o protótipo com o cliente.
3. Resolver as pendências da seção 13.
4. Integrar o formulário ao n8n.
5. Migrar para a stack definida.
6. Em fase separada: SEO, GEO, schema e copy.

---

Atualizado em 2026-10-27 · versão 1.1
