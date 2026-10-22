import { autorPorId, disciplinaPorNome, teorias } from '../lib/dados';
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
    <article className="pagina teoria">
      <header className="cabeca">
        <h1>{t.nome}</h1>
        <p className="ficha-periodo">
          {t.autor}, {t.ano} · <a className="link-disciplina" href={link('disciplina', d.id)}><b className="endereco">{d.endereco}</b> {d.nome}</a>
        </p>
      </header>

      {t.formula && <div className="formula" aria-label={`Fórmula: ${t.formula}`}>{t.formula}</div>}

      <div className="teoria-corpo">
        <div className="ficha-bio">{t.descricao.map((p, k) => <p key={k}>{p}</p>)}</div>
        {t.autores.length > 0 && (
          <aside>
            <h2 className="rotulo">{t.autores.length > 1 ? 'Autores' : 'Autor'}</h2>
            <div className="chips">{t.autores.map(id => <ChipAutor key={id} autor={autorPorId[id]} />)}</div>
          </aside>
        )}
      </div>

      <nav className="vizinhos" aria-label={`Outras teorias de ${d.nome}`}>
        {anterior ? <a href={link('teoria', anterior.id)}><small>Anterior</small>{anterior.nome}</a> : <span />}
        {proxima ? <a className="fim" href={link('teoria', proxima.id)}><small>Próxima</small>{proxima.nome}</a> : <span />}
      </nav>
    </article>
  );
}

export function Teorias() {
  useTitulo('Teorias');
  const ordenadas = [...teorias].sort((a, b) => parseInt(a.ano) - parseInt(b.ano));
  return (
    <article className="pagina">
      <header className="cabeca">
        <h1>Teorias</h1>
        <p className="lede">{teorias.length} leis, modelos e hipóteses, da lei de Weber (1834) às explicações evolutivas.</p>
      </header>
      <ListaTeorias teorias={ordenadas} comDisciplina />
    </article>
  );
}
