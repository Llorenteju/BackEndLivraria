import {
    criarUsuario,
    listaUsuario,
    obterUsuario,
    atualizaUsuario,
    deletarUsuario
} from "../controllers/usuarios.controller.js";
import express from "express"
// MESMA COISA: const express = require("express")

const router = express.Router();

router.get("/", listaUsuario);
router.post("/", criarUsuario);
router.get("/:id", obterUsuario);
router.put("/:id", atualizaUsuario);
router.delete("/:id", deletarUsuario);


export default router;