import { autorPorId, corDe, disciplinaPorNome, idade, influenciou, teoriasDe } from '../lib/dados';
import { link, useTitulo } from '../lib/rota';
import { ChipAutor, Retrato } from '../componentes/Autor';

export default function Autor({ autor }) {
  useTitulo(autor.nome);
  const principal = disciplinaPorNome[autor.disciplinas[0]];
  const vizinhos = principal.autores;
  const i = vizinhos.indexOf(autor);
  const anterior = vizinhos[i - 1], proximo = vizinhos[i + 1];
  const por = autor.influencias.map(id => autorPorId[id]).filter(Boolean);
  const para = (influenciou[autor.id] || []).map(id => autorPorId[id]);
  const suasTeorias = teoriasDe(autor.id);

  return (
    <article className="pagina-autor" style={{ '--cor': corDe(autor.disciplinas[0]) }}>
      <header className="autor-hero">
        <Retrato autor={autor} className="autor-foto" />
        <div className="autor-titulo">
          <div className="etiquetas">
            {autor.disciplinas.map(d => (
              <a key={d} className="etiqueta" href={link('disciplina', disciplinaPorNome[d].id)} style={{ '--cor': corDe(d) }}>{d}</a>
            ))}
          </div>
          <h1>{autor.nome}</h1>
          <p className="autor-periodo">{autor.periodo}{idade(autor) && <span> · {idade(autor)}</span>}</p>
          {autor.resumo && <p className="autor-resumo">{autor.resumo}</p>}
        </div>
      </header>

      <div className="autor-corpo">
        <div className="texto-longo">
          {autor.bio.length
            ? autor.bio.map((p, k) => <p key={k}>{p}</p>)
            : <p className="pendente">Ficha em preparação.</p>}
        </div>

        <aside className="autor-lado">
          {autor.obras.length > 0 && (
            <section>
              <h2>Obras-chave</h2>
              <ol className="obras">
                {autor.obras.map(o => (
                  <li key={o.ano + o.titulo}>
                    <span className="obra-ano">{o.ano}</span>
                    {o.link
                      ? <a href={o.link} target="_blank" rel="noopener noreferrer">{o.titulo} ↗</a>
                      : <span>{o.titulo}</span>}
                  </li>
                ))}
              </ol>
            </section>
          )}
          {autor.tags.length > 0 && (
            <section>
              <h2>Métodos</h2>
              <div className="etiquetas">{autor.tags.map(t => <span key={t} className="etiqueta neutra">{t}</span>)}</div>
            </section>
          )}
          {por.length > 0 && (
            <section>
              <h2>Influenciado por</h2>
              <div className="chips">{por.map(a => <ChipAutor key={a.id} autor={a} />)}</div>
            </section>
          )}
          {para.length > 0 && (
            <section>
              <h2>Influenciou</h2>
              <div className="chips">{para.map(a => <ChipAutor key={a.id} autor={a} />)}</div>
            </section>
          )}
          {suasTeorias.length > 0 && (
            <section>
              <h2>Teorias</h2>
              <ul className="lista-simples">
                {suasTeorias.map(t => <li key={t.id}><a href={link('teoria', t.id)}>{t.nome}</a> <span>{t.ano}</span></li>)}
              </ul>
            </section>
          )}
        </aside>
      </div>

      <nav className="vizinhos" aria-label={`Outros autores de ${principal.nome}`}>
        {anterior ? <a href={link('autor', anterior.id)}><small>← Anterior</small>{anterior.nome}</a> : <span />}
        <a className="vizinhos-meio" href={link('disciplina', principal.id)}>{principal.nome} · {i + 1}/{vizinhos.length}</a>
        {proximo ? <a className="fim" href={link('autor', proximo.id)}><small>Próximo →</small>{proximo.nome}</a> : <span />}
      </nav>
    </article>
  );
}
