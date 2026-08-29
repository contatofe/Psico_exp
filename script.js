/**
 * ============================================================================
 * MAPA MULTINÍVEL · COMPORTAMENTO E COGNIÇÃO HUMANA
 * ============================================================================
 * Este arquivo JavaScript gerencia toda a lógica interativa da aplicação, incluindo:
 * 1. Estruturas de Dados (Linhas do tempo, Colunas de proximidade, Matriz 4x4, Autores e Teorias).
 * 2. Construção da Matriz de Disciplinas.
 * 3. Gerenciamento de Overlays/Modais para detalhes de Disciplinas, Autores e Teorias.
 * 4. Grafo Interativo de Influências em SVG.
 * 5. Linha do Tempo / Cronologia dos Autores.
 */

/* ============================================================================
   1. ESTRUTURAS DE DADOS DA MATRIZ PRINCIPAL
   ============================================================================ */

/**
 * Níveis temporais / ontogenéticos / evolutivos (Eixo Y da matriz).
 * Vão desde a explicação imediata (segundos) até a filogenética (milhões de anos).
 */
const LINHAS_TEMPO = [
  { num: "03", nome: "Evolutivo recente", sub: "100 mil a 10 milhões de anos (evolução da espécie humana)" },
  { num: "02", nome: "Histórico/cultural", sub: "1 mil a 100 mil anos (surgimento de culturas, escrita, instituições)" },
  { num: "01", nome: "Desenvolvimental", sub: "Anos a décadas (desenvolvimento individual, aprendizado)" },
  { num: "00", nome: "Imediato", sub: "segundos a minutos (processamento, interações)" },
];

/**
 * Proximidades causais / Níveis de análise (Eixo X da matriz).
 * Vão desde o nível biológico interno até o nível social e cultural amplo.
 */
const COLUNAS_PROX = [
  { letra: "A", nome: "Intra-biológico", sub: "dentro do organismo", classe: "col-A" },
  { letra: "B", nome: "Individual interno", sub: "dentro do indivíduo", classe: "col-B" },
  { letra: "C", nome: "Interação imediata", sub: "entre indivíduos", classe: "col-C" },
  { letra: "D", nome: "Social / cultural", sub: "estruturas e cultura", classe: "col-D" },
];

/**
 * Mapeamento da matriz por coordenadas [linha, coluna].
 * Cada célula contém a lista de disciplinas científicas associadas àquela interseção.
 */
const MATRIZ = {
  "0,0": ["Genética populacional humana", "Neuroevolução"],
  "0,1": ["Etologia", "Psicologia evolutiva"],
  "0,2": [],
  "0,3": ["Evolução cultural", "Antropologia evolutiva"],
  "1,0": ["Epigenética evolutiva"],
  "1,1": ["Psicologia cultural"],
  "1,2": ["Sociobiologia / Ecologia comportamental"],
  "1,3": ["Antropologia", "Sociologia histórica", "História cultural"],
  "2,0": ["Neurodesenvolvimento", "Endocrinologia do desenvolvimento"],
  "2,1": ["Psicologia do desenvolvimento", "Psicologia cognitiva"],
  "2,2": ["Psicologia social"],
  "2,3": ["Sociologia", "Sociolinguística", "Educação e mídia"],
  "3,0": ["Neurociência", "Psicofisiologia"],
  "3,1": ["Psicofísica", "Neuroeconomia"],
  "3,2": ["Análise Experimental do Comportamento", "Economia comportamental", "Teoria dos jogos"],
  "3,3": ["Comunicação simbólica", "Mídias sociais"],
};

/**
 * Descrições resumidas do objeto de estudo de cada disciplina.
 */
const DESCRICOES = {
  "Psicologia cognitiva": "O estudo dos processos mentais — atenção, memória, linguagem, raciocínio — entendidos como sistemas de processamento de informação.",
  "Análise Experimental do Comportamento": "A ciência das relações funcionais entre comportamento e ambiente, fundada na investigação experimental do reforçamento e da escolha.",
  "Economia comportamental": "A integração entre psicologia e economia, focada em como vieses e heurísticas moldam decisões reais sob risco e incerteza.",
  "Psicologia social": "O estudo de como pensamos, sentimos e nos comportamos em função da presença real, imaginária ou implícita de outros.",
  "Antropologia": "A investigação comparativa das culturas e da experiência humana, do trabalho de campo etnográfico à análise de sistemas simbólicos.",
  "Neurociência": "O estudo do sistema nervoso em seus múltiplos níveis — molecular, celular, sistêmico — como substrato da mente e do comportamento.",
  "Etologia": "O estudo do comportamento animal em seu ambiente natural, considerando causas próximas e distantes em uma perspectiva evolutiva.",
  "Sociolinguística": "O estudo da linguagem como prática social, atenta à variação, ao contato e à mudança em contextos comunitários reais.",
  "Psicofísica": "A medida quantitativa da relação entre estímulos físicos e as sensações que eles produzem — fundadora da psicologia experimental.",
};

/* ============================================================================
   2. DICIONÁRIO COMPLETO DE AUTORES
   ============================================================================ */
