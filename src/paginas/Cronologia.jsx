import { ANO_ATUAL, autores, disciplinas } from '../lib/dados';
import { link, useTitulo } from '../lib/rota';
import { Retrato } from '../componentes/Autor';

// Cada autor aparece uma vez, na sua disciplina principal (lista já vem por nascimento). Dentro da disciplina,
// autores que se sobrepõem no tempo vão para faixas (lanes) diferentes.
const PX_ANO = 7, FAIXA = 46, ESPACO_NOME = 150;
const INICIO = Math.floor(Math.min(...autores.map(a => a.nasc)) / 20) * 20;
const FIM = Math.ceil(ANO_ATUAL / 20) * 20;
const xDe = ano => (ano - INICIO) * PX_ANO + 28;
const LARGURA = xDe(FIM) + ESPACO_NOME;
const MARCAS = Array.from({ length: (FIM - INICIO) / 20 + 1 }, (_, i) => INICIO + i * 20);

const grupos = disciplinas
  .map(d => {
    const lista = d.autores.filter(a => a.disciplinas[0] === d.nome);
    const faixas = [];
    const itens = lista.map(a => {
      const ini = xDe(a.nasc), fim = xDe(a.morte ?? ANO_ATUAL);
      let f = faixas.findIndex(ocupada => ocupada + 16 < ini);
      if (f === -1) f = faixas.push(0) - 1;
      faixas[f] = Math.max(fim, ini + ESPACO_NOME);
      return { a, ini, fim, f };
    });
    return { d, itens, altura: faixas.length * FAIXA + 12 };
  })
  .filter(g => g.itens.length)
  .sort((a, b) => a.itens[0].ini - b.itens[0].ini); // escada: disciplinas mais antigas primeiro

export default function Cronologia() {
  useTitulo('Cronologia');
  return (
    <article className="pagina">
      <header className="cabeca">
          <h1>Cronologia</h1>
          <p className="lede">
            Cada barra é uma vida; cada ponto, uma obra-chave. Role para os lados para percorrer de {INICIO} até hoje.
          </p>
      </header>
      <div className="crono-moldura">
        <div className="crono" style={{ '--largura': LARGURA + 'px' }}>
          <div className="crono-eixo">
            <div className="crono-rotulo">Disciplina</div>
            <div className="crono-trilho">
              {MARCAS.map(ano => <span key={ano} className="crono-marca" style={{ left: xDe(ano) }}>{ano}</span>)}
            </div>
          </div>
          {grupos.map(({ d, itens, altura }) => (
            <section key={d.id} className="crono-grupo">
              <a className="crono-rotulo" href={link('disciplina', d.id)}>{d.nome}<small>{itens.length}</small></a>
              <div className="crono-trilho" style={{ height: altura }}>
                {MARCAS.map(ano => <span key={ano} className="crono-grade" style={{ left: xDe(ano) }} />)}
                {itens.map(({ a, ini, fim, f }) => (
                  <a key={a.id} className="crono-vida" href={link('autor', a.id)} style={{ top: f * FAIXA + 8, left: ini }}
                    title={`${a.nome} (${a.periodo})`}>
                    <span className={'crono-barra' + (a.morte ? '' : ' viva')} style={{ width: Math.max(fim - ini, 2) }} />
                    {a.obras.map(o => {
                      const ano = parseInt(o.ano);
                      return ano >= a.nasc && <span key={o.titulo} className="crono-obra" style={{ left: xDe(ano) - ini }} title={`${o.ano} · ${o.titulo}`} />;
                    })}
                    <Retrato autor={a} mini />
                    <span className="crono-nome">{a.nome}<small>{a.periodo}</small></span>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
