import { db } from "../config/db.js"
// ============================
//  Rotas CRUD
// ============================


// Implemente os seguintes métodos:
// listarLivros → retorna todos os livros cadastrados
// buscarLivro → retorna um livro pelo ID
// criarLivro → insere um novo livro no banco
// atualizarLivro → atualiza os dados de um livro existente
// excluirLivro → exclui um livro pelo ID


export async function criarLivro(req, res) {
    try {
        const { titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse } = req.body;
        if (!titulo || !autor || !genero || !editora || !ano_publicacao || !isbn || !idioma || !formato || !caminho_capa || !sinopse)
            return res.status(400).json({ erro: "Campos obrigatórios" });

        await db.execute(
            "INSERT INTO livros (titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse]
        );

        res.json({ mensagem: "Livro criado com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};


export async function listarLivros(req, res) {
    try {
        const [rows] = await db.execute("SELECT * FROM livros");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};
         
export async function buscarLivro(req, res) {
  try {
    const temAvaliacoes = req.originalUrl.includes("/avaliacoes");


    if (temAvaliacoes && !req.params.id) {
      const [rows] = await db.execute(`
        SELECT 
          l.id,
          l.titulo,
          IFNULL(ROUND(AVG(a.nota), 2), 0) AS media_notas,
          COUNT(a.id) AS total_avaliacoes
        FROM livros l
        LEFT JOIN avaliacoes a ON l.id = a.livro_id
        GROUP BY l.id, l.titulo
        ORDER BY l.titulo;
      `);

      return res.json(rows);
    }

    if (temAvaliacoes && req.params.id) {
      const [rows] = await db.execute(`
        SELECT 
          l.id,
          l.titulo,
          IFNULL(ROUND(AVG(a.nota), 2), 0) AS media_notas,
          COUNT(a.id) AS total_avaliacoes
        FROM livros l
        LEFT JOIN avaliacoes a ON l.id = a.livro_id
        WHERE l.id = ?
        GROUP BY l.id, l.titulo;
      `, [req.params.id]);

      if (rows.length === 0)
        return res.status(404).json({ erro: "Livro não encontrado" });

      return res.json(rows[0]);
    }

    const [rows] = await db.execute("SELECT * FROM livros WHERE id = ?", [req.params.id]);

    if (rows.length === 0)
      return res.status(404).json({ erro: "Livro não encontrado" });

    res.json(rows[0]);

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function atualizarLivro(req, res) {
    try {
        const {
            titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse
        } = req.body;

        await db.execute(
            "UPDATE livros SET titulo = ?, autor = ?, genero = ?, editora = ?, ano_publicacao = ?, isbn = ?, idioma = ?, formato = ?, caminho_capa = ?, sinopse = ? WHERE id = ?",
            [titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse, req.params.id]
        );

        res.json({ mensagem: "Livro atualizado com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};


export async function excluirLivro(req, res) {
    try {
        await db.execute("DELETE FROM livros WHERE id = ?", [req.params.id]);
        res.json({ mensagem: "Livro deletado com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

