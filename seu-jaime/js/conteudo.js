/* ARQUIVO: CAMADA DE DADOS. Único lugar para editar textos, serviços, fotos, horários e contatos.
   Campo vazio ("" , null ou []) = a interface não mostra aquele bloco. */
const CONTEUDO = {
  nome: "Seu Jaime Barbearia",
  slogan: "Transformando visual, elevando estilo!",
  instagram: "https://www.instagram.com/seujaimebarbearia.oficial",
  instagramUsuario: "@seujaimebarbearia.oficial",
  whatsapp: "5511959403747", // DDI + DDD + número, só dígitos
  endereco: { rua: "Rua Lomar, 3", bairro: "Jardim Ipanema", cidade: "São Paulo", estado: "SP", cep: "" },
  /* Horários por dia (0 = domingo ... 6 = sábado). Ex.: 1: ["09:00", "19:00"]. Dia sem entrada = fechado/não informado. */
  horarios: {}, // por dia da semana; ainda não informado (liga a tabela e o selo "Aberto agora")
  funcionamento: { abertura: "10:00", fechamento: "19:00" },
  sobre: "Conheça quem cuida do seu visual.",
  equipe: [ // { nome, cargo, foto (caminho em img/), descricao }
    { nome: "Matheus", cargo: "Barbeiro", foto: "", descricao: "" },
    { nome: "Mizael", cargo: "Barbeiro", foto: "", descricao: "" },
    { nome: "Jaime", cargo: "Barbeiro", foto: "", descricao: "" }
  ],
  servicos: [
    { id: "corte", nome: "Corte masculino", descricao: "Degradê, social e penteado lateral.", preco: 40, duracao: "", destaque: false },
    { id: "infantil", nome: "Corte infantil", descricao: "Para os pequenos saírem estilosos.", preco: 30, duracao: "", destaque: false },
    { id: "barba", nome: "Barba", descricao: "Barba feita e alinhada.", preco: 50, duracao: "", destaque: false },
    { id: "plano", nome: "Plano Mensal", descricao: "Cortes durante o mês com preço fechado.", preco: 80, precoSufixo: "por mês", duracao: "", destaque: true }
  ],
  categoriasGaleria: { cortes: "Cortes", freestyle: "Free Style", infantil: "Infantil", espaco: "O espaço" },
  galeria: [
    { arquivo: "img/corte-01.jpg", categoria: "cortes", alt: "Corte degradê com topo penteado para trás, visto de lado", largura: 900, altura: 1008 },
    { arquivo: "img/freestyle-01.jpg", categoria: "freestyle", alt: "Free Style com desenho riscado na lateral da cabeça", largura: 900, altura: 970 },
    { arquivo: "img/espaco-01.jpg", categoria: "espaco", alt: "Cliente na cadeira, com as paredes amarelas e espelhos da barbearia ao fundo", largura: 900, altura: 1018 }
  ],
  depoimentos: [] // { nome: "", texto: "" }
};
