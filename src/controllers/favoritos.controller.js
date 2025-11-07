// listarFavoritos → retorna todos os livros favoritados por cada usuário
// criarFavorito → adiciona um livro aos favoritos do usuário
// excluirFavorito → remove um livro dos favoritos

// Desafio extra 
// Criar uma rota /favoritos/usuario/:id que liste todos os livros favoritados de um usuário específico.

import { db } from "../config/db.js"


export async function listarFavoritos(req, res) {
    try {
        const [rows] = await db.execute(`
     SELECT 
      f.id AS favorito_id, 
      u.nome AS nome_usuario, 
      l.titulo AS titulo_livro, 
      f.data_favoritado
      FROM favoritos f
   	JOIN usuarios u ON f.usuario_id = u.id
      JOIN livros l ON f.livro_id = l.id
      ORDER BY u.nome, f.data_favoritado DESC`);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao listar os livros favoritados por cada usuário" });
    }
};


export async function criarFavorito(req, res) {
    try {
        const { usuario_id, livro_id, data_favoritado } = req.body;
        
        if (!usuario_id || !livro_id) {
            return res.status(400).json({ erro: "Campos obrigatórios (usuario_id e livro_id)" });
        }

        const [livro] = await db.execute(
            "SELECT ativo FROM livros WHERE id = ?", 
            [livro_id]
        );

        if (livro.length === 0) {
            return res.status(404).json({ erro: "Livro não encontrado" });
        }

        if (livro[0].ativo !== 1) { 
            return res.status(400).json({ erro: "O livro não está ativo e não pode ser favoritado" });
        }

        await db.execute(
            "INSERT INTO favoritos (usuario_id, livro_id, data_favoritado) VALUES (?, ?, ?)",
            [usuario_id, livro_id, data_favoritado || new Date()] // Use 'data_favoritado' ou uma data atual
        );

        res.json({ mensagem: "Livro favoritado com sucesso!" });
    } catch (err) {

        res.status(500).json({ erro: err.message });
    }
};

export async function excluirFavorito(req, res) {
    try {
        const { id } = req.params;
        const [result] = await db.execute("DELETE FROM favoritos WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: "Favorito não encontrado" });
        }
        res.json({ mensagem: "Favorito deletado com sucesso!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao excluir favorito" });
    }
};


export async function listarFavoritosPorUsuario(req, res) {
    try {
        const { id } = req.params; 
        const [rows] = await db.execute(`
            SELECT 
                f.id AS favorito_id, 
                l.titulo AS titulo_livro, 
                l.autor,
                f.data_favoritado
            FROM 
                favoritos f
            JOIN 
                livros l ON f.livro_id = l.id
            WHERE 
                f.usuario_id = ?
            ORDER BY 
                f.data_favoritado DESC
        `, [id]);
        if (rows.length === 0) {
            return res.status(200).json({ mensagem: "Nenhum livro favoritado encontrado para este usuário." });
        }
        
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao listar favoritos do usuário." });
    }
};