const AUTORES = {
  "Psicologia cognitiva": [
    {
      nome: "George Miller", periodo: "1920–2012", foto: "miller.jpg",
      contribuicao: "Um dos fundadores da revolução cognitiva. No artigo 'The Magical Number Seven, Plus or Minus Two' (1956) propôs limites na capacidade da memória de curto prazo (≈7±2 unidades), introduzindo o conceito de *chunking* (agrupamento de informação).\n\nCo-fundou com Jerome Bruner o Center for Cognitive Studies (Harvard), institucionalizando a área.\n\nConectou psicologia com teoria da informação (influência de Claude Shannon), tratando processamento humano como canal com capacidade limitada.\n\nInfluenciou diretamente estudos posteriores de memória de trabalho (Baddeley) e carga cognitiva.",
      tags: ["Experimental", "Matemática"],
      influencias: ["Jerome Bruner"],
      obras: [{ ano: "1956", titulo: "The Magical Number Seven, Plus or Minus Two", link: "https://psychclassics.yorku.ca/Miller/" }, { ano: "1960", titulo: "Plans and the Structure of Behavior (com Galanter e Pribram)", link: "" }]
    },

    {
      nome: "Noam Chomsky", periodo: "1928–presente", foto: "chomsky.jpg",
      contribuicao: "Revolucionou a linguística com a gramática gerativa e a hipótese da Gramática Universal.\n\nSua crítica a 'Verbal Behavior' de Skinner (1959) argumentou que linguagem não pode ser explicada apenas por reforço — requer estruturas mentais inatas.\n\nIntroduziu distinções como competência vs desempenho e regras recursivas (capacidade infinita com meios finitos).\n\nInfluenciou profundamente a psicologia cognitiva ao recolocar representações mentais e estruturas internas no centro da explicação.\n\nDialoga com tradição racionalista (Descartes) e influenciou Pinker, Fodor e a ciência cognitiva moderna.",
      tags: ["Filosofia da ciência", "Matemática"],
      influencias: [],
      obras: [{ ano: "1957", titulo: "Syntactic Structures", link: "" }, { ano: "1959", titulo: "A Review of B. F. Skinner's Verbal Behavior", link: "https://chomsky.info/1967____/" }, { ano: "1965", titulo: "Aspects of the Theory of Syntax", link: "" }]
    },

    {
      nome: "Ulric Neisser", periodo: "1928–2012", foto: "neisser.jpg",
      contribuicao: "Autor de 'Cognitive Psychology' (1967), livro que nomeou e estruturou o campo.\n\nDefiniu cognição como todos os processos pelos quais o input sensorial é transformado, reduzido, elaborado, armazenado e recuperado.\n\nInicialmente alinhado ao paradigma do processamento de informação, depois criticou a artificialidade dos experimentos de laboratório e propôs uma abordagem ecológica (influência de James Gibson).\n\nIntroduziu preocupação com validade ecológica — antecipando debates atuais sobre generalização experimental.",
      tags: ["Experimental", "Filosofia da ciência"],
      influencias: ["George Miller", "James Gibson", "Jerome Bruner"],
      obras: [{ ano: "1967", titulo: "Cognitive Psychology", link: "" }, { ano: "1976", titulo: "Cognition and Reality", link: "" }]
    },

    {
      nome: "Michael Posner", periodo: "1936–presente", foto: "posner.jpg",
      contribuicao: "Pioneiro no estudo experimental da atenção.\n\nDesenvolveu o Posner Cueing Task (1978), demonstrando deslocamento encoberto de atenção e efeitos de facilitação/inibição (valid vs invalid cues).\n\nPropôs modelo das três redes atencionais:\n- alerta (noradrenérgica)\n- orientação (parietal)\n- controle executivo (cingulado anterior)\n\nIntegra psicologia cognitiva com neurociência (fMRI, EEG), sendo central na neurociência da atenção.\n\nInfluenciado por estudos de tempo de reação (Donders) e processamento seriado.",
      tags: ["Experimental", "Neuroimagem"],
      influencias: ["George Miller", "Donald Broadbent"],
      obras: [{ ano: "1980", titulo: "Orienting of Attention", link: "" }, { ano: "1990", titulo: "The attention system of the human brain (com Petersen)", link: "https://doi.org/10.1146/annurev.ne.13.030190.000325" }]
    },

    {
      nome: "Allen Newell", periodo: "1927–1992", foto: "newell.jpg",
      contribuicao: "Pioneiro da ciência cognitiva computacional.\n\nCo-criou com Herbert Simon o Logic Theorist (1956) e o General Problem Solver (GPS), primeiros programas de IA que simulavam raciocínio humano.\n\nDesenvolveu a arquitetura cognitiva SOAR, modelando cognição como sistema de produção (if-then rules).\n\nPropôs que cognição pode ser entendida como manipulação simbólica.\n\nInfluenciado por matemática, lógica e computação; ajudou a consolidar o paradigma computacional da mente."
    },

    {
      nome: "Donald Broadbent", periodo: "1926–1993", foto: "broadbent.jpg",
      contribuicao: "Propôs o modelo de filtro atencional (1958), um dos primeiros modelos formais de atenção.\n\nSugeriu que processamento é serial e que um filtro precoce seleciona informação com base em características físicas.\n\nBaseado em experimentos de escuta dicótica (shadowing tasks).\n\nInfluenciou diretamente Treisman e modelos posteriores de atenção seletiva.\n\nFortemente inspirado pela teoria da informação (Shannon).",
      tags: ["Experimental"],
      influencias: [],
      obras: [{ ano: "1958", titulo: "Perception and Communication", link: "" }]
    },

    {
      nome: "Anne Treisman", periodo: "1935–2018", foto: "treisman.jpg",
      contribuicao: "Refinou Broadbent com a teoria de atenuação (não bloqueio total, mas redução de sinal irrelevante).\n\nDesenvolveu a Feature Integration Theory (FIT):\n- características básicas (cor, forma) são processadas em paralelo\n- atenção é necessária para 'ligar' features em objetos\n\nExplicou fenômenos como ilusões de conjunção.\n\nInfluenciada por Broadbent; influenciou estudos modernos de atenção visual e binding neural.",
      tags: ["Experimental"],
      influencias: ["Donald Broadbent"],
      obras: [{ ano: "1980", titulo: "A feature-integration theory of attention (com Gelade)", link: "https://doi.org/10.1016/0010-0285(80)90005-5" }]
    },

    {
      nome: "Endel Tulving", periodo: "1927–2023", foto: "tulving.jpg",
      contribuicao: "Distinguiu memória episódica (eventos autobiográficos) de memória semântica (conhecimento geral).\n\nIntroduziu conceito de 'viagem mental no tempo' (mental time travel) e consciência autonoética.\n\nPropôs organização hierárquica da memória.\n\nSeus trabalhos influenciaram profundamente neurociência da memória (hipocampo, amnésia).\n\nDialoga com estudos de H.M. (Scoville & Milner).",
      tags: ["Experimental", "Neuropsicológico"],
      influencias: [],
      obras: [{ ano: "1972", titulo: "Episodic and Semantic Memory", link: "" }, { ano: "1983", titulo: "Elements of Episodic Memory", link: "" }]
    },

    {
      nome: "Alan Baddeley", periodo: "1934–presente", foto: "baddeley.jpg",
      contribuicao: "Propôs o modelo de memória de trabalho (1974, com Hitch):\n- executivo central\n- alça fonológica\n- bloco visuoespacial\n\nPosteriormente adicionou o buffer episódico.\n\nSuperou o modelo unitário de memória de curto prazo de Miller.\n\nAltamente influente em educação, neuropsicologia e ciência cognitiva.\n\nBaseado em evidências de dupla tarefa e dissociações neuropsicológicas.",
      tags: ["Experimental", "Neuropsicológico"],
      influencias: ["George Miller"],
      obras: [{ ano: "1974", titulo: "Working Memory (com Hitch)", link: "" }, { ano: "2000", titulo: "The episodic buffer: a new component of working memory?", link: "https://doi.org/10.1016/S1364-6613(00)01538-2" }]
    },

    {
      nome: "David Marr", periodo: "1945–1980", foto: "marr.jpg",
      contribuicao: "Propôs os três níveis de análise da cognição:\n- computacional (qual problema é resolvido)\n- algorítmico (como é resolvido)\n- implementacional (como é fisicamente realizado)\n\nAplicou isso à visão (ex: processamento de bordas, representações intermediárias).\n\nSeu framework é central para integrar psicologia, IA e neurociência.\n\nInfluenciado por computação e neurofisiologia.",
      tags: ["Computacional", "Matemática", "Filosofia da ciência"],
      influencias: ["Herbert Simon"],
      obras: [{ ano: "1982", titulo: "Vision", link: "" }]
    },

    {
      nome: "James Gibson", periodo: "1904–1979", foto: "gibson.jpg",
      contribuicao: "Propôs a teoria ecológica da percepção.\n\nRejeitou processamento interno pesado, defendendo que informação está no ambiente (affordances).\n\nPercepção é direta, não inferencial.\n\nInfluenciou Neisser (fase tardia), embodied cognition e robótica.\n\nContraponto ao paradigma computacional clássico.",
      tags: ["Experimental", "Filosofia da ciência"],
      influencias: [],
      obras: [{ ano: "1979", titulo: "The Ecological Approach to Visual Perception", link: "" }]
    },

    {
      nome: "Jerome Bruner", periodo: "1915–2016", foto: "bruner.jpg",
      contribuicao: "Co-fundador da revolução cognitiva.\n\nEstudou categorização, representação e aprendizagem.\n\nPropôs modos de representação:\n- enativa (ação)\n- icônica (imagem)\n- simbólica (linguagem)\n\nContribuiu para psicologia educacional e cultura.\n\nColaborou com Miller e influenciou abordagens construtivistas.",
      tags: ["Experimental", "Filosofia da ciência"],
      influencias: [],
      obras: [{ ano: "1956", titulo: "A Study of Thinking", link: "" }, { ano: "1990", titulo: "Acts of Meaning", link: "" }]
    }
  ],

  "Análise Experimental do Comportamento": [
    {
      nome: "B. F. Skinner", periodo: "1904–1990", foto: "skinner.jpg",
      contribuicao: "Fundador do behaviorismo radical e da análise experimental do comportamento. Desenvolveu o conceito de condicionamento operante, distinguindo comportamento respondente (Pavlov) de operante (emitido e selecionado por consequências).\n\nFormalizou contingências de três termos (SD → R → SR), onde estímulos discriminativos (SD) sinalizam a disponibilidade de reforço para respostas (R) seguidas de consequências (SR).\n\nDesenvolveu os esquemas de reforçamento (FR, VR, FI, VI), demonstrando padrões estáveis de resposta (ex: pausas pós-reforço em FR, taxas altas em VR).\n\nCriou a Skinner Box, permitindo controle experimental preciso e mensuração contínua do comportamento.\n\nEm 'Verbal Behavior' (1957), propôs uma análise funcional da linguagem (mands, tacts, intraverbais), antecipando debates sobre cognição e linguagem.\n\nInfluenciado por Pavlov, Thorndike e pelo positivismo lógico; influenciou profundamente psicologia, educação, economia comportamental e ciência do comportamento aplicada (ABA).",
      tags: ["Experimental", "Modelagem animal"],
      influencias: ["Edward Thorndike", "Ivan Pavlov", "John B. Watson"],
      obras: [{ ano: "1938", titulo: "The Behavior of Organisms", link: "" }, { ano: "1953", titulo: "Science and Human Behavior", link: "" }, { ano: "1957", titulo: "Verbal Behavior", link: "" }]
    },

    {
      nome: "Richard Herrnstein", periodo: "1930–1994", foto: "herrnstein.jpg",
      contribuicao: "Formulou a Lei da Igualação (Matching Law, 1961), descrevendo quantitativamente a alocação de respostas em esquemas concorrentes:\n\nB1 / (B1 + B2) = R1 / (R1 + R2)\n\nou na forma generalizada:\n\nlog(B1/B2) = a·log(R1/R2) + log k\n\nonde 'a' representa sensibilidade à razão de reforço e 'k' viés.\n\nDemonstrou que organismos distribuem comportamento proporcionalmente às taxas de reforço, estabelecendo ponte direta entre psicologia experimental e teoria econômica.\n\nAluno de Skinner, influenciou modelos de escolha, economia comportamental e neuroeconomia.\n\nTambém investigou 'melhoramento relativo' vs maximização, desafiando modelos clássicos de decisão racional.",
      tags: ["Experimental", "Matemática", "Modelagem animal"],
      influencias: ["B. F. Skinner"],
      obras: [{ ano: "1961", titulo: "Relative and absolute strength of response as a function of frequency of reinforcement", link: "https://doi.org/10.1901/jeab.1961.4-267" }, { ano: "1970", titulo: "On the law of effect", link: "https://doi.org/10.1901/jeab.1970.13-243" }]
    },

    {
      nome: "John B. Watson", periodo: "1878–1958", foto: "watson.jpg",
      contribuicao: "Fundador do behaviorismo metodológico. No manifesto de 1913 ('Psychology as the Behaviorist Views It'), rejeitou introspecção e propôs que a psicologia deveria estudar apenas comportamento observável.\n\nExperimento do Pequeno Albert (1920, com Rosalie Rayner) demonstrou condicionamento de respostas emocionais, generalização de estímulos e aprendizagem de medo.\n\nDefendeu que comportamento humano poderia ser moldado integralmente pelo ambiente ('dê-me uma dúzia de crianças...').\n\nInfluenciado por Pavlov; abriu caminho para Skinner e a análise experimental do comportamento.",
      tags: ["Experimental", "Filosofia da ciência"],
      influencias: ["Ivan Pavlov", "Edward Thorndike"],
      obras: [{ ano: "1913", titulo: "Psychology as the Behaviorist Views It", link: "https://psychclassics.yorku.ca/Watson/views.htm" }, { ano: "1920", titulo: "Conditioned emotional reactions (com Rayner)", link: "" }]
    },

    {
      nome: "Ivan Pavlov", periodo: "1849–1936", foto: "pavlov.jpg",
      contribuicao: "Descobriu o condicionamento clássico (respondente) ao estudar reflexos digestivos em cães.\n\nFormalizou a associação entre estímulo condicionado (CS) e estímulo incondicionado (US), produzindo resposta condicionada (CR).\n\nInvestigou processos fundamentais:\n- aquisição\n- extinção\n- generalização\n- discriminação\n\nIntroduziu a ideia de 'reflexos condicionados' como base da aprendizagem.\n\nSeus achados influenciaram profundamente behaviorismo, neurociência e modelos contemporâneos de aprendizagem associativa (ex: modelos de erro de previsão).\n\nRecebeu o Nobel de Fisiologia em 1904.",
      tags: ["Experimental", "Modelagem animal"],
      influencias: ["Hermann von Helmholtz"],
      obras: [{ ano: "1927", titulo: "Conditioned Reflexes", link: "" }]
    },

    {
      nome: "Edward Thorndike", periodo: "1874–1949", foto: "thorndike.jpg",
      contribuicao: "Formulou a Lei do Efeito (1898) a partir de experimentos com caixas-problema:\n\nRespostas seguidas de consequências satisfatórias são fortalecidas; respostas seguidas de consequências aversivas são enfraquecidas.\n\nDescreveu aprendizagem como processo gradual (trial-and-error), não insight súbito.\n\nPropôs também a Lei do Exercício (uso fortalece conexões estímulo-resposta).\n\nSeus experimentos antecipam diretamente o condicionamento operante de Skinner e influenciaram teorias de aprendizagem e educação.\n\nFoi um dos primeiros a quantificar comportamento em laboratório.",
      tags: ["Experimental", "Modelagem animal"],
      influencias: [],
      obras: [{ ano: "1898", titulo: "Animal Intelligence: An Experimental Study", link: "" }, { ano: "1911", titulo: "Animal Intelligence", link: "" }]
    },

    {
      nome: "Howard Rachlin", periodo: "1935–2021", foto: "rachlin.jpg",
      contribuicao: "Desenvolveu o behaviorismo teleológico, propondo que comportamento deve ser entendido em padrões estendidos no tempo, não em respostas isoladas.\n\nEstudou autocontrole e desconto temporal, mostrando que escolhas impulsivas vs autocontroladas podem ser modeladas como conflito entre recompensas imediatas e atrasadas.\n\nContribuiu para modelos de desconto hiperbólico:\n\nV = A / (1 + kD)\n\nonde V é valor subjetivo, A magnitude e D atraso.\n\nInfluenciou economia comportamental e teorias modernas de decisão.\n\nAluno de Herrnstein, ajudou a expandir análise do comportamento para fenômenos complexos como altruísmo e cooperação.",
      tags: ["Experimental", "Matemática", "Filosofia da ciência"],
      influencias: ["Richard Herrnstein", "B. F. Skinner"],
      obras: [{ ano: "2000", titulo: "The Science of Self-Control", link: "" }]
    },

    {
      nome: "William Baum", periodo: "1939–presente", foto: "baum.jpg",
      contribuicao: "Desenvolveu a abordagem molar do comportamento, defendendo análise em escalas temporais amplas (padrões de comportamento), em oposição à análise molecular (respostas discretas).\n\nRefinou a Lei da Igualação com a Lei Generalizada da Igualação, incorporando parâmetros de sensibilidade e viés.\n\nArgumentou que comportamento é melhor compreendido como distribuição temporal de atividades.\n\nContribuiu para integrar behaviorismo com teoria de sistemas e economia comportamental.\n\nAutor de 'Understanding Behaviorism', que sistematiza o behaviorismo moderno.",
      tags: ["Experimental", "Matemática"],
      influencias: ["Richard Herrnstein", "B. F. Skinner"],
      obras: [{ ano: "1974", titulo: "On two types of deviation from the matching law", link: "https://doi.org/10.1901/jeab.1974.22-231" }]
    },

    {
      nome: "Allen Neuringer", periodo: "1940–presente", foto: "neuringer.jpg",
      contribuicao: "Demonstrou que variabilidade comportamental pode ser operantemente condicionada.\n\nMostrou que organismos podem aprender a produzir comportamento 'aleatório' sob contingências específicas.\n\nIsso expandiu a visão clássica do behaviorismo, mostrando que não apenas respostas específicas, mas padrões de variabilidade podem ser selecionados por consequências.\n\nConecta análise do comportamento com criatividade e exploração."
    }
  ],

  "Economia comportamental": [
    {
      nome: "Daniel Kahneman", periodo: "1934–2024", foto: "kahneman.jpg",
      contribuicao: "Nobel de Economia (2002). Com Amos Tversky, desenvolveu a Teoria do Prospecto (1979), mostrando que decisões sob risco violam a utilidade esperada.\n\nFunção de valor dependente de referência e com aversão à perda:\nV(x) = { x^α, se x ≥ 0; -λ(-x)^β, se x < 0 }\ncom λ > 1 (perdas pesam mais que ganhos).\n\nIntroduziu pesos de probabilidade não lineares π(p), explicando superponderação de pequenas probabilidades.\n\nPopularizou o modelo de dois sistemas (Sistema 1 rápido/heurístico; Sistema 2 lento/deliberativo) e documentou vieses como ancoragem, disponibilidade e representatividade.\n\nFormado na tradição cognitiva (influência de Herbert Simon); influenciou finanças comportamentais, políticas públicas e neuroeconomia.",
      tags: ["Experimental", "Matemática"],
      influencias: ["Herbert Simon", "Amos Tversky", "Richard Herrnstein"],
      obras: [{ ano: "1979", titulo: "Prospect Theory: An Analysis of Decision under Risk (com Tversky)", link: "https://www.jstor.org/stable/1914185" }, { ano: "2011", titulo: "Thinking, Fast and Slow", link: "" }]
    },

    {
      nome: "Amos Tversky", periodo: "1937–1996", foto: "tversky.jpg",
      contribuicao: "Coautor com Kahneman da heurística e vieses.\n\nDemonstrou experimentalmente:\n- representatividade (insensibilidade a tamanho de amostra, regressão à média)\n- disponibilidade (frequência julgada pela facilidade de lembrança)\n- ancoragem e ajuste\n\nCo-criou a Prospect Theory e estudos de framing (mesmo problema → decisões diferentes conforme enquadramento).\n\nInfluenciado por Herbert Simon (racionalidade limitada) e pela tradição psicofísica; seu trabalho redefiniu decisão como processo sistematicamente enviesado.",
      tags: ["Experimental", "Matemática"],
      influencias: ["Herbert Simon", "S. S. Stevens", "R. Duncan Luce"],
      obras: [{ ano: "1974", titulo: "Judgment under Uncertainty: Heuristics and Biases (com Kahneman)", link: "https://doi.org/10.1126/science.185.4157.1124" }]
    },

    {
      nome: "Richard Thaler", periodo: "1945–presente", foto: "thaler.jpg",
      contribuicao: "Nobel de Economia (2017). Integra psicologia à economia aplicada.\n\nDesenvolveu:\n- Contabilidade mental (segregação de ganhos/perdas; violação de fungibilidade)\n- Endowment effect (WTA > WTP)\n- Planejador vs executor (autocontrole)\n\nCom Cass Sunstein, criou o conceito de *Nudge* (arquitetura de escolha), influenciando políticas públicas (defaults, enquadramento, saliência).\n\nColaborou com Kahneman/Tversky; influenciou políticas de aposentadoria, saúde e finanças comportamentais.",
      tags: ["Experimental", "Matemática"],
      influencias: ["Daniel Kahneman", "Amos Tversky", "Herbert Simon", "Howard Rachlin"],
      obras: [{ ano: "2008", titulo: "Nudge (com Sunstein)", link: "" }, { ano: "2015", titulo: "Misbehaving: The Making of Behavioral Economics", link: "" }]
    },

    {
      nome: "Herbert Simon", periodo: "1916–2001", foto: "simon.jpg",
      contribuicao: "Nobel de Economia (1978). Introduziu racionalidade limitada e *satisficing*.\n\nModelou decisão como busca em espaço de estados sob restrições computacionais.\n\nPioneiro em IA (com Allen Newell: General Problem Solver) e ciência cognitiva.\n\nForneceu a base conceitual para heurísticas (Kahneman & Tversky) e para modelos de decisão realistas em economia.",
      tags: ["Computacional", "Matemática", "Filosofia da ciência"],
      influencias: [],
      obras: [{ ano: "1955", titulo: "A Behavioral Model of Rational Choice", link: "" }, { ano: "1969", titulo: "The Sciences of the Artificial", link: "" }]
    },

    {
      nome: "R. Duncan Luce", periodo: "1925–2012", foto: "luce.jpg",
      contribuicao: "Fundamental na psicologia matemática e teoria da decisão.\n\nFormulou o Axioma de Escolha de Luce (1959):\nP(i|S) = v_i / Σ_{j∈S} v_j\nonde v_i é o valor de utilidade do item i.\n\nBase para modelos probabilísticos de escolha (logit/softmax) e conexão com psicofísica (Lei de Thurstone–Mosteller).\n\nInfluenciou econometria, marketing quantitativo e modelos de escolha discreta.",
      tags: ["Matemática", "Experimental"],
      influencias: ["S. S. Stevens", "Gustav Fechner"],
      obras: [{ ano: "1959", titulo: "Individual Choice Behavior: A Theoretical Analysis", link: "" }]
    },

    {
      nome: "Colin Camerer", periodo: "1959–presente", foto: "camerer.jpg",
      contribuicao: "Pioneiro da economia experimental e neuroeconomia.\n\nUsou jogos econômicos (Ultimatum, Dictator, Trust Game) para mostrar preferências sociais (equidade, reciprocidade).\n\nIntegra dados comportamentais com medidas neurais (fMRI), conectando decisão a sistemas de recompensa (estriado) e controle (PFC).\n\nInfluenciado por Kahneman/Tversky e teoria dos jogos; influenciou políticas e design de mercados."
    },

    {
      nome: "Ernst Fehr", periodo: "1956–presente", foto: "fehr.jpg",
      contribuicao: "Estudos experimentais de cooperação e punição altruísta.\n\nMostrou que indivíduos punem violações de normas mesmo com custo próprio, sustentando cooperação em bens públicos.\n\nCo-desenvolveu modelos de preferências sociais (inequity aversion com Schmidt):\nU_i = x_i − α_i max(x_j − x_i, 0) − β_i max(x_i − x_j, 0)\n\nIntegra psicologia social com economia; impacto em desenho institucional e políticas."
    },

    {
      nome: "David Laibson", periodo: "1966–presente", foto: "laibson.jpg",
      contribuicao: "Introduziu o desconto hiperbólico quase-hiperbólico (β–δ):\nU_t = u_t + β Σ_{k=1}^{∞} δ^k u_{t+k}, com 0<β≤1.\n\nExplica inconsistência temporal (preferências reversas) e problemas de autocontrole.\n\nAplicações em poupança, aposentadoria e vícios.\n\nConecta economia com psicologia do tempo (Rachlin, Ainslie)."
    },

    {
      nome: "George Loewenstein", periodo: "1955–presente", foto: "loewenstein.jpg",
      contribuicao: "Integra emoção e decisão.\n\n'Hot–cold empathy gap': estados emocionais alteram preferências e previsões.\n\nTeoria do *information gap* (curiosidade) e estudos sobre utilidade antecipada/experiencial.\n\nMostrou que estados afetivos (dor, fome, excitação) distorcem julgamento — ponte entre economia comportamental e neuro/afeto."
    }
  ],

  "Psicologia social": [
    {
      nome: "Kurt Lewin", periodo: "1890–1947", foto: "lewin.jpg",
      contribuicao: "Fundador da psicologia social moderna.\n\nFormulou a Teoria de Campo:\nB = f(P, E)\n(comportamento é função da pessoa e do ambiente).\n\nIntroduziu o conceito de 'espaço de vida' (life space), onde forças psicológicas atuam como vetores.\n\nPioneiro da pesquisa-ação e dinâmica de grupos (group dynamics), estudando liderança, coesão e mudança social.\n\nInfluenciado pela Gestalt; formou toda uma geração (Festinger, Cartwright, etc.).",
      tags: ["Experimental", "Filosofia da ciência"],
      influencias: [],
      obras: [{ ano: "1936", titulo: "Principles of Topological Psychology", link: "" }, { ano: "1951", titulo: "Field Theory in Social Science", link: "" }]
    },

    {
      nome: "Leon Festinger", periodo: "1919–1989", foto: "festinger.jpg",
      contribuicao: "Criador da Teoria da Dissonância Cognitiva (1957):\n\nIndivíduos buscam consistência entre crenças, atitudes e comportamento; inconsistências geram desconforto (dissonância), levando à mudança cognitiva.\n\nExperimento clássico (1959): participantes pagos $1 vs $20 para mentir — menos recompensa levou a maior mudança de atitude.\n\nTambém desenvolveu a Teoria da Comparação Social (1954): avaliamos nossas opiniões comparando com outros.\n\nAluno de Lewin; extremamente influente em cognição social e tomada de decisão.",
      tags: ["Experimental"],
      influencias: ["Kurt Lewin"],
      obras: [{ ano: "1957", titulo: "A Theory of Cognitive Dissonance", link: "" }, { ano: "1959", titulo: "Cognitive consequences of forced compliance (com Carlsmith)", link: "" }]
    },

    {
      nome: "Stanley Milgram", periodo: "1933–1984", foto: "milgram.jpg",
      contribuicao: "Experimentos de obediência (1961–63): participantes aplicavam choques potencialmente letais sob autoridade.\n\nMostrou alta taxa de obediência (~65%).\n\nIntroduziu conceito de 'estado agente': indivíduos veem-se como executores da vontade de uma autoridade.\n\nVariáveis críticas:\n- proximidade da vítima\n- legitimidade da autoridade\n- presença de dissenso\n\nTambém estudou redes sociais ('small world experiment' → seis graus de separação).\n\nInfluenciado por Asch.",
      tags: ["Experimental"],
      influencias: ["Solomon Asch"],
      obras: [{ ano: "1963", titulo: "Behavioral Study of Obedience", link: "" }, { ano: "1974", titulo: "Obedience to Authority", link: "" }]
    },

    {
      nome: "Philip Zimbardo", periodo: "1933–2024", foto: "zimbardo.jpg",
      contribuicao: "Experimento da Prisão de Stanford (1971): estudantes assumiram papéis de guardas/prisioneiros.\n\nMostrou rápida internalização de papéis sociais e comportamento abusivo.\n\nIntroduziu conceito de 'efeito Lúcifer': situações podem transformar comportamento moral.\n\nEstudou desindividualização (anonimato → perda de autocontrole).\n\nPosteriormente criticado por questões metodológicas, mas ainda influente conceitualmente.",
      tags: ["Experimental", "Observacional"],
      influencias: ["Stanley Milgram"],
      obras: [{ ano: "1971", titulo: "The Stanford Prison Experiment (relatório)", link: "" }, { ano: "2007", titulo: "The Lucifer Effect", link: "" }]
    },

    {
      nome: "Solomon Asch", periodo: "1907–1996", foto: "asch.jpg",
      contribuicao: "Experimentos de conformidade (1951): indivíduos concordavam com respostas obviamente erradas sob pressão de grupo.\n\nDemonstrou dois tipos de influência:\n- normativa (desejo de aceitação)\n- informacional (dúvida sobre percepção)\n\nMostrou que presença de um único dissidente reduz drasticamente a conformidade.\n\nInfluenciou Milgram e toda a psicologia social experimental.",
      tags: ["Experimental"],
      influencias: ["Kurt Lewin"],
      obras: [{ ano: "1951", titulo: "Effects of group pressure upon the modification and distortion of judgment", link: "" }, { ano: "1955", titulo: "Opinions and Social Pressure", link: "" }]
    },

    {
      nome: "Elliot Aronson", periodo: "1932–presente", foto: "aronson.jpg",
      contribuicao: "Refinou a teoria da dissonância cognitiva com foco no self (self-consistency).\n\nDesenvolveu o paradigma da 'justificação insuficiente' e aplicações educacionais.\n\nCriou a técnica da 'jigsaw classroom' para reduzir preconceito via interdependência cooperativa.\n\nAutor de 'The Social Animal', síntese influente da área.\n\nAluno de Festinger.",
      tags: ["Experimental"],
      influencias: ["Leon Festinger"],
      obras: [{ ano: "1972", titulo: "The Social Animal", link: "" }]
    },

    {
      nome: "Henri Tajfel", periodo: "1919–1982", foto: "tajfel.jpg",
      contribuicao: "Criador da Teoria da Identidade Social.\n\nExperimentos de grupos mínimos mostraram que mera categorização arbitrária gera favoritismo intragrupal.\n\nPropôs que identidade social contribui para autoestima.\n\nExplicou preconceito como consequência de processos cognitivos básicos (categorização).\n\nInfluenciou John Turner (Self-Categorization Theory)."
    },

    {
      nome: "John Turner", periodo: "1947–2011", foto: "turner.jpg",
      contribuicao: "Desenvolveu a Teoria da Autocategorização.\n\nExplicou como indivíduos alternam entre níveis de identidade (pessoal vs social).\n\nIntroduziu conceito de despersonalização: indivíduos agem como membros de grupo.\n\nComplementa e formaliza a teoria de Tajfel."
    },

    {
      nome: "Fritz Heider", periodo: "1896–1988", foto: "heider.jpg",
      contribuicao: "Fundador da teoria da atribuição.\n\nPropôs que indivíduos são 'cientistas ingênuos' tentando inferir causas do comportamento.\n\nIntroduziu distinção:\n- causas internas (disposicionais)\n- causas externas (situacionais)\n\nBase para todo o campo de atribuição causal."
    },

    {
      nome: "Harold Kelley", periodo: "1921–2003", foto: "kelley.jpg",
      contribuicao: "Desenvolveu o modelo de covariação na atribuição:\n\nCausa inferida com base em:\n- consenso\n- consistência\n- distintividade\n\nFormalizou atribuição como processo quase estatístico.\n\nExpandiu a teoria de Heider."
    },

    {
      nome: "Lee Ross", periodo: "1942–2021", foto: "ross.jpg",
      contribuicao: "Identificou o erro fundamental de atribuição: tendência a superestimar causas internas e subestimar o contexto.\n\nEstudou viés ator-observador e falso consenso.\n\nDemonstrou limites da introspecção (Nisbett & Wilson, 1977): pessoas não acessam causas reais de suas decisões.\n\nContribuiu para a crítica da racionalidade intuitiva."
    },

    {
      nome: "Susan Fiske", periodo: "1952–presente", foto: "fiske.jpg",
      contribuicao: "Modelo de Conteúdo de Estereótipos (SCM): grupos são avaliados em duas dimensões:\n- calor (intenção)\n- competência (capacidade)\n\nPrediz emoções sociais (inveja, desprezo, admiração).\n\nDesenvolveu também teoria de cognição social baseada em economia cognitiva.\n\nInfluente na psicologia social contemporânea."
    },

    {
      nome: "Anthony Greenwald", periodo: "1936–presente", foto: "greenwald.jpg",
      contribuicao: "Criador do Implicit Association Test (IAT).\n\nMede atitudes implícitas via tempos de reação.\n\nMostrou que vieses podem operar fora da consciência.\n\nInfluenciou estudos de preconceito implícito e políticas públicas.\n\nConectou cognição social com processos automáticos."
    },

    {
      nome: "Muzafer Sherif", periodo: "1906–1988", foto: "sherif.jpg",
      contribuicao: "Experimentos Robbers Cave (1954): conflito intergrupal entre grupos de meninos.\n\nMostrou que competição gera hostilidade, e metas superordenadas reduzem conflito.\n\nTambém estudou normas sociais com o efeito autocinético.\n\nPioneiro em normas sociais e dinâmica intergrupal."
    },

    {
      nome: "John Darley e Bibb Latané", periodo: "1938-2018 / 1937–presente", foto: "darley_latane.jpg",
      contribuicao: "Efeito espectador (1968)\n\n Eles descobriram que a presença de outras pessoas diminui a chance de um indivíduo ajudar em emergências, fenômeno conhecido como difusão de responsabilidade. Quanto maior o grupo, menor a probabilidade de intervenção, demonstrando que a apatia é um processo social, não individual."
    }
  ],

  "Antropologia": [
    {
      nome: "Claude Lévi-Strauss", periodo: "1908–2009", foto: "levi_strauss.jpg",
      contribuicao: "Fundador da antropologia estruturalista.\n\nPropôs que culturas são organizadas por estruturas mentais universais, especialmente oposições binárias (natureza/cultura, cru/cozido).\n\nAplicou métodos da linguística estrutural (influência de Ferdinand de Saussure) ao estudo de mitos e parentesco.\n\nObras centrais: 'As Estruturas Elementares do Parentesco' (1949), 'O Pensamento Selvagem' (1962), 'Mitológicas'.\n\nArgumentou que mitos de diferentes culturas compartilham transformações estruturais.\n\nInfluenciou profundamente filosofia, psicanálise (Lacan) e ciências humanas.",
      tags: ["Etnográfico", "Filosofia da ciência"],
      influencias: ["Franz Boas"],
      obras: [{ ano: "1949", titulo: "Les Structures élémentaires de la parenté", link: "" }, { ano: "1962", titulo: "La Pensée sauvage", link: "" }]
    },

    {
      nome: "Bronisław Malinowski", periodo: "1884–1942", foto: "malinowski.jpg",
      contribuicao: "Fundador da etnografia moderna baseada em observação participante.\n\nRealizou trabalho de campo prolongado nas Ilhas Trobriand.\n\nObra central: 'Argonautas do Pacífico Ocidental' (1922).\n\nDesenvolveu o funcionalismo: instituições culturais existem para satisfazer necessidades humanas (biológicas e psicológicas).\n\nEstudou o sistema Kula, mostrando trocas simbólicas complexas não reduzíveis a economia utilitária.\n\nRevolucionou o método: imersão total, língua local, registro detalhado do cotidiano.",
      tags: ["Etnográfico", "Trabalho de campo", "Observacional"],
      influencias: [],
      obras: [{ ano: "1922", titulo: "Argonauts of the Western Pacific", link: "" }]
    },

    {
      nome: "Franz Boas", periodo: "1858–1942", foto: "boas.jpg",
      contribuicao: "Pai da antropologia americana.\n\nCombateu o racismo científico e o determinismo biológico.\n\nPropôs o particularismo histórico: cada cultura deve ser entendida em seus próprios termos.\n\nDefendeu o relativismo cultural.\n\nDemonstrou plasticidade biológica (estudos com imigrantes → forma craniana muda com ambiente).\n\nFormou a primeira grande geração de antropólogos nos EUA (Mead, Benedict, Sapir).\n\nInfluenciado pela geografia e física; transformou antropologia em ciência empírica.",
      tags: ["Etnográfico", "Trabalho de campo"],
      influencias: [],
      obras: [{ ano: "1911", titulo: "The Mind of Primitive Man", link: "" }]
    },

    {
      nome: "Margaret Mead", periodo: "1901–1978", foto: "mead.jpg",
      contribuicao: "Aluna de Boas.\n\nEm 'Coming of Age in Samoa' (1928), argumentou que adolescência é culturalmente moldada, não biologicamente universal.\n\nEstudos em Nova Guiné mostraram variação de papéis de gênero (ex: Arapesh, Mundugumor, Tchambuli).\n\nPopularizou a antropologia para o público.\n\nInfluenciou debates sobre natureza vs cultura.\n\nPosteriormente criticada metodologicamente (Derek Freeman), gerando debate sobre validade etnográfica.",
      tags: ["Etnográfico", "Trabalho de campo", "Observacional"],
      influencias: ["Franz Boas"],
      obras: [{ ano: "1928", titulo: "Coming of Age in Samoa", link: "" }]
    },

    {
      nome: "Clifford Geertz", periodo: "1926–2006", foto: "geertz.jpg",
      contribuicao: "Principal nome da antropologia interpretativa.\n\nPropôs que cultura é um sistema de significados compartilhados.\n\nMétodo de 'descrição densa' (thick description): interpretar camadas de significado.\n\nExemplo clássico: briga de galos em Bali.\n\nObra central: 'A Interpretação das Culturas' (1973).\n\nInfluenciado por Max Weber (cultura como teia de significados).\n\nMudou o foco de explicação causal para interpretação simbólica.",
      tags: ["Etnográfico", "Filosofia da ciência"],
      influencias: [],
      obras: [{ ano: "1973", titulo: "The Interpretation of Cultures", link: "" }]
    },

    {
      nome: "A. R. Radcliffe-Brown", periodo: "1881–1955", foto: "radcliffe_brown.jpg",
      contribuicao: "Co-fundador do estrutural-funcionalismo.\n\nDiferente de Malinowski, focou não nas necessidades individuais, mas na função das instituições para a manutenção da estrutura social.\n\nInspirado por Émile Durkheim.\n\nEstudou sistemas de parentesco e organização social como estruturas estáveis.\n\nBuscou leis gerais da organização social."
    },

    {
      nome: "Edward Tylor", periodo: "1832–1917", foto: "tylor.jpg",
      contribuicao: "Um dos primeiros antropólogos.\n\nDefiniu cultura como:\n'complexo que inclui conhecimento, crença, arte, moral, lei e costumes'.\n\nPropôs evolucionismo cultural unilinear (sociedades evoluem de 'primitivas' a 'civilizadas').\n\nHoje criticado por etnocentrismo, mas importante historicamente.\n\nIntroduziu conceito de animismo."
    },

    {
      nome: "Lewis Henry Morgan", periodo: "1818–1881", foto: "morgan.jpg",
      contribuicao: "Pioneiro do evolucionismo cultural.\n\nClassificou sociedades em estágios (selvageria, barbárie, civilização).\n\nEstudou sistemas de parentesco (Iroqueses).\n\nInfluenciou Karl Marx e Friedrich Engels.\n\nImportante para o desenvolvimento inicial da antropologia."
    },

    {
      nome: "Edward Sapir", periodo: "1884–1939", foto: "sapir.jpg",
      contribuicao: "Aluno de Boas.\n\nPioneiro da antropologia linguística.\n\nCoformulador da hipótese Sapir-Whorf (relatividade linguística): linguagem influencia pensamento.\n\nEstudou relação entre linguagem, cultura e cognição.\n\nInfluenciou sociolinguística e ciência cognitiva."
    },

    {
      nome: "Benjamin Lee Whorf", periodo: "1897–1941", foto: "whorf.jpg",
      contribuicao: "Desenvolveu a hipótese Sapir-Whorf.\n\nArgumentou que categorias linguísticas moldam percepção e pensamento.\n\nExemplos famosos (Hopi e tempo).\n\nHoje reformulada como versão fraca (influência, não determinação).\n\nImportante ponte entre antropologia e cognição."
    },

    {
      nome: "Marvin Harris", periodo: "1927–2001", foto: "harris.jpg",
      contribuicao: "Criador do materialismo cultural.\n\nPropôs que práticas culturais são explicadas por fatores materiais (ecologia, economia).\n\nExemplo: vacas sagradas na Índia → função ecológica/econômica.\n\nDistinguiu:\n- infraestrutura (base material)\n- estrutura\n- superestrutura\n\nBuscou explicações causais mais objetivas na antropologia."
    },

    {
      nome: "Marshall Sahlins", periodo: "1930–2021", foto: "sahlins.jpg",
      contribuicao: "Crítico do reducionismo econômico.\n\nMostrou que sociedades 'primitivas' não são necessariamente pobres (\"economia da abundância original\").\n\nIntegra cultura, economia e simbolismo.\n\nDebate famoso com Marvin Harris.\n\nInfluenciado por Lévi-Strauss e pela antropologia simbólica."
    }
  ],

  "Neurociência": [
    {
      nome: "Santiago Ramón y Cajal", periodo: "1852–1934", foto: "cajal.jpg",
      contribuicao: "Pai da neurociência moderna. Nobel (1906, com Golgi).\n\nEstabeleceu a doutrina do neurônio (células discretas) e o princípio da polarização dinâmica (fluxo direcional de informação: dendritos → soma → axônio).\n\nUsando a técnica de Golgi, descreveu morfologia de neurônios e circuitos (córtex, retina, cerebelo).\n\nSeus desenhos detalhados ainda são referência.\n\nRefutou a teoria reticular e fundou a neuroanatomia moderna.",
      tags: ["Observacional"],
      influencias: ["Camillo Golgi"],
      obras: [{ ano: "1894", titulo: "Les Nouvelles Idées sur la Structure du Système Nerveux", link: "" }, { ano: "1899-1904", titulo: "Textura del Sistema Nervioso del Hombre y de los Vertebrados", link: "" }]
    },

    {
      nome: "Camillo Golgi", periodo: "1843–1926", foto: "golgi.jpg",
      contribuicao: "Desenvolveu a 'reação negra' (coloração com prata), permitindo visualizar neurônios individuais em meio ao tecido.\n\nDescobriu o complexo de Golgi (organelo celular).\n\nDefendeu a teoria reticular (rede contínua), posteriormente refutada por Cajal.\n\nSua técnica foi crucial para toda a neuroanatomia do século XX.",
      tags: ["Observacional"],
      influencias: [],
      obras: [{ ano: "1873", titulo: "Sulla struttura della sostanza grigia del cervello", link: "" }]
    },

    {
      nome: "Alan Hodgkin & Andrew Huxley", periodo: "1914–1998 / 1917–2012", foto: "hodgkin_huxley.jpg",
      contribuicao: "Nobel (1963). Modelaram matematicamente o potencial de ação no axônio gigante de lula.\n\nSistema de equações diferenciais descrevendo correntes de Na⁺ e K⁺ dependentes de voltagem:\nC_m dV/dt = -g_Na m^3h(V - E_Na) - g_K n^4(V - E_K) - g_L(V - E_L) + I\n\nIntroduziram variáveis de porta (m, h, n) e condutâncias dinâmicas.\n\nBase da neurofisiologia e da neurociência computacional (modelos de neurônio, redes).",
      tags: ["Experimental", "Eletrofisiologia", "Matemática", "Computacional"],
      influencias: [],
      obras: [{ ano: "1952", titulo: "A quantitative description of membrane current... (série de 5 artigos)", link: "https://doi.org/10.1113/jphysiol.1952.sp004764" }]
    },

    {
      nome: "Donald Hebb", periodo: "1904–1985", foto: "hebb.jpg",
      contribuicao: "Em 'The Organization of Behavior' (1949), propôs a regra hebbiana:\n'neurônios que disparam juntos se conectam'.\n\nIntroduziu 'cell assemblies' (conjuntos de neurônios que codificam representações).\n\nBase conceitual da plasticidade sináptica e de algoritmos de aprendizado em redes neurais.\n\nInfluenciou diretamente a descoberta de LTP e modelos conexionistas.",
      tags: ["Filosofia da ciência", "Computacional"],
      influencias: ["Ivan Pavlov", "Edward Thorndike"],
      obras: [{ ano: "1949", titulo: "The Organization of Behavior", link: "" }]
    },

    {
      nome: "Eric Kandel", periodo: "1929–presente", foto: "kandel.jpg",
      contribuicao: "Nobel (2000). Demonstrou bases celulares/moleculares da aprendizagem em Aplysia.\n\nMostrou que:\n- habituação → diminuição de liberação sináptica\n- sensibilização → aumento via serotonina\n\nIdentificou cascatas de sinalização (cAMP, PKA, CREB) que levam a mudanças sinápticas duradouras.\n\nConectou memória a plasticidade sináptica.\n\nIntegra biologia molecular, comportamento e memória.",
      tags: ["Experimental", "Eletrofisiologia", "Modelagem animal"],
      influencias: ["Donald Hebb"],
      obras: [{ ano: "2001", titulo: "The molecular biology of memory storage", link: "https://doi.org/10.1126/science.1067020" }, { ano: "2006", titulo: "In Search of Memory", link: "" }]
    },

    {
      nome: "Michael Gazzaniga", periodo: "1939–presente", foto: "gazzaniga.jpg",
      contribuicao: "Pioneiro nos estudos de cérebro dividido (split-brain), com Roger Sperry.\n\nMostrou lateralização funcional (linguagem no hemisfério esquerdo).\n\nPropôs o conceito de 'intérprete' — mecanismo do hemisfério esquerdo que constrói narrativas coerentes.\n\nCunhou o termo 'neurociência cognitiva'.\n\nConectou neurociência com cognição e consciência.",
      tags: ["Experimental", "Neuropsicológico", "Clínico"],
      influencias: [],
      obras: [{ ano: "1985", titulo: "The Social Brain", link: "" }, { ano: "2011", titulo: "Who's in Charge? Free Will and the Science of the Brain", link: "" }]
    },

    {
      nome: "James Olds", periodo: "1922–1976", foto: "olds.jpg",
      contribuicao: "Com Peter Milner (1954), descobriu o sistema de recompensa por autoestimulação elétrica.\n\nRatos pressionavam alavancas milhares de vezes para estimular o feixe prosencefálico medial.\n\nFundou o estudo dos circuitos de recompensa (posteriormente ligados à dopamina).\n\nBase para estudos de motivação, vício e reforço."
    }
  ],

  "Psicofísica": [
    {
      nome: "Ernst Weber", periodo: "1795–1878", foto: "weber_e.jpg",
      contribuicao: "Pioneiro da psicofísica.\n\nFormulou a Lei de Weber (ΔI/I = k).\n\nMostrou que percepção de diferença é relativa à intensidade inicial.\n\nBase experimental para Fechner."
    },

    {
      nome: "Gustav Fechner", periodo: "1801–1887", foto: "fechner.jpg",
      contribuicao: "Pai da psicofísica.\n\nFormulou a Lei de Fechner (S = k log I).\n\nRelacionou mundo físico (estímulo) e mental (sensação).\n\nMarco fundador da psicologia experimental (1860)."
    },

    {
      nome: "S. S. Stevens", periodo: "1906–1973", foto: "stevens.jpg",
      contribuicao: "Desenvolveu a Lei da Potência de Stevens (S = k Iⁿ).\n\nClassificou escalas de mensuração (nominal, ordinal, intervalar, razão).\n\nRefinou a psicofísica clássica."
    },

    {
      nome: "George A. Miller", periodo: "1920–2012", foto: "miller.jpg",
      contribuicao: "Aplicou teoria da informação à psicofísica.\n\nEstudou capacidade de processamento humano em bits.\n\nLigou percepção a limitações cognitivas.\n\nInfluenciado por Shannon.\n\nPonte entre psicofísica e psicologia cognitiva."
    }
  ],

  "Psicologia evolutiva": [
    {
      nome: "Leda Cosmides", periodo: "1957–presente", foto: "cosmides.jpg",
      contribuicao: "Cofundadora da psicologia evolutiva. Demonstrou que a mente possui módulos especializados moldados pela seleção natural.\n\nExperimento clássico do problema de Wason mostrou desempenho superior quando tarefas envolvem contratos sociais (detecção de trapaceiros).\n\nPropôs mecanismos cognitivos adaptativos específicos."
    },
    {
      nome: "John Tooby", periodo: "1952–presente", foto: "tooby.jpg",
      contribuicao: "Co-fundador da psicologia evolutiva com Cosmides.\n\nDefendeu que a mente é composta por adaptações evolutivas específicas (contra visão de mente geral).\n\nIntegra biologia evolutiva com cognição humana.\n\nInfluenciado por Hamilton, Trivers e Dawkins."
    }
  ],

  "Genética populacional humana": [
    {
      nome: "R. A. Fisher", periodo: "1890–1962", foto: "fisher.jpg",
      contribuicao: "Fundador da genética populacional moderna.\n\nEquação fundamental da seleção natural.\n\nIntroduziu máxima verossimilhança e ANOVA.\n\nIntegra genética mendeliana com seleção natural."
    },
    {
      nome: "Sewall Wright", periodo: "1889–1988", foto: "wright.jpg",
      contribuicao: "Desenvolveu conceito de deriva genética e paisagem adaptativa.\n\nIntroduziu coeficiente de endogamia (F).\n\nModelo de equilíbrio entre seleção, mutação e deriva."
    }
  ],

  "Neuroevolução": [
    {
      nome: "Paul MacLean", periodo: "1913–2007", foto: "maclean.jpg",
      contribuicao: "Propôs o modelo do cérebro triuno (reptiliano, límbico, neocórtex).\n\nEmbora simplificado, influenciou fortemente a compreensão evolutiva do cérebro."
    },
    {
      nome: "Terrence Deacon", periodo: "1950–presente", foto: "deacon.jpg",
      contribuicao: "Estudou evolução do cérebro e linguagem.\n\nMostrou coevolução entre linguagem e estrutura neural.\n\nObra: 'The Symbolic Species'."
    }
  ],

  "Evolução cultural": [
    {
      nome: "Joseph Henrich", periodo: "1968–presente", foto: "henrich.jpg",
      contribuicao: "Desenvolveu teoria da evolução cultural cumulativa.\n\nMostrou que cultura evolui por transmissão social e seleção.\n\nConceito WEIRD populations."
    },
    {
      nome: "Boyd & Richerson", periodo: "—", foto: "boyd_richerson.jpg",
      contribuicao: "Modelaram transmissão cultural com equações evolutivas.\n\nIntroduziram vieses de transmissão (conformista, prestígio).\n\nFundadores da teoria da evolução cultural."
    }
  ],

  "Epigenética evolutiva": [
    {
      nome: "Conrad Waddington", periodo: "1905–1975", foto: "waddington.jpg",
      contribuicao: "Introduziu o conceito de epigenética.\n\nPaisagem epigenética como metáfora do desenvolvimento.\n\nMostrou interação gene-ambiente."
    },
    {
      nome: "Eva Jablonka", periodo: "1952–presente", foto: "jablonka.jpg",
      contribuicao: "Defende herança epigenética como mecanismo evolutivo.\n\nPropôs múltiplos sistemas de herança (genético, epigenético, comportamental, simbólico)."
    }
  ],

  "Psicologia cultural": [
    {
      nome: "Richard Shweder", periodo: "1945–presente", foto: "shweder.jpg",
      contribuicao: "Defendeu que cognição é culturalmente moldada.\n\nCriticou universalismo da psicologia ocidental.\n\nEstudos sobre moralidade e cultura."
    },
    {
      nome: "Hazel Markus", periodo: "1949–presente", foto: "markus.jpg",
      contribuicao: "Teoria do self independente vs interdependente.\n\nMostrou diferenças culturais na cognição e emoção."
    }
  ],

  "Sociobiologia / Ecologia comportamental": [
    {
      nome: "John Maynard Smith", periodo: "1920–2004", foto: "maynard_smith.jpg",
      contribuicao: "Aplicou teoria dos jogos à evolução.\n\nIntroduziu ESS (estratégia evolutivamente estável)."
    },
    {
      nome: "Robert Trivers", periodo: "1943–presente", foto: "trivers.jpg",
      contribuicao: "Altruísmo recíproco e investimento parental.\n\nBase da evolução do comportamento social."
    }
  ],

  "Sociologia": [
    {
      nome: "Émile Durkheim", periodo: "1858–1917", foto: "durkheim.jpg",
      contribuicao: "Fundador da sociologia.\n\nIntroduziu 'fatos sociais'.\n\nEstudo clássico do suicídio como fenômeno social."
    },
    {
      nome: "Max Weber", periodo: "1864–1920", foto: "weber.jpg",
      contribuicao: "Sociologia interpretativa.\n\nConceito de ação social.\n\nAnálise da ética protestante e capitalismo."
    },
    {
      nome: "Karl Marx", periodo: "1818–1883", foto: "marx.jpg",
      contribuicao: "Teoria do materialismo histórico.\n\nAnálise de classes e conflito social.\n\nInfluência massiva em sociologia e economia."
    },
    {
      nome: "Pierre Bourdieu", periodo: "1930–2002", foto: "bourdieu.jpg",
      contribuicao: "Um dos sociólogos mais influentes do século XX.\n\nDesenvolveu os conceitos de:\n- habitus: disposições internalizadas que guiam percepção, pensamento e ação\n- campo: espaços sociais estruturados (arte, ciência, política) com regras próprias\n- capital: diferentes formas de poder (econômico, cultural, social, simbólico)\n\nMostrou como desigualdades sociais são reproduzidas de forma não explícita, especialmente via educação.\n\nEm 'A Distinção' (1979), demonstrou que gostos e preferências (arte, comida, estilo) funcionam como marcadores de classe.\n\nIntegra estrutura social e cognição individual: comportamento não é apenas escolha racional nem puro determinismo — é produto de disposições incorporadas em contextos estruturados.\n\nFortemente influenciado por Durkheim e Weber; influenciou antropologia, educação, psicologia social e estudos culturais."
    }
  ],

  "Sociologia histórica": [
    {
      nome: "Norbert Elias", periodo: "1897–1990", foto: "elias.jpg",
      contribuicao: "Processo civilizador.\n\nMostrou mudanças históricas no comportamento social."
    },
    {
      nome: "Charles Tilly", periodo: "1929–2008", foto: "tilly.jpg",
      contribuicao: "Estudo de formação do Estado e movimentos sociais.\n\nIntegra história e sociologia."
    }
  ],

  "História cultural": [
    {
      nome: "Michel Foucault", periodo: "1926–1984", foto: "foucault.jpg",
      contribuicao: "Analisou relação entre poder, saber e discurso.\n\nGenealogia das instituições (prisão, loucura)."
    },
    {
      nome: "Peter Burke", periodo: "1937–presente", foto: "burke.jpg",
      contribuicao: "História cultural moderna.\n\nEstudo de práticas simbólicas e comunicação."
    }
  ],

  "Neurodesenvolvimento": [
    {
      nome: "Patricia Kuhl", periodo: "1946–presente", foto: "kuhl.jpg",
      contribuicao: "Estudos sobre aquisição de linguagem em bebês.\n\nPeríodos críticos e plasticidade neural."
    },
    {
      nome: "Charles Nelson", periodo: "1951–presente", foto: "nelson.jpg",
      contribuicao: "Desenvolvimento cerebral e impacto de privação.\n\nEstudos com crianças institucionalizadas."
    }
  ],

  "Endocrinologia do desenvolvimento": [
    {
      nome: "Bruce McEwen", periodo: "1938–2020", foto: "mcewen.jpg",
      contribuicao: "Conceito de carga alostática.\n\nEfeitos do estresse no desenvolvimento cerebral."
    },
    {
      nome: "Robert Sapolsky", periodo: "1957–presente", foto: "sapolsky.jpg",
      contribuicao: "Estudos sobre estresse, cortisol e comportamento.\n\nIntegra endocrinologia com comportamento."
    }
  ],

  "Psicologia do desenvolvimento": [
    {
      nome: "Jean Piaget", periodo: "1896–1980", foto: "piaget.jpg",
      contribuicao: "Teoria dos estágios do desenvolvimento cognitivo.\n\nConstrução ativa do conhecimento."
    },
    {
      nome: "Lev Vygotsky", periodo: "1896–1934", foto: "vygotsky.jpg",
      contribuicao: "Zona de desenvolvimento proximal.\n\nImportância do contexto social na aprendizagem."
    }
  ],

  "Educação e mídia": [
    {
      nome: "Paulo Freire", periodo: "1921–1997", foto: "freire.jpg",
      contribuicao: "Pedagogia crítica.\n\nEducação como prática de liberdade."
    },
    {
      nome: "Marshall McLuhan", periodo: "1911–1980", foto: "mcluhan.jpg",
      contribuicao: "'O meio é a mensagem'.\n\nImpacto das mídias na cognição e sociedade."
    }
  ],

  "Psicofisiologia": [
    {
      nome: "Walter Cannon", periodo: "1871–1945", foto: "cannon.jpg",
      contribuicao: "Resposta luta-ou-fuga.\n\nHomeostase."
    },
    {
      nome: "Hans Selye", periodo: "1907–1982", foto: "selye.jpg",
      contribuicao: "Síndrome geral de adaptação.\n\nFundador do estudo do estresse."
    }
  ],

  "Neuroeconomia": [
    {
      nome: "Paul Glimcher", periodo: "1960–presente", foto: "glimcher.jpg",
      contribuicao: "Integra neurociência com teoria da decisão.\n\nCodificação neural de valor esperado."
    },
    {
      nome: "Wolfram Schultz", periodo: "1944–presente", foto: "schultz.jpg",
      contribuicao: "Erro de previsão de recompensa.\n\nBase neural do aprendizado por reforço."
    }
  ],

  "Teoria dos jogos": [
    {
      nome: "John von Neumann", periodo: "1903–1957", foto: "vonneumann.jpg",
      contribuicao: "Fundador da teoria dos jogos.\n\nTeorema minimax."
    },
    {
      nome: "John Nash", periodo: "1928–2015", foto: "nash.jpg",
      contribuicao: "Equilíbrio de Nash.\n\nBase da estratégia em jogos."
    }
  ],

  "Comunicação simbólica": [
    {
      nome: "Charles Peirce", periodo: "1839–1914", foto: "peirce.jpg",
      contribuicao: "Fundador da semiótica.\n\nModelo signo–objeto–interpretante."
    },
    {
      nome: "Ferdinand de Saussure", periodo: "1857–1913", foto: "saussure.jpg",
      contribuicao: "Fundador da linguística moderna.\n\nSignificante vs significado."
    }
  ],

  "Mídias sociais": [
    {
      nome: "Sherry Turkle", periodo: "1948–presente", foto: "turkle.jpg",
      contribuicao: "Estuda impacto psicológico da tecnologia.\n\nIdentidade digital e isolamento."
    },
    {
      nome: "danah boyd", periodo: "1977–presente", foto: "boyd.jpg",
      contribuicao: "Pesquisa redes sociais e cultura digital.\n\nFoco em jovens e comportamento online."
    }
  ],

  "Antropologia evolutiva": [
    {
      nome: "Richard Wrangham", periodo: "1948–presente", foto: "wrangham.jpg",
      contribuicao: "Primatólogo e antropólogo evolucionista.\n\nPropôs a hipótese do cozimento ('cooking hypothesis'): o uso do fogo transformou a biologia humana (digestão, cérebro maior, redução de dentes).\n\nEstudou também a hipótese da auto-domesticação humana, sugerindo que seleção contra agressividade moldou comportamento social.\n\nIntegra primatologia, evolução e comportamento humano.\n\nObra: 'Catching Fire'."
    },

    {
      nome: "Sarah Blaffer Hrdy", periodo: "1946–presente", foto: "hrdy.jpg",
      contribuicao: "Pioneira no estudo evolutivo da parentalidade e cooperação.\n\nPropôs a teoria da criação cooperativa (cooperative breeding): humanos evoluíram com múltiplos cuidadores, não apenas a mãe.\n\nMostrou importância da aloparentalidade para evolução da empatia e cognição social.\n\nIntegra etologia, antropologia e psicologia do desenvolvimento.\n\nObra: 'Mothers and Others'."
    },

    {
      nome: "Kim Hill", periodo: "1947–presente", foto: "hill.jpg",
      contribuicao: "Estudos com populações caçadoras-coletoras (Ache, etc.).\n\nMostrou padrões universais de cooperação, compartilhamento de alimentos e organização social.\n\nContribuiu para teoria do 'foraging' humano e evolução da vida social.\n\nBase empírica forte para hipóteses evolutivas sobre comportamento humano."
    },

    {
      nome: "Robin Dunbar", periodo: "1947–presente", foto: "dunbar.jpg",
      contribuicao: "Propôs o número de Dunbar (~150), limite cognitivo para relações sociais estáveis.\n\nRelacionou tamanho do neocórtex com tamanho de grupos sociais em primatas.\n\nSugeriu que linguagem evoluiu como substituto do grooming social.\n\nIntegra neurociência, etologia e antropologia."
    },

    {
      nome: "Joseph Henrich", periodo: "1968–presente", foto: "henrich.jpg",
      contribuicao: "Integra evolução cultural com antropologia evolutiva.\n\nMostrou que humanos são 'espécie cultural', altamente dependente de aprendizado social.\n\nEstudos com populações não-WEIRD revelam grande variação psicológica.\n\nConceito de evolução cultural cumulativa.\n\nObra: 'The WEIRDest People in the World'."
    },

    {
      nome: "Peter Richerson", periodo: "1943–presente", foto: "richerson.jpg",
      contribuicao: "Co-fundador da teoria da evolução cultural.\n\nModelou transmissão cultural usando ferramentas da biologia evolutiva.\n\nMostrou como normas sociais e cultura evoluem por seleção.\n\nColaborou extensivamente com Boyd."
    },

    {
      nome: "Robert Boyd", periodo: "1948–presente", foto: "boyd.jpg",
      contribuicao: "Co-fundador da evolução cultural.\n\nIntroduziu vieses de transmissão cultural:\n- conformista\n- prestígio\n- payoff-biased\n\nMostrou que cultura pode evoluir independentemente de genes.\n\nIntegra antropologia com modelagem matemática."
    },

    {
      nome: "Christopher Boehm", periodo: "1931–2021", foto: "boehm.jpg",
      contribuicao: "Estudou hierarquias e igualitarismo em sociedades humanas.\n\nPropôs que humanos evoluíram mecanismos de controle social contra dominância (reverse dominance hierarchy).\n\nMostrou papel de punição coletiva na manutenção de normas.\n\nIntegra etologia, antropologia e evolução social."
    }
  ]
};

