import express from "express";
import { criarUsuario } from "../controllers/usuario-controller.js";

const router = express.Router();

router.post("/novoUsuario", criarUsuario);

export default router;

