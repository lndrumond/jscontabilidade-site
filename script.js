// Configuração central do protótipo: trocar aqui evita caçar o número espalhado pelo HTML (PRD seção 11)
const CONFIG = {
  whatsappNumber: '5531988457407',
  whatsappMessage: 'Olá! Gostaria de um orçamento.',
  // Webhook do n8n. Vazio no protótipo: o envio é simulado e nada sai do navegador
  formEndpoint: '',
};

// Precisa ser igual ao breakpoint do CSS, senão o menu fica aberto num layout que não tem botão para fechá-lo
const DESKTOP_QUERY = window.matchMedia('(min-width: 960px)');

function buildWhatsappUrl() {
  const text = encodeURIComponent(CONFIG.whatsappMessage);
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${text}`;
}

function setupWhatsappLinks() {
  const url = buildWhatsappUrl();
  document.querySelectorAll('[data-whatsapp]').forEach((link) => {
    link.href = url;
  });
}

function setupMenu() {
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (!header || !toggle || !nav) return;

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  }

  toggle.addEventListener('click', () => setOpen(!isOpen()));

  // Fecha ao escolher uma seção, senão o painel continua cobrindo o destino da âncora
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !isOpen()) return;
    setOpen(false);
    // Devolve o foco ao botão para quem navega por teclado não se perder na página
    toggle.focus();
  });

  // Tab depois do último link fecha o menu em vez de prender o foco (critério de aceite do PRD).
  // relatedTarget nulo é ignorado: o Safari não foca botões no clique e fecharia o menu por engano
  header.addEventListener('focusout', (event) => {
    if (isOpen() && event.relatedTarget && !header.contains(event.relatedTarget)) {
      setOpen(false);
    }
  });

  DESKTOP_QUERY.addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}

function setupHeaderScroll() {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

// O <template> repete os mesmos ids em cada cópia, e ids duplicados quebram label e aria-describedby
function makeIdsUnique(root, suffix) {
  const idMap = new Map();
  root.querySelectorAll('[id]').forEach((element) => {
    const newId = `${element.id}-${suffix}`;
    idMap.set(element.id, newId);
    element.id = newId;
  });

  // Atributos que apontam para outros ids precisam acompanhar a renomeação
  const referenceAttributes = ['for', 'aria-describedby', 'aria-labelledby', 'aria-controls'];
  const selector = referenceAttributes.map((attribute) => `[${attribute}]`).join(',');
  root.querySelectorAll(selector).forEach((element) => {
    referenceAttributes.forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;
      const updated = element
        .getAttribute(attribute)
        .split(' ')
        .map((id) => idMap.get(id) || id)
        .join(' ');
      element.setAttribute(attribute, updated);
    });
  });
}

function setupQuoteForms() {
  const template = document.querySelector('#quote-form-template');
  const mounts = document.querySelectorAll('[data-form-mount]');
  if (!template || !mounts.length) return;

  mounts.forEach((mount, index) => {
    const fragment = template.content.cloneNode(true);
    makeIdsUnique(fragment, `f${index}`);
    mount.replaceChildren(fragment);

    setupQuoteFormBehavior(mount.querySelector('form'));

    // O link da política ainda é placeholder; sem isso o clique jogaria o visitante para o topo da página
    mount.querySelector('[data-privacy-link]').addEventListener('click', (event) => event.preventDefault());
  });
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Aplica a máscara (31) 98845-7407 enquanto a pessoa digita ou cola
function formatPhone(value) {
  let digits = value.replace(/\D/g, '');
  // Colar "+55 31 98845-7407" traz 13 dígitos; só nesse caso o 55 é código do país e não DDD
  if (digits.length === 13 && digits.startsWith('55')) digits = digits.slice(2);
  digits = digits.slice(0, 11);

  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function phoneDigits(value) {
  return value.replace(/\D/g, '');
}

// DDD de dois dígitos sem zero + nono dígito 9 + oito dígitos. É WhatsApp, então só celular vale
function isValidMobile(value) {
  return /^[1-9]{2}9\d{8}$/.test(phoneDigits(value));
}

// clean roda ao sair do campo (aparar durante a digitação impediria digitar o espaço entre nomes)
const FIELD_RULES = {
  name: {
    clean: (value) => value.replace(/\s+/g, ' ').trim(),
    validate: (value) => (value.length >= 2 ? '' : 'Informe seu nome.'),
  },
  phone: {
    clean: formatPhone,
    validate: (value) => (isValidMobile(value) ? '' : 'Informe um WhatsApp válido com DDD, por exemplo (31) 98845-7407.'),
  },
  email: {
    clean: (value) => value.trim(),
    validate: (value) => (EMAIL_PATTERN.test(value) ? '' : 'Informe um e-mail válido, por exemplo nome@email.com.'),
  },
  clientType: {
    validate: (value) => (value ? '' : 'Selecione o tipo de cliente.'),
  },
  service: {
    validate: (value) => (value ? '' : 'Selecione o serviço de interesse.'),
  },
  consent: {
    validate: (value, control) => (control.checked ? '' : 'Marque o consentimento para enviar.'),
  },
};

function cleanValue(control) {
  const { clean } = FIELD_RULES[control.name];
  return clean ? clean(control.value) : control.value;
}

function validateControl(control) {
  const message = FIELD_RULES[control.name].validate(cleanValue(control), control);
  showFieldError(control, message);
  return message === '';
}

function showFieldError(control, message) {
  const field = control.closest('.field');
  const errorElement = field.querySelector('.field__error');
  field.classList.toggle('field--invalid', message !== '');
  errorElement.textContent = message;
  errorElement.hidden = message === '';
  if (message) {
    control.setAttribute('aria-invalid', 'true');
  } else {
    control.removeAttribute('aria-invalid');
  }
}

function buildPayload(controls) {
  const values = Object.fromEntries(
    controls.map((control) => [control.name, control.type === 'checkbox' ? control.checked : cleanValue(control)]),
  );
  return {
    name: values.name,
    // Com código do país e só dígitos: é o formato que as APIs de WhatsApp esperam
    phone: `55${phoneDigits(values.phone)}`,
    email: values.email,
    clientType: values.clientType,
    service: values.service,
    consent: values.consent,
    page: window.location.href,
    sentAt: new Date().toISOString(),
  };
}

async function sendLead(payload) {
  if (!CONFIG.formEndpoint) {
    // Protótipo: simula a espera de uma rede real para o cliente enxergar o estado "Enviando..."
    await new Promise((resolve) => setTimeout(resolve, 900));
    return;
  }

  // Sem limite de tempo, uma rede travada deixaria o botão em "Enviando..." para sempre
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(CONFIG.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Falha no envio: HTTP ${response.status}`);
  } finally {
    clearTimeout(timer);
  }
}

