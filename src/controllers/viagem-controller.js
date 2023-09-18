import Viagem from "../models/viagem-model.js";
import Reserva from "../models/reserva-model.js";

export const criarViagem = async (req, res) => {
    const { destino, dataPartida, dataChegada, preco, assentosDisponiveis } = req.body;

    try {
        const viagem = new Viagem({
            destino,
            dataPartida,
            dataChegada,
            preco,
            assentosDisponiveis,
        });
        viagem.save();
        res.status(201).json({ message: "Viagem criada com sucesso", viagem });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erro ao criar uma nova viagem" });
    }
};

export const remarcarViagem = async (req, res) => {
    const { viagemId } = req.params;
    const { destino, dataPartida, dataChegada, preco, assentosDisponiveis } = req.body;

    try {
        const viagemExistente = await Viagem.findById(viagemId);
        if (!viagemExistente) {
            return res.status(404).json({ message: "Viagem não encontrada" });
        }

        // Atualiza apenas os campos que forem fornecidos no body da req
        if (destino !== undefined) {
            viagemExistente.destino = destino;
        }
        if (dataPartida !== undefined) {
            viagemExistente.dataPartida = dataPartida;
        }
        if (dataChegada !== undefined) {
            viagemExistente.dataChegada = dataChegada;
        }
        if (preco !== undefined) {
            viagemExistente.preco = preco;
        }
        if (assentosDisponiveis !== undefined) {
            viagemExistente.assentosDisponiveis = assentosDisponiveis;
        }

        viagemExistente.save();
        res.status(200).json({ message: "Viagem remarcada com sucesso", viagem: viagemExistente });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erro ao remarcar a viagem" });
    }
};


export const cancelarViagem = async (req, res) => {
    const { viagemId } = req.params;

    try {
        const viagemExistente = await Viagem.findById(viagemId);
        if (!viagemExistente) {
            return res.status(404).json({ message: "Viagem não encontrada" });
        }
        // Atualiza o destino da viagem para "cancelado"
        viagemExistente.destino = "cancelado";
        viagemExistente.save();

        // Encontra todas as reservas relacionadas a esta viagem e atualiza o status para "cancelado"
        await Reserva.updateMany({ viagem: viagemId }, { status: "Cancelada" });

        res.status(200).json({ message: "Viagem cancelada com sucesso", viagem: viagemExistente });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erro ao cancelar a viagem" });
    }
};
