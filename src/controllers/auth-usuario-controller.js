import cookie from "cookie";
import { gerarToken } from "../auth/jwt.js";
import { verificaUsuario } from "../auth/verifica-credenciais-usuario.js";

export const authLogin = async (req, res) => {
    const { login, senha } = req.body;
    try {
        const usuarioAutenticado = await verificaUsuario(login, senha);

        if (!usuarioAutenticado) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        const tipoUsuario = usuarioAutenticado.tipo;
        const token = gerarToken({ tipo: tipoUsuario, usuario: usuarioAutenticado });

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        };

        res.setHeader("Set-Cookie", cookie.serialize("token", token, cookieOptions));
        res.status(200).json({ message: "Login bem-sucedido" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao autenticar o usuário" });
    }
};
