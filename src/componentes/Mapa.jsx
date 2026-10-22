import { useRef, useState } from 'react';
import { colunas, disciplinaPorId, disciplinas, linhas } from '../lib/dados';
import { link } from '../lib/rota';

// Faixa coberta por cada linha da matriz (de cima para baixo: evolutivo → imediato).
const ALCANCE = ['10⁵ – 10⁷ anos', '10³ – 10⁵ anos', '1 – 10² anos', '1 s – 10³ s'];
const CURTO = ['Evolutivo', 'Histórico', 'Desenvolv.', 'Imediato'];   // eixo estreito no celular
// área do ponto ∝ número de autores
const raio = d => 4.4 * Math.sqrt(d.autores.length);
// permite quebrar "Histórico/cultural" depois da barra
const quebravel = s => s.replace('/', '/​');

/** Ponto mais próximo na direção da seta, a partir das coordenadas do gráfico. */
function vizinho(atual, tecla) {
  const [eixo, sinal] = { ArrowRight: ['x', 1], ArrowLeft: ['x', -1], ArrowDown: ['y', 1], ArrowUp: ['y', -1] }[tecla];
  const outro = eixo === 'x' ? 'y' : 'x';
  let melhor = null, nota = Infinity;
  for (const d of disciplinas) {
    const passo = (d[eixo] - atual[eixo]) * sinal;
    if (passo <= 0.5) continue;
    const n = passo + 2.5 * Math.abs(d[outro] - atual[outro]);
    if (n < nota) { nota = n; melhor = d; }
  }
  return melhor;
}

/** Figura 1: as disciplinas plotadas por escala temporal (Y) e proximidade causal (X). */
export function Mapa() {
  const plano = useRef(null);
  const toque = useRef(false);
  const [mira, setMira] = useState(null);   // { x, y } em % do plano
  const [foco, setFoco] = useState(null);   // disciplina sob o cursor, o teclado ou o primeiro toque

  const alvo = foco ? { x: foco.x, y: foco.y } : mira;
  const linhaAtiva = alvo ? Math.min(3, Math.floor(alvo.y / 25)) : null;
  const colunaAtiva = alvo ? Math.min(3, Math.floor(alvo.x / 25)) : null;

  const mover = e => {
    if (e.pointerType !== 'mouse') return;
    const r = plano.current.getBoundingClientRect();
    setMira({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  const teclas = e => {
    const atual = disciplinaPorId[e.target.dataset?.id];
    if (!atual || !e.key.startsWith('Arrow')) return;
    const prox = vizinho(atual, e.key);
    if (!prox) return;
    e.preventDefault();
    plano.current.querySelector(`[data-id="${prox.id}"]`).focus();
  };

  // no toque não há hover: o primeiro toque mostra o nome, o segundo abre a disciplina
  const clicar = (e, d) => {
    if (toque.current && foco !== d) { e.preventDefault(); setFoco(d); }
  };

  return (
    <figure className="figura">
      <div className="figura-barra">
        <h1>Comportamento humano em duas coordenadas</h1>
        <output className="leitura" aria-live="polite">
          {foco
            ? <><b className={`endereco col-${foco.coluna}`}>{foco.endereco}</b> {foco.nome}{' '}
                <small>{foco.autores.length} autores · {foco.teorias.length} teorias</small>
                {toque.current && <a className="leitura-abrir" href={link('disciplina', foco.id)}>Abrir →</a>}</>
            : alvo
              ? <><b>{colunas[colunaAtiva].letra}·{linhas[linhaAtiva].num}</b> {linhas[linhaAtiva].nome} × {colunas[colunaAtiva].nome.toLowerCase()}</>
              : <small className="dica">Passe o cursor sobre os pontos · toque uma vez para ver o nome</small>}
        </output>
      </div>

      <div className="figura-grafico">
        <div className="eixo-y">
          <span className="eixo-canto">↑ Tempo<br />Proximidade →</span>
          {linhas.map((l, i) => (
            <div key={l.num} className={'faixa-y' + (linhaAtiva === i ? ' ativa' : '')}>
              <em>{l.num}</em>
              <strong className="nome-longo">{quebravel(l.nome)}</strong>
              <strong className="nome-curto" aria-hidden="true">{CURTO[i]}</strong>
              <span>{ALCANCE[i]}</span>
            </div>
          ))}
        </div>

        <div className="area-plano">
          <div className="abas-colunas">
            {colunas.map((c, i) => (
              <div key={c.letra} className={`aba aba-coluna col-${i}` + (colunaAtiva === i ? ' ativa' : '')}>
                <strong>{c.letra}</strong> <span>{c.nome}</span>
              </div>
            ))}
          </div>

          <div ref={plano} className={'plano' + (foco ? ' com-foco' : '')}
            onPointerDown={e => { toque.current = e.pointerType !== 'mouse'; }}
            onPointerMove={mover} onPointerLeave={() => setMira(null)} onKeyDown={teclas}>
            {colunas.map((c, i) => <span key={c.letra} className={`campo-coluna col-${i}`} style={{ left: `${i * 25}%` }} />)}
            {linhaAtiva != null && <span className="campo-linha" style={{ top: `${linhaAtiva * 25}%` }} />}
            {[1, 2, 3].map(i => <span key={'h' + i} className="grade-h" style={{ top: `${i * 25}%` }} />)}

            {alvo && (
              <>
                <span className="mira-v" style={{ left: `${alvo.x}%` }} />
                <span className="mira-h" style={{ top: `${alvo.y}%` }} />
              </>
            )}

            {disciplinas.map((d, i) => (
              <a key={d.id} data-id={d.id} href={link('disciplina', d.id)} aria-label={d.nome}
                className={`ponto col-${d.coluna}` + (foco === d ? ' ativo' : '') + (d.x > 72 ? ' rotulo-esquerda' : '')}
                style={{ left: `${d.x}%`, top: `${d.y}%`, '--d': `${raio(d) * 2}px`, '--atraso': `${(3 - d.linha) * 90 + (i % 5) * 25}ms` }}
                onClick={e => clicar(e, d)}
                onPointerEnter={e => e.pointerType === 'mouse' && setFoco(d)}
                onPointerLeave={e => e.pointerType === 'mouse' && setFoco(null)}
                onFocus={() => setFoco(d)} onBlur={() => !toque.current && setFoco(null)}>
                <i aria-hidden="true" />
                <span aria-hidden="true">{d.nome}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <figcaption className="legenda">
        <b>Fig. 1</b> {disciplinas.length} disciplinas posicionadas pela escala de tempo e pela proximidade causal das
        explicações que produzem; dentro de cada célula, a posição não tem significado. Área do ponto proporcional ao
        número de autores. <a href={link('sobre')}>Como ler este mapa</a>
      </figcaption>
    </figure>
  );
}
