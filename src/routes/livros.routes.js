import express from "express";
import {
  criarLivro,
  listarLivros,
  buscarLivro,
  atualizarLivro,
  excluirLivro,
} from "../controllers/livros.controller.js";

const router = express.Router();

router.get("/", listarLivros);
router.post("/", criarLivro);

router.get("/avaliacoes", buscarLivro);
router.get("/avaliacoes/:id", buscarLivro);

router.get("/:id", buscarLivro);
router.put("/:id", atualizarLivro);
router.delete("/:id", excluirLivro);

export default router;