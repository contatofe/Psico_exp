// Carrega e cruza os dados. Cada autor é um arquivo em src/data/autores/<id>.json
// e a foto, se existir, fica em src/assets/fotos/<id>.jpg (miniatura em mini/).
import matriz from '../data/matriz.json';
import teoriasJson from '../data/teorias.json';

const arquivos = import.meta.glob('../data/autores/*.json', { eager: true, import: 'default' });
const urls = globs => Object.fromEntries(
  Object.entries(globs).map(([caminho, url]) => [caminho.split('/').pop().replace('.jpg', ''), url])
);
const FOTOS = urls(import.meta.glob('../assets/fotos/*.jpg', { eager: true, query: '?url', import: 'default' }));
const MINIS = urls(import.meta.glob('../assets/fotos/mini/*.jpg', { eager: true, query: '?url', import: 'default' }));

export const ANO_ATUAL = new Date().getFullYear();

/** "1914–1998 / 1917–2012" → [1914, 2012]; "1968–presente" → [1968, null] */
export function anos(periodo) {
  const t = periodo.match(/\d{4}|presente/g) || [];
  const inicio = Math.min(...t.filter((_, i) => i % 2 === 0).map(Number));
  const fim = t.at(-1) === 'presente' ? null : Number(t.at(-1));
  return [inicio, fim];
}

export const linhas = matriz.linhas;
export const colunas = matriz.colunas;

export const autores = Object.values(arquivos)
  .map(a => {
    const [nasc, morte] = anos(a.periodo);
    return { ...a, nasc, morte, foto: FOTOS[a.id], mini: MINIS[a.id] };
  })
  .sort((a, b) => a.nasc - b.nasc);

export const teorias = teoriasJson;

// Posição de cada disciplina no gráfico, em % do plano (0–100). Dentro da célula, as
// disciplinas se espalham na vertical; o deslocamento horizontal vem de um hash do nome,
// então é estável entre visitas e igual no mapa grande e nos mini-mapas.
const hash = s => [...s].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7);
const naCelula = {};
for (const d of matriz.disciplinas) (naCelula[`${d.linha},${d.coluna}`] ||= []).push(d.nome);

export const disciplinas = matriz.disciplinas.map(d => {
  const vizinhas = naCelula[`${d.linha},${d.coluna}`];
  const i = vizinhas.indexOf(d.nome);
  const dentroX = 0.22 + (hash(d.nome) % 57) / 100;          // 22–78% da célula
  const dentroY = (i + 1) / (vizinhas.length + 1);
  return {
    ...d,
    endereco: `${matriz.colunas[d.coluna].letra}·${matriz.linhas[d.linha].num}`,
    x: (d.coluna + dentroX) * 25,
    y: (d.linha + dentroY) * 25,
    autores: autores.filter(a => a.disciplinas.includes(d.nome)),
    teorias: teorias.filter(t => t.disciplina === d.nome),
  };
});

const porChave = (lista, chave) => Object.fromEntries(lista.map(x => [x[chave], x]));
export const autorPorId = porChave(autores, 'id');
export const teoriaPorId = porChave(teorias, 'id');
export const disciplinaPorId = porChave(disciplinas, 'id');
export const disciplinaPorNome = porChave(disciplinas, 'nome');

/** Quem cada autor influenciou (o inverso de `influencias`). */
export const influenciou = {};
for (const a of autores) for (const i of a.influencias) (influenciou[i] ||= []).push(a.id);

export const teoriasDe = id => teorias.filter(t => t.autores.includes(id));

export function iniciais(nome) {
  const partes = nome.split(/\s+/).filter(p => /^\p{L}{2}/u.test(p)); // ignora "B." e "&"
  if (partes.length < 2) return nome[0].toUpperCase();
  return (partes[0][0] + partes.at(-1)[0]).toUpperCase();
}

export function idade(autor) {
  if (autor.periodo.includes('/')) return '';
  return autor.morte ? `viveu ${autor.morte - autor.nasc} anos` : `${ANO_ATUAL - autor.nasc} anos`;
}
