import { useEffect, useState } from 'react';
import { autorPorId, disciplinaPorId, teoriaPorId } from './lib/dados';
import { link, useRota, useTitulo } from './lib/rota';
import { Busca } from './componentes/Busca';
import Inicio, { PaginaMapa } from './paginas/Inicio';
import Autores from './paginas/Autores';
import Autor from './paginas/Autor';
import Disciplina from './paginas/Disciplina';
import Teoria, { Teorias } from './paginas/Teoria';
import Influencias from './paginas/Influencias';
import Cronologia from './paginas/Cronologia';
import Sobre from './paginas/Sobre';
import { Icone } from './componentes/Interface';

const MENU = [['mapa', 'mapa'], ['autores', 'autores'], ['teorias', 'teorias'], ['influencias', 'redes'], ['cronologia', 'crono'], ['sobre', 'sobre']];
const SECAO = { autor: 'autores', teoria: 'teorias', disciplina: 'mapa' };

function pagina(nome, id) {
  switch (nome) {
    case '': return <Inicio />;
    case 'mapa': return <PaginaMapa key={id || 'todos'} coluna={id} />;
    case 'autores': return <Autores />;
    case 'teorias': return <Teorias />;
    case 'influencias': return <Influencias />;
    case 'cronologia': return <Cronologia />;
    case 'sobre': return <Sobre />;
    case 'autor': return autorPorId[id] && <Autor key={id} autor={autorPorId[id]} />;
    case 'disciplina': return disciplinaPorId[id] && <Disciplina key={id} disciplina={disciplinaPorId[id]} />;
    case 'teoria': return teoriaPorId[id] && <Teoria key={id} teoria={teoriaPorId[id]} />;
  }
}

function NaoEncontrada() {
  useTitulo('Página não encontrada');
  return (
    <div className="pagina nao-encontrada">
      <h1>Fora do mapa</h1>
      <p className="lede">Este endereço não existe ou mudou. <a href="#/mapa">Voltar ao mapa</a>.</p>
    </div>
  );
}

export default function App() {
  const [nome, id] = useRota();
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    const atalho = e => {
      const digitando = /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName) || e.target.isContentEditable;
      if ((!digitando && e.key === '/') || (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setBuscando(true);
      }
    };
    addEventListener('keydown', atalho);
    return () => removeEventListener('keydown', atalho);
  }, []);

  useEffect(() => {
    document.querySelector('.orelha[aria-current]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [nome]);

  return (
    <>
      <a className="pular" href="#conteudo" onClick={e => { e.preventDefault(); document.getElementById('conteudo').focus(); }}>
        Pular para o conteúdo
      </a>
      <div className="masthead"><a href={link('')}>mapa multinível<span aria-hidden="true"> / </span><span>comportamento e cognição</span></a><span>arquivo aberto</span></div>
      <header className="topo">
        <nav className="abas" aria-label="Principal">
          {[['', ''], ...MENU].map(([rota, rotulo], i) => {
            const atual = (SECAO[nome] ?? nome) === rota;
            return (
              <a key={rota} className="orelha" href={link(rota)} aria-current={atual ? 'page' : undefined}
                aria-label={rota ? undefined : 'Início'} style={atual ? undefined : { zIndex: MENU.length - i }}>
                {rotulo ? (atual ? '_' : '.') + rotulo : <span className="marca-capa">//</span>}
              </a>
            );
          })}
        </nav>
        <button className="botao-busca" onClick={() => setBuscando(true)} aria-label="Buscar (atalho: /)">
          <Icone nome="busca" /><span>buscar</span><kbd>/</kbd>
        </button>
      </header>

      <main id="conteudo" tabIndex={-1} className={'folha' + (nome === '' ? ' folha-capa' : '')}>
        {pagina(nome, id) || <NaoEncontrada />}
      </main>

      <footer className="rodape"><a href={link('')}>mapa multi_nível</a><a href={link('sobre')}>Como ler este mapa <Icone /></a></footer>

      {buscando && <Busca onFechar={() => setBuscando(false)} />}
    </>
  );
}
