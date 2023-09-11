import mongoose from "mongoose";

const viagensSchema = new mongoose.Schema(
    {
        destino: {type: String, require: true},
        data: {type: String, require: true},
        partida: {type: String, require: true},
        chegada: {type: String, require: true},
        preco: {type: String, require: true},
        assentosDisponiveis: {type: Number, require: true},
    }
)

const viagens = mongoose.model('forms', viagensSchema);

export default viagens;