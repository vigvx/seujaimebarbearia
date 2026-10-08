/* ARQUIVO: CAMADA DE REGRAS. Funções puras: não tocam na tela nem leem o DOM. */
const Regras = {
  somenteDigitos(t) { return String(t || "").replace(/\D/g, ""); },
  formatarMoeda(v) { return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); },
  formatarTelefone(t) {
    const d = Regras.somenteDigitos(t);
    const m = d.match(/^55(\d{2})(\d{4,5})(\d{4})$/);
    return m ? "(" + m[1] + ") " + m[2] + "-" + m[3] : "";
  },
  linkWhatsapp(numero, mensagem) {
    const d = Regras.somenteDigitos(numero);
    if (!d) return "";
    return "https://wa.me/" + d + (mensagem ? "?text=" + encodeURIComponent(mensagem) : "");
  },
  /* d = { servico, barbeiro, quando } (todos opcionais) */
  mensagemAgendar(nomeBarbearia, d) {
    d = d || {}; const p = [];
    if (d.servico) p.push("Serviço: " + d.servico);
    if (d.barbeiro) p.push("Barbeiro: " + d.barbeiro);
    if (d.quando) p.push("Quando: " + d.quando);
    return "Olá, " + nomeBarbearia + "! Quero agendar um horário." + (p.length ? " " + p.join(". ") + "." : "") + " Quais horários vocês têm?";
  },
  /* Soma dos preços dos serviços de um combo; 0 se algum não tiver preço. */
  somaPrecos(ids, servicos) {
    const l = (ids || []).map(id => (servicos || []).find(s => s.id === id));
    return l.length && l.every(s => s && s.preco) ? l.reduce((a, s) => a + s.preco, 0) : 0;
  },
  cortesParaCompensar(preco, precoRef) { return preco > 0 && precoRef > 0 ? Math.ceil(preco / precoRef) : 0; },
  faixaPreco(servicos) {
    const v = (servicos || []).map(s => s.preco).filter(Boolean);
    return v.length ? "R$" + Math.min(...v) + "-R$" + Math.max(...v) : "";
  },
  resumoPrecos(servicos) {
    return (servicos || []).filter(s => s.preco).map(s => s.nome + ": " + Regras.formatarMoeda(s.preco) + (s.precoSufixo ? " " + s.precoSufixo : "")).join(" · ");
  },
  formatarNota(n) { return Number(n).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }); },
  textoAvaliacoes(q) { return Number(q) === 1 ? "1 avaliação" : q + " avaliações"; },
  /* Transforma códigos (@precos, @plano...) em texto montado a partir dos dados; devolve "" se não houver como montar. */
  resolverResposta(r, c) {
    if (!r) return "";
    const s = c.servicos || [];
    if (r === "@agendar") {
      const on = c.agendamentoOnline && c.agendamentoOnline.link;
      return (on ? "Você pode agendar online, no botão “" + (c.agendamentoOnline.rotulo || "Agendar online") + "”, ou pelo WhatsApp. " : "Pelo WhatsApp. ") + "No WhatsApp, escolha serviço, barbeiro e quando prefere (se quiser), envie a mensagem e a gente responde com os horários disponíveis.";
    }
    if (r === "@precos") { const t = Regras.resumoPrecos(s); return t ? t + "." : ""; }
    if (r === "@funcionamento") {
      if (Regras.temHorarios(c.horarios)) return "Veja a tabela de horários na seção Horários e localização.";
      const t = Regras.textoFuncionamento(c.funcionamento);
      return t ? "Atendemos das " + t + ". Para confirmar os dias, é só chamar no WhatsApp." : "";
    }
    if (r === "@endereco") { const t = Regras.enderecoTexto(c.endereco); return t ? "Ficamos na " + t + ". Use o botão “Como chegar” para abrir o mapa." : ""; }
    if (r === "@plano") {
      const p = s.find(x => x.comparaCom); if (!p || !p.preco) return "";
      const ref = s.find(x => x.id === p.comparaCom), n = ref ? Regras.cortesParaCompensar(p.preco, ref.preco) : 0;
      const inclui = (p.inclui || []).map(x => x.charAt(0).toLowerCase() + x.slice(1)).join("; ");
      return "Você paga " + Regras.formatarMoeda(p.preco) + " por mês." + (inclui ? " Inclui: " + inclui + "." : "") + (n > 1 ? " O plano já se paga com " + n + " cortes no mês." : "") + " Para assinar, é só chamar no WhatsApp.";
    }
    return r;
  },
  montarFaq(c) {
    return (c.faq || []).map(f => ({ pergunta: f.pergunta, resposta: Regras.resolverResposta(f.resposta, c) })).filter(f => f.pergunta && f.resposta);
  },
  enderecoTexto(e) {
    if (!e || !e.rua) return "";
    const partes = [e.rua, e.bairro, [e.cidade, e.estado].filter(Boolean).join(", "), e.cep];
    return partes.filter(Boolean).join(" · ");
  },
  linkMapa(e) {
    const t = [e.rua, e.bairro, e.cidade, e.estado, e.cep].filter(Boolean).join(", ");
    return t ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(t) : "";
  },
  temHorarios(h) { return !!h && Object.keys(h).some(k => Array.isArray(h[k]) && h[k].length === 2); },
  paraMinutos(hhmm) { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; },
  /* Retorna { aberto: bool, texto: string } ou null se não há horários. */
  estadoAgora(horarios, agora) {
    if (!Regras.temHorarios(horarios)) return null;
    const dia = agora.getDay(), min = agora.getHours() * 60 + agora.getMinutes();
    const hoje = horarios[dia];
    if (hoje && min >= Regras.paraMinutos(hoje[0]) && min < Regras.paraMinutos(hoje[1])) {
      return { aberto: true, texto: "Aberto agora · fecha às " + hoje[1] };
    }
    for (let i = 0; i < 8; i++) {
      const d = (dia + i) % 7, h = horarios[d];
      if (!h) continue;
      if (i === 0 && min >= Regras.paraMinutos(h[0])) continue;
      const quando = i === 0 ? "" : i === 1 ? "amanhã, " : Regras.nomeDia(d).toLowerCase() + ", ";
      return { aberto: false, texto: "Fechado, abre " + quando + "às " + h[0] };
    }
    return null;
  },
  formatarHora(hhmm) { const [h, m] = hhmm.split(":").map(Number); return m ? h + "h" + String(m).padStart(2, "0") : h + "h"; },
  textoFuncionamento(f) { return f && f.abertura && f.fechamento ? Regras.formatarHora(f.abertura) + " às " + Regras.formatarHora(f.fechamento) : ""; },
  nomeDia(i) { return ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"][i]; },
  filtrarGaleria(fotos, categoria) { return categoria === "todos" ? fotos : fotos.filter(f => f.categoria === categoria); },
  categoriasComFotos(fotos, nomes) { return Object.keys(nomes).filter(c => fotos.some(f => f.categoria === c)); },
  jsonLd(c) {
    const o = { "@context": "https://schema.org", "@type": "BarberShop", name: c.nome };
    if (c.slogan) o.slogan = c.slogan;
    if (c.instagram) o.sameAs = [c.instagram];
    const tel = Regras.somenteDigitos(c.whatsapp);
    if (tel) o.telephone = "+" + tel;
    if (c.endereco && c.endereco.rua) {
      o.address = { "@type": "PostalAddress", streetAddress: c.endereco.rua, addressLocality: c.endereco.cidade, addressRegion: c.endereco.estado, addressCountry: "BR" };
      if (c.endereco.cep) o.address.postalCode = c.endereco.cep;
    }
    const specs = [];
    Object.keys(c.horarios || {}).forEach(d => { const h = c.horarios[d]; if (Array.isArray(h) && h.length === 2) specs.push({ "@type": "OpeningHoursSpecification", dayOfWeek: Regras.nomeDia(d) === "Domingo" ? "Sunday" : ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d - 1], opens: h[0], closes: h[1] }); });
    if (specs.length) o.openingHoursSpecification = specs;
    o.image = (c.fachada && c.fachada.arquivo) || "img/og-imagem.jpg";
    if (c.agendamentoOnline && c.agendamentoOnline.link) o.potentialAction = { "@type": "ReserveAction", name: c.agendamentoOnline.rotulo || "Agendar online", target: c.agendamentoOnline.link };
    const fp = Regras.faixaPreco(c.servicos); if (fp) o.priceRange = fp;
    const mapa = Regras.linkMapa(c.endereco || {}); if (mapa) o.hasMap = mapa;
    const g = c.google || {};
    if (g.nota && g.quantidade) o.aggregateRating = { "@type": "AggregateRating", ratingValue: String(g.nota), reviewCount: String(g.quantidade) };
    return o;
  },
  jsonLdFaq(faq) {
    return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(f => ({ "@type": "Question", name: f.pergunta, acceptedAnswer: { "@type": "Answer", text: f.resposta } })) };
  }
};
