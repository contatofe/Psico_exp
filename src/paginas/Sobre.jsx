import { colunas, linhas, teoriaPorId } from '../lib/dados';
import { link, useTitulo } from '../lib/rota';

export default function Sobre() {
  useTitulo('Sobre');
  const tinbergen = teoriaPorId['quatro-questoes-de-tinbergen'];
  return (
    <article className="pagina sobre">
      <header className="cabeca">
        <h1>Como ler este mapa</h1>
        <p className="lede">
          Um comportamento humano tem causas em várias escalas ao mesmo tempo. O mapa posiciona cada disciplina
          pelo tipo de causa que ela costuma investigar, em duas coordenadas.
        </p>
      </header>

      <div className="sobre-eixos">
        <section>
          <h2>Eixo vertical: escala temporal</h2>
          <p>Quanto tempo atrás está a causa.</p>
          <ol>{[...linhas].reverse().map(l => <li key={l.num}><b>{l.num}</b> {l.nome}<small>{l.sub}</small></li>)}</ol>
        </section>
        <section>
          <h2>Eixo horizontal: proximidade causal</h2>
          <p>Onde a causa age.</p>
          <ol>{colunas.map(c => <li key={c.letra}><b>{c.letra}</b> {c.nome}<small>{c.sub}</small></li>)}</ol>
        </section>
      </div>

      <div className="ficha-bio sobre-texto">
        <p>
          Cada disciplina recebe um endereço: a letra da coluna e o número da linha. Psicologia social, por exemplo,
          fica em C·01, interação entre indivíduos na escala do desenvolvimento.
        </p>
        <p>
          Só a célula carrega informação: dentro dela, a posição de cada ponto serve apenas para que eles não se
          sobreponham. A área do ponto é proporcional ao número de autores da disciplina, e a cor indica a coluna (a
          proximidade causal). Passe o cursor sobre um ponto para ver o nome.
        </p>
        <p>
          A ideia vem das quatro perguntas que o etólogo Nikolaas Tinbergen propôs em 1963 (mecanismo,
          desenvolvimento, função e evolução) e da abordagem multinível com que Robert Sapolsky explica o
          comportamento humano.{tinbergen && <> <a href={link('teoria', tinbergen.id)}>Ler sobre as quatro perguntas</a>.</>}
        </p>
        <p>
          Os textos foram escritos com apoio de inteligência artificial e estão em revisão. Encontrou um erro?{' '}
          <a href="https://github.com/contatofe/Psico_exp/issues" target="_blank" rel="noopener noreferrer">Avise no GitHub</a>.
        </p>
      </div>
    </article>
  );
}
