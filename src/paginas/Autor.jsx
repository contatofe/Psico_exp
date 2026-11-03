import { autorPorId, disciplinaPorNome, idade, influenciou, teoriasDe } from '../lib/dados';
import { link, useTitulo } from '../lib/rota';
import { ChipAutor, EtiquetaDisciplina, Retrato } from '../componentes/Autor';
import { Voltar } from '../componentes/Interface';

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
    <article className={`ficha col-${principal.coluna}`}>
      <figure className="ficha-prancha">
        <Retrato autor={autor} />
        <figcaption>{autor.nome}, {autor.periodo}</figcaption>
      </figure>

      <div className="ficha-texto">
        <Voltar para="autores">Todos os autores</Voltar>
        <header className="ficha-cabeca">
          <h1>{autor.nome}</h1>
          <p className="ficha-periodo">{autor.periodo}{idade(autor) && <> · {idade(autor)}</>}</p>
          <nav className="ficha-disciplinas" aria-label="Disciplinas">
            {autor.disciplinas.map(nome => <EtiquetaDisciplina key={nome} d={disciplinaPorNome[nome]} />)}
          </nav>
        </header>

        {autor.resumo && <p className="ficha-resumo">{autor.resumo}</p>}

        <div className="ficha-bio" id="biografia">
          {autor.bio.length ? autor.bio.map((p, k) => <p key={k}>{p}</p>) : <p className="pendente">Ficha em preparação.</p>}
        </div>

        <dl className="ficha-dados" id="obras-e-relacoes">
          {autor.obras.length > 0 && (
            <div>
              <dt>Obras-chave</dt>
              <dd>
                <ol className="obras">
                  {autor.obras.map(o => (
                    <li key={o.ano + o.titulo}>
                      <span className="obra-ano">{o.ano}</span>
                      {o.link
                        ? <a href={o.link} target="_blank" rel="noopener noreferrer">{o.titulo}</a>
                        : <span>{o.titulo}</span>}
                    </li>
                  ))}
                </ol>
              </dd>
            </div>
          )}
          {suasTeorias.length > 0 && (
            <div>
              <dt>Teorias</dt>
              <dd>
                <ul className="lista-links">
                  {suasTeorias.map(t => <li key={t.id}><a href={link('teoria', t.id)}>{t.nome}</a></li>)}
                </ul>
              </dd>
            </div>
          )}
          {por.length > 0 && (
            <div>
              <dt>Influenciado por</dt>
              <dd className="chips">{por.map(a => <ChipAutor key={a.id} autor={a} />)}</dd>
            </div>
          )}
          {para.length > 0 && (
            <div>
              <dt>Influenciou</dt>
              <dd className="chips">{para.map(a => <ChipAutor key={a.id} autor={a} />)}</dd>
            </div>
          )}
          {autor.tags.length > 0 && (
            <div>
              <dt>Métodos</dt>
              <dd>{autor.tags.join(', ')}</dd>
            </div>
          )}
        </dl>

        <nav className="vizinhos" aria-label={`Outros autores de ${principal.nome}`}>
          {anterior ? <a href={link('autor', anterior.id)}><small>Anterior</small>{anterior.nome}</a> : <span />}
          {proximo ? <a className="fim" href={link('autor', proximo.id)}><small>Próximo</small>{proximo.nome}</a> : <span />}
        </nav>
      </div>
    </article>
  );
}
