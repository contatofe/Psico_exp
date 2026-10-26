import { useState } from 'react';
import { autores, autorPorId, disciplinas } from '../lib/dados';
import { link, useTitulo } from '../lib/rota';
import { AlternarVista, Icone } from '../componentes/Interface';

// Layout calculado uma vez: um bloco por disciplina (ordenado por coluna da matriz),
// autores em grade dentro do bloco, arestas como curvas de Bézier entre as caixas.
const NO_L = 176, NO_A = 36, ESP_X = 12, ESP_Y = 14, PAD_X = 16, PAD_Y = 62, ENTRE = 24, LARGURA = 1240;

const arestas = autores.flatMap(a => a.influencias.filter(i => autorPorId[i]).map(de => ({ de, para: a.id })));
const naRede = new Set(arestas.flatMap(e => [e.de, e.para]));

const posicoes = {};
const blocos = [];
let x = 0, y = 0, alturaLinha = 0;
for (const d of [...disciplinas].sort((a, b) => a.coluna - b.coluna || a.linha - b.linha)) {
  const membros = d.autores.filter(a => naRede.has(a.id) && !posicoes[a.id]);
  if (!membros.length) continue;
  const cols = membros.length <= 4 ? Math.min(membros.length, 2) : membros.length <= 9 ? 3 : 4;
  const w = cols * NO_L + (cols - 1) * ESP_X + PAD_X * 2;
  const h = Math.ceil(membros.length / cols) * (NO_A + ESP_Y) - ESP_Y + PAD_Y + 14;
  if (x + w > LARGURA && x > 0) { x = 0; y += alturaLinha + ENTRE; alturaLinha = 0; }
  blocos.push({ d, x, y, w, h });
  membros.forEach((a, i) => {
    posicoes[a.id] = { x: x + PAD_X + (i % cols) * (NO_L + ESP_X), y: y + PAD_Y + Math.floor(i / cols) * (NO_A + ESP_Y), coluna: d.coluna };
  });
  x += w + ENTRE;
  alturaLinha = Math.max(alturaLinha, h);
}
const ALTURA = y + alturaLinha;

function caminho(p1, p2) {
  const c1 = { x: p1.x + NO_L / 2, y: p1.y + NO_A / 2 }, c2 = { x: p2.x + NO_L / 2, y: p2.y + NO_A / 2 };
  const dx = c2.x - c1.x, dy = c2.y - c1.y;
  let sx, sy, tx, ty;
  if (Math.abs(dx) > Math.abs(dy)) {
    sx = c1.x + Math.sign(dx) * NO_L / 2; sy = c1.y; tx = c2.x - Math.sign(dx) * NO_L / 2; ty = c2.y;
  } else {
    sx = c1.x; sy = c1.y + Math.sign(dy) * NO_A / 2; tx = c2.x; ty = c2.y - Math.sign(dy) * NO_A / 2;
  }
  const mx = (sx + tx) / 2;
  return `M${sx},${sy} C${mx},${sy} ${mx},${ty} ${tx},${ty}`;
}

function quebrar(texto, limite) {
  const linhas = [''];
  for (const palavra of texto.split(' ')) {
    const i = linhas.length - 1;
    if (linhas[i] && (linhas[i] + ' ' + palavra).length > limite) linhas.push(palavra);
    else linhas[i] += (linhas[i] ? ' ' : '') + palavra;
  }
  return linhas;
}

function nomeCurto(nome) {
  const p = nome.split(' ');
  if (nome.includes('&') || nome.includes(' e ') || p.length <= 2 || p[0].endsWith('.')) return nome;
  const part = p.findIndex(x => ['von', 'van', 'de', 'y'].includes(x));
  if (part > 0) return p.slice(part - (p[part] === 'y' ? 1 : 0)).join(' ');
  return `${p[0][0]}. ${p.at(-1)}`;
}

