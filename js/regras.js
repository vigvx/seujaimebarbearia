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
  mensagemAgendar(nomeBarbearia, servico) {
    return "Olá, " + nomeBarbearia + "! Quero agendar" + (servico ? " " + servico : " um horário") + ". Quais horários vocês têm?";
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
    return o;
  }
};
