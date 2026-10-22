import { Fragment } from 'react';
import { colunas, disciplinas, linhas } from '../lib/dados';
import { link } from '../lib/rota';

const naCelula = (l, c) => disciplinas.filter(d => d.linha === l && d.coluna === c);

/** Matriz 4×4: escala temporal (linhas) × proximidade causal (colunas). */
export function Matriz() {
  return (
    <div className="matriz">
      <div className="mz-canto" aria-hidden="true">
        <span>Proximidade causal →</span>
        <span>↓ Escala temporal</span>
      </div>
      {colunas.map((c, ci) => (
        <div key={c.letra} className="mz-coluna" style={{ '--cor': `var(--c${ci})` }}>
          <span className="mz-letra">{c.letra}</span>
          <strong>{c.nome}</strong>
          <span>{c.sub}</span>
        </div>
      ))}
      {linhas.map((l, li) => (
        <Fragment key={l.num}>
          <div className="mz-linha">
            <span className="mz-num">{l.num}</span>
            <strong>{l.nome}</strong>
            <span>{l.sub}</span>
          </div>
          {colunas.map((c, ci) => {
            const ds = naCelula(li, ci);
            return (
              <div key={c.letra} className={'mz-celula' + (ds.length ? '' : ' vazia')} style={{ '--cor': `var(--c${ci})` }}>
                <span className="mz-rotulo-movel">{c.letra} · {c.nome}</span>
                {ds.map(d => (
                  <a key={d.id} className="mz-disciplina" href={link('disciplina', d.id)}>
                    <span>{d.nome}</span>
                    <span className="mz-contagem">{d.autores.length}</span>
                  </a>
                ))}
              </div>
            );
          })}
        </Fragment>
      ))}
    </div>
  );
}

/** Miniatura da matriz que marca a célula de uma disciplina. */
export function MiniMatriz({ linha, coluna }) {
  return (
    <div className="mini-matriz" aria-hidden="true">
      {linhas.flatMap((_, li) => colunas.map((_, ci) => (
        <span key={`${li}${ci}`} className={li === linha && ci === coluna ? 'ativa' : ''}
          style={{ '--cor': `var(--c${ci})` }} />
      )))}
    </div>
  );
}
