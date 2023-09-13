import mongoose from "mongoose";
import bcrypt from "bcrypt";


const usuarioSchema = new mongoose.Schema({
    nome:{type: String, required: true},
    login:{type: String, required: true, unique: true},
    senha:{type: String, required: true},
    tipo: {type: String, default: "cliente"}
})

//método de verificação de senha
usuarioSchema.methods.verificarSenha = async function (senha) {
    try {
        return await bcrypt.compare(senha, this.senha);
    } catch (error) {
        throw error;
    }
};

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;
