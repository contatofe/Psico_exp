import { useState } from 'react';
import { autores, disciplinas } from '../lib/dados';
import { useTitulo } from '../lib/rota';
import { FiguraAutor } from '../componentes/Autor';
import { normalizar } from '../componentes/Busca';

const ORDENS = {
  cronologica: (a, b) => a.nasc - b.nasc,
  alfabetica: (a, b) => a.nome.localeCompare(b.nome, 'pt'),
};

export default function Autores() {
  useTitulo('Autores');
  const [q, setQ] = useState('');
  const [disc, setDisc] = useState('');
  const [ordem, setOrdem] = useState('cronologica');

  const termo = normalizar(q);
  const lista = autores
    .filter(a => (!disc || a.disciplinas.includes(disc)) && (!termo || normalizar(a.nome).includes(termo)))
    .sort(ORDENS[ordem]);

  return (
    <article className="pagina">
      <header className="cabeca">
        <h1>Autores</h1>
        <p className="lede">{autores.length} pessoas que mudaram o que sabemos sobre mente, cérebro e sociedade.</p>
      </header>

      <div className="filtros">
        <input type="search" placeholder="Filtrar por nome" value={q} onChange={e => setQ(e.target.value)} aria-label="Filtrar por nome" />
        <select value={disc} onChange={e => setDisc(e.target.value)} aria-label="Disciplina">
          <option value="">Todas</option>
          {disciplinas.filter(d => d.autores.length).map(d => <option key={d.id} value={d.nome}>{d.endereco} {d.nome}</option>)}
        </select>
        <select value={ordem} onChange={e => setOrdem(e.target.value)} aria-label="Ordem">
          <option value="cronologica">Por nascimento</option>
          <option value="alfabetica">Alfabética</option>
        </select>
        <span className="filtros-total">{lista.length}</span>
      </div>

      {lista.length
        ? <div className="grade-figuras">{lista.map(a => <FiguraAutor key={a.id} autor={a} />)}</div>
        : <p className="vazio">Nenhum autor com esse nome{disc && ` em ${disc}`}.</p>}
    </article>
  );
}
