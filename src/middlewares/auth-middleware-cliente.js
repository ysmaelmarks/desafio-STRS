import { verificarToken } from "../auth/jwt.js";

export const autenticarMiddlewareCliente = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "Acesso não autorizado. Token não fornecido." });
    }

    const decoded = verificarToken(token);

    if (!decoded || decoded.tipo !== "cliente") {
        return res.status(401).json({ message: "Acesso não autorizado. Token inválido ou expirado." });
    }

    req.usuarioAutenticado = decoded;
    next();
};
