import cookie from "cookie";
import { gerarToken } from "../auth/jwt.js";

export const authLogin = async (req, res) => {
    const token = gerarToken(usuarioAutenticado);
    const cookieOptions = {
        httpOnly: true, // Impede o acesso pelo JavaScript no lado do cliente
        secure: true, // Requer conexões HTTPS
        sameSite: "strict", // Melhora a segurança contra CSRF
    };

    res.setHeader("Set-Cookie", cookie.serialize("token", token, cookieOptions));

    res.status(200).json({ message: "Login bem-sucedido" });
}