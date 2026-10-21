/**
 * ============================================================================
 * MAPA MULTINÍVEL · COMPORTAMENTO E COGNIÇÃO HUMANA
 * ============================================================================
 * Este arquivo JavaScript gerencia a lógica da interface e carrega os dados
 * dinamicamente dos arquivos JSON localizados na pasta `data/`:
 * - `data/matriz.json`: Estrutura de eixos, matriz de disciplinas e descrições.
 * - `data/autores.json`: Banco de dados completo dos autores por disciplina.
 * - `data/teorias.json`: Banco de dados das teorias e hipóteses por disciplina.
 */

/* ============================================================================
   1. VARIÁVEIS E ARMAZENAMENTO DE DADOS (CARREGADOS VIA FETCH)
   ============================================================================ */
let LINHAS_TEMPO = [];
let COLUNAS_PROX = [];
let MATRIZ = {};
let DESCRICOES = {};
let AUTORES = {};
let TEORIAS = {};

/* ============================================================================
   2. VARIÁVEIS DE ESTADO GLOBAL DA INTERFACE
   ============================================================================ */
let currentDiscipline = null; // Disciplina atualmente aberta no modal
let currentAuthorIdx = 0;     // Índice do autor atualmente exibido no modal do autor
let currentTheoryIdx = 0;     // Índice da teoria atualmente exibida no modal de teoria
let currentView = 'authors';  // Aba ativa no modal da disciplina ('authors' | 'theories')
let currentMode = 'matrix';   // Modo de visualização principal ('matrix' | 'graph' | 'timeline')

/* ============================================================================
   3. INICIALIZAÇÃO E CARREGAMENTO ASSÍNCRONO DOS DADOS (JSON)
   ============================================================================ */
let isAppInitialized = false;