/* ============================================================================
   3. DICIONÁRIO DE TEORIAS E HIPÓTESES
   ============================================================================ */
const TEORIAS = {
  "Psicologia cognitiva": [
    {
      nome: "Magical Number Seven (capacidade da memória de curto prazo)", ano: "1956",
      autor: "George Miller", formula: "7 ± 2",
      descricao: "Miller observou que a memória de curto prazo humana parece ter um limite consistente em torno de sete itens (mais ou menos dois), seja para dígitos, palavras ou outros estímulos.\n\nA proposta é que o cérebro agrupa informações em 'chunks' (pedaços significativos), e que a capacidade limita-se ao número de chunks, não à informação bruta. Por isso lembramos números de telefone melhor quando agrupados (2-digito-2-digito) do que como sequência contínua.\n\nFoi um dos primeiros achados a tratar a mente como sistema de processamento de informação com limites quantificáveis — marco fundador da psicologia cognitiva."
    },

    {
      nome: "Gramática Universal", ano: "1957–65",
      autor: "Noam Chomsky", formula: null,
      descricao: "A hipótese de que todas as línguas humanas compartilham uma estrutura profunda comum, geneticamente determinada, que torna possível a aquisição rápida de linguagem por crianças.\n\nChomsky argumentou que o input linguístico recebido por crianças é 'pobre' (poverty of the stimulus) — não suficiente para que elas aprendam regras gramaticais por reforçamento ou imitação. A solução: nascemos com um 'dispositivo de aquisição de linguagem' (LAD) já equipado com princípios universais.\n\nA teoria reorientou linguística e psicologia cognitiva, embora continue debatida — abordagens construtivistas e baseadas em uso (Tomasello) oferecem alternativas."
    },

    {
      nome: "Modelo das três redes atencionais", ano: "1990",
      autor: "Michael Posner", formula: null,
      descricao: "Posner propôs que a atenção não é uma função única, mas um sistema composto por três redes neurais distintas: alerta (manter prontidão), orientação (selecionar informação espacial) e controle executivo (resolver conflitos e gerenciar respostas).\n\nCada rede está associada a circuitos cerebrais específicos e neurotransmissores diferentes — alerta envolve noradrenalina, orientação envolve acetilcolina, controle executivo envolve dopamina.\n\nO modelo articulou psicologia cognitiva e neurociência, gerando paradigmas como o Attention Network Test (ANT) que medem as três redes simultaneamente."
    },

    {
      nome: "Teoria do fator g (inteligência geral)", ano: "1904",
      autor: "Charles Spearman", formula: "g",
      descricao: "Spearman observou que pessoas que se saem bem em um teste cognitivo tendem a se sair bem em outros, mesmo de domínios diferentes. As correlações positivas entre testes apontariam para um fator subjacente comum: a inteligência geral, ou g.\n\nUsando análise fatorial (técnica que ele inventou), Spearman propôs um modelo bifatorial: cada habilidade cognitiva tem um componente geral (g) e um componente específico (s) à tarefa.\n\nO conceito é central na psicometria contemporânea, mas continua controverso — críticos questionam se g reflete uma capacidade real ou um artefato estatístico."
    },

    {
      nome: "Inteligência fluida e cristalizada", ano: "1963",
      autor: "Raymond Cattell", formula: "Gf · Gc",
      descricao: "Cattell distinguiu dois tipos de inteligência: inteligência fluida (Gf), a capacidade de raciocinar em situações novas, e inteligência cristalizada (Gc), o conhecimento acumulado pela experiência e educação.\n\nA distinção tem suporte empírico forte: Gf tende a declinar com a idade adulta, enquanto Gc tende a se manter ou crescer até a velhice tardia.\n\nO modelo evoluiu para a teoria CHC (Cattell-Horn-Carroll), hoje a estrutura mais aceita em psicometria contemporânea, com 9-10 fatores amplos."
    },

    {
      nome: "Memória episódica vs. semântica", ano: "1972",
      autor: "Endel Tulving", formula: null,
      descricao: "Tulving propôs que a memória declarativa (consciente) se divide em dois sistemas distintos: episódica (eventos pessoais, com contexto espaço-temporal — 'lembro de almoçar com minha mãe ontem') e semântica (conhecimento factual descontextualizado — 'sei que Paris é capital da França').\n\nA distinção tem suporte neuropsicológico: pacientes com lesões hipocampais perdem memória episódica mas preservam a semântica. Os sistemas envolvem circuitos cerebrais parcialmente diferentes.\n\nTulving também propôs que a memória episódica permite 'viagem mental no tempo' — capacidade de reviver o passado e projetar o futuro."
    },

    {
      nome: "Teoria da Integração de Características (FIT)", ano: "1980",
      autor: "Anne Treisman", formula: null,
      descricao: "Treisman propôs que a percepção visual ocorre em dois estágios: primeiro, características como cor, forma e orientação são processadas em paralelo, automaticamente, em mapas separados. Depois, a atenção atua como 'cola' que integra essas características em objetos coerentes.\n\nEvidências vêm de tarefas de busca visual: encontrar um alvo definido por uma única característica (um X vermelho entre Os) é fácil e independe do número de distratores. Já encontrar um alvo definido pela conjunção de características (um X vermelho entre Xs verdes e Os vermelhos) requer atenção serial e fica mais lento conforme aumenta o número de distratores.\n\nA teoria fundamentou décadas de pesquisa sobre atenção visual."
    },
  ],

  "Análise Experimental do Comportamento": [
    {
      nome: "Lei do Efeito", ano: "1898",
      autor: "Edward Thorndike", formula: null,
      descricao: "Thorndike formulou: respostas seguidas por consequências satisfatórias tendem a se repetir; respostas seguidas por consequências desconfortáveis tendem a diminuir.\n\nFormulada a partir de experimentos com gatos em 'caixas-problema': os animais aprendiam a escapar não por insight, mas por tentativa-e-erro, com gradual fortalecimento das respostas bem-sucedidas.\n\nFoi o precursor direto do conceito de reforçamento de Skinner e da própria ideia de que o comportamento é selecionado por suas consequências — paralelo darwinista entre seleção natural e seleção operante."
    },

    {
      nome: "Condicionamento clássico", ano: "1903",
      autor: "Ivan Pavlov", formula: "EI → RI ; EC → RC",
      descricao: "Pavlov mostrou que um estímulo neutro (campainha), quando pareado repetidamente com um estímulo incondicionado (comida), passa a eliciar uma resposta condicionada (salivação) similar à resposta incondicionada original.\n\nO modelo fundamenta o estudo de aprendizagem associativa e é base para entender fobias, aversões alimentares, tolerância a drogas e respostas emocionais aprendidas.\n\nVersões modernas incluem o modelo Rescorla-Wagner, que formaliza matematicamente como força associativa muda em função de surpresa (erro de predição) — base teórica de modelos atuais de aprendizagem por reforço."
    },

    {
      nome: "Condicionamento operante", ano: "1938",
      autor: "B. F. Skinner", formula: null,
      descricao: "Skinner propôs uma classe de comportamentos chamada 'operante' — comportamentos voluntários que operam sobre o ambiente e são moldados por suas consequências.\n\nReforçamento positivo (apresentar consequência apetitiva), reforçamento negativo (remover estímulo aversivo), punição positiva e negativa formam o quadrante básico de contingências.\n\nO trabalho com esquemas de reforçamento (intervalo fixo, razão variável, etc) revelou padrões comportamentais robustos que continuam centrais na economia comportamental, no design de interfaces e em estudos de jogos de azar."
    },

    {
      nome: "Lei da Igualação (Matching Law)", ano: "1961",
      autor: "Richard Herrnstein", formula: "B₁/B₂ = R₁/R₂",
      descricao: "Em situações de escolha entre alternativas concorrentes, a proporção de respostas em cada alternativa iguala a proporção de reforços obtidos por ela.\n\nFoi a primeira lei quantitativa rigorosa do comportamento de escolha, com formalização matemática limpa e suporte experimental amplo (em pombos, ratos e humanos).\n\nA versão generalizada (Baum, 1974) introduziu parâmetros de viés e sensibilidade, ajustando a equação a desvios sistemáticos. A lei é a fundação da análise quantitativa do comportamento e tem paralelos diretos com modelos econômicos de escolha."
    },

    {
      nome: "Behaviorismo teleológico e desconto temporal", ano: "1992",
      autor: "Howard Rachlin", formula: "V = A / (1 + k·D)",
      descricao: "Rachlin propôs que o valor subjetivo de uma recompensa diminui hiperbolicamente conforme aumenta o atraso até o seu recebimento. A função tem forma de hipérbole, não de exponencial — gerando reversões de preferência ao longo do tempo (impulsividade).\n\nNa fórmula, V é o valor subjetivo, A é a magnitude da recompensa, D é o atraso e k é a taxa de desconto individual.\n\nA proposta integra análise do comportamento com economia comportamental e neurociência da tomada de decisão. Tem aplicações em estudos sobre adicção, autocontrole e patologia psiquiátrica — taxas de k elevadas correlacionam-se com adicção, TDAH e dependência."
    },
  ],

  "Economia comportamental": [
    {
      nome: "Racionalidade limitada (bounded rationality)", ano: "1955",
      autor: "Herbert Simon", formula: null,
      descricao: "Contra o modelo do agente racional clássico que otimiza utilidade, Simon argumentou que humanos têm capacidades cognitivas limitadas e operam em ambientes complexos demais para otimização perfeita.\n\nNa prática, buscamos soluções 'satisficing' — suficientemente boas, em vez de ótimas. Estabelecemos níveis de aspiração, buscamos sequencialmente, e paramos quando uma alternativa atende ao critério.\n\nA proposta abriu caminho para a economia comportamental e foi pioneira em integrar psicologia cognitiva e ciências de decisão. Simon recebeu o Nobel de Economia (1978) por essas contribuições."
    },

    {
      nome: "Teoria do Prospecto", ano: "1979",
      autor: "Daniel Kahneman & Amos Tversky", formula: "v(x), π(p)",
      descricao: "Substitui a teoria da utilidade esperada como descrição (não prescrição) de como pessoas reais decidem sob risco.\n\nTrês insights centrais: (1) avaliamos resultados como ganhos ou perdas relativos a um ponto de referência, não em termos absolutos; (2) somos avessos a perdas — perder R$100 dói mais do que ganhar R$100 satisfaz, num fator de cerca de 2; (3) ponderamos probabilidades de forma não-linear, superestimando eventos raros e subestimando eventos comuns.\n\nA teoria gerou o Nobel de Economia para Kahneman em 2002 (Tversky havia falecido) e fundamenta grande parte da economia comportamental atual."
    },

    {
      nome: "Heurísticas e vieses", ano: "1974",
      autor: "Tversky & Kahneman", formula: null,
      descricao: "Tversky e Kahneman documentaram que humanos usam atalhos mentais (heurísticas) sistemáticos para tomar decisões sob incerteza, e que esses atalhos geram vieses previsíveis.\n\nHeurísticas centrais: representatividade (julgar probabilidade pela semelhança a um estereótipo), disponibilidade (julgar frequência pela facilidade de lembrar exemplos), ancoragem (decisões influenciadas por números arbitrários apresentados antes).\n\nO programa de pesquisa demonstrou que esses vieses não são erros aleatórios, mas padrões sistemáticos — abrindo caminho para o conceito de 'arquitetura de escolha' e para o uso de nudges em políticas públicas."
    },

    {
      nome: "Nudge e arquitetura de escolha", ano: "2008",
      autor: "Richard Thaler & Cass Sunstein", formula: null,
      descricao: "A forma como escolhas são apresentadas influencia profundamente as decisões — mesmo quando o conjunto de opções é idêntico. Thaler e Sunstein propõem que governos e instituições podem usar essa influência de forma deliberada e benéfica, sem restringir liberdade.\n\nExemplos clássicos: tornar a inscrição em planos de previdência o default (com opção de saída) aumenta dramaticamente a poupança; mudar a ordem de itens em cardápios afeta escolhas alimentares; doação de órgãos por opt-out vs opt-in muda taxas de doação em ordens de magnitude.\n\nA proposta foi rotulada de 'paternalismo libertário' e gerou unidades de Behavioral Insights em vários governos (Reino Unido, EUA, Brasil)."
    },

    {
      nome: "Axioma de escolha de Luce", ano: "1959",
      autor: "R. Duncan Luce", formula: "P(x|S) = v(x)/Σv(y)",
      descricao: "Luce propôs uma formalização probabilística da escolha: a probabilidade de escolher um item x de um conjunto S depende do valor (utilidade) de x relativo à soma dos valores de todos os itens disponíveis.\n\nO axioma central diz que adicionar ou remover alternativas irrelevantes não deveria afetar as proporções de escolha entre alternativas existentes (independência de alternativas irrelevantes — IIA).\n\nForma a base matemática de modelos logit/multinomiais usados em pesquisa de mercado, escolha do consumidor e modelagem psicológica de decisão. Variantes (Tversky, McFadden) relaxam IIA para casos onde violações sistemáticas ocorrem."
    },
  ],

  "Psicologia social": [
    {
      nome: "Teoria de campo", ano: "1936",
      autor: "Kurt Lewin", formula: "B = f(P, E)",
      descricao: "Comportamento (B) é função (f) da pessoa (P) em interação com o ambiente (E). A fórmula simples encapsula uma virada conceitual: comportamento não é determinado isoladamente por traços de personalidade nem por situação, mas pela interação dinâmica entre os dois.\n\nLewin emprestou o conceito de campo da física: a pessoa existe num 'espaço vital' com forças (atrações, repulsões, barreiras) que estruturam o comportamento naquele momento.\n\nA teoria fundou a psicologia social moderna e influenciou décadas de pesquisa sobre dinâmica de grupos, mudança social e pesquisa-ação."
    },

    {
      nome: "Teoria da dissonância cognitiva", ano: "1957",
      autor: "Leon Festinger (refinado por Aronson)", formula: null,
      descricao: "Quando uma pessoa mantém duas cognições inconsistentes (ou cognição inconsistente com comportamento), surge um estado psicológico desconfortável — dissonância — que motiva a redução do conflito.\n\nA redução pode ocorrer mudando atitudes ('na verdade não gostei tanto daquele emprego que rejeitei'), buscando informações justificadoras, ou minimizando a importância da cognição conflitante.\n\nO experimento clássico (Festinger & Carlsmith, 1959) mostrou que pessoas pagas pouco para mentir mudavam mais suas atitudes do que pessoas pagas muito — quando a justificativa externa é fraca, a pressão para justificar internamente é maior. Aronson reformulou a teoria em termos de auto-conceito: dissonância surge especialmente quando o comportamento ameaça a visão de si."
    },

    {
      nome: "Conformidade", ano: "1951",
      autor: "Solomon Asch", formula: null,
      descricao: "Asch demonstrou experimentalmente que pessoas frequentemente concordam com julgamentos perceptuais obviamente errados quando uma maioria unânime discorda delas. Em torno de 75% dos participantes conformaram-se em pelo menos uma de várias tentativas.\n\nO paradigma usava tarefas simples de comparação de comprimento de linhas — situações onde a resposta correta é incontroversa. A pressão social bastava para distorcer respostas.\n\nFatores que aumentam conformidade: tamanho do grupo (até cerca de 4-5 pessoas), unanimidade (a presença de um único 'aliado' reduz drasticamente o efeito), público vs privado. A teoria fundamentou décadas de pesquisa sobre influência social e pressão de grupo."
    },

    {
      nome: "Obediência à autoridade", ano: "1963",
      autor: "Stanley Milgram", formula: null,
      descricao: "Milgram demonstrou que pessoas comuns aplicam o que acreditam serem choques elétricos de até 450 volts (potencialmente letais) em estranhos quando instruídas por uma figura de autoridade — cerca de 65% dos participantes 'foram até o fim'.\n\nO trabalho foi motivado pelo julgamento de Eichmann e pela banalidade do mal documentada por Hannah Arendt: como pessoas normais participam de atrocidades?\n\nMilgram identificou fatores moduladores: proximidade física da vítima reduz obediência, presença de pares desobedientes reduz dramaticamente, autoridade legítima e institucional aumenta. As implicações éticas do estudo geraram reformas profundas em comitês de ética em pesquisa."
    },

    {
      nome: "Poder das situações (Stanford Prison Experiment)", ano: "1971",
      autor: "Philip Zimbardo", formula: null,
      descricao: "Zimbardo argumentou que situações têm poder dramático de moldar comportamento, sobrepondo-se a traços individuais de personalidade. Estudantes universitários atribuídos aleatoriamente a papéis de 'guardas' ou 'prisioneiros' em um cenário simulado de prisão exibiram comportamentos cruéis (guardas) ou submissos (prisioneiros) em poucos dias.\n\nO experimento foi interrompido em 6 dias dos 14 planejados devido à deterioração psicológica dos participantes.\n\nA interpretação 'situacionista forte' foi posteriormente questionada — análises de áudios e documentos sugerem que Zimbardo instruiu guardas explicitamente, e os participantes podem ter performado papéis sob expectativas. Ainda assim, o experimento permanece um marco no debate sobre 'maçãs ruins vs barris ruins' e tem ressonância em casos como Abu Ghraib."
    },
  ],

  "Neurociência": [
    {
      nome: "Doutrina do neurônio", ano: "1888",
      autor: "Santiago Ramón y Cajal", formula: null,
      descricao: "Cajal established que o sistema nervoso é composto por células discretas (neurônios) que se comunicam por contato, não por continuidade. Foi uma virada conceitual contra a teoria reticular dominante (Golgi), que via o sistema nervoso como uma rede contínua.\n\nUsando a coloração argêntica desenvolvida por Golgi, Cajal documentou a polaridade neuronal — informação flui de dendritos para o corpo celular e dali para o axônio — formulando a 'lei da polarização dinâmica'.\n\nA doutrina foi confirmada décadas depois pela microscopia eletrônica, que revelou as fendas sinápticas. Os desenhos detalhados de Cajal continuam usados em livros-texto e sua estética influenciou a iconografia da neurociência."
    },

    {
      nome: "Modelo de Hodgkin-Huxley", ano: "1952",
      autor: "Alan Hodgkin & Andrew Huxley", formula: "I = Cₘ·dV/dt + ΣI_íon",
      descricao: "Hodgkin e Huxley descreveram matematicamente o potencial de ação como resultado da abertura e fechamento sequenciais de canais iônicos voltagem-dependentes — primeiro Na⁺ entra (despolarização), depois K⁺ sai (repolarização).\n\nO modelo matemático reproduz com precisão notável a forma do potencial de ação medido experimentalmente no axônio gigante de lula. Cada canal é modelado por equações diferenciais com 'gating variables' que descrevem a probabilidade de abertura.\n\nÉ a fundação da neurociência computacional contemporânea — modelos de redes neurais biofísicas, simulações de redes corticais (NEURON, Brian) ainda partem dele. Rendeu o Nobel de 1963."
    },

    {
      nome: "Postulado de Hebb (plasticidade sináptica)", ano: "1949",
      autor: "Donald Hebb", formula: null,
      descricao: "Hebb formulou: quando um axônio de um neurônio A está suficientemente próximo para excitar um neurônio B e participa repetidamente em fazê-lo disparar, alguma mudança ocorre que aumenta a eficiência de A em ativar B.\n\nVersão popular: 'cells that fire together, wire together'.\n\nO postulado prediz a base celular do aprendizado e foi confirmado experimentalmente com a descoberta da Long-Term Potentiation (LTP) por Bliss e Lømo (1973), que mostraram fortalecimento sináptico duradouro após estimulação correlacionada. É também a inspiração para algoritmos de aprendizado em redes neurais artificiais."
    },

    {
      nome: "Centros de prazer (autoestimulação intracraniana)", ano: "1954",
      autor: "James Olds & Peter Milner", formula: null,
      descricao: "Olds e Milner descobriram acidentalmente que ratos com eletrodos implantados em certas regiões cerebrais (especialmente o feixe prosencefálico medial) pressionavam alavancas obsessivamente para receber estimulação elétrica — até 7000 vezes por hora, ignorando comida, água e sexo.\n\nO achado revelou um sistema neural específico para recompensa, posteriormente identificado como o circuito mesolímbico dopaminérgico (área tegmental ventral → núcleo accumbens).\n\nFundamenta a neurociência contemporânea da motivação, do prazer e da adicção. Modelos atuais distinguem 'wanting' (querer, dopaminérgico) de 'liking' (gostar, opióide), refinando a interpretação original."
    },

    {
      nome: "Dissociação memória declarativa vs procedural (paciente H.M.)", ano: "1957",
      autor: "Brenda Milner", formula: null,
      descricao: "O paciente Henry Molaison (H.M.) sofreu remoção bilateral do hipocampo aos 27 anos para tratar epilepsia intratável. A cirurgia eliminou suas crises, mas também sua capacidade de formar novas memórias declarativas (eventos e fatos).\n\nMilner descobriu, no entanto, que H.M. ainda aprendia novas habilidades motoras (memória procedural), sem se lembrar de ter praticado. A dissociação demonstrou que existem múltiplos sistemas de memória, com substratos neurais distintos.\n\nDécadas de estudos com H.M. estabeleceram a divisão fundamental entre memória explícita (hipocampal, declarativa) e implícita (estriatal/cerebelar, procedural) que estrutura a neuropsicologia moderna."
    },
  ],

  "Etologia": [
    {
      nome: "Quatro questões de Tinbergen", ano: "1963",
      autor: "Nikolaas Tinbergen", formula: null,
      descricao: "Tinbergen propôs que a explicação completa de um comportamento requer responder a quatro perguntas distintas e complementares: causação (que mecanismos imediatos produzem o comportamento?), ontogenia (como o comportamento se desenvolve no indivíduo?), função (que vantagem evolutiva ele confere?) e filogênese (como evoluiu na linhagem?).\n\nAs duas primeiras são causas próximas (mecanismo e desenvolvimento), as duas últimas são causas distais (função e história evolutiva).\n\nO esquema é a fundação metodológica da etologia e é a inspiração direta deste mapa multinível. Sua força está em prevenir o erro frequente de tomar uma resposta como suficiente — explicar o ciúme como 'estratégia evolutiva de proteção de paternidade' (função) não responde como ele funciona neurobiologicamente (mecanismo)."
    },

    {
      nome: "Imprinting (impressão filial)", ano: "1935",
      autor: "Konrad Lorenz", formula: null,
      descricao: "Lorenz documentou que filhotes de gansos formam um vínculo rápido e irreversível com o primeiro objeto em movimento que veem após o nascimento — normalmente a mãe, mas em condições experimentais, com humanos, objetos coloridos ou outros estímulos.\n\nO fenômeno tem três características-chave: ocorre durante um 'período crítico' restrito (primeiras horas a dias de vida), é praticamente irreversível, e direciona não só comportamento filial atual como também escolha de parceiro sexual na vida adulta.\n\nO conceito de período crítico foi central para John Bowlby ao formular a teoria do apego em humanos, e influencia debates contemporâneos sobre janelas plásticas no neurodesenvolvimento."
    },

    {
      nome: "Dança das abelhas", ano: "1947",
      autor: "Karl von Frisch", formula: null,
      descricao: "Von Frisch decodificou o sistema de comunicação de abelhas operárias: ao retornar à colmeia após encontrar uma fonte de alimento, a abelha executa uma 'dança em oito' (waggle dance) cujo ângulo em relação à vertical codifica a direção da fonte em relação ao sol, e cuja duração codifica a distância.\n\nAbelhas-companheiras decodificam a dança e voam diretamente para a fonte sem necessidade de seguir trilhas químicas.\n\nFoi um dos primeiros casos documentados de comunicação simbólica em invertebrados — estímulo distal (alimento longe) sendo codificado em sinal arbitrário que outras abelhas decodificam com precisão. Ganhou o Nobel em 1973 (com Lorenz e Tinbergen)."
    },

    {
      nome: "Teoria do apego", ano: "1969",
      autor: "John Bowlby", formula: null,
      descricao: "Bowlby integrou etologia, psicanálise e teoria de sistemas para argumentar que o vínculo bebê-cuidador é um sistema comportamental geneticamente moldado, evolutivamente vantajoso para a sobrevivência infantil.\n\nO sistema de apego é ativado por ameaça (separação, medo) e busca proximidade ao cuidador como base segura. A qualidade do vínculo durante a infância forma 'modelos internos de funcionamento' (internal working models) que influenciam relacionamentos ao longo da vida.\n\nMary Ainsworth desenvolveu a 'Situação Estranha' para classificar estilos de apego — seguro, evitativo, ambivalente, desorganizado — operacionalizando a teoria. É hoje fundamento da psicologia do desenvolvimento e da psicoterapia."
    },
  ],

  "Sociolinguística": [
    {
      nome: "Variação linguística como prática social", ano: "1963",
      autor: "William Labov", formula: null,
      descricao: "Labov demonstrou que variação linguística não é desordem ou erro — é estruturada e socialmente significativa. Seu estudo na ilha de Martha's Vineyard mostrou que pescadores enfatizavam pronúncias arcaicas como marca identitária contra turistas.\n\nO estudo posterior em lojas de departamento de Nova York (Saks, Macy's, Klein's) revelou que falantes ajustavam pronúncia do /r/ pós-vocálico de acordo com contexto e classe social — variação sistemática, sensível a estilo, situação e identidade.\n\nA proposta fundou a sociolinguística variacionista e estabeleceu métodos quantitativos rigorosos para estudo da variação. Mostrou que mudança linguística começa em variação atual, ligada a redes sociais e marcadores identitários."
    },
  ],

  "Psicofísica": [
    {
      nome: "Lei de Weber", ano: "1834",
      autor: "Ernst Weber", formula: "ΔI / I = k",
      descricao: "Weber observou que a menor diferença perceptível (just noticeable difference, JND) entre dois estímulos é proporcional à magnitude do estímulo de referência, com constante k específica para cada modalidade sensorial.\n\nNa prática: se você consegue notar a diferença entre 100g e 105g (um aumento de 5%), também conseguirá notar a diferença entre 1000g e 1050g (mesmo 5%) — mas não entre 1000g e 1005g.\n\nA lei vale aproximadamente para muitas modalidades (peso, brilho, intensidade sonora) em ranges intermediários, com desvios em extremos. Foi a primeira lei quantitativa em psicologia, abrindo caminho para a psicofísica e para o tratamento da percepção como objeto de medida."
    },

    {
      nome: "Lei de Fechner", ano: "1860",
      autor: "Gustav Fechner", formula: "S = k · log(I)",
      descricao: "A partir da Lei de Weber, Fechner derivou matematicamente que a sensação percebida (S) cresce logaritmicamente com a intensidade física do estímulo (I) — duplicar a intensidade não duplica a sensação.\n\nA lei explica fenômenos cotidianos: por que decibéis e magnitudes de estrelas usam escalas logarítmicas, por que precisamos de incrementos cada vez maiores para sentir diferenças no volume.\n\nFechner desenvolveu também três métodos clássicos de mensuração psicofísica (limiar, ajuste, estímulos constantes) que permanecem em uso. Sua obra 'Elementos de Psicofísica' (1860) é considerada o marco fundador da psicologia experimental — primeiro tratamento sistemático de fenômenos mentais como mensuráveis."
    },

    {
      nome: "Lei da Potência de Stevens", ano: "1957",
      autor: "S. S. Stevens", formula: "S = k · Iⁿ",
      descricao: "Stevens contestou a Lei de Fechner usando estimação direta de magnitude — pedindo a participantes que atribuíssem números proporcionais à intensidade percebida. Os resultados ajustaram-se melhor a uma função de potência do que a uma logarítmica.\n\nO expoente n varia por modalidade: cerca de 0.33 para brilho (sensação cresce mais lentamente que estímulo), 1.0 para comprimento, 3.5 para choque elétrico (sensação cresce muito mais rápido que estímulo).\n\nStevens também classificou as escalas de mensuração (nominal, ordinal, intervalar, razão), uma estrutura que continua central em estatística e metodologia de pesquisa contemporânea."
    },
  ],
};

