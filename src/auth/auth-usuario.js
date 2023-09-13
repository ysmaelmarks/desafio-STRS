import Usuario from "../models/usuarios-model.js";

const autenticarUsuario = async (login, senha) => {
    try {
        // Procura um usuário com o login fornecido
        const usuario = await Usuario.findOne({ login });
        if (!usuario) {
            return null;
        }
        const senhaCorreta = await usuario.verificarSenha(senha);
        if (!senhaCorreta) {
            return null;
        }
        return usuario;
    } catch (error) {
        console.error(error);
        return;
    }
};

export { autenticarUsuario };
