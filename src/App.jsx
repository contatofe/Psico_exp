import { useEffect, useState } from 'react';
import { autorPorId, disciplinaPorId, teoriaPorId } from './lib/dados';
import { link, useRota, useTitulo } from './lib/rota';
import { Busca } from './componentes/Busca';
import Inicio from './paginas/Inicio';
import Autores from './paginas/Autores';
import Autor from './paginas/Autor';
import Disciplina from './paginas/Disciplina';
import Teoria, { Teorias } from './paginas/Teoria';
import Influencias from './paginas/Influencias';
import Cronologia from './paginas/Cronologia';

const MENU = [['autores', 'Autores'], ['teorias', 'Teorias'], ['influencias', 'Influências'], ['cronologia', 'Cronologia']];
const SECAO = { autor: 'autores', teoria: 'teorias' };

function pagina(nome, id) {
  switch (nome) {
    case '': return <Inicio />;
    case 'autores': return <Autores />;
    case 'teorias': return <Teorias />;
    case 'influencias': return <Influencias />;
    case 'cronologia': return <Cronologia />;
    case 'autor': return autorPorId[id] && <Autor key={id} autor={autorPorId[id]} />;
    case 'disciplina': return disciplinaPorId[id] && <Disciplina key={id} disciplina={disciplinaPorId[id]} />;
    case 'teoria': return teoriaPorId[id] && <Teoria key={id} teoria={teoriaPorId[id]} />;
  }
}

function NaoEncontrada() {
  useTitulo('Página não encontrada');
  return (
    <div className="nao-encontrada">
      <h1>Página não encontrada</h1>
      <p>Talvez o link esteja antigo. <a href="#/">Voltar ao mapa</a>.</p>
    </div>
  );
}

export default function App() {
  const [nome, id] = useRota();
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    const atalho = e => {
      const digitando = /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName);
      if (!digitando && (e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey)))) {
        e.preventDefault();
        setBuscando(true);
      }
    };
    addEventListener('keydown', atalho);
    return () => removeEventListener('keydown', atalho);
  }, []);

  return (
    <>
      <a className="pular" href="#conteudo" onClick={e => { e.preventDefault(); document.getElementById('conteudo').focus(); }}>
        Pular para o conteúdo
      </a>
      <header className="topo">
        <a className="marca" href="#/">
          <span className="marca-grade" aria-hidden="true"><i /><i /><i /><i /></span>
          <span>Mapa Multinível<small>Comportamento e cognição</small></span>
        </a>
        <nav className="menu" aria-label="Principal">
          {MENU.map(([rota, rotulo]) => (
            <a key={rota} href={link(rota)} aria-current={(SECAO[nome] || nome) === rota ? 'page' : undefined}>{rotulo}</a>
          ))}
        </nav>
        <button className="botao-busca" onClick={() => setBuscando(true)} aria-label="Buscar">
          <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" /><path d="M13 13l4 4" /></svg>
          <span>Buscar</span><kbd>/</kbd>
        </button>
      </header>

      <main id="conteudo" tabIndex={-1}>{pagina(nome, id) || <NaoEncontrada />}</main>

      <footer className="rodape">
        <p>
          Inspirado nas quatro perguntas de Nikolaas Tinbergen e na abordagem multinível de Robert Sapolsky.
          Textos de divulgação científica; encontrou um erro? <a href="https://github.com/contatofe/Psico_exp/issues" target="_blank" rel="noopener noreferrer">Avise no GitHub</a>.
        </p>
      </footer>

      {buscando && <Busca onFechar={() => setBuscando(false)} />}
    </>
  );
}
