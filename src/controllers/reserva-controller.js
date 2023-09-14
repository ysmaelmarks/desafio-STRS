import Viagem from "../models/viagem-model.js";
import Reserva from "../models/reserva-model.js";
import Usuario from "../models/usuarios-model.js";

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
            status: "Confirmada",
            assentosReservados,
        });

        viagem.assentosDisponiveis -= assentosReservados;

        await reserva.save();
        await viagem.save();

        /* criar um model/schema para construir um cartão de confirmação mais robusto também
        pode ser uma opção*/

        return res.status(201).json({
            message: "Reserva criada com sucesso",
            reserva: {
                _id: reserva._id,
                passageiro,
                viagem: {
                    destino: viagem.destino,
                    data: viagem.data,
                    partida: viagem.partida,
                    chegada: viagem.chegada,
                    assentos_Reservados: assentosReservados,
                }
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
};

export const buscarReservaCliente = async (req, res) => {
    const { login } = req.params;

    try {
        const cliente = await Usuario.findOne({ login });
        if (!cliente) {
            return res.status(404).json({ message: "Cliente não encontrado" });
        }

        const reservas = await Reserva.find({ passageiro: cliente.nome });
        if (reservas.status === "Cancelada") {
            return res.status(200).json({
                message: "Reserva Cancelada. Você pode receber um reembolso em Estalecas ou remarcar sua viagem.",
                reservas,
            });
        }
        
        return res.status(200).json({
            cliente: {
                nome: cliente.nome,
                login: cliente.login,
            },
            reservas,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
};

export const trocarReserva = async (req, res) => {
    const { reservaId } = req.params; // ID da reserva a ser alterada
    const { novoDestino, novaData } = req.body; // Novo destino e data fornecidos pelo cliente

    try {
        const reservaExistente = await Reserva.findById(reservaId);
        if (!reservaExistente) {
            return res.status(404).json({ message: "Reserva não encontrada" });
        }

        // Verifica se há viagens disponíveis com o novo destino e data
        const viagemDisponivel = await Viagem.findOne({
            destino: novoDestino,
            data: novaData,
            assentosDisponiveis: { $gte: reservaExistente.assentosReservados },
        });

        if (!viagemDisponivel) {
            return res.status(400).json({ message: "Não há viagens disponíveis com os novos detalhes" });
        }

        // Atualiza a reserva existente com os novos detalhes
        reservaExistente.viagem = viagemDisponivel._id;
        reservaExistente.save();

        return res.status(200).json({ message: "Reserva alterada com sucesso" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

export const cancelarReserva = async (req, res) => {
    const { reservaId } = req.params;

    try {
        const reservaExistente = await Reserva.findById(reservaId);
        if (!reservaExistente) {
            return res.status(404).json({ message: "Reserva não encontrada" });
        }

        if (reservaExistente.status == "Cancelada") {
            return res.status(400).json({ message: "Esta reserva já foi cancelada anteriormente" });
        }

        // Pega as informações da viagem associada à reserva
        const viagem = await Viagem.findById(reservaExistente.viagem);

        if (!viagem) {
            return res.status(500).json({ message: "Viagem associada à reserva não encontrada" });
        }

        // Calcula o valor do reembolso com base no preço da viagem e nos assentos reservados
        const reembolso = viagem.preco * reservaExistente.assentosReservados;

        // Atualiza o status da reserva para "cancelada"
        reservaExistente.status = "Cancelada";
        await reservaExistente.save();

        // Atualize os assentos disponíveis na viagem
        viagem.assentosDisponiveis += reservaExistente.assentosReservados;
        await viagem.save();

        return res.status(200).json({ message: `Reserva cancelada com sucesso. Reembolso de $∑{reembolso} Estalecas` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
};