function setupQuoteFormBehavior(form) {
  const controls = Array.from(form.elements).filter((element) => element.name in FIELD_RULES);
  const consent = form.elements.consent;
  const submit = form.querySelector('button[type="submit"]');
  const hint = form.querySelector('[data-consent-hint]');
  const status = form.querySelector('[data-form-status]');
  const submitLabel = submit.textContent;
  let isSubmitting = false;

  // O envio só trava sem o consentimento ou durante o envio; erros de campo aparecem em texto (decisão 5 do plano)
  function updateSubmitState() {
    submit.disabled = isSubmitting || !consent.checked;
    hint.hidden = consent.checked;
  }

  function setStatus(message, type, withWhatsappLink = false) {
    // replaceChildren com texto evita innerHTML (regra de código do projeto)
    status.replaceChildren(message);
    status.dataset.type = type;
    if (withWhatsappLink) {
      const link = document.createElement('a');
      link.href = buildWhatsappUrl();
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'fale com a gente pelo WhatsApp';
      link.setAttribute('aria-label', 'Fale com a gente pelo WhatsApp (abre em nova aba)');
      status.append(' ', link);
    }
  }

  function clearStatus() {
    status.replaceChildren();
    delete status.dataset.type;
  }

  function resetForm() {
    form.reset();
    controls.forEach((control) => {
      delete control.dataset.touched;
      showFieldError(control, '');
    });
    updateSubmitState();
  }

  form.addEventListener('input', (event) => {
    const control = event.target;
    if (!(control.name in FIELD_RULES)) return;

    if (control.name === 'phone') control.value = formatPhone(control.value);
    // O aviso de revisão perde o sentido assim que a pessoa começa a corrigir
    if (status.dataset.type === 'error') clearStatus();
    // Só valida em tempo real campos que a pessoa já visitou, para não gritar erro antes de ela digitar
    if (control.dataset.touched) validateControl(control);
    if (control === consent) updateSubmitState();
  });

  form.addEventListener('change', (event) => {
    const control = event.target;
    if (!(control.name in FIELD_RULES)) return;

    control.dataset.touched = 'true';
    validateControl(control);
    if (control === consent) updateSubmitState();
  });

  form.addEventListener('focusout', (event) => {
    const control = event.target;
    if (!(control.name in FIELD_RULES)) return;

    if (control.type === 'text' || control.type === 'email' || control.type === 'tel') {
      control.value = cleanValue(control);
    }
    control.dataset.touched = 'true';
    validateControl(control);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    // Duplo clique ou Enter repetido não pode gerar dois envios
    if (isSubmitting) return;
    clearStatus();

    let firstInvalid = null;
    controls.forEach((control) => {
      control.dataset.touched = 'true';
      if (!validateControl(control) && !firstInvalid) firstInvalid = control;
    });
    if (firstInvalid) {
      firstInvalid.focus();
      setStatus('Revise os campos destacados e tente novamente.', 'error');
      return;
    }

    const payload = buildPayload(controls);
    isSubmitting = true;
    submit.textContent = 'Enviando...';
    form.setAttribute('aria-busy', 'true');
    updateSubmitState();

    let succeeded = false;
    try {
      await sendLead(payload);
      succeeded = true;
    } catch (error) {
      setStatus('Não foi possível enviar agora. Tente novamente em instantes ou', 'error', true);
    }

    isSubmitting = false;
    submit.textContent = submitLabel;
    form.removeAttribute('aria-busy');
    if (succeeded) {
      resetForm();
      setStatus('Recebemos seu pedido. Nossa equipe entra em contato em breve.', 'success');
    } else {
      updateSubmitState();
    }
  });

  updateSubmitState();
}

