import { useState } from 'react';
import { autorPorId, disciplinaPorNome, disciplinas, teorias } from '../lib/dados';
import { link, useTitulo } from '../lib/rota';
import { ChipAutor, EtiquetaDisciplina } from '../componentes/Autor';
import { ListaTeorias } from './Disciplina';
import { Icone, Voltar } from '../componentes/Interface';
import { normalizar } from '../componentes/Busca';

export default function Teoria({ teoria: t }) {
  useTitulo(t.nome);
  const d = disciplinaPorNome[t.disciplina];
  const irmas = d.teorias;
  const i = irmas.indexOf(t);
  const anterior = irmas[i - 1], proxima = irmas[i + 1];

  return (
    <article className="pagina teoria">
      <Voltar para="teorias">Todas as teorias</Voltar>
      <header className="cabeca">
        <h1>{t.nome}</h1>
        <p className="ficha-periodo">
          {t.autor}, {t.ano}
        </p>
        <p className="cabeca-etiquetas"><EtiquetaDisciplina d={d} /></p>
      </header>

      {t.formula && <div className={`formula col-${d.coluna}`} aria-label={`Fórmula: ${t.formula}`}>{t.formula}</div>}

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
  const [q, setQ] = useState('');
  const [disc, setDisc] = useState('');
  const ordenadas = teorias.filter(t => (!disc || t.disciplina === disc) && normalizar(`${t.nome} ${t.autor}`).includes(normalizar(q))).sort((a, b) => parseInt(a.ano) - parseInt(b.ano));
  return (
    <article className="pagina teorias-pagina">
      <header className="cabeca">
        <h1>Teorias<span className="titulo-ponto">.</span></h1>
        <p className="lede">{teorias.length} leis, modelos e hipóteses, da lei de Weber (1834) às explicações evolutivas.</p>
      </header>
      <div className="filtros">
        <label className="campo campo-busca"><span>Teoria ou autor</span><div><Icone nome="busca" /><input type="search" placeholder="Encontrar uma teoria" value={q} onChange={e => setQ(e.target.value)} /></div></label>
        <label className="campo"><span>Disciplina</span><select value={disc} onChange={e => setDisc(e.target.value)}><option value="">Todas as disciplinas</option>{disciplinas.filter(d => d.teorias.length).map(d => <option key={d.id} value={d.nome}>{d.nome}</option>)}</select></label>
      </div>
      <div className="resultado-barra"><span role="status">{ordenadas.length} de {teorias.length} teorias</span>{(q || disc) && <button className="botao-texto" onClick={() => { setQ(''); setDisc(''); }}>Limpar filtros</button>}</div>
      {ordenadas.length ? <ListaTeorias teorias={ordenadas} comDisciplina /> : <p className="vazio">Nenhuma teoria encontrada. Tente outro nome ou disciplina.</p>}
    </article>
  );
}
