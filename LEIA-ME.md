# Seu Jaime Barbearia — landing page

## Como abrir
Dê dois cliques em `index.html`. Não precisa de servidor nem instalação.

## Como editar
- **Textos, preços, horários, telefone, fotos:** só `js/conteudo.js`. Campo vazio some da tela.
- **Cores e fontes:** só as variáveis no topo de `css/base.css`.
- **Funcionamento:** `funcionamento` (hoje 10h às 19h) aparece na seção de horários e no rodapé.
- **Dias da semana:** em `horarios`, use `1: ["10:00","19:00"]` (0 = domingo … 6 = sábado). Preenchido, aparecem a tabela por dia e o selo "Aberto agora".
- **Equipe:** em `equipe`, preencha `foto` (arquivo em `img/`) e `descricao` de cada pessoa. Sem foto, o card mostra a inicial do nome.
- **Nova foto:** coloque em `img/` (JPG/WebP leve) e adicione uma linha em `galeria` com `categoria`: `cortes`, `freestyle`, `infantil` ou `espaco`.

## Camadas
| Arquivo | Papel |
|---|---|
| `js/conteudo.js` | Dados |
| `js/regras.js` | Regras (aberto agora, link do WhatsApp e do Maps, filtros, moeda, telefone) |
| `js/interface.js` | Desenha na tela |
| `js/app.js` | Liga tudo |
| `css/base.css`, `componentes.css`, `secoes.css` | Marca, peças, layout |

## Pendências
- [ ] Dias da semana de funcionamento (o horário 10h às 19h já está no site; o selo "Aberto agora" e a tabela por dia só ligam depois)
- [ ] Duração dos serviços
- [ ] Confirmar com o dono o que o Plano Mensal (R$ 80) inclui
- [ ] Autorização do dono para as 3 fotos da galeria (mostram clientes). Sem autorização, esvazie `galeria` em `conteudo.js`
- [ ] Fotos e descrições da equipe (Matheus, Mizael, Jaime) e confirmar o cargo "Barbeiro"
- [ ] Fotos de corte infantil (a categoria só aparece quando houver foto)
- [ ] Depoimentos reais
- [ ] CEP completo
- [ ] Foto da fachada ("Arte do Corte"): fora do site até o dono confirmar
