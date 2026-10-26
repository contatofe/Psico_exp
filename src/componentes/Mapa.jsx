import { useRef, useState } from 'react';
import { colunas, disciplinaPorId, disciplinas, linhas } from '../lib/dados';
import { link } from '../lib/rota';
import { AlternarVista, Icone } from './Interface';

const ALCANCE = ['10⁵ – 10⁷ anos', '10³ – 10⁵ anos', '1 – 10² anos', '1 s – 10³ s'];
const CURTO = ['Evolutivo', 'Histórico', 'Desenvolv.', 'Imediato'];
const raio = d => 4.4 * Math.sqrt(d.autores.length);
const quebravel = s => s.replace('/', '/\u200b').replace('Desenvolvimental', 'Desenvol_\u200bvimental');

function vizinho(atual, tecla, lista) {
  const [eixo, sinal] = { ArrowRight: ['x', 1], ArrowLeft: ['x', -1], ArrowDown: ['y', 1], ArrowUp: ['y', -1] }[tecla];
  const outro = eixo === 'x' ? 'y' : 'x';
  let melhor = null, nota = Infinity;
  for (const d of lista) {
    const passo = (d[eixo] - atual[eixo]) * sinal;
    if (passo <= 0.5) continue;
    const n = passo + 2.5 * Math.abs(d[outro] - atual[outro]);
    if (n < nota) { nota = n; melhor = d; }
  }
  return melhor;
}

