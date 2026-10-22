// Valida os dados antes do build: `npm run checar`. Erros quebram o build; avisos só informam.
import fs from 'node:fs';
import path from 'node:path';

const DATA = path.join(import.meta.dirname, '../src/data');
const FOTOS = path.join(import.meta.dirname, '../src/assets/fotos');
const ler = p => JSON.parse(fs.readFileSync(path.join(DATA, p), 'utf8'));

const erros = [], avisos = [];
const matriz = ler('matriz.json');
const teorias = ler('teorias.json');
const autores = fs.readdirSync(path.join(DATA, 'autores')).filter(f => f.endsWith('.json'))
  .map(f => ({ arquivo: f, ...ler(`autores/${f}`) }));

const disciplinas = new Set(matriz.disciplinas.map(d => d.nome));
const ids = new Set(autores.map(a => a.id));

for (const a of autores) {
  const e = msg => erros.push(`autores/${a.arquivo}: ${msg}`);
  if (a.arquivo !== `${a.id}.json`) e(`id "${a.id}" não bate com o nome do arquivo`);
  if (!a.nome) e('sem nome');
  // duplas: "1914–1998 / 1917–2012"
  if (!/^\d{4}–(\d{4}|presente)( \/ \d{4}–(\d{4}|presente))?$/.test(a.periodo))
    e(`periodo inválido "${a.periodo}" (use AAAA–AAAA, AAAA–presente ou, para duplas, AAAA–AAAA / AAAA–AAAA)`);
  if (!a.disciplinas?.length) e('sem disciplinas');
  for (const d of a.disciplinas || []) if (!disciplinas.has(d)) e(`disciplina desconhecida "${d}"`);
  for (const i of a.influencias || []) {
    if (!ids.has(i)) e(`influência "${i}" não existe`);
    if (i === a.id) e('influencia a si mesmo');
  }
  for (const o of a.obras || []) if (!/^\d{4}/.test(o.ano) || !o.titulo) e(`obra inválida ${JSON.stringify(o)}`);
  if (a.resumo?.length > 200) e(`resumo com ${a.resumo.length} caracteres (máx. 200)`);
  if (!a.resumo || !a.bio?.length) avisos.push(`${a.id}: ficha incompleta (sem resumo ou bio)`);
  if (!fs.existsSync(path.join(FOTOS, `${a.id}.jpg`))) avisos.push(`${a.id}: sem foto (src/assets/fotos/${a.id}.jpg)`);
}

const idsTeoria = new Set();
for (const t of teorias) {
  const e = msg => erros.push(`teorias.json "${t.id}": ${msg}`);
  if (idsTeoria.has(t.id)) e('id duplicado');
  idsTeoria.add(t.id);
  if (!disciplinas.has(t.disciplina)) e(`disciplina desconhecida "${t.disciplina}"`);
  for (const i of t.autores) if (!ids.has(i)) e(`autor "${i}" não existe`);
}

for (const d of matriz.disciplinas) if (!d.descricao) avisos.push(`disciplina "${d.nome}" sem descrição`);

const semFoto = avisos.filter(a => a.includes('sem foto')).length;
for (const a of avisos.filter(a => !a.includes('sem foto'))) console.warn('aviso:', a);
if (semFoto) console.warn(`aviso: ${semFoto} autores sem foto (detalhes: npm run checar -- --fotos)`);
if (process.argv.includes('--fotos')) avisos.filter(a => a.includes('sem foto')).forEach(a => console.warn('  ', a));
for (const e of erros) console.error('ERRO:', e);
console.log(`${autores.length} autores · ${teorias.length} teorias · ${matriz.disciplinas.length} disciplinas · ${erros.length} erros`);
process.exit(erros.length ? 1 : 0);
