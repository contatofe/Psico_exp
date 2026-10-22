import { disciplinaPorNome, iniciais } from '../lib/dados';
import { link } from '../lib/rota';

const colunaDe = autor => `col-${disciplinaPorNome[autor.disciplinas[0]].coluna}`;

/** Retrato P&B; sem foto, a prancha vira um campo na cor da coluna com o nome (ou as iniciais, se pequena). */
export function Retrato({ autor, mini = false, className = '' }) {
  const src = mini ? autor.mini : autor.foto;
  if (src) {
    return (
      <div className={`retrato ${className}`}>
        <img src={src} alt="" loading="lazy" decoding="async" />
      </div>
    );
  }
  const palavras = autor.nome.replace(/ & | e /, ' & ').split(' ');
  // a maior palavra ocupa a largura útil da prancha (~0.47em por letra na condensada)
  const maior = Math.max(...palavras.map(p => p.length));
  const tamanho = `${Math.min(26, 84 / (maior * 0.47)).toFixed(1)}cqi`;
  return (
    <div className={`retrato sem-foto ${colunaDe(autor)} ${className}`} aria-hidden="true">
      {mini
        ? <span className="retrato-iniciais">{iniciais(autor.nome)}</span>
        : <span className="retrato-nome" style={{ fontSize: tamanho }}>{palavras.map((p, i) => <span key={i}>{p}</span>)}</span>}
    </div>
  );
}

/** Prancha com legenda, usada nas grades de autores. */
export function FiguraAutor({ autor }) {
  return (
    <a className="figura-autor" href={link('autor', autor.id)}>
      <Retrato autor={autor} />
      <span className="fa-legenda">
        <span className="fa-nome">{autor.nome}</span>
        <span className="fa-periodo">{autor.periodo}</span>
      </span>
    </a>
  );
}

export function ChipAutor({ autor }) {
  return (
    <a className="chip-autor" href={link('autor', autor.id)}>
      <Retrato autor={autor} mini />
      <span>{autor.nome}</span>
    </a>
  );
}

/** Etiqueta de disciplina: endereço na cor da coluna + nome. */
export function EtiquetaDisciplina({ d }) {
  return (
    <a className={`etiqueta col-${d.coluna}`} href={link('disciplina', d.id)}>
      <b>{d.endereco}</b> {d.nome}
    </a>
  );
}
