import express from "express";
import { authLoginCliente } from "../controllers/auth-cliente-controller.js";
import { authLoginGerente } from "../controllers/auth-gerente-controller.js";
const router = express.Router();

app.post("/login", authLoginCliente)
    .post("/login-gerente", authLoginGerente);

export default router;

