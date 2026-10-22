# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Estudantes de psicologia (graduação e pós) e de áreas vizinhas (neurociência, economia comportamental, antropologia), usando o site para estudar e se orientar no campo: onde cada disciplina se encaixa, quem são as pessoas centrais, quais teorias saíram de cada uma.

## Product Purpose

Um mapa de autores, teorias e disciplinas que explicam o comportamento humano, organizado em duas coordenadas: escala temporal (imediato → evolutivo) e proximidade causal (intra-biológico → social/cultural). O site cumpre seu papel quando o visitante:

1. entende a visão multinível (comportamento se explica em várias escalas ao mesmo tempo), com o mapa como ferramenta de pensamento;
2. descobre autores e obras que não conhecia;
3. acha o trabalho relevante e bonito a ponto de compartilhar.

## Positioning

Não é uma lista de autores nem uma enciclopédia: é um quadro único (4×4) que posiciona cada disciplina no espaço tempo × proximidade causal. O mapa é a parte mais importante da ferramenta; o resto (fichas, teorias, rede, cronologia) é aprofundamento a partir dele.

## Capabilities and Constraints

- React + Vite, site estático, roteamento por hash (`#/autor/<id>`), sem backend.
- Conteúdo em `src/data/`: 119 autores (um JSON cada), 35 teorias, 29 disciplinas na matriz.
- Páginas: mapa (home), disciplina, autor, teoria, índices de autores e de teorias, rede de influências, cronologia, busca.
- Os índices de autores e teorias foram aprovados pelo dono do projeto e ficam.
- Textos em português do Brasil, gerados com apoio de IA; devem ser revisados antes de publicação.

## Brand Commitments

- Liberdade total de nome e identidade.
- O crédito à inspiração conceitual (as quatro perguntas de Nikolaas Tinbergen e a abordagem multinível de Robert Sapolsky) deve existir, mas discreto, em algum lugar secundário; não precisa ser evidente.
- Fichas de autores com imagem grande, em destaque (ideia original do dono do projeto, mantida).

## Evidence on Hand

- Retratos de 44 autores em `src/assets/fotos/<id>.jpg` (miniaturas em `mini/`); 75 autores ainda sem foto, a serem fornecidas pelo dono. O design precisa funcionar bem sem foto.
- Nenhum depoimento, métrica de uso ou imprensa: não inventar.

## Product Principles

1. O mapa é o produto: tudo parte dele e volta para ele.
2. Rigor antes de ornamento: informação correta e clara vale mais que efeito.
3. Profundidade sob demanda: a primeira tela é simples; o detalhe aparece quando o estudante pede.
4. Digno de ser compartilhado: o acabamento precisa sustentar o compartilhamento público.
