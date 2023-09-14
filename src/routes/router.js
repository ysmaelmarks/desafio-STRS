import express from "express";
import usuariosRouter from "./usuarios-router.js";
import loginRouter from "./login-router.js";
import { 
        criarReserva,
        buscarReservaCliente, 
        trocarReserva, 
        cancelarReserva
} from "../controllers/reserva-controller.js";

import {
        autenticarMiddlewareCliente,
        autenticarMiddlewareGerente
} from "../middlewares/auth-middleware.js";

import { 
        criarViagem,
        remarcarViagem,
        cancelarViagem
} from "../controllers/viagem-controller.js";

const router = express.Router();

router
    .post("/viagem/:viagemId/reserva", autenticarMiddlewareCliente, criarReserva)
    .get("/reservas/cliente/:login", autenticarMiddlewareCliente, buscarReservaCliente)
    .patch("/reservas/:reservaId/trocar", autenticarMiddlewareCliente, trocarReserva)
    .patch("/reservas/:reservaId/cancelar", autenticarMiddlewareCliente, cancelarReserva)
    .post("/viagens", autenticarMiddlewareGerente, criarViagem)
    .patch("/viagens/:viagemId", autenticarMiddlewareGerente, remarcarViagem)
    .delete("/viagens/:viagemId", autenticarMiddlewareGerente, cancelarViagem)
    .use(usuariosRouter)
    .use(loginRouter);

export default router;
