// Defina as rotas e conecte com o controller:
// GET    /reservas
// POST   /reservas
// DELETE /reservas/:id

import { listarReservas, criarReserva, excluirReserva, listarReservasAtivas } from "../controllers/reservas.controller.js";
import express from "express"

const router = express.Router();

router.get("/ativas",  listarReservasAtivas)

router.get("/", listarReservas);
router.post("/", criarReserva);
router.delete("/:id", excluirReserva);

export default router;