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
import Sobre from './paginas/Sobre';

const MENU = [['', 'Mapa'], ['autores', 'Autores'], ['teorias', 'Teorias'], ['influencias', 'Rede'], ['cronologia', 'Cronologia'], ['sobre', 'Sobre']];
const SECAO = { autor: 'autores', teoria: 'teorias', disciplina: '' };

function pagina(nome, id) {
  switch (nome) {
    case '': return <Inicio />;
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
      <p className="lede">Este endereço não existe ou mudou. <a href="#/">Voltar ao mapa</a>.</p>
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
        <nav className="abas" aria-label="Principal">
          {/* por enquanto aponta para o mapa; depois será a home do projeto */}
          <a className="aba aba-marca" href="#/" style={{ zIndex: MENU.length + 1 }}>Mapa Multinível</a>
          {MENU.map(([rota, rotulo], i) => {
            const atual = (SECAO[nome] ?? nome) === rota;
            return (
              <a key={rotulo} className="aba" href={link(rota)} aria-current={atual ? 'page' : undefined}
                style={atual ? undefined : { zIndex: MENU.length - i }}>{rotulo}</a>
            );
          })}
        </nav>
        <button className="botao-busca" onClick={() => setBuscando(true)} aria-label="Buscar (atalho: /)">
          <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" /><path d="M13 13l4.5 4.5" /></svg>
        </button>
      </header>

      <main id="conteudo" tabIndex={-1} className="folha">
        {pagina(nome, id) || <NaoEncontrada />}
      </main>

      {buscando && <Busca onFechar={() => setBuscando(false)} />}
    </>
  );
}
