w# Mapa Multinível · Comportamento e Cognição Humana

Um site de divulgação científica que organiza autores, teorias e disciplinas ligadas ao estudo do comportamento e da cognição humana.

A ideia vem das quatro perguntas de Nikolaas Tinbergen e da abordagem multinível de Robert Sapolsky: um mesmo comportamento tem causas em várias escalas ao mesmo tempo. A matriz cruza dois eixos:

- **Escala temporal** (linhas): imediato · desenvolvimental · histórico/cultural · evolutivo recente
- **Proximidade causal** (colunas): intra-biológico · individual interno · interação imediata · social/cultural

## O que tem no site

| Página            | Endereço                 | O que mostra                                                          |
| ----------------- | ------------------------ | --------------------------------------------------------------------- |
| Início            | `#/`                     | Capa com o título e o fichário ilustrado                              |
| Mapa              | `#/mapa`                 | As disciplinas como pontos num gráfico de duas coordenadas            |
| Disciplina        | `#/disciplina/<id>`      | Endereço no mapa (ex.: C·02), descrição, autores e teorias            |
| Autor             | `#/autor/<id>`           | Retrato grande, biografia, obras-chave, métodos, influências          |
| Teoria            | `#/teoria/<id>`          | Fórmula (quando houver), explicação e autores                         |
| Autores / Teorias | `#/autores`, `#/teorias` | Índices com filtro                                                    |
| Rede              | `#/influencias`          | Rede de influências entre autores                                     |
| Cronologia        | `#/cronologia`           | Linha do tempo de vidas e obras                                       |
| Sobre             | `#/sobre`                | Como ler o mapa e créditos                                            |

Busca global: tecla `/` ou `⌘K`. No mapa, as setas do teclado andam entre os pontos.

O sistema visual está descrito em [DESIGN.md](DESIGN.md) e o propósito do produto em [PRODUCT.md](PRODUCT.md).

## Rodar localmente

Requer Node.js 20 ou superior.

```bash
npm install
npm run dev
```

Outros comandos:

- `npm run build`: valida os dados e gera o site estático em `dist/`
- `npm run checar`: só valida os dados (ids, influências, períodos, disciplinas)
- `npm run fotos`: redimensiona as fotos e gera as miniaturas (usa o `sips` do macOS)

## Estrutura

```text
src/
├── data/
│   ├── matriz.json          eixos da matriz e disciplinas (linha, coluna, descrição)
│   ├── teorias.json         teorias, com disciplina e ids dos autores
│   └── autores/<id>.json    um arquivo por autor
├── assets/fotos/            <id>.jpg (e miniaturas em mini/)
├── lib/                     carregamento dos dados e roteamento
├── componentes/             matriz, retratos, busca
└── paginas/                 uma página por rota
scripts/                     validação dos dados e preparo das fotos
```

## Como adicionar ou editar um autor

1. Crie ou edite `src/data/autores/<id>.json`. O `id` é o nome em minúsculas, sem acentos, com hífens (ex.: `b-f-skinner`):

   ```json
   {
     "id": "b-f-skinner",
     "nome": "B. F. Skinner",
     "periodo": "1904–1990",
     "disciplinas": ["Análise Experimental do Comportamento"],
     "resumo": "Uma frase (até 160 caracteres) para os cartões.",
     "bio": ["Parágrafo 1", "Parágrafo 2", "Parágrafo 3"],
     "tags": ["Experimental", "Modelagem animal"],
     "influencias": ["edward-thorndike", "ivan-pavlov"],
     "obras": [
       { "ano": "1938", "titulo": "The Behavior of Organisms", "link": "" }
     ]
   }
   ```

   - `periodo`: `AAAA–AAAA`, `AAAA–presente` ou, para duplas, `AAAA–AAAA / AAAA–AAAA` (com travessão `–`).
   - `disciplinas`: nomes exatamente como em `matriz.json`. A primeira define a posição na rede e na cronologia.
   - `influencias`: ids de outros autores do mapa. "Influenciou" é calculado automaticamente.

2. Foto (opcional): salve como `src/assets/fotos/<id>.jpg` e rode `npm run fotos`. Sem foto, o site mostra uma prancha na cor da coluna da disciplina, com o nome.
3. Rode `npm run checar` para conferir.

## Publicar

`npm run build` gera a pasta `dist/` com arquivos estáticos e caminhos relativos. Ela pode ser publicada no GitHub Pages, Netlify, Vercel ou em qualquer servidor estático. O roteamento usa `#/`, então não é preciso configurar o servidor.
