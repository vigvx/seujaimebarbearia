/* ARQUIVO: CAMADA DE TELA. Recebe dados prontos e desenha. Nunca decide regra.
   Todo texto entra com textContent (nunca HTML cru). */
const Interface = {
  criar(tag, classe, texto) {
    const e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texto) e.textContent = texto;
    return e;
  },
  limpar(el) { while (el.firstChild) el.removeChild(el.firstChild); },
  ligarLinksZap(linkPadrao) { document.querySelectorAll("[data-zap]").forEach(a => { if (linkPadrao) a.href = linkPadrao; else a.hidden = true; }); },
  /* Botões de agendamento online (links externos). Sem link, os botões somem. */
  ligarLinksOnline(link, rotulo) {
    document.querySelectorAll("[data-online]").forEach(a => {
      if (!link) { a.hidden = true; return; }
      a.href = link; a.target = "_blank"; a.rel = "noopener";
      const t = a.querySelector(".botao__txt"); if (t && rotulo) t.textContent = rotulo;
    });
  },
  desenharSelo(estado) {
    const s = document.getElementById("seloAberto");
    if (!estado) { s.hidden = true; return; }
    s.hidden = false; s.textContent = estado.texto;
    s.className = "selo " + (estado.aberto ? "selo--aberto" : "selo--fechado");
  },
  desenharServicos(lista) {
    const alvo = document.getElementById("listaServicos"); Interface.limpar(alvo);
    lista.forEach(s => {
      const c = Interface.criar("article", "card" + (s.destaque ? " card--destaque" : ""));
      if (s.destaque) c.appendChild(Interface.criar("span", "card__faixa", "Destaque"));
      c.appendChild(Interface.criar("h3", "", s.nome));
      if (s.descricao) c.appendChild(Interface.criar("p", "", s.descricao));
      if (s.extra) c.appendChild(Interface.criar("p", "card__extra", s.extra));
      if (s.inclui && s.inclui.length) {
        const ul = Interface.criar("ul", "card__lista");
        s.inclui.forEach(i => ul.appendChild(Interface.criar("li", "", i)));
        c.appendChild(ul);
      }
      if (s.precoTexto) {
        const p = Interface.criar("p", "card__preco");
        if (s.precoDeTexto) { p.setAttribute("aria-label", "De " + s.precoDeTexto + " por " + s.precoTexto); p.appendChild(Interface.criar("s", "card__de", s.precoDeTexto)); }
        p.appendChild(document.createTextNode(s.precoTexto));
        if (s.precoSufixo) p.appendChild(Interface.criar("small", "", " " + s.precoSufixo));
        c.appendChild(p);
        if (s.economiaTexto) c.appendChild(Interface.criar("p", "card__economia", s.economiaTexto));
      } else if (s.destaque) c.appendChild(Interface.criar("p", "card__preco", "Pergunte pelo plano"));
      if (s.duracao) c.appendChild(Interface.criar("p", "", "Duração: " + s.duracao));
      if (s.link) { const a = Interface.criar("a", "botao botao--claro", "Agendar " + s.nome.toLowerCase()); a.href = s.link; a.target = "_blank"; a.rel = "noopener"; c.appendChild(a); }
      alvo.appendChild(c);
    });
  },
  desenharSobre(texto, equipe) {
    const intro = document.getElementById("introSobre"), alvo = document.getElementById("listaEquipe");
    Interface.limpar(alvo);
    if (!texto && !equipe.length) { document.getElementById("sobre").hidden = true; return; }
    intro.textContent = texto || ""; intro.hidden = !texto; alvo.hidden = !equipe.length;
    equipe.forEach(p => {
      const fig = Interface.criar("figure", "foto foto--pessoa");
      if (p.foto) {
        const img = document.createElement("img");
        img.src = p.foto; img.alt = "Foto de " + p.nome; img.loading = "lazy"; img.decoding = "async"; img.width = 900; img.height = 1125;
        fig.appendChild(img);
      } else {
        const v = Interface.criar("div", "foto__vazia script", p.nome.charAt(0).toUpperCase()); v.setAttribute("aria-hidden", "true");
        fig.appendChild(v);
      }
      const cap = document.createElement("figcaption");
      cap.appendChild(Interface.criar("strong", "foto__nome", p.nome));
      if (p.cargo) cap.appendChild(Interface.criar("span", "foto__cargo", p.cargo));
      if (p.descricao) cap.appendChild(Interface.criar("span", "foto__desc", p.descricao));
      fig.appendChild(cap); alvo.appendChild(fig);
    });
  },
  desenharFiltros(categorias, ativa, aoEscolher) {
    const alvo = document.getElementById("filtros"); Interface.limpar(alvo);
    categorias.forEach(c => {
      const b = Interface.criar("button", "filtro", c.nome); b.type = "button";
      b.setAttribute("aria-pressed", String(c.id === ativa));
      b.addEventListener("click", () => aoEscolher(c.id));
      alvo.appendChild(b);
    });
    alvo.hidden = categorias.length < 2;
  },
  desenharGaleria(fotos, nomes, instagram) {
    const alvo = document.getElementById("grade"); Interface.limpar(alvo);
    if (!fotos.length) {
      const c = Interface.criar("div", "convite");
      c.appendChild(Interface.criar("p", "", "Veja os cortes e o clima da barbearia no nosso Instagram."));
      if (instagram) { const a = Interface.criar("a", "botao botao--claro", "Ver no Instagram"); a.href = instagram; a.target = "_blank"; a.rel = "noopener"; c.appendChild(a); }
      alvo.appendChild(c); return;
    }
    fotos.forEach(f => {
      const fig = Interface.criar("figure", "foto");
      const img = document.createElement("img");
      img.src = f.arquivo; img.alt = f.alt || ""; img.loading = "lazy"; img.decoding = "async";
      if (f.largura) img.width = f.largura; if (f.altura) img.height = f.altura;
      fig.appendChild(img);
      if (nomes[f.categoria]) fig.appendChild(Interface.criar("figcaption", "", nomes[f.categoria]));
      alvo.appendChild(fig);
    });
  },
  /* g = { notaTexto, quantidadeTexto, link, linkAvaliar } vindo pronto da regra. */
  desenharDepoimentos(lista, g) {
    g = g || {};
    const sec = document.getElementById("depoimentos"), nota = document.getElementById("notaGoogle");
    const temNota = !!(g.notaTexto || g.linkAvaliar);
    if (!lista.length && !temNota) { sec.hidden = true; return; }
    sec.hidden = false; Interface.limpar(nota); nota.hidden = !temNota;
    if (g.notaTexto) {
      const e = Interface.criar("span", "nota-google__estrelas", "★★★★★"); e.setAttribute("aria-hidden", "true"); nota.appendChild(e);
      nota.appendChild(Interface.criar("strong", "", g.notaTexto + " no Google"));
      if (g.quantidadeTexto) nota.appendChild(Interface.criar("span", "", "· " + g.quantidadeTexto));
    }
    [[g.link, "Ver avaliações"], [g.linkAvaliar, "Avalie a gente"]].forEach(([url, txt]) => {
      if (!url) return; const a = Interface.criar("a", "nota-google__link", txt); a.href = url; a.target = "_blank"; a.rel = "noopener"; nota.appendChild(a);
    });
    const alvo = document.getElementById("listaDepoimentos"); Interface.limpar(alvo);
    lista.forEach(d => {
      const c = Interface.criar("blockquote", "card"); c.appendChild(Interface.criar("p", "", d.texto));
      if (d.nome) c.appendChild(Interface.criar("p", "", "— " + d.nome + (d.origem ? " · " + d.origem : "")));
      alvo.appendChild(c);
    });
  },
  desenharFaq(lista) {
    const sec = document.getElementById("duvidas"), alvo = document.getElementById("listaFaq"); Interface.limpar(alvo);
    if (!lista.length) { sec.hidden = true; return; }
    lista.forEach(f => {
      const d = Interface.criar("details", "faq__item");
      d.appendChild(Interface.criar("summary", "", f.pergunta)); d.appendChild(Interface.criar("p", "", f.resposta));
      alvo.appendChild(d);
    });
  },
  desenharAviso(a) {
    const el = document.getElementById("aviso"); Interface.limpar(el);
    if (!a || !a.texto) { el.hidden = true; return; }
    el.hidden = false;
    if (a.link) { const l = Interface.criar("a", "", a.texto); l.href = a.link; l.target = "_blank"; l.rel = "noopener"; el.appendChild(l); } else el.textContent = a.texto;
  },
  desenharFachada(f) {
    const fig = document.getElementById("fachada"); Interface.limpar(fig);
    if (!f || !f.arquivo) { fig.hidden = true; return; }
    fig.hidden = false;
    const img = document.createElement("img");
    img.src = f.arquivo; img.alt = f.alt || "Fachada da Seu Jaime Barbearia"; img.loading = "lazy"; img.decoding = "async";
    if (f.largura) img.width = f.largura; if (f.altura) img.height = f.altura;
    fig.appendChild(img); fig.appendChild(Interface.criar("figcaption", "", "Nossa fachada"));
  },
  desenharAgendador(servicos, barbeiros, quandos) {
    const grupo = document.getElementById("agendador");
    if (!servicos.length) { grupo.hidden = true; return; }
    const encher = (id, primeiro, itens) => {
      const sel = document.getElementById(id); Interface.limpar(sel);
      const op = (v, t) => { const o = document.createElement("option"); o.value = v; o.textContent = t; sel.appendChild(o); };
      op("", primeiro); itens.forEach(i => op(i, i));
      sel.closest("label").hidden = !itens.length;
    };
    encher("selServico", "Escolha o serviço", servicos);
    encher("selBarbeiro", "Qualquer barbeiro", barbeiros);
    encher("selQuando", "Quando você prefere?", quandos);
  },
  ligarAgendador(aoMudar) {
    const ids = ["selServico", "selBarbeiro", "selQuando"];
    const ler = () => ({ servico: document.getElementById(ids[0]).value, barbeiro: document.getElementById(ids[1]).value, quando: document.getElementById(ids[2]).value });
    ids.forEach(id => document.getElementById(id).addEventListener("change", () => aoMudar(ler())));
  },
  desenharHorarios(linhas, funcionamento) {
    const alvo = document.getElementById("blocoHorarios"); Interface.limpar(alvo);
    if (!linhas.length && funcionamento) {
      const p = Interface.criar("p", "funcionamento");
      p.appendChild(Interface.criar("span", "funcionamento__rotulo", "Funcionamento"));
      p.appendChild(Interface.criar("strong", "funcionamento__horas", funcionamento));
      alvo.appendChild(p); return;
    }
    if (!linhas.length) { alvo.appendChild(Interface.criar("p", "", "Chame no WhatsApp para saber os horários.")); return; }
    const t = Interface.criar("table", "tabela"); t.appendChild(Interface.criar("caption", "", "")).className = "sr";
    const corpo = document.createElement("tbody");
    linhas.forEach(l => { const tr = document.createElement("tr"); if (l.hoje) tr.className = "hoje"; tr.appendChild(Interface.criar("th", "", l.dia)).scope = "row"; tr.appendChild(Interface.criar("td", "", l.horario)); corpo.appendChild(tr); });
    t.removeChild(t.firstChild); t.appendChild(corpo); alvo.appendChild(t);
  },
  desenharLocal(texto, linkMapa) {
    const e = document.getElementById("endereco"); if (texto) e.textContent = texto;
    const b = document.getElementById("botaoMapa"); if (linkMapa) b.href = linkMapa; else b.hidden = true;
  },
  desenharContatos(telefone, instagram, usuario) {
    const i = document.getElementById("linkInstagram");
    if (instagram) { i.href = instagram; if (usuario) i.textContent = usuario; } else i.parentElement.hidden = true;
    document.querySelectorAll(".rodape [data-zap]").forEach(a => { if (telefone) a.textContent = "WhatsApp: " + telefone; });
  },
  desenharFuncionamentoRodape(texto) { const p = document.getElementById("rodapeFuncionamento"); if (texto) { p.textContent = "Funcionamento: " + texto; p.hidden = false; } },
  /* Card em destaque: ativa por toque/clique; no desktop o hover é feito só em CSS. */
  ligarDestaque() {
    const todos = () => document.querySelectorAll(".card--destaque");
    document.addEventListener("click", e => {
      const alvo = e.target.closest(".card--destaque");
      todos().forEach(c => { if (c === alvo) c.classList.toggle("ativo"); else c.classList.remove("ativo"); });
    });
  },
  /* Entrada suave ao rolar: só quando o visitante não pediu menos movimento. */
  ligarRevelar(escopo) {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!Interface.observador) Interface.observador = new IntersectionObserver((itens) => itens.forEach(i => {
      if (!i.isIntersecting) return;
      const el = i.target; Interface.observador.unobserve(el); el.classList.add("visivel");
      setTimeout(() => { el.classList.remove("revelar", "visivel"); el.style.removeProperty("--atraso"); }, 900);
    }), { threshold: 0.1, rootMargin: "0px 0px -2px 0px" });
    const alvos = (escopo || document).querySelectorAll(".hero__titulo,.hero__sub,.hero .botao,.secao__titulo,.divisor,.sobre__intro,.filtros,.card,.foto,.convite,.local>*,.faq__item,.nota-google,.agendador,.chamada>*,.rodape>*");
    alvos.forEach(el => {
      if (el.dataset.revelar) return; el.dataset.revelar = "1";
      const pos = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.setProperty("--atraso", Math.min(pos, 5) * 70 + "ms");
      el.classList.add("revelar"); Interface.observador.observe(el);
    });
  },
  injetarJsonLd(obj) { const s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(obj); document.head.appendChild(s); },
  ligarMenu() {
    const b = document.getElementById("menuBotao"), m = document.getElementById("menu");
    const alternar = f => { m.classList.toggle("aberto", f); b.setAttribute("aria-expanded", String(f)); };
    b.addEventListener("click", () => alternar(!m.classList.contains("aberto")));
    m.querySelectorAll("a").forEach(a => a.addEventListener("click", () => alternar(false)));
    document.addEventListener("keydown", e => { if (e.key === "Escape") alternar(false); });
  }
};