export function Mapa({ colunaInicial }) {
  const plano = useRef(null);
  const toque = useRef({ touch: false, selecionado: false });
  const [foco, setFoco] = useState(null);
  const [coluna, setColuna] = useState(colunas.some(c => c.letra === colunaInicial) ? colunaInicial : '');
  const [vista, setVista] = useState('mapa');
  const [nomes, setNomes] = useState(false);
  const visiveis = disciplinas.filter(d => !coluna || colunas[d.coluna].letra === coluna);

  const filtrar = valor => { setColuna(valor); setFoco(null); };
  const mover = e => {
    if (e.pointerType !== 'mouse') return;
    const r = plano.current.getBoundingClientRect();
    plano.current.style.setProperty('--mira-x', `${e.clientX - r.left}px`);
    plano.current.style.setProperty('--mira-y', `${e.clientY - r.top}px`);
  };
  const teclas = e => {
    const atual = disciplinaPorId[e.target.dataset?.id];
    if (!atual || !['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
    e.preventDefault();
    const prox = vizinho(atual, e.key, visiveis);
    if (prox) plano.current.querySelector(`[data-id="${prox.id}"]`).focus();
  };
  const clicar = e => {
    if (toque.current.touch && !toque.current.selecionado) e.preventDefault();
    toque.current.touch = false;
  };

  return (
    <figure className="figura">
      <div className="mapa-cabeca">
        <h1>O mapa<span className="titulo-ponto">.</span></h1>
        <div className="mapa-ferramentas">
          <button className="controle" type="button" aria-pressed={nomes} disabled={vista !== 'mapa'} onClick={() => setNomes(!nomes)}>Mostrar nomes</button>
          <AlternarVista valor={vista} onChange={setVista} opcoes={[[ 'mapa', 'Mapa', 'mapa' ], [ 'lista', 'Índice', 'lista' ]]} />
        </div>
      </div>
      <div className="mapa-filtros" role="group" aria-label="Filtrar por proximidade causal">
        <button type="button" aria-pressed={!coluna} onClick={() => filtrar('')}>Todas <span>{disciplinas.length}</span></button>
        {colunas.map((c, i) => <button key={c.letra} type="button" className={`col-${i}`} aria-pressed={coluna === c.letra} onClick={() => filtrar(coluna === c.letra ? '' : c.letra)}><i aria-hidden="true" /><b>{c.letra}</b><span>{c.nome}</span></button>)}
      </div>

      {vista === 'mapa' ? <>
        <div className="figura-grafico">
          <div className="eixo-y">
            <span className="eixo-canto">Tempo ↑<br />Proximidade →</span>
            {linhas.map((l, i) => <div key={l.num} className={'faixa-y' + (foco?.linha === i ? ' ativa' : '')}>
              <em>{l.num}</em><strong className="nome-longo">{quebravel(l.nome)}</strong><strong className="nome-curto" aria-hidden="true">{CURTO[i]}</strong><span>{ALCANCE[i]}</span>
            </div>)}
          </div>
          <div className="area-plano">
            <div className="titulos-colunas">{colunas.map((c, i) => <div key={c.letra} className={`titulo-coluna col-${i}` + (coluna && coluna !== c.letra ? ' atenuada' : '')}><b>{c.letra.toLowerCase()}.</b><span>{c.nome.toLowerCase().replace(' / ', '/\u200b')}</span></div>)}</div>
            <div ref={plano} className={'plano' + (foco ? ' com-foco' : '') + (nomes ? ' com-nomes' : '')} onPointerMove={mover} onKeyDown={teclas}>
              {colunas.map((c, i) => <span key={c.letra} className={`campo-coluna col-${i}` + (coluna && coluna !== c.letra ? ' atenuada' : '')} style={{ left: `${i * 25}%` }} />)}
              {foco && <span className="campo-linha" style={{ top: `${foco.linha * 25}%` }} />}
              {[0, 1, 2, 3, 4].map(i => <span key={i} className="grade-h" style={{ top: `${i * 25}%` }} />)}
              <span className="mira-v" /><span className="mira-h" />
              {visiveis.map(d => <a key={d.id} data-id={d.id} href={link('disciplina', d.id)} aria-label={`${d.nome}, ${d.endereco}`}
                className={`ponto col-${d.coluna}` + (foco === d ? ' ativo' : '') + (d.x > 72 ? ' rotulo-esquerda' : '')}
                style={{ left: `${d.x}%`, top: `${d.y}%`, '--d': `${raio(d) * 2}px` }}
                onPointerDown={e => { toque.current = { touch: e.pointerType !== 'mouse', selecionado: foco === d }; }}
                onClick={clicar} onPointerEnter={e => e.pointerType === 'mouse' && setFoco(d)}
                onPointerLeave={e => e.pointerType === 'mouse' && setFoco(null)} onFocus={() => setFoco(d)}>
                <i aria-hidden="true" /><span aria-hidden="true">{d.nome}</span>
              </a>)}
            </div>
          </div>
        </div>
        <div className={'mapa-leitura' + (foco ? ` col-${foco.coluna}` : '')} aria-live="polite" aria-atomic="true">
          <span className="leitura-coordenada">{foco?.endereco || '↳'}</span>
          <div>{foco ? <><strong>{foco.nome}</strong><span>{foco.autores.length} autores · {foco.teorias.length} teorias</span></> : <><strong>Escolha um ponto para explorar</strong><span>Passe o cursor, use as setas do teclado ou toque em uma disciplina.</span></>}</div>
          {foco && <a className="leitura-abrir" href={link('disciplina', foco.id)}>Abrir disciplina <Icone /></a>}
        </div>
      </> : <div className="indice-disciplinas">{linhas.map((l, i) => {
        const lista = visiveis.filter(d => d.linha === i);
        return lista.length > 0 && <section key={l.num}><h2><span>{l.num}</span>{l.nome}</h2><ul>{lista.map(d => <li key={d.id}><a className={`col-${d.coluna}`} href={link('disciplina', d.id)}><b className="endereco">{d.endereco}</b><span>{d.nome}<small>{d.autores.length} autores · {d.teorias.length} teorias</small></span><Icone /></a></li>)}</ul></section>;
      })}</div>}
      <figcaption className="legenda"><b>Fig.01_</b> {disciplinas.length} disciplinas posicionadas pela escala de tempo e pela proximidade causal das explicações que produzem; dentro de cada célula, a posição não tem significado. Área do ponto proporcional ao número de autores. <a href={link('sobre')}>Como ler este mapa</a></figcaption>
    </figure>
  );
}
