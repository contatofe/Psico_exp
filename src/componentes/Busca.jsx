import { useEffect, useRef, useState } from 'react';
import { autores, disciplinaPorNome, disciplinas, teorias } from '../lib/dados';
import { link } from '../lib/rota';
import { Retrato } from './Autor';
import { Icone } from './Interface';

export const normalizar = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const INDICE = [
  ...autores.map(a => ({ tipo: 'Autor', titulo: a.nome, sub: a.disciplinas.join(' · '), href: link('autor', a.id), autor: a, texto: normalizar([a.nome, ...a.disciplinas, ...a.tags].join(' ')) })),
  ...teorias.map(t => ({ tipo: 'Teoria', titulo: t.nome, sub: `${t.autor} · ${t.ano}`, href: link('teoria', t.id), marca: disciplinaPorNome[t.disciplina].endereco, texto: normalizar([t.nome, t.autor, t.disciplina].join(' ')) })),
  ...disciplinas.map(d => ({ tipo: 'Disciplina', titulo: d.nome, sub: `${d.autores.length} autores`, href: link('disciplina', d.id), marca: d.endereco, texto: normalizar(d.nome) })),
];
const ATALHOS = [['mapa', 'Explorar o mapa', 'mapa'], ['autores', 'Consultar autores', 'grade'], ['teorias', 'Consultar teorias', 'lista']];

export function Busca({ onFechar }) {
  const dialogo = useRef(null);
  const campo = useRef(null);
  const [q, setQ] = useState('');
  useEffect(() => {
    const anterior = document.activeElement;
    const el = dialogo.current;
    if (!el.open) el.showModal();
    return () => { el.close(); anterior?.focus?.({ preventScroll: true }); };
  }, []);
  const termos = normalizar(q).split(/\s+/).filter(Boolean);
  const encontrados = termos.length ? INDICE.filter(r => termos.every(t => r.texto.includes(t))) : [];
  const resultados = encontrados.slice(0, 20);
  const abrir = href => { location.hash = href; onFechar(); };
  const teclado = e => {
    if (!['ArrowDown', 'ArrowUp'].includes(e.key)) return;
    const itens = [...dialogo.current.querySelectorAll('.busca-resultados a, .busca-atalhos a')];
    if (!itens.length) return;
    e.preventDefault();
    const i = itens.indexOf(document.activeElement);
    if (e.key === 'ArrowUp' && i === 0) campo.current.focus();
    else itens[(i + (e.key === 'ArrowDown' ? 1 : -1) + itens.length) % itens.length].focus();
  };
  return <dialog ref={dialogo} className="busca" aria-labelledby="busca-titulo" onClose={onFechar} onKeyDown={teclado} onClick={e => e.target === dialogo.current && dialogo.current.close()}>
    <header className="busca-cabeca"><h2 id="busca-titulo">Buscar no arquivo</h2><button type="button" onClick={onFechar} aria-label="Fechar busca"><Icone nome="fechar" /></button></header>
    <div className="busca-campo"><Icone nome="busca" /><input ref={campo} autoFocus type="search" placeholder="Autor, teoria ou disciplina" value={q} aria-label="Buscar" onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && resultados[0] && abrir(resultados[0].href)} /></div>
    {termos.length ? <>
      <p className="busca-contagem" role="status">{encontrados.length} resultados{encontrados.length > 20 && ' · mostrando os primeiros 20'}</p>
      <ul className="busca-resultados">{resultados.map(r => <li key={r.href}><a href={r.href} onClick={onFechar}>{r.autor ? <Retrato autor={r.autor} mini /> : <span className="busca-marca">{r.marca}</span>}<span className="busca-titulo">{r.titulo}<small>{r.sub}</small></span><span className="busca-tipo">{r.tipo}</span></a></li>)}</ul>
      {!resultados.length && <p className="busca-vazio">Nada encontrado para “{q}”. Tente outro nome.</p>}
    </> : <nav className="busca-atalhos" aria-label="Atalhos do arquivo">{ATALHOS.map(([rota, titulo, icone]) => <a key={rota} href={link(rota)} onClick={onFechar}><Icone nome={icone} />{titulo}<Icone /></a>)}</nav>}
    <footer className="busca-rodape"><span><kbd>↑</kbd> <kbd>↓</kbd> navegar</span><span><kbd>enter</kbd> abrir</span><span><kbd>esc</kbd> fechar</span></footer>
  </dialog>;
}
