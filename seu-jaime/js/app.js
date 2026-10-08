/* ARQUIVO: MAESTRO. Lê conteudo.js, chama regras.js, manda interface.js desenhar e liga os eventos. */
(function () {
  const c = CONTEUDO;
  const msg = s => Regras.mensagemAgendar(c.nome, s);
  const zap = s => Regras.linkWhatsapp(c.whatsapp, msg(s));

  Interface.ligarLinksZap(zap(""));
  Interface.desenharContatos(Regras.formatarTelefone(c.whatsapp), c.instagram, c.instagramUsuario);

  const servicos = (c.servicos || []).map(s => Object.assign({}, s, {
    precoTexto: s.preco ? Regras.formatarMoeda(s.preco) : "",
    link: zap(s.nome.toLowerCase() === "plano mensal" ? "o Plano Mensal" : "um " + s.nome.toLowerCase())
  }));
  Interface.desenharServicos(servicos);
  Interface.desenharSobre(c.sobre, c.equipe || []);

  let ativa = "todos";
  const pintarGaleria = () => {
    const ids = Regras.categoriasComFotos(c.galeria, c.categoriasGaleria);
    const lista = [{ id: "todos", nome: "Todos" }].concat(ids.map(id => ({ id, nome: c.categoriasGaleria[id] })));
    Interface.desenharFiltros(lista, ativa, id => { ativa = id; pintarGaleria(); });
    Interface.desenharGaleria(Regras.filtrarGaleria(c.galeria, ativa), c.categoriasGaleria, c.instagram);
    if (pronto) Interface.ligarRevelar(document.getElementById("grade"));
  };
  let pronto = false;
  pintarGaleria();
  Interface.desenharDepoimentos(c.depoimentos || []);

  const hoje = new Date().getDay();
  const linhas = Regras.temHorarios(c.horarios) ? [1, 2, 3, 4, 5, 6, 0].map(d => ({
    dia: Regras.nomeDia(d), hoje: d === hoje,
    horario: c.horarios[d] ? c.horarios[d][0] + " às " + c.horarios[d][1] : "Fechado"
  })) : [];
  const funcionamento = Regras.textoFuncionamento(c.funcionamento);
  Interface.desenharHorarios(linhas, funcionamento);
  Interface.desenharFuncionamentoRodape(funcionamento);
  Interface.desenharSelo(Regras.estadoAgora(c.horarios, new Date()));
  Interface.desenharLocal(Regras.enderecoTexto(c.endereco), Regras.linkMapa(c.endereco));
  Interface.injetarJsonLd(Regras.jsonLd(c));
  Interface.ligarMenu();
  Interface.ligarDestaque();
  Interface.ligarRevelar();
  clearTimeout(window.__semJs);
  pronto = true;
})();
