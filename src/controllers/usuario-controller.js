import Usuario from "../models/usuarios-model.js";

export const criarUsuario = async (req, res) => {
    try {
        const { nome, login, senha, tipo } = req.body;

        // Verificar se o login já está em uso
        const loginEmUso = await Usuario.findOne({ login });
        if (loginEmUso) {
            return res.status(400).json({ message: "O login já está em uso." });
        }

        const novoUsuario = new Usuario({ nome, login, senha, tipo });
        await novoUsuario.save();

        res.status(201).json({ message: "Usuário criado com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao criar um usuário." });
    }
};