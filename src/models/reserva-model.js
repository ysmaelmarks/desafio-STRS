import mongoose from "mongoose";

const reservasSchema = new mongoose.Schema(
    {
        passageiro: {type: String, require: true},
        viagem: {},
        estadoReserva:{}
    }
)

const reservas = mongoose.model('forms', reservasSchema);

export default reservas;