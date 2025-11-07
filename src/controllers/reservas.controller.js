// listarReservas → retorna todas as reservas cadastradas (com dados do usuário e livro)
// criarReserva → insere uma nova reserva no banco
// excluirReserva → exclui uma reserva pelo ID

//  Desafio extra 
// // Criar uma rota /reservas/ativas que liste apenas as reservas com data de devolução maior ou igual à data atual.

import { db } from "../config/db.js"
export async function listarReservas(req, res) {
  try {
    const [rows] = await db.execute(`
      SELECT 
        r.id,
        r.usuario_id,
        u.nome AS nome_usuario,
        r.livro_id,
        l.titulo AS titulo_livro,
        r.data_retirada,
        r.data_devolucao,
        r.confirmado_email
      FROM reservas r
      INNER JOIN usuarios u ON r.usuario_id = u.id
      INNER JOIN livros l ON r.livro_id = l.id
      ORDER BY r.data_retirada DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao listar reservas" });
  }
};

export async function criarReserva(req, res) {
    try {
        const { usuario_id, livro_id, data_retirada, data_devolucao } = req.body;
        
        if (!usuario_id || !livro_id || !data_retirada || !data_devolucao) {
            return res.status(400).json({ erro: "Campos obrigatórios: usuário, livro, data de retirada e data de devolução." });
        }

        const retirada = new Date(data_retirada);
        const devolucao = new Date(data_devolucao);

        if (devolucao <= retirada) { 
            return res.status(400).json({ 
                erro: "A data de devolução não pode ser igual ou anterior à data de retirada." 
            });
        }
        
        await db.execute(
            "INSERT INTO reservas (usuario_id, livro_id, data_retirada, data_devolucao) VALUES (?, ?, ?, ?)",
            [usuario_id, livro_id, data_retirada, data_devolucao]
        );

        res.json({ mensagem: "Reserva criada com sucesso!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao criar reserva: " + err.message });
    }
};

export async function excluirReserva(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await db.execute("SELECT id FROM reservas WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ erro: "Reserva não encontrada" });
    }

    await db.execute("DELETE FROM reservas WHERE id = ?", [id]);
    res.json({ mensagem: "Reserva deletada com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao excluir reserva" });
  }
};

export async function listarReservasAtivas(req, res) {
  try {
    const [rows] = await db.execute(`
    SELECT 
   r.id AS reserva_id, 
   u.nome AS nome_usuario, 
   l.titulo AS titulo_livro,
   r.data_retirada,
   r.data_devolucao
   FROM reservas r
   JOIN usuarios u ON r.usuario_id = u.id
   JOIN livros l ON r.livro_id = l.id
   WHERE r.data_devolucao >= CURDATE()
   ORDER BY r.data_devolucao ASC`);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao listar reservas ativas" });
  }
};

