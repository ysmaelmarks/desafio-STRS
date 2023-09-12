import express from "express";
import { criarReserva} from "./reservaController.js";
import { autenticarMiddleware } from "../middlewares/authmiddleware.js";

const router = express.Router();

router.post("/viagem/:viagemId/reserva", autenticarMiddleware, criarReserva);

export default router;