/* ============================================================================
   4. VARIÁVEIS DE ESTADO GLOBAL
   ============================================================================ */
let currentDiscipline = null; // Disciplina atualmente aberta no modal
let currentAuthorIdx = 0;     // Índice do autor atualmente exibido no modal do autor
let currentTheoryIdx = 0;     // Índice da teoria atualmente exibida no modal de teoria
let currentView = 'authors';  // Aba ativa no modal da disciplina ('authors' | 'theories')
let currentMode = 'matrix';   // Modo de visualização principal ('matrix' | 'graph' | 'timeline')

/* ============================================================================
   5. CONSTRUÇÃO DA MATRIZ PRINCIPAL
   ============================================================================ */

/**
 * Constrói a grade interativa da matriz (4x4) no elemento `#matrix`.
 */
function buildMatrix() {
  const matrix = document.getElementById('matrix');
  if (!matrix) return;

  matrix.innerHTML = '';

  // Canto superior esquerdo da grade com os indicadores dos eixos (Tempo / Proximidade)
  const corner = document.createElement('div');
  corner.className = 'corner';
  corner.innerHTML = `
    <div class="axis-y"><span class="axis-label">↑ Tempo</span></div>
    <div class="axis-x"><span class="axis-label">Proximidade →</span></div>
  `;
  matrix.appendChild(corner);

  // Cabeçalhos das 4 colunas (Eixo de Proximidade Causal A, B, C, D)
  COLUNAS_PROX.forEach(col => {
    const h = document.createElement('div');
    h.className = 'col-header';
    h.innerHTML = `
      <div>
        <div class="col-marker">${col.letra}</div>
        <div class="col-name">${col.nome}</div>
      </div>
      <div class="col-sub">${col.sub}</div>
    `;
    matrix.appendChild(h);
  });

  // Linhas da Matriz (Eixo de Escala Temporal 03, 02, 01, 00)
  LINHAS_TEMPO.forEach((row, rowIdx) => {
    // Rótulo da linha
    const label = document.createElement('div');
    label.className = 'row-label' + (rowIdx === 0 ? ' first' : '');
    label.innerHTML = `
      <div class="row-num">${row.num}</div>
      <div class="row-name">${row.nome}</div>
      <div class="row-sub">${row.sub}</div>
    `;
    matrix.appendChild(label);

    // Células da linha para cada coluna
    COLUNAS_PROX.forEach((col, colIdx) => {
      const cell = document.createElement('div');
      cell.className = `cell ${col.classe}` + (rowIdx === 0 ? ' first-row' : '');
      const disciplinas = MATRIZ[`${rowIdx},${colIdx}`] || [];

      if (disciplinas.length === 0) {
        cell.innerHTML = '<div class="cell-empty">·</div>';
      } else {
        disciplinas.forEach(disc => {
          const btn = document.createElement('button');
          const count = (AUTORES[disc] || []).length;
          const has = count > 0;
          btn.className = 'discipline' + (has ? '' : ' empty-discipline');
          btn.innerHTML = `<span>${disc}</span>${has ? `<span class="count">${String(count).padStart(2, '0')}</span>` : ''}`;
          if (has) {
            btn.onclick = () => openDiscipline(disc);
          } else {
            btn.title = 'Sem autores cadastrados ainda';
          }
          cell.appendChild(btn);
        });
      }
      matrix.appendChild(cell);
    });
  });
}

