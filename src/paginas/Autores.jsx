import { useState } from 'react';
import { autores, disciplinaPorNome, disciplinas } from '../lib/dados';
import { link, useTitulo } from '../lib/rota';
import { FiguraAutor, Retrato } from '../componentes/Autor';
import { normalizar } from '../componentes/Busca';
import { AlternarVista, Icone } from '../componentes/Interface';

const ORDENS = { cronologica: (a, b) => a.nasc - b.nasc, alfabetica: (a, b) => a.nome.localeCompare(b.nome, 'pt') };

export default function Autores() {
  useTitulo('Autores');
  const [q, setQ] = useState('');
  const [disc, setDisc] = useState('');
  const [ordem, setOrdem] = useState('cronologica');
  const [vista, setVista] = useState('galeria');
  const termo = normalizar(q);
  const lista = autores.filter(a => (!disc || a.disciplinas.includes(disc)) && (!termo || normalizar(a.nome).includes(termo))).sort(ORDENS[ordem]);
  const limpar = () => { setQ(''); setDisc(''); };

  return <article className="pagina autores-pagina">
    <header className="cabeca"><h1>Autores<span className="titulo-ponto">.</span></h1><p className="lede">{autores.length} pessoas que mudaram o que sabemos sobre mente, cérebro e sociedade.</p></header>
    <div className="filtros">
      <label className="campo campo-busca"><span>Nome</span><div><Icone nome="busca" /><input type="search" placeholder="Encontrar um autor" value={q} onChange={e => setQ(e.target.value)} /></div></label>
      <label className="campo"><span>Disciplina</span><select value={disc} onChange={e => setDisc(e.target.value)}><option value="">Todas as disciplinas</option>{disciplinas.filter(d => d.autores.length).map(d => <option key={d.id} value={d.nome}>{d.endereco} {d.nome}</option>)}</select></label>
      <label className="campo"><span>Ordenar por</span><select value={ordem} onChange={e => setOrdem(e.target.value)}><option value="cronologica">Nascimento</option><option value="alfabetica">Nome, A–Z</option></select></label>
    </div>
    <div className="resultado-barra"><span role="status">{lista.length} de {autores.length} autores{(q || disc) && <button className="botao-texto" onClick={limpar}>Limpar filtros</button>}</span><AlternarVista valor={vista} onChange={setVista} opcoes={[[ 'galeria', 'Galeria', 'grade' ], [ 'lista', 'Lista', 'lista' ]]} /></div>
    {lista.length ? vista === 'galeria' ? <div className="grade-figuras">{lista.map(a => <FiguraAutor key={a.id} autor={a} />)}</div> :
      <ul className="indice-autores">{lista.map(a => {const d = disciplinaPorNome[a.disciplinas[0]];return <li key={a.id}><a className={`col-${d.coluna}`} href={link('autor', a.id)}><Retrato autor={a} mini /><span className="ia-nome">{a.nome}<small>{a.disciplinas[0]}</small></span><span className="ia-periodo">{a.periodo}</span><span className="endereco">{d.endereco}</span><Icone /></a></li>;})}</ul>
      : <div className="vazio"><p>Nenhum autor com esse nome{disc && ` em ${disc}`}.</p><button className="controle" onClick={limpar}>Limpar filtros</button></div>}
  </article>;
}
