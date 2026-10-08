/* ARQUIVO: MAESTRO. Lê conteudo.js, chama regras.js, manda interface.js desenhar e liga os eventos. */
(function () {
  const c = CONTEUDO;
  const fmt = Regras.formatarMoeda;
  const zap = d => Regras.linkWhatsapp(c.whatsapp, Regras.mensagemAgendar(c.nome, d));
  const base = c.servicos || [];

  Interface.desenharAviso(c.aviso);
  Interface.ligarLinksZap(zap({}));
  Interface.ligarLinksOnline(c.agendamentoOnline && c.agendamentoOnline.link, c.agendamentoOnline && c.agendamentoOnline.rotulo);
  Interface.desenharContatos(Regras.formatarTelefone(c.whatsapp), c.instagram, c.instagramUsuario);

  const servicos = base.map(s => {
    const soma = s.compoe ? Regras.somaPrecos(s.compoe, base) : 0;
    const ref = s.comparaCom ? base.find(x => x.id === s.comparaCom) : null;
    const n = ref ? Regras.cortesParaCompensar(s.preco, ref.preco) : 0;
    const combo = s.preco && soma > s.preco;
    return Object.assign({}, s, {
      precoTexto: s.preco ? fmt(s.preco) : "",
      precoDeTexto: combo ? fmt(soma) : "",
      economiaTexto: combo ? "Economize " + fmt(soma - s.preco) : "",
      extra: n > 1 ? "Se paga com " + n + " cortes no mês." : "",
      inclui: s.compoe ? s.compoe.map(id => (base.find(x => x.id === id) || {}).nome).filter(Boolean) : s.inclui,
      link: zap({ servico: s.nome })
    });
  });
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

  const g = c.google || {};
  Interface.desenharDepoimentos(c.depoimentos || [], {
    notaTexto: g.nota ? Regras.formatarNota(g.nota) : "",
    quantidadeTexto: g.nota && g.quantidade ? Regras.textoAvaliacoes(g.quantidade) : "",
    link: g.link, linkAvaliar: g.linkAvaliar
  });
  const faq = Regras.montarFaq(c);
  Interface.desenharFaq(faq);

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
  Interface.desenharFachada(c.fachada);

  Interface.desenharAgendador(base.map(s => s.nome), (c.equipe || []).map(p => p.nome), (c.agendamento && c.agendamento.quando) || []);
  Interface.ligarAgendador(d => { const l = zap(d); if (l) document.getElementById("botaoAgendar").href = l; });

  Interface.injetarJsonLd(Regras.jsonLd(c));
  if (faq.length) Interface.injetarJsonLd(Regras.jsonLdFaq(faq));
  Interface.ligarMenu();
  Interface.ligarDestaque();
  Interface.ligarRevelar();
  clearTimeout(window.__semJs);
  pronto = true;
})();
