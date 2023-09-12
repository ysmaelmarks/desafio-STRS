import mongoose from "mongoose";

const reservaSchema = new mongoose.Schema({
  passageiro: { type: String, required: true },
  viagem: { type: mongoose.Schema.Types.ObjectId, ref: "Viagem", required: true },
  assentosReservados: { type: Number, required: true },
  status: { type: String, enum: ["Confirmada", "Pendente", "Cancelada"], default: "Pendente" },
});

const Reserva = mongoose.model("Reserva", reservaSchema);

export default Reserva;
