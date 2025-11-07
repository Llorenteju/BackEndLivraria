import { criarAvaliacao, listarAvaliacoes, buscarAvaliacao } from "../controllers/avaliacoes.controller.js";


// Defina as rotas e conecte com o controller:
// GET  /avaliacoes
// POST /avaliacoes



import express from "express"

const router = express.Router();

router.get("/",listarAvaliacoes);
router.get("/:id",buscarAvaliacao);
router.post("/", criarAvaliacao);

export default router;