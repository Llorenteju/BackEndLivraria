// Defina as rotas e conecte com o controller:
// GET    /favoritos
// POST   /favoritos
// DELETE /favoritos/:id

import { listarFavoritos, criarFavorito, excluirFavorito, listarFavoritosPorUsuario } from "../controllers/favoritos.controller.js";
import express from "express"

const router = express.Router();
router.get("/porusuario/:id", listarFavoritosPorUsuario);

router.get("/", listarFavoritos);
router.post("/", criarFavorito);
router.delete("/:id", excluirFavorito);

export default router;