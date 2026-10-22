import { colunas, disciplinaPorNome, linhas } from '../lib/dados';
import { link, useTitulo } from '../lib/rota';
import { FiguraAutor } from '../componentes/Autor';

export default function Disciplina({ disciplina: d }) {
  useTitulo(d.nome);
  return (
    <article className="pagina">
      <header className={`pasta-disciplina col-${d.coluna}`}>
        <span className="aba aba-pasta"><b>{d.endereco}</b> {linhas[d.linha].nome} × {colunas[d.coluna].nome.toLowerCase()}</span>
        <div className="pasta-corpo">
          <h1>{d.nome}</h1>
          {d.descricao && <p className="lede">{d.descricao}</p>}
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
      {teorias.map((t, i) => (
        <li key={t.id} className={`col-${disciplinaPorNome[t.disciplina].coluna}`} style={{ '--recuo': `${(i % 4) * 14}%` }}>
          <a href={link('teoria', t.id)}>
            <span className="lt-ano aba">{t.ano}</span>
            <span className="lt-nome">{t.nome}<small>{t.autor}{comDisciplina && ` · ${t.disciplina}`}</small></span>
            {t.formula && <span className="lt-formula">{t.formula}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}