function formatCount(value, decimals) {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function animateCounter(element) {
  const target = Number(element.dataset.count);
  const decimals = Number(element.dataset.decimals || 0);
  const duration = 1200;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    // Ease-out: começa rápido e desacelera, parece mais natural que linear
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = formatCount(target * eased, decimals);
    if (progress < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

function setupCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // O HTML já traz o valor final, então sem animação (ou sem suporte) o número continua correto
  if (!counters.length || reduceMotion || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.6 });

  counters.forEach((counter) => {
    // Zera antes de observar; sem isso o valor final piscaria antes de a contagem começar
    counter.textContent = formatCount(0, Number(counter.dataset.decimals || 0));
    observer.observe(counter);
  });
}

// Elementos que entram com fade e slide ao aparecer na tela. O hero fica de fora: anima por CSS ao carregar
const REVEAL_SELECTOR = [
  '.section-header',
  '.service-card',
  '.services-cta',
  '.about__media',
  '.about__content',
  '.rating-card',
  '.review-card',
  '.quote-section__intro',
  '.quote-section__form',
  '.faq__item',
  '.contact-item',
  '.contact-form',
].join(',');

// Igual à duração da transição de .reveal no CSS
const REVEAL_DURATION = 600;
const REVEAL_STAGGER = 80;
const REVEAL_MAX_STEPS = 4;

function setupReveal() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Sem observer ou com movimento reduzido, as classes nem são aplicadas e tudo fica visível desde o início
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      observer.unobserve(element);
      element.classList.add('is-visible');

      // Depois de entrar, o elemento devolve o controle aos próprios estilos; senão .reveal
      // continuaria sobrescrevendo a transição de hover dos cards
      const delay = Number.parseInt(element.style.getPropertyValue('--reveal-delay'), 10) || 0;
      setTimeout(() => {
        element.classList.remove('reveal', 'is-visible');
        element.style.removeProperty('--reveal-delay');
      }, REVEAL_DURATION + delay + 100);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });

  document.querySelectorAll(REVEAL_SELECTOR).forEach((element) => {
    // Atraso crescente entre irmãos cria o efeito em cascata; o limite evita o último item esperar demais
    const position = Array.from(element.parentElement.children).indexOf(element);
    const delay = Math.min(position, REVEAL_MAX_STEPS) * REVEAL_STAGGER;
    element.style.setProperty('--reveal-delay', `${delay}ms`);
    element.classList.add('reveal');
    observer.observe(element);
  });
}

function setupYear() {
  // Ano vem do navegador, então o rodapé não envelhece como o do site atual
  document.querySelectorAll('[data-year]').forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
}

setupWhatsappLinks();
setupMenu();
setupHeaderScroll();
setupQuoteForms();
setupCounters();
setupReveal();
setupYear();
