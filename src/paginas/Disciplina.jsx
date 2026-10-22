import { colunas, linhas } from '../lib/dados';
import { link, useTitulo } from '../lib/rota';
import { CartaoAutor } from '../componentes/Autor';
import { MiniMatriz } from '../componentes/Matriz';

export default function Disciplina({ disciplina: d }) {
  useTitulo(d.nome);
  return (
    <article className="pagina-disciplina" style={{ '--cor': `var(--c${d.coluna})` }}>
      <header className="cabeca-pagina">
        <MiniMatriz linha={d.linha} coluna={d.coluna} />
        <div>
          <p className="sobrancelha">
            {linhas[d.linha].nome} · {colunas[d.coluna].letra} {colunas[d.coluna].nome}
          </p>
          <h1>{d.nome}</h1>
          {d.descricao && <p className="lede">{d.descricao}</p>}
        </div>
      </header>

      {d.autores.length > 0 && (
        <section className="secao">
          <h2 className="titulo-secao">Autores <span>{d.autores.length}</span></h2>
          <div className="grade-autores">{d.autores.map(a => <CartaoAutor key={a.id} autor={a} comResumo />)}</div>
        </section>
      )}

      {d.teorias.length > 0 && (
        <section className="secao">
          <h2 className="titulo-secao">Teorias <span>{d.teorias.length}</span></h2>
          <ListaTeorias teorias={d.teorias} />
        </section>
      )}
    </article>
  );
}

export function ListaTeorias({ teorias }) {
  return (
    <ul className="lista-teorias">
      {teorias.map(t => (
        <li key={t.id}>
          <a href={link('teoria', t.id)}>
            <span className="lt-ano">{t.ano}</span>
            <span className="lt-nome">{t.nome}<small>{t.autor}</small></span>
            {t.formula && <code className="lt-formula">{t.formula}</code>}
          </a>
        </li>
      ))}
    </ul>
  );
}