/* ============================================================================
   6. GERENCIAMENTO DO OVERLAY / MODAL DA DISCIPLINA
   ============================================================================ */

/**
 * Abre o modal de detalhes de uma disciplina, exibindo suas listas de autores e teorias.
 * @param {string} disc - Nome da disciplina selecionada.
 */
function openDiscipline(disc) {
  currentDiscipline = disc;
  const autores = AUTORES[disc] || [];
  const teorias = TEORIAS[disc] || [];

  document.getElementById('discipline-name').textContent = disc;
  document.getElementById('discipline-desc').textContent = DESCRICOES[disc] || '';

  // Atualiza contadores numéricos nos botões de alternância
  document.getElementById('count-authors').textContent =
    String(autores.length).padStart(2, '0');
  document.getElementById('count-theories').textContent =
    String(teorias.length).padStart(2, '0');

  // Desabilita botões quando não houver conteúdo
  const btnAuthors = document.getElementById('toggle-authors');
  const btnTheories = document.getElementById('toggle-theories');
  btnAuthors.disabled = autores.length === 0;
  btnTheories.disabled = teorias.length === 0;

  // Define a visualização inicial (prefere autores se existirem, senão teorias)
  const initialView = autores.length > 0 ? 'authors' : (teorias.length > 0 ? 'theories' : 'authors');
  setView(initialView, false);

  // Renderiza a lista de autores da disciplina
  const listA = document.getElementById('author-list');
  listA.innerHTML = '';
  autores.forEach((autor, idx) => {
    const row = document.createElement('div');
    row.className = 'author-entry';
    row.onclick = () => openAuthor(idx);
    row.innerHTML = `
      <div class="ae-num">${String(idx + 1).padStart(2, '0')}</div>
      <div class="ae-name">${autor.nome}</div>
      <div class="ae-period">${autor.periodo}</div>
      <div class="ae-arrow">→</div>
    `;
    listA.appendChild(row);
  });

  // Renderiza a lista de teorias da disciplina
  const listT = document.getElementById('theory-list');
  listT.innerHTML = '';
  teorias.forEach((teoria, idx) => {
    const row = document.createElement('div');
    row.className = 'theory-entry';
    row.onclick = () => openTheory(idx);
    row.innerHTML = `
      <div class="te-num">${String(idx + 1).padStart(2, '0')}</div>
      <div class="te-name">
        ${teoria.nome}
        <span class="te-author">${teoria.autor}</span>
      </div>
      <div class="te-year">${teoria.ano}</div>
      <div class="te-arrow">→</div>
    `;
    listT.appendChild(row);
  });

  updateDisciplineEyebrow();

  closeAll(false);
  document.getElementById('overlay-discipline').classList.add('active');
  document.body.style.overflow = 'hidden';
  document.getElementById('overlay-discipline').scrollTop = 0;
}

