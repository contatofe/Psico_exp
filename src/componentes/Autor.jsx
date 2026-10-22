import { corDe, iniciais } from '../lib/dados';
import { link } from '../lib/rota';

/** Foto em duotom na cor da disciplina; sem foto, mostra as iniciais. */
export function Retrato({ autor, mini = false, className = '' }) {
  const src = mini ? autor.mini : autor.foto;
  return (
    <div className={`retrato ${className}`} style={{ '--cor': corDe(autor.disciplinas[0]) }}>
      {src
        ? <img src={src} alt="" loading="lazy" decoding="async" />
        : <span className="retrato-iniciais" aria-hidden="true">{iniciais(autor.nome)}</span>}
    </div>
  );
}

export function CartaoAutor({ autor, comResumo = false }) {
  return (
    <a className="cartao-autor" href={link('autor', autor.id)} style={{ '--cor': corDe(autor.disciplinas[0]) }}>
      <Retrato autor={autor} mini={!comResumo} />
      <div className="ca-texto">
        <span className="ca-nome">{autor.nome}</span>
        <span className="ca-periodo">{autor.periodo}</span>
        {comResumo && autor.resumo && <span className="ca-resumo">{autor.resumo}</span>}
      </div>
    </a>
  );
}

/** Linha compacta: mini retrato + nome, para listas de influências e autores de teorias. */
export function ChipAutor({ autor }) {
  return (
    <a className="chip-autor" href={link('autor', autor.id)}>
      <Retrato autor={autor} mini />
      <span>{autor.nome}</span>
    </a>
  );
}
