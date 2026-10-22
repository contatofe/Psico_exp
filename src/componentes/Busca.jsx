import { useEffect, useRef, useState } from 'react';
import { autores, corDe, disciplinas, teorias } from '../lib/dados';
import { link } from '../lib/rota';
import { Retrato } from './Autor';

export const normalizar = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const INDICE = [
  ...autores.map(a => ({
    tipo: 'Autor', titulo: a.nome, sub: a.disciplinas.join(' · '), href: link('autor', a.id), autor: a,
    texto: normalizar([a.nome, ...a.disciplinas, ...a.tags].join(' ')),
  })),
  ...teorias.map(t => ({
    tipo: 'Teoria', titulo: t.nome, sub: `${t.autor} · ${t.ano}`, href: link('teoria', t.id), cor: corDe(t.disciplina),
    texto: normalizar([t.nome, t.autor, t.disciplina].join(' ')),
  })),
  ...disciplinas.map(d => ({
    tipo: 'Disciplina', titulo: d.nome, sub: `${d.autores.length} autores`, href: link('disciplina', d.id), cor: corDe(d.nome),
    texto: normalizar(d.nome),
  })),
];

export function Busca({ onFechar }) {
  const dialogo = useRef(null);
  const [q, setQ] = useState('');
  useEffect(() => { dialogo.current.showModal(); }, []);

  const termos = normalizar(q).split(/\s+/).filter(Boolean);
  const resultados = termos.length ? INDICE.filter(r => termos.every(t => r.texto.includes(t))).slice(0, 12) : [];

  const abrir = href => { location.hash = href; onFechar(); };

  return (
    <dialog ref={dialogo} className="busca" onClose={onFechar}
      onClick={e => e.target === dialogo.current && dialogo.current.close()}>
      <div className="busca-caixa">
        <input autoFocus type="search" placeholder="Buscar autor, teoria ou disciplina…" value={q}
          aria-label="Buscar" onChange={e => setQ(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && resultados[0] && abrir(resultados[0].href)} />
        <ul className="busca-resultados">
          {resultados.map(r => (
            <li key={r.href}>
              <a href={r.href} onClick={onFechar}>
                {r.autor ? <Retrato autor={r.autor} mini /> : <span className="busca-marca" style={{ '--cor': r.cor }} />}
                <span className="busca-titulo">{r.titulo}<small>{r.sub}</small></span>
                <span className="busca-tipo">{r.tipo}</span>
              </a>
            </li>
          ))}
          {termos.length > 0 && !resultados.length && <li className="busca-vazio">Nada encontrado para “{q}”.</li>}
        </ul>
      </div>
    </dialog>
  );
}
