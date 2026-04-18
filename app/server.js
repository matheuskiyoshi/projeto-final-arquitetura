require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const fetch = require("node-fetch");
const app = express();

app.use(express.json());
app.use(express.static("."));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const OMDB_API_KEY = process.env.OMDB_API_KEY;

app.get("/api/filmes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM movies");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar filmes" });
  }
});

app.post("/api/filmes", async (req, res) => {
  const { titulo, ano, genero } = req.body;
  try {
    await pool.query(
      "INSERT INTO movies (movie_id, title, year, genre) VALUES ($1, $2, $3, $4)",
      [Date.now().toString(), titulo, ano, genero],
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao salvar filme" });
  }
});

app.get("/api/avaliacoes", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.rating as nota, m.title as filme, u.name as nome
      FROM ratings r
      LEFT JOIN movies m ON r.movie_id = m.movie_id
      LEFT JOIN users u ON r.user_id = u.user_id
      ORDER BY r.timestamp DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar avaliações" });
  }
});

app.post("/api/avaliacoes", async (req, res) => {
  const { filme, nota, nome } = req.body;

  console.log("Recebido:", { filme, nota, nome }); // DEBUG

  try {
    // Encontrar movie_id pelo title
    const movieResult = await pool.query(
      "SELECT movie_id FROM movies WHERE title = $1",
      [filme],
    );
    if (movieResult.rows.length === 0) {
      return res.status(400).json({ error: "Filme não encontrado" });
    }
    const movieId = movieResult.rows[0].movie_id;

    // Encontrar ou criar user
    let userResult = await pool.query(
      "SELECT user_id FROM users WHERE LOWER(name) = LOWER($1)",
      [nome],
    );
    let userId;

    if (userResult.rows.length === 0) {
      console.log("Criando novo usuário:", nome); // DEBUG
      const newUser = await pool.query(
        "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING user_id",
        [nome, `${nome}@movieflix.com`],
      );
      userId = newUser.rows[0].user_id;
      console.log("Novo user_id:", userId); // DEBUG
    } else {
      userId = userResult.rows[0].user_id;
      console.log("Usuário existente, user_id:", userId); // DEBUG
    }

    console.log("Inserindo rating com:", { userId, movieId, nota }); // DEBUG

    await pool.query(
      "INSERT INTO ratings (user_id, movie_id, rating, timestamp) VALUES ($1, $2, $3, $4)",
      [userId, movieId, nota, new Date().toISOString()],
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("ERRO COMPLETO:", err); // DEBUG
    res.status(500).json({ error: "Erro ao salvar avaliação" });
  }
});

app.get("/api/omdb", async (req, res) => {
  if (!OMDB_API_KEY || OMDB_API_KEY === "sua_chave_aqui") {
    return res.status(400).json({ erro: "OMDB_API_KEY não configurada" });
  }

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?t=${encodeURIComponent(req.query.t)}&apikey=${OMDB_API_KEY}`,
    );
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ erro: "Erro na busca" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