async function initApp() {
  if (isAppInitialized) return;
  isAppInitialized = true;

  try {
    let matrizData = null;
    let autoresData = null;
    let teoriasData = null;

    // Se estiver em servidor HTTP/HTTPS, tenta carregar os arquivos JSON via fetch
    if (window.location.protocol.startsWith('http')) {
      try {
        const [m, a, t] = await Promise.all([
          fetch('data/matriz.json').then(res => {
            if (!res.ok) throw new Error('Falha ao carregar data/matriz.json');
            return res.json();
          }),
          fetch('data/autores.json').then(res => {
            if (!res.ok) throw new Error('Falha ao carregar data/autores.json');
            return res.json();
          }),
          fetch('data/teorias.json').then(res => {
            if (!res.ok) throw new Error('Falha ao carregar data/teorias.json');
            return res.json();
          })
        ]);
        matrizData = m;
        autoresData = a;
        teoriasData = t;
      } catch (fetchErr) {
        console.warn('Aviso: Fetch dos arquivos JSON falhou. Tentando fallback local (data/dados.js)...', fetchErr);
      }
    }

    // Fallback: se estiver abrindo diretamente via file:// ou se fetch falhar
    if ((!matrizData || !autoresData || !teoriasData) && window.__MAPA_DADOS__) {
      matrizData = window.__MAPA_DADOS__.matriz;
      autoresData = window.__MAPA_DADOS__.autores;
      teoriasData = window.__MAPA_DADOS__.teorias;
    }

    // Se mesmo após tentar ambos ainda não tiver dados
    if (!matrizData || !autoresData || !teoriasData) {
      throw new Error('Não foi possível carregar as bases de dados (matriz, autores, teorias).');
    }

    LINHAS_TEMPO = matrizData.LINHAS_TEMPO;
    COLUNAS_PROX = matrizData.COLUNAS_PROX;
    MATRIZ = matrizData.MATRIZ;
    DESCRICOES = matrizData.DESCRICOES;
    AUTORES = autoresData;
    TEORIAS = teoriasData;

    // Constrói a Matriz de Disciplinas após o carregamento bem-sucedido dos dados
    buildMatrix();
  } catch (error) {
    console.error('Erro no carregamento dos dados da aplicação:', error);
    const matrix = document.getElementById('matrix');
    if (matrix) {
      matrix.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 48px 32px; text-align: center; background: var(--paper-pure); border: 1px dashed var(--ink-3); border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 22px; color: var(--ink-12); margin-bottom: 12px;">Não foi possível carregar os dados</h3>
          <p style="font-size: 14px; color: var(--ink-9); max-width: 580px; margin: 0 auto 16px; line-height: 1.6;">
            Se você estiver abrindo o arquivo localmente (protocolo <code>file://</code>), as políticas de segurança do navegador (CORS) bloqueiam o carregamento de arquivos JSON externos.
          </p>
          <p style="font-family: var(--mono); font-size: 12px; color: var(--ink-7);">
            Para resolver: certifique-se de que <code>data/dados.js</code> está incluído no <code>index.html</code> ou execute um servidor local (ex: <code>npx serve</code> ou Live Server).
          </p>
        </div>
      `;
    }
  }
}

/* ============================================================================
   4. CONSTRUÇÃO DA MATRIZ PRINCIPAL
   ============================================================================ */

/**
 * Constrói a grade interativa da matriz (4x4) no elemento `#matrix`.
 */
function buildMatrix() {
  const matrix = document.getElementById('matrix');
  if (!matrix) return;

  matrix.innerHTML = '';

  // Canto superior esquerdo da grade com os indicadores dos eixos (Tempo / Proximidade)
  const corner = document.createElement('div');
  corner.className = 'corner';
  corner.innerHTML = `
    <div class="axis-y"><span class="axis-label">↑ Tempo</span></div>
    <div class="axis-x"><span class="axis-label">Proximidade →</span></div>
  `;
  matrix.appendChild(corner);

  // Cabeçalhos das 4 colunas (Eixo de Proximidade Causal A, B, C, D)
  COLUNAS_PROX.forEach(col => {
    const h = document.createElement('div');
    h.className = 'col-header';
    h.innerHTML = `
      <div>
        <div class="col-marker">${col.letra}</div>
        <div class="col-name">${col.nome}</div>
      </div>
      <div class="col-sub">${col.sub}</div>
    `;
    matrix.appendChild(h);
  });

  // Linhas da Matriz (Eixo de Escala Temporal 03, 02, 01, 00)
  LINHAS_TEMPO.forEach((row, rowIdx) => {
    const label = document.createElement('div');
    label.className = 'row-label' + (rowIdx === 0 ? ' first' : '');
    label.innerHTML = `
      <div class="row-num">${row.num}</div>
      <div class="row-name">${row.nome}</div>
      <div class="row-sub">${row.sub}</div>
    `;
    matrix.appendChild(label);

    COLUNAS_PROX.forEach((col, colIdx) => {
      const cell = document.createElement('div');
      cell.className = `cell ${col.classe}` + (rowIdx === 0 ? ' first-row' : '');
      const disciplinas = MATRIZ[`${rowIdx},${colIdx}`] || [];

      if (disciplinas.length === 0) {
        cell.innerHTML = '<div class="cell-empty">·</div>';
      } else {
        disciplinas.forEach(disc => {
          const btn = document.createElement('button');
          const count = (AUTORES[disc] || []).length;
          const has = count > 0;
          btn.className = 'discipline' + (has ? '' : ' empty-discipline');
          btn.innerHTML = `<span>${disc}</span>${has ? `<span class="count">${String(count).padStart(2, '0')}</span>` : ''}`;
          if (has) {
            btn.onclick = () => openDiscipline(disc);
          } else {
            btn.title = 'Sem autores cadastrados ainda';
          }
          cell.appendChild(btn);
        });
      }
      matrix.appendChild(cell);
    });
  });
}

/* ============================================================================
   5. GERENCIAMENTO DO OVERLAY / MODAL DA DISCIPLINA
   ============================================================================ */

/**
 * Abre o modal de detalhes de uma disciplina, exibindo suas listas de autores e teorias.
 * @param {string} disc - Nome da disciplina selecionada.
 */
function openDiscipline(disc) {
  currentDiscipline = disc;
  const autores = AUTORES[disc] || [];
  const teorias = TEORIAS[disc] || [];

  document.getElementById('discipline-name').textContent = disc;
  document.getElementById('discipline-desc').textContent = DESCRICOES[disc] || '';

  document.getElementById('count-authors').textContent =
    String(autores.length).padStart(2, '0');
  document.getElementById('count-theories').textContent =
    String(teorias.length).padStart(2, '0');

  const btnAuthors = document.getElementById('toggle-authors');
  const btnTheories = document.getElementById('toggle-theories');
  btnAuthors.disabled = autores.length === 0;
  btnTheories.disabled = teorias.length === 0;

  const initialView = autores.length > 0 ? 'authors' : (teorias.length > 0 ? 'theories' : 'authors');
  setView(initialView, false);

  const listA = document.getElementById('author-list');
  listA.innerHTML = '';
  autores.forEach((autor, idx) => {
    const row = document.createElement('div');
    row.className = 'author-entry';
    row.onclick = () => openAuthor(idx);
    row.innerHTML = `
      <div class="ae-num">${String(idx + 1).padStart(2, '0')}</div>
      <div class="ae-name">${autor.nome}</div>
      <div class="ae-period">${autor.periodo}</div>
      <div class="ae-arrow">→</div>
    `;
    listA.appendChild(row);
  });

  const listT = document.getElementById('theory-list');
  listT.innerHTML = '';
  teorias.forEach((teoria, idx) => {
    const row = document.createElement('div');
    row.className = 'theory-entry';
    row.onclick = () => openTheory(idx);
    row.innerHTML = `
      <div class="te-num">${String(idx + 1).padStart(2, '0')}</div>
      <div class="te-name">
        ${teoria.nome}
        <span class="te-author">${teoria.autor}</span>
      </div>
      <div class="te-year">${teoria.ano}</div>
      <div class="te-arrow">→</div>
    `;
    listT.appendChild(row);
  });

  updateDisciplineEyebrow();

  closeAll(false);
  document.getElementById('overlay-discipline').classList.add('active');
  document.body.style.overflow = 'hidden';
  document.getElementById('overlay-discipline').scrollTop = 0;
}

/**
 * Alterna entre as abas 'authors' e 'theories' no modal da disciplina.
 * @param {string} view - 'authors' ou 'theories'
 * @param {boolean} [scrollToTop=true] - Se deve rolar o modal até o topo
 */
function setView(view, scrollToTop = true) {
  currentView = view;
  const btnA = document.getElementById('toggle-authors');
  const btnT = document.getElementById('toggle-theories');
  const contentA = document.getElementById('view-authors-content');
  const contentT = document.getElementById('view-theories-content');

  if (view === 'authors') {
    btnA.classList.add('active');
    btnT.classList.remove('active');
    contentA.style.display = '';
    contentT.style.display = 'none';
  } else {
    btnT.classList.add('active');
    btnA.classList.remove('active');
    contentT.style.display = '';
    contentA.style.display = 'none';
  }

  updateDisciplineEyebrow();
  if (scrollToTop) {
    document.getElementById('overlay-discipline').scrollTop = 0;
  }
}

/**
 * Atualiza o texto do subtítulo/categoria no modal da disciplina.
 */
function updateDisciplineEyebrow() {
  if (!currentDiscipline) return;
  const autores = AUTORES[currentDiscipline] || [];
  const teorias = TEORIAS[currentDiscipline] || [];
  const n = currentView === 'authors' ? autores.length : teorias.length;
  const label = currentView === 'authors' ? 'autores' : 'teorias';
  document.getElementById('discipline-eyebrow').textContent =
    `Disciplina · ${String(n).padStart(2, '0')} ${label}`;
}

/* ============================================================================
   6. FICHA DETALHADA DO AUTOR
   ============================================================================ */

/**
 * Abre o modal com a biografia e contribuição detalhada de um autor.
 * @param {number} idx - Índice do autor na lista da disciplina atual.
 */
function openAuthor(idx) {
  if (!currentDiscipline) return;
  const autores = AUTORES[currentDiscipline];
  currentAuthorIdx = idx;
  const autor = autores[idx];
  if (!autor) return;

  document.getElementById('author-name').textContent = autor.nome;
  document.getElementById('author-period').textContent = autor.periodo;
  document.getElementById('author-discipline-tag').textContent = currentDiscipline;
  document.getElementById('author-index-tag').textContent =
    `Ficha ${String(idx + 1).padStart(2, '0')}`;
  document.getElementById('author-pagination').textContent =
    `${String(idx + 1).padStart(2, '0')} / ${String(autores.length).padStart(2, '0')}`;
  document.getElementById('author-back-label').textContent =
    `voltar para ${currentDiscipline.toLowerCase()}`;

  const m = autor.periodo.match(/(\d{4}).*?(\d{4}|presente)/);
  let lifespan = '';
  if (m) {
    if (m[2] === 'presente') {
      const age = new Date().getFullYear() - parseInt(m[1]);
      lifespan = `${age} anos`;
    } else {
      const age = parseInt(m[2]) - parseInt(m[1]);
      lifespan = `${age} anos de vida`;
    }
  }
  document.getElementById('author-lifespan').textContent = lifespan;

  const partes = autor.contribuicao.split('\n\n');
  document.getElementById('author-lede').textContent = partes[0] || '';
  const restoEl = document.getElementById('author-body');
  restoEl.innerHTML = '';
  partes.slice(1).forEach(p => {
    const para = document.createElement('p');
    para.textContent = p;
    restoEl.appendChild(para);
  });

  const heroBg = document.getElementById('hero-bg');
  const heroFb = document.getElementById('hero-fallback');
  const heroFbLetter = document.getElementById('hero-fallback-letter');
  heroFbLetter.textContent = autor.nome.charAt(0).toUpperCase();
  heroBg.style.display = 'none';
  heroFb.style.display = 'flex';

  const img = new Image();
  img.onload = () => {
    heroBg.style.backgroundImage = `url('fotos/${autor.foto}')`;
    heroBg.style.display = 'block';
    heroFb.style.display = 'none';
  };
  img.onerror = () => { /* Mantém fallback */ };
  img.src = `fotos/${autor.foto}`;

  const navPrev = document.getElementById('nav-prev');
  const navNext = document.getElementById('nav-next');
  if (idx > 0) {
    navPrev.disabled = false;
    document.getElementById('nav-prev-name').textContent = autores[idx - 1].nome;
  } else {
    navPrev.disabled = true;
    document.getElementById('nav-prev-name').textContent = '—';
  }
  if (idx < autores.length - 1) {
    navNext.disabled = false;
    document.getElementById('nav-next-name').textContent = autores[idx + 1].nome;
  } else {
    navNext.disabled = true;
    document.getElementById('nav-next-name').textContent = '—';
  }

  renderAuthorMeta(autor);

  document.getElementById('overlay-discipline').classList.remove('active');
  document.getElementById('overlay-author').classList.add('active');
  document.body.style.overflow = 'hidden';
  document.getElementById('overlay-author').scrollTop = 0;
}

/**
 * Renderiza tags, influências e lista de obras-chave da ficha do autor.
 * @param {Object} autor - Objeto do autor.
 */
function renderAuthorMeta(autor) {
  const container = document.getElementById('author-meta-section');
  container.innerHTML = '';
  const hasAny = (autor.tags && autor.tags.length) ||
    (autor.influencias !== undefined) ||
    (autor.obras && autor.obras.length);
  if (!hasAny) return;

  if (autor.tags && autor.tags.length) {
    const row = document.createElement('div');
    row.className = 'meta-row';
    row.innerHTML = `
      <div class="meta-label">Métodos e ferramentas</div>
      <div class="meta-content">
        <div class="tag-list">
          ${autor.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>
    `;
    container.appendChild(row);
  }

  if (autor.influencias !== undefined) {
    const row = document.createElement('div');
    row.className = 'meta-row';
    const influList = autor.influencias.length === 0
      ? '<span class="influence-empty">Sem influências mapeadas neste recorte</span>'
      : `<div class="influence-list">${autor.influencias.map(name => {
        const found = findAuthorByName(name);
        if (found) {
          return `<span class="influence-item" onclick="openAuthorByName('${name.replace(/'/g, "\\'")}')">${name} →</span>`;
        }
        return `<span class="influence-empty">${name}</span>`;
      }).join('')
      }</div>`;
    row.innerHTML = `
      <div class="meta-label">Influenciado por</div>
      <div class="meta-content">${influList}</div>
    `;
    container.appendChild(row);
  }

  if (autor.obras && autor.obras.length) {
    const row = document.createElement('div');
    row.className = 'meta-row';
    const items = autor.obras.map(o => {
      const linkHtml = o.link
        ? `<a class="work-link" href="${o.link}" target="_blank" rel="noopener" title="Abrir link">↗</a>`
        : `<span class="work-link disabled" title="Sem link cadastrado">↗</span>`;
      return `
        <div class="work-item">
          <div class="work-year">${o.ano}</div>
          <div class="work-title">${escapeHTML(o.titulo)}</div>
          ${linkHtml}
        </div>
      `;
    }).join('');
    row.innerHTML = `
      <div class="meta-label">Obras-chave</div>
      <div class="meta-content"><div class="works-list">${items}</div></div>
    `;
    container.appendChild(row);
  }
}

/**
 * Escapa caracteres HTML para evitar injeções XSS acidentais.
 * @param {string} s - Texto a ser escapado.
 * @returns {string}
 */
function escapeHTML(s) {
  return s.replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}

/**
 * Procura um autor por nome em qualquer disciplina.
 * @param {string} name - Nome do autor.
 * @returns {Object|null}
 */
function findAuthorByName(name) {
  for (const [disc, lista] of Object.entries(AUTORES)) {
    const idx = lista.findIndex(a => a.nome === name);
    if (idx !== -1) return { disciplina: disc, idx, autor: lista[idx] };
  }
  return null;
}

/**
 * Busca um autor pelo nome e abre sua ficha diretamente.
 * @param {string} name - Nome do autor.
 */
function openAuthorByName(name) {
  const f = findAuthorByName(name);
  if (!f) return;
  currentDiscipline = f.disciplina;
  openAuthor(f.idx);
}

/**
 * Navega entre autores da mesma disciplina.
 * @param {number} delta - Deslocamento.
 */
function navAuthor(delta) {
  const autores = AUTORES[currentDiscipline] || [];
  const newIdx = currentAuthorIdx + delta;
  if (newIdx >= 0 && newIdx < autores.length) {
    openAuthor(newIdx);
  }
}

/**
 * Retorna da ficha do autor para o modal da disciplina.
 */
function backToDiscipline() {
  if (currentDiscipline) {
    document.getElementById('overlay-author').classList.remove('active');
    setTimeout(() => {
      openDiscipline(currentDiscipline);
      setView('authors', false);
    }, 100);
  }
}

/* ============================================================================
   7. FICHA DETALHADA DA TEORIA
   ============================================================================ */

/**
 * Abre a ficha detalhada de uma teoria/hipótese.
 * @param {number} idx - Índice da teoria.
 */
function openTheory(idx) {
  if (!currentDiscipline) return;
  const teorias = TEORIAS[currentDiscipline] || [];
  currentTheoryIdx = idx;
  const teoria = teorias[idx];
  if (!teoria) return;

  const hero = document.getElementById('theory-hero');
  const formulaEl = document.getElementById('theory-formula');
  if (teoria.formula) {
    hero.classList.remove('no-formula');
    formulaEl.innerHTML = teoria.formula;
  } else {
    hero.classList.add('no-formula');
    formulaEl.innerHTML = '';
  }

  document.getElementById('theory-name').textContent = teoria.nome;
  document.getElementById('theory-author').textContent = teoria.autor;
  document.getElementById('theory-year').textContent = teoria.ano;
  document.getElementById('theory-discipline-tag').textContent = currentDiscipline;
  document.getElementById('theory-index-tag').textContent =
    `Ficha ${String(idx + 1).padStart(2, '0')}`;
  document.getElementById('theory-pagination').textContent =
    `${String(idx + 1).padStart(2, '0')} / ${String(teorias.length).padStart(2, '0')}`;
  document.getElementById('theory-back-label').textContent =
    `voltar para ${currentDiscipline.toLowerCase()}`;

  const partes = (teoria.descricao || '').split('\n\n');
  document.getElementById('theory-lede').textContent = partes[0] || '';
  const restoEl = document.getElementById('theory-body');
  restoEl.innerHTML = '';
  partes.slice(1).forEach(p => {
    const para = document.createElement('p');
    para.textContent = p;
    restoEl.appendChild(para);
  });

  const navPrev = document.getElementById('theory-nav-prev');
  const navNext = document.getElementById('theory-nav-next');
  if (idx > 0) {
    navPrev.disabled = false;
    document.getElementById('theory-nav-prev-name').textContent = teorias[idx - 1].nome;
  } else {
    navPrev.disabled = true;
    document.getElementById('theory-nav-prev-name').textContent = '—';
  }
  if (idx < teorias.length - 1) {
    navNext.disabled = false;
    document.getElementById('theory-nav-next-name').textContent = teorias[idx + 1].nome;
  } else {
    navNext.disabled = true;
    document.getElementById('theory-nav-next-name').textContent = '—';
  }

  document.getElementById('overlay-discipline').classList.remove('active');
  document.getElementById('overlay-theory').classList.add('active');
  document.body.style.overflow = 'hidden';
  document.getElementById('overlay-theory').scrollTop = 0;
}

/**
 * Navega entre teorias da mesma disciplina.
 * @param {number} delta - Deslocamento.
 */
function navTheory(delta) {
  const teorias = TEORIAS[currentDiscipline] || [];
  const newIdx = currentTheoryIdx + delta;
  if (newIdx >= 0 && newIdx < teorias.length) {
    openTheory(newIdx);
  }
}

/**
 * Retorna da ficha da teoria para a aba de teorias no modal da disciplina.
 */
function backToDisciplineFromTheory() {
  if (currentDiscipline) {
    document.getElementById('overlay-theory').classList.remove('active');
    setTimeout(() => {
      openDiscipline(currentDiscipline);
      setView('theories', false);
    }, 100);
  }
}

/* ============================================================================
   8. FECHAMENTO DE MODAIS E ATALHOS DE TECLADO
   ============================================================================ */

/**
 * Fecha todos os modais abertos.
 * @param {boolean} [restoreScroll=true]
 */
function closeAll(restoreScroll = true) {
  document.querySelectorAll('.overlay').forEach(o => o.classList.remove('active'));
  if (restoreScroll) document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAll();
  const authorActive = document.getElementById('overlay-author').classList.contains('active');
  const theoryActive = document.getElementById('overlay-theory').classList.contains('active');
  if (e.key === 'ArrowLeft') {
    if (authorActive) navAuthor(-1);
    else if (theoryActive) navTheory(-1);
  }
  if (e.key === 'ArrowRight') {
    if (authorActive) navAuthor(1);
    else if (theoryActive) navTheory(1);
  }
});

/* ============================================================================
   9. ALTERNADOR DE MODOS DE VISUALIZAÇÃO (Matriz / Influências / Cronologia)
   ============================================================================ */

/**
 * Alterna a exibição principal da página entre 'matrix', 'graph' e 'timeline'.
 * @param {string} mode - Modo selecionado.
 */
function setMode(mode) {
  currentMode = mode;
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
  const matrix = document.getElementById('view-matrix');
  const graph = document.getElementById('view-graph');
  const timeline = document.getElementById('view-timeline');
  const legend = document.getElementById('legend-block');

  matrix.style.display = (mode === 'matrix') ? '' : 'none';
  graph.style.display = (mode === 'graph') ? '' : 'none';
  timeline.style.display = (mode === 'timeline') ? '' : 'none';
  legend.style.display = (mode === 'matrix') ? '' : 'none';

  if (mode === 'graph' && !graph.dataset.built) {
    if (Object.keys(AUTORES).length > 0) {
      buildGraph();
      graph.dataset.built = 'true';
    }
  }
  if (mode === 'timeline' && !timeline.dataset.built) {
    if (Object.keys(AUTORES).length > 0) {
      buildTimeline();
      timeline.dataset.built = 'true';
    }
  }
}

/* ============================================================================
   10. VISUALIZAÇÃO: GRAFO DE INFLUÊNCIAS (SVG)
   ============================================================================ */

/**
 * Desenha o grafo em SVG com clusters de disciplinas, nós de autores e setas.
 */
function buildGraph() {
  const svg = document.getElementById('graph-svg');
  if (!svg) return;
  svg.innerHTML = '';

  const allEdges = [];
  const referencedNames = new Set();
  for (const [disc, lista] of Object.entries(AUTORES)) {
    lista.forEach(a => {
      if (a.influencias && a.influencias.length) {
        a.influencias.forEach(infl => {
          if (findAuthorByName(infl)) {
            allEdges.push({ from: infl, to: a.nome });
            referencedNames.add(infl);
            referencedNames.add(a.nome);
          }
        });
      }
    });
  }

  const byDisc = {};
  for (const [disc, lista] of Object.entries(AUTORES)) {
    const f = lista.filter(a => referencedNames.has(a.nome));
    if (f.length > 0) byDisc[disc] = f.sort((a, b) =>
      (parseAuthorYear(a.periodo) || 0) - (parseAuthorYear(b.periodo) || 0)
    );
  }

  const ordemPreferencial = [
    "Psicofísica",
    "Psicologia cognitiva",
    "Análise Experimental do Comportamento",
    "Economia comportamental",
    "Psicologia social",
    "Antropologia",
    "Etologia",
    "Neurociência",
    "Sociolinguística",
  ];
  const discsOrdered = ordemPreferencial.filter(d => byDisc[d]);
  Object.keys(byDisc).forEach(d => {
    if (!discsOrdered.includes(d)) discsOrdered.push(d);
  });

  const NODE_W = 122, NODE_H = 28;
  const NODE_GAP_X = 14, NODE_GAP_Y = 16;
  const CLUSTER_PAD_X = 18, CLUSTER_PAD_Y = 32;
  const CLUSTER_GAP = 28;

  function clusterDims(n) {
    const cols = n <= 4 ? Math.min(n, 2) : (n <= 9 ? 3 : 4);
    const rows = Math.ceil(n / cols);
    const w = cols * NODE_W + (cols - 1) * NODE_GAP_X + CLUSTER_PAD_X * 2;
    const h = rows * NODE_H + (rows - 1) * NODE_GAP_Y + CLUSTER_PAD_Y + 12;
    return { cols, rows, w, h };
  }

  const SVG_W_TARGET = svg.clientWidth || svg.parentElement?.clientWidth || 1200;
  const W = Math.max(SVG_W_TARGET, 1100);
  let curX = 16, curY = 16, rowMaxH = 0, totalH = 0;
  const clusterRects = [];

  discsOrdered.forEach(disc => {
    const autores = byDisc[disc];
    const dims = clusterDims(autores.length);
    if (curX + dims.w > W && curX > 16) {
      curX = 16;
      curY += rowMaxH + CLUSTER_GAP;
      rowMaxH = 0;
    }
    clusterRects.push({ disc, x: curX, y: curY, ...dims, autores });
    curX += dims.w + CLUSTER_GAP;
    rowMaxH = Math.max(rowMaxH, dims.h);
    totalH = Math.max(totalH, curY + dims.h);
  });

  const H = totalH + 32;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMin meet');
  svg.style.height = H + 'px';

  const positions = {};
  clusterRects.forEach(c => {
    c.autores.forEach((autor, i) => {
      const col = i % c.cols;
      const row = Math.floor(i / c.cols);
      const x = c.x + CLUSTER_PAD_X + col * (NODE_W + NODE_GAP_X);
      const y = c.y + CLUSTER_PAD_Y + row * (NODE_H + NODE_GAP_Y);
      positions[autor.nome] = { x, y, w: NODE_W, h: NODE_H, disciplina: c.disc };
    });
  });

  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5"
            markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" class="arrow-head"/>
    </marker>
    <marker id="arrow-hl" viewBox="0 0 10 10" refX="8" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" class="arrow-head-highlight"/>
    </marker>
  `;
  svg.appendChild(defs);

  const clustersGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  clustersGroup.setAttribute('id', 'clusters');
  svg.appendChild(clustersGroup);

  clusterRects.forEach(c => {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', c.x);
    rect.setAttribute('y', c.y);
    rect.setAttribute('width', c.w);
    rect.setAttribute('height', c.h);

    let col = '';
    for (const [key, discs] of Object.entries(MATRIZ)) {
      if (discs.includes(c.disc)) {
        col = ['A', 'B', 'C', 'D'][parseInt(key.split(',')[1])];
        break;
      }
    }
    rect.setAttribute('class', 'cluster-rect' + (col ? ' col-' + col : ''));
    clustersGroup.appendChild(rect);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', c.x + 12);
    label.setAttribute('y', c.y + 18);
    label.setAttribute('class', 'cluster-label');
    label.textContent = c.disc;
    clustersGroup.appendChild(label);
  });

  const edgeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  edgeGroup.setAttribute('id', 'edges');
  svg.appendChild(edgeGroup);

  const edgeElements = [];
  allEdges.forEach(e => {
    const p1 = positions[e.from];
    const p2 = positions[e.to];
    if (!p1 || !p2) return;

    const c1 = { x: p1.x + p1.w / 2, y: p1.y + p1.h / 2 };
    const c2 = { x: p2.x + p2.w / 2, y: p2.y + p2.h / 2 };
    const dx = c2.x - c1.x;
    const dy = c2.y - c1.y;

    let sx, sy, tx, ty;
    if (Math.abs(dx) > Math.abs(dy)) {
      sx = c1.x + (dx > 0 ? p1.w / 2 : -p1.w / 2);
      sy = c1.y;
      tx = c2.x + (dx > 0 ? -p2.w / 2 : p2.w / 2);
      ty = c2.y;
    } else {
      sx = c1.x;
      sy = c1.y + (dy > 0 ? p1.h / 2 : -p1.h / 2);
      tx = c2.x;
      ty = c2.y + (dy > 0 ? -p2.h / 2 : p2.h / 2);
    }

    const cx1 = sx + (tx - sx) * 0.5;
    const cy1 = sy;
    const cx2 = tx - (tx - sx) * 0.5;
    const cy2 = ty;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${sx},${sy} C ${cx1},${cy1} ${cx2},${cy2} ${tx},${ty}`);
    path.setAttribute('class', 'edge');
    path.setAttribute('marker-end', 'url(#arrow)');
    path.dataset.from = e.from;
    path.dataset.to = e.to;
    edgeGroup.appendChild(path);
    edgeElements.push(path);
  });

  const nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  nodesGroup.setAttribute('id', 'nodes');
  svg.appendChild(nodesGroup);

  Object.entries(positions).forEach(([nome, pos]) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'node-group');
    g.dataset.name = nome;
    g.style.cursor = 'pointer';

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', pos.x);
    rect.setAttribute('y', pos.y);
    rect.setAttribute('width', pos.w);
    rect.setAttribute('height', pos.h);
    rect.setAttribute('class', 'node-bg');
    g.appendChild(rect);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', pos.x + pos.w / 2);
    label.setAttribute('y', pos.y + pos.h / 2 + 1);
    label.setAttribute('class', 'node-label');
    label.textContent = compactName(nome);
    g.appendChild(label);

    g.addEventListener('click', () => openAuthorByName(nome));
    g.addEventListener('mouseenter', () => highlightNode(nome));
    g.addEventListener('mouseleave', () => clearHighlight());

    nodesGroup.appendChild(g);
  });

  svg._edges = edgeElements;
  svg._nodes = nodesGroup;
}

/**
 * Formata um nome longo de autor para um formato mais compacto.
 * @param {string} name - Nome completo.
 * @returns {string}
 */
function compactName(name) {
  if (name.includes('&')) return name;
  const parts = name.split(' ');
  if (parts.length <= 2) return name;
  if (name.includes(' y ')) return parts.slice(-3).join(' ');
  if (name.includes(' von ') || name.includes(' van ') || name.includes(' de ')) {
    const idx = parts.findIndex(p => ['von', 'van', 'de'].includes(p.toLowerCase()));
    return parts.slice(idx).join(' ');
  }
  if (parts[0].endsWith('.')) return name;
  return `${parts[0][0]}. ${parts.slice(-1).join(' ')}`;
}

/**
 * Destaca as conexões de um nó ao passar o mouse.
 * @param {string} name - Nome do autor.
 */
function highlightNode(name) {
  const svg = document.getElementById('graph-svg');
  if (!svg) return;
  const edges = svg._edges || [];
  const nodes = svg._nodes;
  if (!nodes) return;

  const connected = new Set([name]);
  edges.forEach(e => {
    const isConnected = e.dataset.from === name || e.dataset.to === name;
    if (isConnected) {
      if (e.dataset.from === name) connected.add(e.dataset.to);
      if (e.dataset.to === name) connected.add(e.dataset.from);
      e.classList.add('highlight');
      e.classList.remove('dimmed');
      e.setAttribute('marker-end', 'url(#arrow-hl)');
    } else {
      e.classList.remove('highlight');
      e.classList.add('dimmed');
      e.setAttribute('marker-end', 'url(#arrow)');
    }
  });

  nodes.querySelectorAll('.node-group').forEach(g => {
    const n = g.dataset.name;
    g.classList.toggle('highlight', n === name);
    g.classList.toggle('dimmed', !connected.has(n));
  });
}

/**
 * Limpa o destaque de conexões.
 */
function clearHighlight() {
  const svg = document.getElementById('graph-svg');
  if (!svg) return;
  (svg._edges || []).forEach(e => {
    e.classList.remove('highlight');
    e.classList.remove('dimmed');
    e.setAttribute('marker-end', 'url(#arrow)');
  });
  if (svg._nodes) {
    svg._nodes.querySelectorAll('.node-group').forEach(g => {
      g.classList.remove('highlight');
      g.classList.remove('dimmed');
    });
  }
}

/* ============================================================================
   11. VISUALIZAÇÃO: CRONOLOGIA / LINHA DO TEMPO
   ============================================================================ */

function parseAuthorYear(periodo) {
  const m = (periodo || '').match(/(\d{4})/);
  return m ? parseInt(m[1]) : null;
}

function parseAuthorDeath(periodo) {
  const m = (periodo || '').match(/(\d{4})\s*[–\-]\s*(\d{4}|presente)/);
  if (!m) return null;
  return m[2] === 'presente' ? new Date().getFullYear() : parseInt(m[2]);
}

/**
 * Constrói a linha do tempo com barras de vida e avatares.
 */
function buildTimeline() {
  const container = document.getElementById('timeline-container');
  if (!container) return;
  container.innerHTML = '';

  const byDisc = {};
  for (const [disc, lista] of Object.entries(AUTORES)) {
    const valid = lista.filter(a => parseAuthorYear(a.periodo));
    if (valid.length === 0) continue;
    byDisc[disc] = valid;
  }

  let yearMin = Infinity, yearMax = -Infinity;
  Object.values(byDisc).flat().forEach(a => {
    const y1 = parseAuthorYear(a.periodo);
    const y2 = parseAuthorDeath(a.periodo) || new Date().getFullYear();
    if (y1 < yearMin) yearMin = y1;
    if (y2 > yearMax) yearMax = y2;
  });
  yearMin = Math.floor(yearMin / 20) * 20;
  yearMax = Math.ceil(yearMax / 20) * 20;
  const totalYears = yearMax - yearMin;

  const PX_PER_YEAR = 7;
  const trackWidth = totalYears * PX_PER_YEAR;
  const yearToX = y => (y - yearMin) * PX_PER_YEAR;

  const ordemPreferencial = [
    "Psicofísica",
    "Psicologia cognitiva",
    "Análise Experimental do Comportamento",
    "Economia comportamental",
    "Psicologia social",
    "Antropologia",
    "Etologia",
    "Neurociência",
    "Sociolinguística",
  ];
  const discsOrdered = ordemPreferencial.filter(d => byDisc[d]);
  Object.keys(byDisc).forEach(d => {
    if (!discsOrdered.includes(d)) discsOrdered.push(d);
  });

  const inner = document.createElement('div');
  inner.className = 'timeline-scroll-inner';
  inner.style.width = (180 + trackWidth + 200) + 'px';
  container.appendChild(inner);

  const axisWrapper = document.createElement('div');
  axisWrapper.style.cssText = `
    display: grid;
    grid-template-columns: 180px 1fr;
    position: sticky;
    top: 0;
    z-index: 6;
    background: var(--paper-pure);
    border-bottom: 1px solid var(--ink-9);
  `;
  const axisLeftPad = document.createElement('div');
  axisLeftPad.style.cssText = `
    background: var(--paper-pure);
    border-right: 1px solid var(--ink-2);
    padding: 12px 16px;
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.12em;
    color: var(--ink-7);
    text-transform: uppercase;
  `;
  axisLeftPad.textContent = '↓ Disciplinas / Tempo →';
  axisWrapper.appendChild(axisLeftPad);

  const axis = document.createElement('div');
  axis.className = 'timeline-axis';
  axis.style.cssText = `
    position: relative;
    height: 40px;
    margin-left: 0;
    border-bottom: none;
    width: ${trackWidth + 200}px;
  `;
  for (let y = yearMin; y <= yearMax; y += 20) {
    const tick = document.createElement('div');
    tick.className = 'timeline-tick';
    tick.style.left = yearToX(y) + 'px';
    tick.textContent = y;
    axis.appendChild(tick);
  }
  axisWrapper.appendChild(axis);
  inner.appendChild(axisWrapper);

  discsOrdered.forEach((disc) => {
    const block = document.createElement('div');
    block.className = 'timeline-discipline';

    const labelCell = document.createElement('div');
    labelCell.className = 'timeline-discipline-name';
    labelCell.innerHTML = `
      <div class="td-name">${disc}</div>
      <div class="td-count">${String(byDisc[disc].length).padStart(2, '0')} autores</div>
    `;
    block.appendChild(labelCell);

    const track = document.createElement('div');
    track.className = 'timeline-track';
    track.style.width = (trackWidth + 200) + 'px';

    for (let y = yearMin; y <= yearMax; y += 20) {
      const grid = document.createElement('div');
      grid.className = 'timeline-grid-line';
      grid.style.left = yearToX(y) + 'px';
      grid.style.height = '100%';
      track.appendChild(grid);
    }

    const autores = [...byDisc[disc]].sort((a, b) =>
      parseAuthorYear(a.periodo) - parseAuthorYear(b.periodo)
    );

    const SUBLANE_HEIGHT = 44;
    const ESTIMATED_NAME_PX = 130;
    const lanes = [];

    autores.forEach(autor => {
      const y1 = parseAuthorYear(autor.periodo);
      const y2 = parseAuthorDeath(autor.periodo) || new Date().getFullYear();
      const startX = yearToX(y1) - 16;
      const endX = yearToX(y2) + ESTIMATED_NAME_PX;

      let laneIdx = lanes.findIndex(end => end + 12 < startX);
      if (laneIdx === -1) {
        laneIdx = lanes.length;
        lanes.push(endX);
      } else {
        lanes[laneIdx] = endX;
      }
      autor._lane = laneIdx;
      autor._startX = yearToX(y1);
      autor._endX = yearToX(y2);
    });

    track.style.minHeight = (lanes.length * SUBLANE_HEIGHT + 16) + 'px';

    autores.forEach(autor => {
      const lane = autor._lane;

      const row = document.createElement('div');
      row.className = 'timeline-author-row';
      row.style.top = (lane * SUBLANE_HEIGHT + 6) + 'px';
      row.style.left = '0';
      row.style.right = '0';
      row.style.position = 'absolute';
      row.style.height = SUBLANE_HEIGHT + 'px';

      const bar = document.createElement('div');
      bar.className = 'timeline-life-bar';
      bar.style.left = autor._startX + 'px';
      bar.style.width = Math.max(2, autor._endX - autor._startX) + 'px';
      bar.title = `${autor.nome} (${autor.periodo})`;
      row.appendChild(bar);

      const avatar = document.createElement('div');
      avatar.className = 'timeline-avatar';
      avatar.style.left = autor._startX + 'px';
      avatar.title = `${autor.nome} (${autor.periodo})`;

      const initials = (autor.nome || '').split(/\s+/)
        .filter(p => /^[A-Za-zÀ-ÿ]/.test(p))
        .slice(0, 2).map(p => p[0].toUpperCase()).join('');
      avatar.textContent = initials || '?';
      if (autor.foto) {
        const img = new Image();
        img.onload = () => {
          avatar.textContent = '';
          avatar.appendChild(img);
        };
        img.src = `fotos/${autor.foto}`;
      }
      row.appendChild(avatar);

      if (autor.obras && autor.obras.length) {
        autor.obras.forEach(o => {
          const oy = parseInt((o.ano || '').match(/\d{4}/)?.[0]);
          if (!oy || oy < yearMin || oy > yearMax) return;
          const dot = document.createElement('div');
          dot.className = 'timeline-work-dot';
          dot.style.left = yearToX(oy) + 'px';
          dot.title = `${o.ano} — ${o.titulo}`;
          row.appendChild(dot);
        });
      }

      const nameEl = document.createElement('div');
      nameEl.className = 'timeline-author-name';
      nameEl.style.left = (autor._startX + 22) + 'px';
      nameEl.innerHTML = `${autor.nome}<span class="timeline-author-period">${autor.periodo}</span>`;
      row.appendChild(nameEl);

      row.onclick = () => {
        const f = findAuthorByName(autor.nome);
        if (f) { currentDiscipline = f.disciplina; openAuthor(f.idx); }
      };

      track.appendChild(row);
    });

    block.appendChild(track);
    inner.appendChild(block);
  });
}

/* ============================================================================
   12. INICIALIZAÇÃO DA APLICAÇÃO
   ============================================================================ */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
