import Usuario from "../models/usuarios-model.js";

export const verificaUsuario = async (login) => {
    try {
        const usuario = await Usuario.findOne({ login });
        if (!usuario) {
            return null;
        }
        /*
        const senhaCorreta = await usuario.verificarSenha(senha);
        if (!senhaCorreta) {
            return null;
        }

        Aprimorar essa parte para receber valores reais do BCRYPT

        */
        return usuario;
    } catch (error) {
        console.log(error);
        return null;
    }
};
