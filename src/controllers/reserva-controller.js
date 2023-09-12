import Viagem from "./models/viagem-model.js";
import Reserva from "./models/reserva-model.js";

export const criarReserva = async (req, res) => {
    const { viagemId } = req.params;
    const { passageiro, assentosReservados } = req.body;

    try {
        const viagem = await Viagem.findById(viagemId);
        if (!viagem) {
            return res.status(404).json({ message: "Viagem não encontrada" });
        }

        if (viagem.assentosDisponiveis < assentosReservados) {
            return res.status(400).json({ message: "Assentos insuficientes disponíveis" });
        }

        const reservasDoCliente = await Reserva.find({
            viagem: viagemId,
            passageiro,
        });

        const assentosJaReservados = reservasDoCliente.reduce(
            (total, reserva) => total + reserva.assentosReservados,
            0
        );

        if (assentosJaReservados + assentosReservados > 2) {
            return res.status(400).json({ message: "Você só pode reservar no máximo 2 assentos nesta viagem" });
        }

        const reserva = new Reserva({
            passageiro,
            viagem: viagemId,
            assentosReservados,
        });

        viagem.assentosDisponiveis -= assentosReservados;

        await reserva.save();
        await viagem.save();

        return res.status(201).json({ message: "Reserva criada com sucesso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
};

export const criarViagem = async (req, res)=>{
    
}