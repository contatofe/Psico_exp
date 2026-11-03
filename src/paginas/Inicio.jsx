import { link, useTitulo } from '../lib/rota';
import { Mapa } from '../componentes/Mapa';
import { Arquivo } from '../componentes/Arquivo';
import { Icone } from '../componentes/Interface';

/** Capa: o título e o arquivo de fichas (as cores das fichas são as das colunas do mapa). */
export default function Inicio() {
  useTitulo('');
  return (
    <div className="capa">
      <div className="capa-principal">
        <div className="capa-texto">
          <h1 className="capa-titulo"><span>//</span>mapa<br />multi<br />_nível</h1>
          <p className="capa-sub">psicologia<br />experimental//</p>
          <a className="abrir-arquivo" href={link('mapa')}>Explorar o mapa <Icone /></a>
        </div>
        <a className="capa-arquivo" href={link('mapa')} aria-label="Abrir o mapa de disciplinas">
          <Arquivo />
        </a>
      </div>
    </div>
  );
}

export function PaginaMapa({ coluna }) {
  useTitulo('Mapa');
  return <div className="pagina-mapa"><Mapa colunaInicial={coluna} /></div>;
}
