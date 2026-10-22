import { autorPorId, corDe, disciplinaPorNome, disciplinas } from '../lib/dados';
import { link, useTitulo } from '../lib/rota';
import { ChipAutor } from '../componentes/Autor';
import { ListaTeorias } from './Disciplina';

export default function Teoria({ teoria: t }) {
  useTitulo(t.nome);
  const d = disciplinaPorNome[t.disciplina];
  const irmas = d.teorias;
  const i = irmas.indexOf(t);
  const anterior = irmas[i - 1], proxima = irmas[i + 1];

  return (
    <article className="pagina-teoria" style={{ '--cor': corDe(t.disciplina) }}>
      <header className="teoria-hero">
        <a className="etiqueta" href={link('disciplina', d.id)}>{d.nome}</a>
        <h1>{t.nome}</h1>
        <p className="autor-periodo">{t.autor} · {t.ano}</p>
        {t.formula && <div className="formula">{t.formula}</div>}
      </header>

      <div className="autor-corpo">
        <div className="texto-longo">{t.descricao.map((p, k) => <p key={k}>{p}</p>)}</div>
        {t.autores.length > 0 && (
          <aside className="autor-lado">
            <section>
              <h2>{t.autores.length > 1 ? 'Autores' : 'Autor'}</h2>
              <div className="chips">{t.autores.map(id => <ChipAutor key={id} autor={autorPorId[id]} />)}</div>
            </section>
          </aside>
        )}
      </div>

      <nav className="vizinhos" aria-label={`Outras teorias de ${d.nome}`}>
        {anterior ? <a href={link('teoria', anterior.id)}><small>← Anterior</small>{anterior.nome}</a> : <span />}
        <a className="vizinhos-meio" href={link('teorias')}>Todas as teorias</a>
        {proxima ? <a className="fim" href={link('teoria', proxima.id)}><small>Próxima →</small>{proxima.nome}</a> : <span />}
      </nav>
    </article>
  );
}

export function Teorias() {
  useTitulo('Teorias');
  const comTeorias = disciplinas.filter(d => d.teorias.length);
  return (
    <article>
      <header className="cabeca-pagina simples">
        <div>
          <p className="sobrancelha">Índice</p>
          <h1>Teorias e leis</h1>
          <p className="lede">Modelos, leis e hipóteses que deram forma a cada disciplina, do primeiro número da psicologia às explicações evolutivas.</p>
        </div>
      </header>
      {comTeorias.map(d => (
        <section key={d.id} className="secao" style={{ '--cor': corDe(d.nome) }}>
          <h2 className="titulo-secao"><a href={link('disciplina', d.id)}>{d.nome}</a> <span>{d.teorias.length}</span></h2>
          <ListaTeorias teorias={d.teorias} />
        </section>
      ))}
    </article>
  );
}
