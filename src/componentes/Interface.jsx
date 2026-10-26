import { link } from '../lib/rota';

export function Icone({ nome = 'seta', ...props }) {
  const caminhos = {
    seta: <><path d="M4 12h15M13 5l7 7-7 7" /></>,
    voltar: <><path d="M20 12H5m6-7-7 7 7 7" /></>,
    busca: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    fechar: <path d="m6 6 12 12M6 18 18 6" />,
    grade: <><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><rect x="14" y="14" width="6" height="6" /></>,
    lista: <><path d="M9 5h12M9 12h12M9 19h12M3 5h1M3 12h1M3 19h1" /></>,
    mapa: <><path d="M4 3v17h17M4 8h17M4 14h17M10 3v17M16 3v17" /><circle cx="13" cy="11" r="2" fill="currentColor" stroke="none" /></>,
  };
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{caminhos[nome]}</svg>;
}

export function Voltar({ para = 'mapa', children = 'Voltar ao mapa' }) {
  return <a className="voltar" href={link(para)}><Icone nome="voltar" />{children}</a>;
}

export function AlternarVista({ valor, onChange, opcoes }) {
  return <div className="alternar-vista" role="group" aria-label="Visualização">{opcoes.map(([id, rotulo, icone]) =>
    <button key={id} type="button" aria-pressed={valor === id} onClick={() => onChange(id)}><Icone nome={icone} /><span>{rotulo}</span></button>
  )}</div>;
}
