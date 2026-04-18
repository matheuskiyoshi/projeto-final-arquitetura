const API = "http://localhost:10000";

async function buscarOMDB() {
  const titulo = document.getElementById("busca-titulo").value;
  if (!titulo) return;
  console.log(`🔍 Buscando filme: ${titulo}`);
  try {
    const res = await fetch(`${API}/api/omdb?t=${titulo}`);
    const dados = await res.json();
    if (dados.Response === "True") {
      document.getElementById("titulo").value = dados.Title;
      document.getElementById("ano").value = dados.Year;
      mostrarMensagem("Dados encontrados!", "sucesso");
    } else {
      mostrarMensagem("Filme não encontrado", "erro");
    }
  } catch (e) {
    mostrarMensagem("Erro na busca", "erro");
  }
}

async function salvarFilme(e) {
  e.preventDefault();
  const dados = {
    titulo: document.getElementById("titulo").value,
    ano: document.getElementById("ano").value,
    genero: document.getElementById("genero").value,
  };

  await fetch(`${API}/api/filmes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });

  mostrarMensagem("Filme salvo!", "sucesso");
  e.target.reset();
  carregarDados();
}

async function salvarAvaliacao(e) {
  e.preventDefault();
  const dados = {
    filme: document.getElementById("filme-select").value,
    nota: document.getElementById("nota").value,
    nome: document.getElementById("nome").value,
  };

  await fetch(`${API}/api/avaliacoes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });

  mostrarMensagem("Avaliação salva!", "sucesso");
  e.target.reset();
  carregarDados();
}

async function carregarDados() {
  console.log("🔄 Iniciando carregamento...");

  try {
    // Carregar filmes
    const resFilmes = await fetch(`${API}/api/filmes`);
    const filmes = await resFilmes.json();
    console.log("Filmes recebidos:", filmes);

    const tbodyF = document.querySelector("#tabela-filmes tbody");
    console.log("Tbody encontrado:", tbodyF);

    if (filmes && filmes.length > 0) {
      tbodyF.innerHTML = filmes
        .map(
          (f) =>
            `<tr><td>${f.title}</td><td>${f.year}</td><td>${f.genre}</td></tr>`,
        )
        .join("");
    } else {
      tbodyF.innerHTML =
        '<tr><td colspan="3">Nenhum filme cadastrado</td></tr>';
    }

    // Atualizar select
    const select = document.getElementById("filme-select");
    select.innerHTML =
      '<option value="">Selecione o filme</option>' +
      filmes
        .map((f) => `<option value="${f.title}">${f.title}</option>`)
        .join("");

    // Carregar avaliações
    const resAval = await fetch(`${API}/api/avaliacoes`);
    const avaliacoes = await resAval.json();
    console.log("Avaliações recebidas:", avaliacoes);

    const tbodyA = document.querySelector("#tabela-avaliacoes tbody");

    if (avaliacoes && avaliacoes.length > 0) {
      tbodyA.innerHTML = avaliacoes
        .map(
          (a) =>
            `<tr><td>${a.filme}</td><td>${a.nota}</td><td>${a.nome}</td></tr>`,
        )
        .join("");
    } else {
      tbodyA.innerHTML = '<tr><td colspan="3">Nenhuma avaliação</td></tr>';
    }
  } catch (erro) {
    console.error("❌ Erro ao carregar dados:", erro);
  }
}

function mostrarMensagem(texto, tipo) {
  const div = document.getElementById("mensagem");
  div.textContent = texto;
  div.className = tipo;
  div.style.display = "block";
  setTimeout(() => (div.style.display = "none"), 3000);
}

// Aguardar DOM carregar completamente
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", carregarDados);
} else {
  carregarDados();
}
