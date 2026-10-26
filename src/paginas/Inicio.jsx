import { link, useTitulo } from '../lib/rota';
import { autores, colunas, disciplinas, teorias } from '../lib/dados';
import { Mapa } from '../componentes/Mapa';
import { Icone } from '../componentes/Interface';
import fundo from '../assets/figma/arquivo-fundo.svg';
import gaveta from '../assets/figma/arquivo-gaveta.svg';
import caixa from '../assets/figma/arquivo-caixa.svg';

/** Capa: o título e o arquivo de fichas (as cores das fichas são as das colunas do mapa). */
export default function Inicio() {
  useTitulo('');
  return (
    <div className="capa">
      <div className="capa-principal">
        <div className="capa-texto">
          <h1 className="capa-titulo"><span>//</span>mapa<br />multi<br />_nível</h1>
          <p className="capa-sub">psicologia<br />experimental//</p>
          <a className="abrir-arquivo" href={link('mapa')}>Explorar o mapa <Icone /></a>
        </div>
        <a className="capa-arquivo" href={link('mapa')} aria-label="Abrir o mapa de disciplinas">
          <img className="arquivo-fundo" src={fundo} alt="" />
          <img className="arquivo-gaveta" src={gaveta} alt="" />
          <img className="arquivo-caixa" src={caixa} alt="" />
          <span className="arquivo-chamada"><span>abrir fichário</span><Icone /></span>
        </a>
      </div>
      <div className="capa-catalogo">
        <p>{disciplinas.length} disciplinas<span> / </span>{autores.length} autores<span> / </span>{teorias.length} teorias</p>
        <nav className="capa-colunas" aria-label="Explorar por proximidade causal">
          {colunas.map((c, i) => <a key={c.letra} className={`col-${i}`} href={link('mapa', c.letra)}><b>{c.letra.toLowerCase()}.</b><span>{c.nome}</span><Icone /></a>)}
        </nav>
      </div>
    </div>
  );
}

export function PaginaMapa({ coluna }) {
  useTitulo('Mapa');
  return <div className="pagina-mapa"><Mapa colunaInicial={coluna} /></div>;
}
