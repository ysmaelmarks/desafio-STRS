import mongoose from "mongoose";

const viagemSchema = new mongoose.Schema({
  destino: { type: String, required: true },
  dataPartida: { type: Date, required: true },
  dataChegada: { type: Date, required: true },
  preco: { type: String, required: true },
  assentosDisponiveis: { type: Number, required: true },
});

const Viagem = mongoose.model("Viagem", viagemSchema);

export default Viagem;