/**
 * Alterna entre as abas 'authors' (autores) e 'theories' (teorias) no modal da disciplina.
 * @param {string} view - 'authors' ou 'theories'
 * @param {boolean} [scrollToTop=true] - Se deve rolar o modal até o topo
 */
function setView(view, scrollToTop = true) {
  currentView = view;
  const btnA = document.getElementById('toggle-authors');
  const btnT = document.getElementById('toggle-theories');
  const contentA = document.getElementById('view-authors-content');
  const contentT = document.getElementById('view-theories-content');

  if (view === 'authors') {
    btnA.classList.add('active');
    btnT.classList.remove('active');
    contentA.style.display = '';
    contentT.style.display = 'none';
  } else {
    btnT.classList.add('active');
    btnA.classList.remove('active');
    contentT.style.display = '';
    contentA.style.display = 'none';
  }

  updateDisciplineEyebrow();
  if (scrollToTop) {
    document.getElementById('overlay-discipline').scrollTop = 0;
  }
}

/**
 * Atualiza o texto do subtítulo/categoria no modal da disciplina.
 */
function updateDisciplineEyebrow() {
  if (!currentDiscipline) return;
  const autores = AUTORES[currentDiscipline] || [];
  const teorias = TEORIAS[currentDiscipline] || [];
  const n = currentView === 'authors' ? autores.length : teorias.length;
  const label = currentView === 'authors' ? 'autores' : 'teorias';
  document.getElementById('discipline-eyebrow').textContent =
    `Disciplina · ${String(n).padStart(2, '0')} ${label}`;
}