export default function Influencias() {
  useTitulo('Influências');
  const [hover, setHover] = useState(null);
  const [selecionado, setSelecionado] = useState('');
  const [vista, setVista] = useState('rede');
  const foco = hover || selecionado;
  const conexoes = selecionado ? arestas.filter(e => e.de === selecionado || e.para === selecionado) : arestas;
  const ligados = foco && new Set([foco, ...arestas.flatMap(e => e.de === foco ? [e.para] : e.para === foco ? [e.de] : [])]);

  return (
    <article className="pagina">
      <header className="cabeca">
          <h1>Quem influenciou<br />quem<span className="titulo-ponto">.</span></h1>
          <p className="lede">
            {naRede.size} autores e {arestas.length} relações de influência documentadas. A seta vai de quem influenciou
            para quem foi influenciado. Passe o mouse sobre um nome para destacar suas conexões; clique para abrir a ficha.
          </p>
      </header>
      <div className="rede-ferramentas">
        <label className="campo"><span>Explorar as conexões de</span><select value={selecionado} onChange={e => setSelecionado(e.target.value)}><option value="">Todos os autores</option>{autores.filter(a => naRede.has(a.id)).map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}</select></label>
        <AlternarVista valor={vista} onChange={setVista} opcoes={[[ 'rede', 'Rede', 'mapa' ], [ 'lista', 'Relações', 'lista' ]]} />
      </div>
      <div className="rede-leitura" aria-live="polite">{foco ? <><strong>{autorPorId[foco].nome}</strong><span>{arestas.filter(e => e.para === foco).length} influências recebidas · {arestas.filter(e => e.de === foco).length} autores influenciados</span><a href={link('autor', foco)}>Abrir ficha <Icone /></a></> : <span>Selecione um autor ou passe o cursor sobre a rede para acompanhar suas conexões.</span>}</div>
      {vista === 'rede' ? <div className="rede-moldura" tabIndex={0} aria-label="Rede de influências. Role horizontalmente para explorar.">
        <svg className="rede" viewBox={`-8 -8 ${LARGURA + 16} ${ALTURA + 16}`} role="img" aria-label="Rede de influências entre autores">
          <defs>
            <marker id="seta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" />
            </marker>
          </defs>
          {blocos.map(b => (
            <g key={b.d.id}>
              <rect className="rede-bloco" x={b.x} y={b.y} width={b.w} height={b.h} rx="10" />
              <text className="rede-bloco-nome" x={b.x + 14} y={b.y + 22}><title>{b.d.nome}</title>{quebrar(b.d.nome, Math.floor((b.w - 28) / 7)).map((linha, i) => <tspan key={i} x={b.x + 14} dy={i ? 16 : 0}>{linha}</tspan>)}</text>
            </g>
          ))}
          {arestas.map(e => {
            const ativa = foco && (e.de === foco || e.para === foco);
            return (
              <path key={e.de + '>' + e.para} d={caminho(posicoes[e.de], posicoes[e.para])} markerEnd="url(#seta)"
                className={'rede-aresta' + (ativa ? ' ativa' : foco ? ' apagada' : '')} />
            );
          })}
          {Object.entries(posicoes).map(([id, p]) => (
            <a key={id} href={link('autor', id)} onMouseEnter={() => setHover(id)} onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(id)} onBlur={() => setHover(null)}
              className={'rede-no' + (foco === id ? ' foco' : ligados && !ligados.has(id) ? ' apagado' : '')}>
              <title>{autorPorId[id].nome}</title>
              <rect x={p.x} y={p.y} width={NO_L} height={NO_A} rx="15" />
              <text x={p.x + NO_L / 2} y={p.y + NO_A / 2}>{nomeCurto(autorPorId[id].nome)}</text>
            </a>
          ))}
        </svg>
      </div> : <ul className="lista-relacoes">{conexoes.map(e => <li key={e.de + e.para}><a href={link('autor', e.de)}>{autorPorId[e.de].nome}</a><span aria-label="influenciou"><Icone /></span><a href={link('autor', e.para)}>{autorPorId[e.para].nome}</a></li>)}</ul>}
    </article>
  );
}
