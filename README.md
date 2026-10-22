# Mapa Multinível · Comportamento e Cognição Humana

Um site de divulgação científica que organiza autores, teorias e disciplinas ligadas ao estudo do comportamento e da cognição humana.

A ideia vem das quatro perguntas de Nikolaas Tinbergen e da abordagem multinível de Robert Sapolsky: um mesmo comportamento tem causas em várias escalas ao mesmo tempo. A matriz cruza dois eixos:

- **Escala temporal** (linhas): imediato · desenvolvimental · histórico/cultural · evolutivo recente
- **Proximidade causal** (colunas): intra-biológico · individual interno · interação imediata · social/cultural

## O que tem no site

| Página | Endereço | O que mostra |
|---|---|---|
| Início | `#/` | Apresentação, matriz interativa, autor em destaque |
| Disciplina | `#/disciplina/<id>` | Descrição, posição na matriz, autores e teorias |
| Autor | `#/autor/<id>` | Biografia, obras-chave, métodos, quem influenciou e quem foi influenciado |
| Teoria | `#/teoria/<id>` | Fórmula (quando houver), explicação e autores |
| Autores / Teorias | `#/autores`, `#/teorias` | Índices com filtro |
| Influências | `#/influencias` | Rede de influências entre autores |
| Cronologia | `#/cronologia` | Linha do tempo de vidas e obras |

Busca global: tecla `/` ou `⌘K`.

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
     "obras": [{ "ano": "1938", "titulo": "The Behavior of Organisms", "link": "" }]
   }
   ```

   - `periodo`: `AAAA–AAAA`, `AAAA–presente` ou, para duplas, `AAAA–AAAA / AAAA–AAAA` (com travessão `–`).
   - `disciplinas`: nomes exatamente como em `matriz.json`. A primeira define a cor e a posição na rede e na cronologia.
   - `influencias`: ids de outros autores do mapa. "Influenciou" é calculado automaticamente.
2. Foto (opcional): salve como `src/assets/fotos/<id>.jpg` e rode `npm run fotos`. Sem foto, o site mostra as iniciais.
3. Rode `npm run checar` para conferir.

## Publicar

`npm run build` gera a pasta `dist/` com arquivos estáticos e caminhos relativos. Ela pode ser publicada no GitHub Pages, Netlify, Vercel ou em qualquer servidor estático. O roteamento usa `#/`, então não é preciso configurar o servidor.