/* ============================================================================
   7. FICHA DETALHADA DO AUTOR
   ============================================================================ */

/**
 * Abre o modal com a biografia e contribuição detalhada de um autor.
 * @param {number} idx - Índice do autor na lista da disciplina atual.
 */
function openAuthor(idx) {
  if (!currentDiscipline) return;
  const autores = AUTORES[currentDiscipline];
  currentAuthorIdx = idx;
  const autor = autores[idx];
  if (!autor) return;

  document.getElementById('author-name').textContent = autor.nome;
  document.getElementById('author-period').textContent = autor.periodo;
  document.getElementById('author-discipline-tag').textContent = currentDiscipline;
  document.getElementById('author-index-tag').textContent =
    `Ficha ${String(idx + 1).padStart(2, '0')}`;
  document.getElementById('author-pagination').textContent =
    `${String(idx + 1).padStart(2, '0')} / ${String(autores.length).padStart(2, '0')}`;
  document.getElementById('author-back-label').textContent =
    `voltar para ${currentDiscipline.toLowerCase()}`;

  // Cálculo da expectativa / tempo de vida do autor
  const m = autor.periodo.match(/(\d{4}).*?(\d{4}|presente)/);
  let lifespan = '';
  if (m) {
    if (m[2] === 'presente') {
      const age = new Date().getFullYear() - parseInt(m[1]);
      lifespan = `${age} anos`;
    } else {
      const age = parseInt(m[2]) - parseInt(m[1]);
      lifespan = `${age} anos de vida`;
    }
  }
  document.getElementById('author-lifespan').textContent = lifespan;

  // Divisão da contribuição em parágrafo inicial (lede) e corpo
  const partes = autor.contribuicao.split('\n\n');
  document.getElementById('author-lede').textContent = partes[0] || '';
  const restoEl = document.getElementById('author-body');
  restoEl.innerHTML = '';
  partes.slice(1).forEach(p => {
    const para = document.createElement('p');
    para.textContent = p;
    restoEl.appendChild(para);
  });

  // Carregamento da foto com fallback para a primeira letra do nome
  const heroBg = document.getElementById('hero-bg');
  const heroFb = document.getElementById('hero-fallback');
  const heroFbLetter = document.getElementById('hero-fallback-letter');
  heroFbLetter.textContent = autor.nome.charAt(0).toUpperCase();
  heroBg.style.display = 'none';
  heroFb.style.display = 'flex';

  const img = new Image();
  img.onload = () => {
    heroBg.style.backgroundImage = `url('fotos/${autor.foto}')`;
    heroBg.style.display = 'block';
    heroFb.style.display = 'none';
  };
  img.onerror = () => { /* Mantém a imagem de fallback em caso de erro */ };
  img.src = `fotos/${autor.foto}`;

  // Configuração dos botões de navegação Anterior / Próximo
  const navPrev = document.getElementById('nav-prev');
  const navNext = document.getElementById('nav-next');
  if (idx > 0) {
    navPrev.disabled = false;
    document.getElementById('nav-prev-name').textContent = autores[idx - 1].nome;
  } else {
    navPrev.disabled = true;
    document.getElementById('nav-prev-name').textContent = '—';
  }
  if (idx < autores.length - 1) {
    navNext.disabled = false;
    document.getElementById('nav-next-name').textContent = autores[idx + 1].nome;
  } else {
    navNext.disabled = true;
    document.getElementById('nav-next-name').textContent = '—';
  }

  // Renderização das metainformações (tags, influências e obras)
  renderAuthorMeta(autor);

  document.getElementById('overlay-discipline').classList.remove('active');
  document.getElementById('overlay-author').classList.add('active');
  document.body.style.overflow = 'hidden';
  document.getElementById('overlay-author').scrollTop = 0;
}

/**
 * Renderiza tags de métodos, influências e lista de obras-chave da ficha do autor.
 * @param {Object} autor - Objeto do autor.
 */
