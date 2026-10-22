import { autores, colunas, corDe, disciplinas, linhas, teoriaPorId, teorias } from '../lib/dados';
import { link, useTitulo } from '../lib/rota';
import { CartaoAutor, Retrato } from '../componentes/Autor';
import { Matriz } from '../componentes/Matriz';

const embaralhar = lista => lista.map(x => [Math.random(), x]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
const comFoto = embaralhar(autores.filter(a => a.foto));
const MOSAICO = comFoto.slice(0, 9);
const DESTAQUE = comFoto.find(a => a.resumo && !MOSAICO.includes(a)) || comFoto.find(a => a.resumo);
const VITRINE = embaralhar(autores.filter(a => a.resumo && a !== DESTAQUE))
  .sort((a, b) => !a.foto - !b.foto) // quem tem foto primeiro
  .slice(0, 8);
const TINBERGEN = teoriaPorId['quatro-questoes-de-tinbergen'];

export default function Inicio() {
  useTitulo('');
  return (
    <>
      <section className="hero">
        <div className="hero-texto">
          <p className="sobrancelha">Mapa multinível · ciência do comportamento</p>
          <h1>Por que fazemos <em>o que fazemos?</em></h1>
          <p className="hero-lede">
            Todo comportamento humano tem causas em várias escalas ao mesmo tempo: um neurônio que disparou
            há um segundo, uma infância, uma cultura, milhões de anos de evolução. Este mapa reúne as pessoas
            que ajudaram a explicar cada uma dessas camadas.
          </p>
          <dl className="numeros">
            <div><dt>Autores</dt><dd>{autores.length}</dd></div>
            <div><dt>Teorias</dt><dd>{teorias.length}</dd></div>
            <div><dt>Disciplinas</dt><dd>{disciplinas.length}</dd></div>
            <div><dt>Escalas</dt><dd>{linhas.length}×{colunas.length}</dd></div>
          </dl>
          <div className="hero-acoes">
            <button className="botao" onClick={() => document.getElementById('mapa').scrollIntoView({ behavior: 'smooth' })}>
              Explorar o mapa
            </button>
            <a className="botao fantasma" href={link('autores')}>Ver todos os autores</a>
          </div>
        </div>
        <div className="mosaico" aria-hidden="true">
          {MOSAICO.map(a => (
            <a key={a.id} href={link('autor', a.id)} tabIndex={-1} title={a.nome}><Retrato autor={a} /></a>
          ))}
        </div>
      </section>

      <section className="secao" id="mapa">
        <div className="secao-cabeca">
          <p className="sobrancelha">O mapa</p>
          <h2>Duas coordenadas para qualquer explicação</h2>
          <p>
            As linhas indicam <strong>quanto tempo atrás</strong> está a causa, do instante presente à evolução da espécie.
            As colunas indicam <strong>onde</strong> ela age, de dentro do organismo até a cultura. Cada disciplina ocupa
            a célula em que mais trabalha. Clique em uma para conhecer seus autores e teorias.
          </p>
        </div>
        <Matriz />
      </section>

      {TINBERGEN && (
        <section className="secao chamada">
          <div>
            <p className="sobrancelha">De onde vem a ideia</p>
            <h2>As quatro perguntas de Tinbergen</h2>
            <p>
              Em 1963, o etólogo Niko Tinbergen propôs que nenhum comportamento está explicado até respondermos a
              quatro perguntas: qual o mecanismo, como se desenvolveu, para que serve e como evoluiu. Décadas depois,
              Robert Sapolsky levou a mesma lógica ao comportamento humano. Este mapa segue esse espírito.
            </p>
            <a className="link-seta" href={link('teoria', TINBERGEN.id)}>Ler sobre as quatro perguntas →</a>
          </div>
          <ol className="quatro">
            <li><span>01</span>Mecanismo<small>O que acontece no corpo agora?</small></li>
            <li><span>02</span>Desenvolvimento<small>Como isso surgiu ao longo da vida?</small></li>
            <li><span>03</span>Função<small>Que vantagem isso traz?</small></li>
            <li><span>04</span>Evolução<small>De que história da espécie isso vem?</small></li>
          </ol>
        </section>
      )}

      {DESTAQUE && (
        <section className="secao destaque" style={{ '--cor': corDe(DESTAQUE.disciplinas[0]) }}>
          <a className="destaque-cartao" href={link('autor', DESTAQUE.id)}>
            <Retrato autor={DESTAQUE} className="destaque-foto" />
            <div>
              <p className="sobrancelha">Autor em destaque</p>
              <h2>{DESTAQUE.nome}</h2>
              <p className="destaque-periodo">{DESTAQUE.periodo} · {DESTAQUE.disciplinas.join(' · ')}</p>
              <p className="destaque-resumo">{DESTAQUE.resumo}</p>
              <span className="link-seta">Ler a ficha →</span>
            </div>
          </a>
        </section>
      )}

      <section className="secao">
        <div className="secao-cabeca linha">
          <h2>Algumas pessoas deste mapa</h2>
          <a className="link-seta" href={link('autores')}>Todos os {autores.length} →</a>
        </div>
        <div className="grade-autores">
          {VITRINE.map(a => <CartaoAutor key={a.id} autor={a} comResumo />)}
        </div>
      </section>

      <section className="secao portas">
        <a href={link('influencias')}>
          <p className="sobrancelha">Rede</p>
          <h3>Quem influenciou quem</h3>
          <p>As ideias viajam entre disciplinas. Siga as setas de orientadores, leitores e rivais.</p>
          <span className="link-seta">Abrir a rede →</span>
        </a>
        <a href={link('cronologia')}>
          <p className="sobrancelha">Tempo</p>
          <h3>Dois séculos em uma linha</h3>
          <p>Veja quem foi contemporâneo de quem e quando saíram as obras que mudaram cada campo.</p>
          <span className="link-seta">Abrir a cronologia →</span>
        </a>
      </section>
    </>
  );
}
