import { colunas, linhas } from '../lib/dados';
import { link, useTitulo } from '../lib/rota';
import { FiguraAutor } from '../componentes/Autor';
import { MiniMapa } from '../componentes/Mapa';

export default function Disciplina({ disciplina: d }) {
  useTitulo(d.nome);
  return (
    <article className="pagina">
      <header className="cabeca cabeca-disciplina">
        <div>
          <h1>{d.nome}</h1>
          {d.descricao && <p className="lede">{d.descricao}</p>}
        </div>
        <div className="cabeca-mapa">
          <MiniMapa marcadas={[d.nome]} />
          <p><b className="endereco">{d.endereco}</b> {linhas[d.linha].nome} × {colunas[d.coluna].nome.toLowerCase()}</p>
        </div>
      </header>

      {d.autores.length > 0 && (
        <section className="secao">
          <h2>Autores <span>{d.autores.length}</span></h2>
          <div className="grade-figuras">
            {d.autores.map(a => <FiguraAutor key={a.id} autor={a} />)}
          </div>
        </section>
      )}

      {d.teorias.length > 0 && (
        <section className="secao">
          <h2>Teorias <span>{d.teorias.length}</span></h2>
          <ListaTeorias teorias={d.teorias} />
        </section>
      )}
    </article>
  );
}

export function ListaTeorias({ teorias, comDisciplina = false }) {
  return (
    <ul className="lista-teorias">
      {teorias.map(t => (
        <li key={t.id}>
          <a href={link('teoria', t.id)}>
            <span className="lt-ano">{t.ano}</span>
            <span className="lt-nome">{t.nome}<small>{t.autor}{comDisciplina && ` · ${t.disciplina}`}</small></span>
            {t.formula && <span className="lt-formula">{t.formula}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}
