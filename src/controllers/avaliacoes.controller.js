import { db } from "../config/db.js";

// ============================
//  Controlador de Avaliações
// ============================


export async function criarAvaliacao(req, res) {
  try {
    const { usuarioId, livroId, nota, comentario } = req.body;

    if (!usuarioId || !livroId || !nota)
      return res.status(400).json({ erro: "Campos obrigatórios" });

    await db.execute(
      "INSERT INTO avaliacoes (usuario_id, livro_id, nota, comentario) VALUES (?, ?, ?, ?)",
      [usuarioId, livroId, nota, comentario]
    );

    res.status(201).json({ mensagem: "Avaliação criada com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao criar avaliação" });
  }
}


export async function listarAvaliacoes(req, res) {
  try {
    const [rows] = await db.execute(`
      SELECT
A.id,
    U.nome AS Nome_Usuario,
    L.titulo AS Titulo_Livro,
    A.nota,
    A.comentario,
    A.data_avaliacao
FROM
    avaliacoes AS A
INNER JOIN
    usuarios AS U ON A.usuario_id = U.id  
INNER JOIN
    livros AS L ON A.livro_id = L.id;     
   `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao listar avaliações" });
  }
}


export async function buscarAvaliacao(req, res) {
  try {
    const [rows] = await db.execute(`
  SELECT
    A.id,
    U.nome AS usuario_nome,
    L.titulo AS livro_titulo,
    A.nota,
    A.comentario,
    A.data_avaliacao
  FROM avaliacoes AS A
  INNER JOIN usuarios AS U ON A.usuario_id = U.id
  INNER JOIN livros   AS L ON A.livro_id   = L.id
  WHERE A.id = ?
`, [req.params.id]);
    if (rows.length === 0)
      return res.status(404).json({ erro: "Avaliação não encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};
