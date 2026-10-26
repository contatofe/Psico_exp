import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ANO_ATUAL, autores, disciplinas } from '../lib/dados';
import { link, useTitulo } from '../lib/rota';
import { Retrato } from '../componentes/Autor';

// Cada autor aparece uma vez, na sua disciplina principal (lista já vem por nascimento). Dentro da disciplina,
// autores que se sobrepõem no tempo vão para faixas (lanes) diferentes.
const FAIXA = 46, ESPACO_NOME = 150, FOLGA = 28;
const INICIO = Math.floor(Math.min(...autores.map(a => a.nasc)) / 20) * 20;
const FIM = Math.ceil(ANO_ATUAL / 20) * 20;
const MARCAS = Array.from({ length: (FIM - INICIO) / 20 + 1 }, (_, i) => INICIO + i * 20);

const ZOOM_PADRAO = 7, ZOOM_MIN = 2.5, ZOOM_MAX = 24;
const limitar = z => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));

function montar(px, filtro) {
  const xDe = ano => (ano - INICIO) * px + FOLGA;
  const grupos = disciplinas
    .filter(d => !filtro || d.id === filtro)
    .map(d => {
      const lista = d.autores.filter(a => a.disciplinas[0] === d.nome);
      const faixas = [];
      const itens = lista.map(a => {
        const ini = xDe(a.nasc), fim = xDe(a.morte ?? ANO_ATUAL);
        let f = faixas.findIndex(ocupada => ocupada + 16 < ini);
        if (f === -1) f = faixas.push(0) - 1;
        faixas[f] = Math.max(fim, ini + ESPACO_NOME);
        return { a, ini, fim, f };
      });
      return { d, itens, altura: faixas.length * FAIXA + 12 };
    })
    .filter(g => g.itens.length)
    .sort((a, b) => a.itens[0].ini - b.itens[0].ini); // escada: disciplinas mais antigas primeiro
  return { xDe, grupos, largura: xDe(FIM) + ESPACO_NOME };
}

export default function Cronologia() {
  useTitulo('Cronologia');
  const [px, setPx] = useState(ZOOM_PADRAO);
  const [filtro, setFiltro] = useState('');
  const moldura = useRef(null);
  const ancora = useRef(null);   // { ano, desvio }: o ano que deve continuar sob o mesmo ponto da tela
  const { xDe, grupos, largura } = useMemo(() => montar(px, filtro), [px, filtro]);

  // muda o zoom mantendo o ano sob o cursor (ou no centro da moldura)
  const zoom = (fator, clienteX) => {
    const el = moldura.current;
    const r = el.getBoundingClientRect();
    const rotulo = el.querySelector('.crono-rotulo').offsetWidth;   // coluna fixa dos nomes (varia no celular)
    const desvio = clienteX != null ? clienteX - r.left : (r.width + rotulo) / 2;
    ancora.current = { ano: (el.scrollLeft + desvio - rotulo - FOLGA) / px + INICIO, desvio, rotulo };
    setPx(limitar(px * fator));
  };

  useLayoutEffect(() => {
    if (!ancora.current) return;
    const { ano, desvio, rotulo } = ancora.current;
    moldura.current.scrollLeft = (ano - INICIO) * px + FOLGA + rotulo - desvio;
    ancora.current = null;
  }, [px]);

  // Ctrl/⌘ + roda do mouse (ou pinça do trackpad) dá zoom; o ouvinte precisa ser não passivo
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;
  useEffect(() => {
    const el = moldura.current;
    const roda = e => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      zoomRef.current(Math.exp(-e.deltaY * 0.01), e.clientX);
    };
    el.addEventListener('wheel', roda, { passive: false });
    return () => el.removeEventListener('wheel', roda);
  }, []);

  return (
    <article className="pagina">
      <header className="cabeca">
        <h1>Cronologia<span className="titulo-ponto">.</span></h1>
        <p className="lede">
          Cada barra é uma vida; cada ponto, uma obra-chave, de {INICIO} até hoje. Use o zoom para ver as
          décadas de perto ou o século inteiro.
        </p>
      </header>

      <label className="campo crono-filtro"><span>Disciplina</span><select value={filtro} onChange={e => setFiltro(e.target.value)}><option value="">Todas as disciplinas</option>{disciplinas.filter(d => d.autores.some(a => a.disciplinas[0] === d.nome)).map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}</select></label>
      <div className="crono-ferramentas" role="group" aria-label="Zoom da linha do tempo">
        <button type="button" onClick={() => zoom(1 / 1.35)} disabled={px <= ZOOM_MIN} aria-label="Reduzir zoom">−</button>
        <output aria-live="polite">{Math.round((px / ZOOM_PADRAO) * 100)}%</output>
        <button type="button" onClick={() => zoom(1.35)} disabled={px >= ZOOM_MAX} aria-label="Aumentar zoom">+</button>
        <button type="button" className="crono-reset" onClick={() => zoom(ZOOM_PADRAO / px)} disabled={px === ZOOM_PADRAO}>Restaurar</button>
        <span className="crono-dica">Ctrl ou ⌘ + roda do mouse também funciona</span>
      </div>

      <div className="crono-moldura" ref={moldura} tabIndex={0} aria-label="Linha do tempo. Use as setas para rolar.">
        <div className="crono" style={{ '--largura': largura + 'px' }}>
          <div className="crono-eixo">
            <div className="crono-rotulo">Disciplina</div>
            <div className="crono-trilho">
              {MARCAS.map(ano => <span key={ano} className="crono-marca" style={{ left: xDe(ano) }}>{ano}</span>)}
            </div>
          </div>
          {grupos.map(({ d, itens, altura }) => (
            <section key={d.id} className={`crono-grupo col-${d.coluna}`}>
              <a className="crono-rotulo" href={link('disciplina', d.id)}>{d.nome}<small>{itens.length}</small></a>
              <div className="crono-trilho" style={{ height: altura }}>
                {MARCAS.map(ano => <span key={ano} className="crono-grade" style={{ left: xDe(ano) }} />)}
                {itens.map(({ a, ini, fim, f }) => (
                  <a key={a.id} className="crono-vida" href={link('autor', a.id)} style={{ top: f * FAIXA + 8, left: ini }}
                    title={`${a.nome} (${a.periodo})`}>
                    <span className={'crono-barra' + (a.morte ? '' : ' viva')} style={{ width: Math.max(fim - ini, 2) }} />
                    {a.obras.map(o => {
                      const ano = parseInt(o.ano);
                      return ano >= a.nasc && <span key={o.titulo} className="crono-obra" style={{ left: xDe(ano) - ini }} title={`${o.ano} · ${o.titulo}`} />;
                    })}
                    <Retrato autor={a} mini />
                    <span className="crono-nome">{a.nome}<small>{a.periodo}</small></span>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
