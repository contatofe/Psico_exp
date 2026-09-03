# Mapa Multinível · Comportamento e Cognição Humana

Um mapa interativo para organizar autores, teorias e disciplinas ligadas ao estudo experimental do comportamento e da cognição humana.

O projeto parte da ideia de que fenômenos psicológicos podem ser compreendidos em múltiplos níveis ao mesmo tempo: mecanismos imediatos, desenvolvimento individual, história/cultura e evolução. A matriz combina esses níveis temporais com diferentes graus de proximidade causal, indo do intra-biológico ao social/cultural.

## Inspiração conceitual

A organização do mapa é inspirada por abordagens multiníveis da explicação do comportamento, especialmente pelas perguntas de Tinbergen e por leituras contemporâneas como as de Robert Sapolsky.

A proposta é evitar explicações únicas ou reducionistas: um comportamento humano pode envolver processos neurais imediatos, história de aprendizagem, desenvolvimento, cultura, instituições e evolução.

## Modos de visualização

### Matriz

A visualização principal organiza disciplinas em dois eixos:

- **Escala temporal**
  - Imediato
  - Desenvolvimental
  - Histórico/cultural
  - Evolutivo recente

- **Proximidade causal**
  - Intra-biológico
  - Individual interno
  - Interação imediata
  - Social/cultural

### Influências

Mostra um grafo de autores conectados por relações de influência intelectual. As setas indicam quando um autor influenciou outro dentro do recorte mapeado.

### Cronologia

Apresenta os autores em uma linha do tempo, permitindo visualizar sobreposições históricas, períodos de vida e obras importantes.

## Estrutura do projeto

```text
.
├── index.html
├── style.css
├── script.js
├── data/
│   ├── matriz.json
│   ├── autores.json
│   └── teorias.json
└── fotos/
    └── imagens dos autores
