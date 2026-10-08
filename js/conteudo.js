/* ARQUIVO: CAMADA DE DADOS. Único lugar para editar textos, serviços, fotos, horários e contatos.
   Campo vazio ("" , null ou []) = a interface não mostra aquele bloco. */
const CONTEUDO = {
  nome: "Seu Jaime Barbearia",
  slogan: "Transformando visual, elevando estilo!",
  instagram: "https://www.instagram.com/seujaimebarbearia.oficial",
  instagramUsuario: "@seujaimebarbearia.oficial",
  whatsapp: "5511959403747", // DDI + DDD + número, só dígitos
  endereco: { rua: "Rua Lomar, 3", bairro: "Jardim Ipanema", cidade: "São Paulo", estado: "SP", cep: "" },
  /* Faixa de aviso/promoção no topo. Deixe o texto vazio para esconder. Ex.: { texto: "Segunda com 20% off", link: "" } */
  aviso: { texto: "", link: "" },
  horarios: {}, // por dia da semana; ainda não informado (liga a tabela e o selo "Aberto agora")
  funcionamento: { abertura: "10:00", fechamento: "19:00" },
  sobre: "Conheça quem cuida do seu visual.",
  equipe: [ // { nome, cargo, foto (caminho em img/), descricao }
    { nome: "Matheus", cargo: "Barbeiro", foto: "", descricao: "" },
    { nome: "Mizael", cargo: "Barbeiro", foto: "", descricao: "" },
    { nome: "Jaime", cargo: "Barbeiro", foto: "", descricao: "" }
  ],
  /* Serviços. "compoe": ids que formam um combo (o "de R$ X" e a economia saem da soma).
     "comparaCom": id usado para calcular em quantos cortes o plano se paga. "inclui": lista do que está incluso. */
  servicos: [
    { id: "corte", nome: "Corte masculino", descricao: "Degradê, social e penteado lateral.", preco: 40, duracao: "", destaque: false },
    { id: "infantil", nome: "Corte infantil", descricao: "Para os pequenos saírem estilosos.", preco: 30, duracao: "", destaque: false },
    { id: "barba", nome: "Barba", descricao: "Barba feita e alinhada.", preco: 50, duracao: "", destaque: false },
    { id: "combo", nome: "Corte + Barba", descricao: "Tudo no mesmo atendimento.", compoe: ["corte", "barba"], preco: 75, duracao: "", destaque: false },
    { id: "plano", nome: "Plano Mensal", descricao: "Assinatura mensal de cortes.", comparaCom: "corte", preco: 80, precoSufixo: "por mês", duracao: "", destaque: true,
      inclui: ["Cortes ilimitados no mês", "Qualquer barbeiro da casa", "Agendamento pelo WhatsApp"] }
  ],
  /* Agendamento online (página de agenda). Link vazio = botões "Agendar online" somem. */
  agendamentoOnline: { link: "https://www.app.frizzar.com.br/p/gelwnyg", rotulo: "Agendar online" },
  agendamento: { quando: ["Hoje", "Amanhã", "Esta semana", "Sem preferência"] },
  categoriasGaleria: { cortes: "Cortes", freestyle: "Free Style", infantil: "Infantil", espaco: "O espaço" },
  galeria: [
    { arquivo: "img/corte-01.jpg", categoria: "cortes", alt: "Corte degradê com topo penteado para trás, visto de lado", largura: 900, altura: 1008 },
    { arquivo: "img/freestyle-01.jpg", categoria: "freestyle", alt: "Free Style com desenho riscado na lateral da cabeça", largura: 900, altura: 970 },
    { arquivo: "img/espaco-01.jpg", categoria: "espaco", alt: "Cliente na cadeira, com as paredes amarelas e espelhos da barbearia ao fundo", largura: 900, altura: 1018 }
  ],
  /* Foto da fachada (liberada pelo dono). Coloque o arquivo em img/ e preencha. */
  fachada: { arquivo: "", alt: "", largura: 0, altura: 0 },
  /* Avaliações. Só preencha com dados reais. */
  google: { nota: "", quantidade: "", link: "", linkAvaliar: "" }, // nota ex.: 4.9
  depoimentos: [], // { nome: "", texto: "", origem: "Google" }
  /* Perguntas frequentes. Resposta vazia = pergunta não aparece. Códigos: @precos @funcionamento @endereco @plano */
  faq: [
    { pergunta: "Como faço para agendar?", resposta: "@agendar" },
    { pergunta: "Quanto custa?", resposta: "@precos" },
    { pergunta: "Como funciona o Plano Mensal?", resposta: "@plano" },
    { pergunta: "Qual o horário de funcionamento?", resposta: "@funcionamento" },
    { pergunta: "Onde fica a barbearia?", resposta: "@endereco" },
    { pergunta: "Vocês cortam cabelo de criança?", resposta: "Sim, temos corte infantil. É só escolher o serviço na hora de agendar." },
    { pergunta: "Quais formas de pagamento vocês aceitam?", resposta: "" },
    { pergunta: "Precisa agendar ou aceitam encaixe?", resposta: "" },
    { pergunta: "Tem estacionamento por perto?", resposta: "" },
    { pergunta: "A partir de que idade vocês atendem crianças?", resposta: "" }
  ]
};