function renderAuthorMeta(autor) {
  const container = document.getElementById('author-meta-section');
  container.innerHTML = '';
  const hasAny = (autor.tags && autor.tags.length) ||
    (autor.influencias !== undefined) ||
    (autor.obras && autor.obras.length);
  if (!hasAny) return;

  // Renderiza Tags / Métodos
  if (autor.tags && autor.tags.length) {
    const row = document.createElement('div');
    row.className = 'meta-row';
    row.innerHTML = `
      <div class="meta-label">Métodos e ferramentas</div>
      <div class="meta-content">
        <div class="tag-list">
          ${autor.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>
    `;
    container.appendChild(row);
  }

  // Renderiza Influências de outros autores
  if (autor.influencias !== undefined) {
    const row = document.createElement('div');
    row.className = 'meta-row';
    const influList = autor.influencias.length === 0
      ? '<span class="influence-empty">Sem influências mapeadas neste recorte</span>'
      : `<div class="influence-list">${autor.influencias.map(name => {
        const found = findAuthorByName(name);
        if (found) {
          return `<span class="influence-item" onclick="openAuthorByName('${name.replace(/'/g, "\\'")}')">${name} →</span>`;
        }
        return `<span class="influence-empty">${name}</span>`;
      }).join('')
      }</div>`;
    row.innerHTML = `
      <div class="meta-label">Influenciado por</div>
      <div class="meta-content">${influList}</div>
    `;
    container.appendChild(row);
  }

  // Renderiza Obras principais
  if (autor.obras && autor.obras.length) {
    const row = document.createElement('div');
    row.className = 'meta-row';
    const items = autor.obras.map(o => {
      const linkHtml = o.link
        ? `<a class="work-link" href="${o.link}" target="_blank" rel="noopener" title="Abrir link">↗</a>`
        : `<span class="work-link disabled" title="Sem link cadastrado">↗</span>`;
      return `
        <div class="work-item">
          <div class="work-year">${o.ano}</div>
          <div class="work-title">${escapeHTML(o.titulo)}</div>
          ${linkHtml}
        </div>
      `;
    }).join('');
    row.innerHTML = `
      <div class="meta-label">Obras-chave</div>
      <div class="meta-content"><div class="works-list">${items}</div></div>
    `;
    container.appendChild(row);
  }
}

/**
 * Escapa caracteres HTML para evitar injeções XSS acidentais em strings dinâmicas.
 * @param {string} s - Texto a ser escapado.
 * @returns {string}
 */
function escapeHTML(s) {
  return s.replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}

/**
 * Procura um autor por nome em qualquer uma das disciplinas do dicionário.
 * @param {string} name - Nome do autor.
 * @returns {Object|null} Objeto contendo disciplina, idx e dados do autor.
 */
function findAuthorByName(name) {
  for (const [disc, lista] of Object.entries(AUTORES)) {
    const idx = lista.findIndex(a => a.nome === name);
    if (idx !== -1) return { disciplina: disc, idx, autor: lista[idx] };
  }
  return null;
}

/**
 * Busca um autor pelo nome e abre sua ficha diretamente.
 * @param {string} name - Nome do autor.
 */
function openAuthorByName(name) {
  const f = findAuthorByName(name);
  if (!f) return;
  currentDiscipline = f.disciplina;
  openAuthor(f.idx);
}

/**
 * Navega entre autores da mesma disciplina (-1 para anterior, +1 para próximo).
 * @param {number} delta - Deslocamento na lista.
 */
function navAuthor(delta) {
  const autores = AUTORES[currentDiscipline] || [];
  const newIdx = currentAuthorIdx + delta;
  if (newIdx >= 0 && newIdx < autores.length) {
    openAuthor(newIdx);
  }
}

/**
 * Retorna da ficha do autor para o modal da disciplina de origem.
 */
function backToDiscipline() {
  if (currentDiscipline) {
    document.getElementById('overlay-author').classList.remove('active');
    setTimeout(() => {
      openDiscipline(currentDiscipline);
      setView('authors', false);
    }, 100);
  }
}

/* ============================================================================
   8. FICHA DETALHADA DA TEORIA
   ============================================================================ */

/**
 * Abre a ficha detalhada de uma teoria/hipótese.
 * @param {number} idx - Índice da teoria na lista da disciplina.
 */
function openTheory(idx) {
  if (!currentDiscipline) return;
  const teorias = TEORIAS[currentDiscipline] || [];
  currentTheoryIdx = idx;
  const teoria = teorias[idx];
  if (!teoria) return;

  const hero = document.getElementById('theory-hero');
  const formulaEl = document.getElementById('theory-formula');
  if (teoria.formula) {
    hero.classList.remove('no-formula');
    formulaEl.innerHTML = teoria.formula;
  } else {
    hero.classList.add('no-formula');
    formulaEl.innerHTML = '';
  }

  document.getElementById('theory-name').textContent = teoria.nome;
  document.getElementById('theory-author').textContent = teoria.autor;
  document.getElementById('theory-year').textContent = teoria.ano;
  document.getElementById('theory-discipline-tag').textContent = currentDiscipline;
  document.getElementById('theory-index-tag').textContent =
    `Ficha ${String(idx + 1).padStart(2, '0')}`;
  document.getElementById('theory-pagination').textContent =
    `${String(idx + 1).padStart(2, '0')} / ${String(teorias.length).padStart(2, '0')}`;
  document.getElementById('theory-back-label').textContent =
    `voltar para ${currentDiscipline.toLowerCase()}`;

  // Descrição: divide em parágrafo principal (lede) e parágrafos adicionais
  const partes = (teoria.descricao || '').split('\n\n');
  document.getElementById('theory-lede').textContent = partes[0] || '';
  const restoEl = document.getElementById('theory-body');
  restoEl.innerHTML = '';
  partes.slice(1).forEach(p => {
    const para = document.createElement('p');
    para.textContent = p;
    restoEl.appendChild(para);
  });

  // Configuração dos botões de navegação da teoria
  const navPrev = document.getElementById('theory-nav-prev');
  const navNext = document.getElementById('theory-nav-next');
  if (idx > 0) {
    navPrev.disabled = false;
    document.getElementById('theory-nav-prev-name').textContent = teorias[idx - 1].nome;
  } else {
    navPrev.disabled = true;
    document.getElementById('theory-nav-prev-name').textContent = '—';
  }
  if (idx < teorias.length - 1) {
    navNext.disabled = false;
    document.getElementById('theory-nav-next-name').textContent = teorias[idx + 1].nome;
  } else {
    navNext.disabled = true;
    document.getElementById('theory-nav-next-name').textContent = '—';
  }

  document.getElementById('overlay-discipline').classList.remove('active');
  document.getElementById('overlay-theory').classList.add('active');
  document.body.style.overflow = 'hidden';
  document.getElementById('overlay-theory').scrollTop = 0;
}

/**
 * Navega entre teorias da mesma disciplina (-1 para anterior, +1 para próxima).
 * @param {number} delta - Deslocamento na lista.
 */
function navTheory(delta) {
  const teorias = TEORIAS[currentDiscipline] || [];
  const newIdx = currentTheoryIdx + delta;
  if (newIdx >= 0 && newIdx < teorias.length) {
    openTheory(newIdx);
  }
}

/**
 * Retorna da ficha da teoria para a aba de teorias no modal da disciplina.
 */
function backToDisciplineFromTheory() {
  if (currentDiscipline) {
    document.getElementById('overlay-theory').classList.remove('active');
    setTimeout(() => {
      openDiscipline(currentDiscipline);
      setView('theories', false);
    }, 100);
  }
}

/* ============================================================================
   9. FECHAMENTO DE MODAIS E ATALHOS DE TECLADO
   ============================================================================ */

/**
 * Fecha todos os modais/overlays abertos na tela.
 * @param {boolean} [restoreScroll=true] - Se deve reativar a rolagem da página.
 */
function closeAll(restoreScroll = true) {
  document.querySelectorAll('.overlay').forEach(o => o.classList.remove('active'));
  if (restoreScroll) document.body.style.overflow = '';
}

// Event Listeners para navegação e fechamento via teclado (Escape, Seta Esquerda, Seta Direita)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAll();
  const authorActive = document.getElementById('overlay-author').classList.contains('active');
  const theoryActive = document.getElementById('overlay-theory').classList.contains('active');
  if (e.key === 'ArrowLeft') {
    if (authorActive) navAuthor(-1);
    else if (theoryActive) navTheory(-1);
  }
  if (e.key === 'ArrowRight') {
    if (authorActive) navAuthor(1);
    else if (theoryActive) navTheory(1);
  }
});

/* ============================================================================
   10. ALTERNADOR DE MODOS DE VISUALIZAÇÃO (Matriz / Influências / Cronologia)
   ============================================================================ */

/**
 * Alterna a exibição principal da página entre 'matrix', 'graph' e 'timeline'.
 * @param {string} mode - Modo selecionado.
 */
function setMode(mode) {
  currentMode = mode;
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
  const matrix = document.getElementById('view-matrix');
  const graph = document.getElementById('view-graph');
  const timeline = document.getElementById('view-timeline');
  const legend = document.getElementById('legend-block');

  matrix.style.display = (mode === 'matrix') ? '' : 'none';
  graph.style.display = (mode === 'graph') ? '' : 'none';
  timeline.style.display = (mode === 'timeline') ? '' : 'none';
  legend.style.display = (mode === 'matrix') ? '' : 'none';

  // Constrói o grafo ou cronologia sob demanda na primeira exibição
  if (mode === 'graph' && !graph.dataset.built) {
    buildGraph();
    graph.dataset.built = 'true';
  }
  if (mode === 'timeline' && !timeline.dataset.built) {
    buildTimeline();
    timeline.dataset.built = 'true';
  }
}

/* ============================================================================
   11. VISUALIZAÇÃO: GRAFO DE INFLUÊNCIAS (SVG)
   ============================================================================ */

/**
 * Desenha o grafo em SVG com clusters de disciplinas, nós de autores e setas de influência.
 */
function buildGraph() {
  const svg = document.getElementById('graph-svg');
  if (!svg) return;
  svg.innerHTML = '';

  // 1. Coleta conexões/influências mapeadas entre autores
  const allEdges = [];
  const referencedNames = new Set();
  for (const [disc, lista] of Object.entries(AUTORES)) {
    lista.forEach(a => {
      if (a.influencias && a.influencias.length) {
        a.influencias.forEach(infl => {
          if (findAuthorByName(infl)) {
            allEdges.push({ from: infl, to: a.nome });
            referencedNames.add(infl);
            referencedNames.add(a.nome);
          }
        });
      }
    });
  }

  // 2. Agrupa autores por disciplina mantendo apenas os referenciados
  const byDisc = {};
  for (const [disc, lista] of Object.entries(AUTORES)) {
    const f = lista.filter(a => referencedNames.has(a.nome));
    if (f.length > 0) byDisc[disc] = f.sort((a, b) =>
      (parseAuthorYear(a.periodo) || 0) - (parseAuthorYear(b.periodo) || 0)
    );
  }

  // 3. Ordem conceitual preferencial das disciplinas para disposição dos clusters
  const ordemPreferencial = [
    "Psicofísica",
    "Psicologia cognitiva",
    "Análise Experimental do Comportamento",
    "Economia comportamental",
    "Psicologia social",
    "Antropologia",
    "Etologia",
    "Neurociência",
    "Sociolinguística",
  ];
  const discsOrdered = ordemPreferencial.filter(d => byDisc[d]);
  Object.keys(byDisc).forEach(d => {
    if (!discsOrdered.includes(d)) discsOrdered.push(d);
  });

  // 4. Parâmetros de dimensão dos clusters
  const NODE_W = 122, NODE_H = 28;
  const NODE_GAP_X = 14, NODE_GAP_Y = 16;
  const CLUSTER_PAD_X = 18, CLUSTER_PAD_Y = 32;
  const CLUSTER_GAP = 28;

  function clusterDims(n) {
    const cols = n <= 4 ? Math.min(n, 2) : (n <= 9 ? 3 : 4);
    const rows = Math.ceil(n / cols);
    const w = cols * NODE_W + (cols - 1) * NODE_GAP_X + CLUSTER_PAD_X * 2;
    const h = rows * NODE_H + (rows - 1) * NODE_GAP_Y + CLUSTER_PAD_Y + 12;
    return { cols, rows, w, h };
  }

  // 5. Layout dos clusters em linhas com quebra automática
  const SVG_W_TARGET = svg.clientWidth || svg.parentElement.clientWidth || 1200;
  const W = Math.max(SVG_W_TARGET, 1100);
  let curX = 16, curY = 16, rowMaxH = 0, totalH = 0;
  const clusterRects = [];

  discsOrdered.forEach(disc => {
    const autores = byDisc[disc];
    const dims = clusterDims(autores.length);
    if (curX + dims.w > W && curX > 16) {
      curX = 16;
      curY += rowMaxH + CLUSTER_GAP;
      rowMaxH = 0;
    }
    clusterRects.push({ disc, x: curX, y: curY, ...dims, autores });
    curX += dims.w + CLUSTER_GAP;
    rowMaxH = Math.max(rowMaxH, dims.h);
    totalH = Math.max(totalH, curY + dims.h);
  });

  const H = totalH + 32;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMin meet');
  svg.style.height = H + 'px';

  // 6. Calcula a posição individual de cada autor dentro do seu cluster
  const positions = {};
  clusterRects.forEach(c => {
    c.autores.forEach((autor, i) => {
      const col = i % c.cols;
      const row = Math.floor(i / c.cols);
      const x = c.x + CLUSTER_PAD_X + col * (NODE_W + NODE_GAP_X);
      const y = c.y + CLUSTER_PAD_Y + row * (NODE_H + NODE_GAP_Y);
      positions[autor.nome] = { x, y, w: NODE_W, h: NODE_H, disciplina: c.disc };
    });
  });

  // 7. Definição das pontas de seta no elemento <defs>
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5"
            markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" class="arrow-head"/>
    </marker>
    <marker id="arrow-hl" viewBox="0 0 10 10" refX="8" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" class="arrow-head-highlight"/>
    </marker>
  `;
  svg.appendChild(defs);

  // 8. Desenha os fundos retangulares de cada cluster
  const clustersGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  clustersGroup.setAttribute('id', 'clusters');
  svg.appendChild(clustersGroup);

  clusterRects.forEach(c => {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', c.x);
    rect.setAttribute('y', c.y);
    rect.setAttribute('width', c.w);
    rect.setAttribute('height', c.h);

    let col = '';
    for (const [key, discs] of Object.entries(MATRIZ)) {
      if (discs.includes(c.disc)) {
        col = ['A', 'B', 'C', 'D'][parseInt(key.split(',')[1])];
        break;
      }
    }
    rect.setAttribute('class', 'cluster-rect' + (col ? ' col-' + col : ''));
    clustersGroup.appendChild(rect);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', c.x + 12);
    label.setAttribute('y', c.y + 18);
    label.setAttribute('class', 'cluster-label');
    label.textContent = c.disc;
    clustersGroup.appendChild(label);
  });

  // 9. Desenha as arestas curvas (Curvas Bézier)
  const edgeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  edgeGroup.setAttribute('id', 'edges');
  svg.appendChild(edgeGroup);

  const edgeElements = [];
  allEdges.forEach(e => {
    const p1 = positions[e.from];
    const p2 = positions[e.to];
    if (!p1 || !p2) return;

    const c1 = { x: p1.x + p1.w / 2, y: p1.y + p1.h / 2 };
    const c2 = { x: p2.x + p2.w / 2, y: p2.y + p2.h / 2 };
    const dx = c2.x - c1.x;
    const dy = c2.y - c1.y;

    let sx, sy, tx, ty;
    if (Math.abs(dx) > Math.abs(dy)) {
      sx = c1.x + (dx > 0 ? p1.w / 2 : -p1.w / 2);
      sy = c1.y;
      tx = c2.x + (dx > 0 ? -p2.w / 2 : p2.w / 2);
      ty = c2.y;
    } else {
      sx = c1.x;
      sy = c1.y + (dy > 0 ? p1.h / 2 : -p1.h / 2);
      tx = c2.x;
      ty = c2.y + (dy > 0 ? -p2.h / 2 : p2.h / 2);
    }

    const cx1 = sx + (tx - sx) * 0.5;
    const cy1 = sy;
    const cx2 = tx - (tx - sx) * 0.5;
    const cy2 = ty;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${sx},${sy} C ${cx1},${cy1} ${cx2},${cy2} ${tx},${ty}`);
    path.setAttribute('class', 'edge');
    path.setAttribute('marker-end', 'url(#arrow)');
    path.dataset.from = e.from;
    path.dataset.to = e.to;
    edgeGroup.appendChild(path);
    edgeElements.push(path);
  });

  // 10. Desenha os nós de cada autor
  const nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  nodesGroup.setAttribute('id', 'nodes');
  svg.appendChild(nodesGroup);

  Object.entries(positions).forEach(([nome, pos]) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'node-group');
    g.dataset.name = nome;
    g.style.cursor = 'pointer';

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', pos.x);
    rect.setAttribute('y', pos.y);
    rect.setAttribute('width', pos.w);
    rect.setAttribute('height', pos.h);
    rect.setAttribute('class', 'node-bg');
    g.appendChild(rect);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', pos.x + pos.w / 2);
    label.setAttribute('y', pos.y + pos.h / 2 + 1);
    label.setAttribute('class', 'node-label');
    label.textContent = compactName(nome);
    g.appendChild(label);

    g.addEventListener('click', () => openAuthorByName(nome));
    g.addEventListener('mouseenter', () => highlightNode(nome));
    g.addEventListener('mouseleave', () => clearHighlight());

    nodesGroup.appendChild(g);
  });

  svg._edges = edgeElements;
  svg._nodes = nodesGroup;
}

/**
 * Formata um nome longo de autor para um formato mais compacto no nó do grafo.
 * @param {string} name - Nome completo.
 * @returns {string} Nome abreviado/compacto.
 */
function compactName(name) {
  if (name.includes('&')) return name;
  const parts = name.split(' ');
  if (parts.length <= 2) return name;
  if (name.includes(' y ')) return parts.slice(-3).join(' ');
  if (name.includes(' von ') || name.includes(' van ') || name.includes(' de ')) {
    const idx = parts.findIndex(p => ['von', 'van', 'de'].includes(p.toLowerCase()));
    return parts.slice(idx).join(' ');
  }
  if (parts[0].endsWith('.')) return name;
  return `${parts[0][0]}. ${parts.slice(-1).join(' ')}`;
}

/**
 * Destaca as conexões de um nó ao passar o mouse.
 * @param {string} name - Nome do autor focalizado.
 */
function highlightNode(name) {
  const svg = document.getElementById('graph-svg');
  if (!svg) return;
  const edges = svg._edges || [];
  const nodes = svg._nodes;
  if (!nodes) return;

  const connected = new Set([name]);
  edges.forEach(e => {
    const isConnected = e.dataset.from === name || e.dataset.to === name;
    if (isConnected) {
      if (e.dataset.from === name) connected.add(e.dataset.to);
      if (e.dataset.to === name) connected.add(e.dataset.from);
      e.classList.add('highlight');
      e.classList.remove('dimmed');
      e.setAttribute('marker-end', 'url(#arrow-hl)');
    } else {
      e.classList.remove('highlight');
      e.classList.add('dimmed');
      e.setAttribute('marker-end', 'url(#arrow)');
    }
  });

  nodes.querySelectorAll('.node-group').forEach(g => {
    const n = g.dataset.name;
    g.classList.toggle('highlight', n === name);
    g.classList.toggle('dimmed', !connected.has(n));
  });
}

/**
 * Limpa o destaque de conexões e restaura a opacidade normal do grafo.
 */
function clearHighlight() {
  const svg = document.getElementById('graph-svg');
  if (!svg) return;
  (svg._edges || []).forEach(e => {
    e.classList.remove('highlight');
    e.classList.remove('dimmed');
    e.setAttribute('marker-end', 'url(#arrow)');
  });
  if (svg._nodes) {
    svg._nodes.querySelectorAll('.node-group').forEach(g => {
      g.classList.remove('highlight');
      g.classList.remove('dimmed');
    });
  }
}

/* ============================================================================
   12. VISUALIZAÇÃO: CRONOLOGIA / LINHA DO TEMPO
   ============================================================================ */

/**
 * Extrai o ano de nascimento a partir do campo `periodo`.
 * @param {string} periodo - Ex: "1849–1936"
 * @returns {number|null}
 */
function parseAuthorYear(periodo) {
  const m = (periodo || '').match(/(\d{4})/);
  return m ? parseInt(m[1]) : null;
}

/**
 * Extrai o ano de falecimento (ou ano atual se for "presente").
 * @param {string} periodo - Ex: "1928–presente"
 * @returns {number|null}
 */
function parseAuthorDeath(periodo) {
  const m = (periodo || '').match(/(\d{4})\s*[–\-]\s*(\d{4}|presente)/);
  if (!m) return null;
  return m[2] === 'presente' ? new Date().getFullYear() : parseInt(m[2]);
}

/**
 * Constrói a visualização da linha do tempo com barras de vida, avatares e marcas de obras.
 */
function buildTimeline() {
  const container = document.getElementById('timeline-container');
  if (!container) return;
  container.innerHTML = '';

  const byDisc = {};
  for (const [disc, lista] of Object.entries(AUTORES)) {
    const valid = lista.filter(a => parseAuthorYear(a.periodo));
    if (valid.length === 0) continue;
    byDisc[disc] = valid;
  }

  let yearMin = Infinity, yearMax = -Infinity;
  Object.values(byDisc).flat().forEach(a => {
    const y1 = parseAuthorYear(a.periodo);
    const y2 = parseAuthorDeath(a.periodo) || new Date().getFullYear();
    if (y1 < yearMin) yearMin = y1;
    if (y2 > yearMax) yearMax = y2;
  });
  yearMin = Math.floor(yearMin / 20) * 20;
  yearMax = Math.ceil(yearMax / 20) * 20;
  const totalYears = yearMax - yearMin;

  const PX_PER_YEAR = 7;
  const trackWidth = totalYears * PX_PER_YEAR;
  const yearToX = y => (y - yearMin) * PX_PER_YEAR;

  const ordemPreferencial = [
    "Psicofísica",
    "Psicologia cognitiva",
    "Análise Experimental do Comportamento",
    "Economia comportamental",
    "Psicologia social",
    "Antropologia",
    "Etologia",
    "Neurociência",
    "Sociolinguística",
  ];
  const discsOrdered = ordemPreferencial.filter(d => byDisc[d]);
  Object.keys(byDisc).forEach(d => {
    if (!discsOrdered.includes(d)) discsOrdered.push(d);
  });

  const inner = document.createElement('div');
  inner.className = 'timeline-scroll-inner';
  inner.style.width = (180 + trackWidth + 200) + 'px';
  container.appendChild(inner);

  // Eixo de tempo superior
  const axisWrapper = document.createElement('div');
  axisWrapper.style.cssText = `
    display: grid;
    grid-template-columns: 180px 1fr;
    position: sticky;
    top: 0;
    z-index: 6;
    background: var(--paper-pure);
    border-bottom: 1px solid var(--ink-9);
  `;
  const axisLeftPad = document.createElement('div');
  axisLeftPad.style.cssText = `
    background: var(--paper-pure);
    border-right: 1px solid var(--ink-2);
    padding: 12px 16px;
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.12em;
    color: var(--ink-7);
    text-transform: uppercase;
  `;
  axisLeftPad.textContent = '↓ Disciplinas / Tempo →';
  axisWrapper.appendChild(axisLeftPad);

  const axis = document.createElement('div');
  axis.className = 'timeline-axis';
  axis.style.cssText = `
    position: relative;
    height: 40px;
    margin-left: 0;
    border-bottom: none;
    width: ${trackWidth + 200}px;
  `;
  for (let y = yearMin; y <= yearMax; y += 20) {
    const tick = document.createElement('div');
    tick.className = 'timeline-tick';
    tick.style.left = yearToX(y) + 'px';
    tick.textContent = y;
    axis.appendChild(tick);
  }
  axisWrapper.appendChild(axis);
  inner.appendChild(axisWrapper);

  // Raias horizontais por disciplina
  discsOrdered.forEach((disc) => {
    const block = document.createElement('div');
    block.className = 'timeline-discipline';

    const labelCell = document.createElement('div');
    labelCell.className = 'timeline-discipline-name';
    labelCell.innerHTML = `
      <div class="td-name">${disc}</div>
      <div class="td-count">${String(byDisc[disc].length).padStart(2, '0')} autores</div>
    `;
    block.appendChild(labelCell);

    const track = document.createElement('div');
    track.className = 'timeline-track';
    track.style.width = (trackWidth + 200) + 'px';

    for (let y = yearMin; y <= yearMax; y += 20) {
      const grid = document.createElement('div');
      grid.className = 'timeline-grid-line';
      grid.style.left = yearToX(y) + 'px';
      grid.style.height = '100%';
      track.appendChild(grid);
    }

    const autores = [...byDisc[disc]].sort((a, b) =>
      parseAuthorYear(a.periodo) - parseAuthorYear(b.periodo)
    );

    const SUBLANE_HEIGHT = 44;
    const ESTIMATED_NAME_PX = 130;
    const lanes = [];

    autores.forEach(autor => {
      const y1 = parseAuthorYear(autor.periodo);
      const y2 = parseAuthorDeath(autor.periodo) || new Date().getFullYear();
      const startX = yearToX(y1) - 16;
      const endX = yearToX(y2) + ESTIMATED_NAME_PX;

      let laneIdx = lanes.findIndex(end => end + 12 < startX);
      if (laneIdx === -1) {
        laneIdx = lanes.length;
        lanes.push(endX);
      } else {
        lanes[laneIdx] = endX;
      }
      autor._lane = laneIdx;
      autor._startX = yearToX(y1);
      autor._endX = yearToX(y2);
    });

    track.style.minHeight = (lanes.length * SUBLANE_HEIGHT + 16) + 'px';

    autores.forEach(autor => {
      const lane = autor._lane;

      const row = document.createElement('div');
      row.className = 'timeline-author-row';
      row.style.top = (lane * SUBLANE_HEIGHT + 6) + 'px';
      row.style.left = '0';
      row.style.right = '0';
      row.style.position = 'absolute';
      row.style.height = SUBLANE_HEIGHT + 'px';

      // Barra de extensão de vida
      const bar = document.createElement('div');
      bar.className = 'timeline-life-bar';
      bar.style.left = autor._startX + 'px';
      bar.style.width = Math.max(2, autor._endX - autor._startX) + 'px';
      bar.title = `${autor.nome} (${autor.periodo})`;
      row.appendChild(bar);

      // Avatar do autor
      const avatar = document.createElement('div');
      avatar.className = 'timeline-avatar';
      avatar.style.left = autor._startX + 'px';
      avatar.title = `${autor.nome} (${autor.periodo})`;

      const initials = (autor.nome || '').split(/\s+/)
        .filter(p => /^[A-Za-zÀ-ÿ]/.test(p))
        .slice(0, 2).map(p => p[0].toUpperCase()).join('');
      avatar.textContent = initials || '?';
      if (autor.foto) {
        const img = new Image();
        img.onload = () => {
          avatar.textContent = '';
          avatar.appendChild(img);
        };
        img.src = `fotos/${autor.foto}`;
      }
      row.appendChild(avatar);

      // Pontos com marcos de publicações de obras
      if (autor.obras && autor.obras.length) {
        autor.obras.forEach(o => {
          const oy = parseInt((o.ano || '').match(/\d{4}/)?.[0]);
          if (!oy || oy < yearMin || oy > yearMax) return;
          const dot = document.createElement('div');
          dot.className = 'timeline-work-dot';
          dot.style.left = yearToX(oy) + 'px';
          dot.title = `${o.ano} — ${o.titulo}`;
          row.appendChild(dot);
        });
      }

      // Rótulo com nome e período do autor
      const nameEl = document.createElement('div');
      nameEl.className = 'timeline-author-name';
      nameEl.style.left = (autor._startX + 22) + 'px';
      nameEl.innerHTML = `${autor.nome}<span class="timeline-author-period">${autor.periodo}</span>`;
      row.appendChild(nameEl);

      row.onclick = () => {
        const f = findAuthorByName(autor.nome);
        if (f) { currentDiscipline = f.disciplina; openAuthor(f.idx); }
      };

      track.appendChild(row);
    });

    block.appendChild(track);
    inner.appendChild(block);
  });
}

/* ============================================================================
   13. INICIALIZAÇÃO DA APLICAÇÃO
   ============================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  buildMatrix();
});
// Fallback para execução caso o script seja carregado após o evento DOMContentLoaded
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  buildMatrix();
}
