import Viagem from '../../models/viagem-model.js';
import Reserva from '../../models/reserva-model.js';
import Usuario from '../../models/usuarios-model.js';
import { criarReserva, buscarReservaCliente, trocarReserva, cancelarReserva } from '../../controllers/reserva-controller.js';

const mockRequest = (overrides = {}) => ({
    params: {},
    body: {},
    ...overrides,
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Testes para criarReserva', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Deve criar uma reserva com sucesso', async () => {
        // Mockando os objetos necessários para o teste
        const viagem = {
            _id: 'viagem_id',
            assentosDisponiveis: 2,
            destino: 'Destino',
            dataPartida: new Date(),
            dataChegada: new Date(),
            preco: '100.00',
            save: jest.fn().mockResolvedValue({})
        };

        Viagem.findById = jest.fn().mockResolvedValue(viagem);
        Reserva.find = jest.fn().mockResolvedValue([]);
        Reserva.prototype.save = jest.fn();

        const req = mockRequest({
            params: { viagemId: 'viagem_id' },
            body: { passageiro: 'Passageiro', assentosReservados: 1 },
        });

        const res = mockResponse();

        await criarReserva(req, res);

        expect(Viagem.findById).toHaveBeenCalledWith('viagem_id');
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Reserva criada com sucesso' }));


        expect(Reserva.find).toHaveBeenCalledWith({ viagem: 'viagem_id', passageiro: 'Passageiro' });
        expect(Reserva.prototype.save).toHaveBeenCalled();
    });

    it('Deve retornar erro se a viagem não for encontrada', async () => {
        Viagem.findById = jest.fn().mockResolvedValue(null);

        const req = mockRequest({
            params: { viagemId: 'viagem_id' },
            body: { passageiro: 'Passageiro', assentosReservados: 1 },
        });

        const res = mockResponse();

        await criarReserva(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Viagem não encontrada' });

        expect(Viagem.findById).toHaveBeenCalledWith('viagem_id');
    });
});

describe('Testes para buscarReservaCliente', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Deve buscar reservas de um cliente com sucesso', async () => {
        const clienteMock = {
            nome: 'Alice',
            login: 'alice',
        };

        Usuario.findOne = jest.fn().mockResolvedValue(clienteMock);

        const reservasDoCliente = [
            { passageiro: 'Alice', viagem: 'viagem_id_1', status: 'Confirmada', assentosReservados: 2 },
            { passageiro: 'Alice', viagem: 'viagem_id_2', status: 'Pendente', assentosReservados: 1 },
        ];

        Reserva.find = jest.fn().mockResolvedValue(reservasDoCliente);

        const req = mockRequest({
            params: { login: 'alice' },
        });

        const res = mockResponse();

        await buscarReservaCliente(req, res);

        expect(Usuario.findOne).toHaveBeenCalledWith({ login: 'alice' });
        expect(Reserva.find).toHaveBeenCalledWith({ passageiro: 'Alice' });

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            cliente: { nome: 'Alice', login: 'alice' },
            reservas: reservasDoCliente,
        });
    });

    it('Deve retornar erro se o cliente não for encontrado', async () => {
        Usuario.findOne = jest.fn().mockResolvedValue(null);

        const req = mockRequest({
            params: { login: 'usuario_inexistente' },
        });

        const res = mockResponse();

        await buscarReservaCliente(req, res);

        expect(Usuario.findOne).toHaveBeenCalledWith({ login: 'usuario_inexistente' });

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Cliente não encontrado' });
    });

});

describe('Testes para trocarReserva', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Deve trocar a reserva com sucesso', async () => {
        const reservaExistente = {
            _id: 'reserva_id',
            viagem: 'viagem_id_1',
            assentosReservados: 2,
            save: jest.fn().mockResolvedValue({})
        };

        Reserva.findById = jest.fn().mockResolvedValue(reservaExistente);

        const viagemDisponivel = {
            _id: 'viagem_id_2',
            destino: 'Novo Destino',
            data: new Date(),
            assentosDisponiveis: 3,
        };

        Viagem.findOne = jest.fn().mockResolvedValue(viagemDisponivel);

        const req = mockRequest({
            params: { reservaId: 'reserva_id' },
            body: { novoDestino: 'Novo Destino', novaData: new Date() },
        });

        const res = mockResponse();

        await trocarReserva(req, res);

        expect(Reserva.findById).toHaveBeenCalledWith('reserva_id');
        expect(Viagem.findOne).toHaveBeenCalledWith({
            destino: 'Novo Destino',
            data: expect.any(Date),
            assentosDisponiveis: { $gte: 2 },
        });

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Reserva alterada com sucesso' });
    });

    it('Deve retornar erro se a reserva não for encontrada', async () => {
        Reserva.findById = jest.fn().mockResolvedValue(null);

        const req = mockRequest({
            params: { reservaId: 'reserva_inexistente' },
            body: { novoDestino: 'Novo Destino', novaData: new Date() },
        });

        const res = mockResponse();

        await trocarReserva(req, res);

        expect(Reserva.findById).toHaveBeenCalledWith('reserva_inexistente');

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Reserva não encontrada' });
    });

    it('Deve retornar erro se não houver viagens disponíveis com os novos detalhes', async () => {
        const reservaExistente = {
            _id: 'reserva_id',
            viagem: 'viagem_id_1',
            assentosReservados: 2,
            save: jest.fn().mockResolvedValue({})
        };

        Reserva.findById = jest.fn().mockResolvedValue(reservaExistente);

        Viagem.findOne = jest.fn().mockResolvedValue(null);

        const req = mockRequest({
            params: { reservaId: 'reserva_id' },
            body: { novoDestino: 'Novo Destino', novaData: new Date() },
        });

        const res = mockResponse();

        await trocarReserva(req, res);

        expect(Reserva.findById).toHaveBeenCalledWith('reserva_id');
        expect(Viagem.findOne).toHaveBeenCalledWith({
            destino: 'Novo Destino',
            data: expect.any(Date),
            assentosDisponiveis: { $gte: 2 },
        });

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Não há viagens disponíveis com os novos detalhes' });
    });

});

describe('Testes para cancelarReserva', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Deve cancelar uma reserva com sucesso', async () => {
        const reservaMock = {
            _id: 'x1',
            viagem: 'v1',
            status: 'Reservada',
            assentosReservados: 2,
            save: jest.fn().mockResolvedValue({}),
        };

        const viagemMock = {
            _id: 'v1',
            preco: 100,
            assentosDisponiveis: 10,
            save: jest.fn().mockResolvedValue({}),
        };

        Reserva.findById = jest.fn().mockResolvedValue(reservaMock);
        Viagem.findById = jest.fn().mockResolvedValue(viagemMock);

        const req = mockRequest({
            params: { reservaId: 'x1' },
        });

        const res = mockResponse();

        await cancelarReserva(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Reserva cancelada com sucesso. Reembolso de $∑200 Estalecas' })
        );

        expect(reservaMock.status).toEqual('Cancelada');
        expect(reservaMock.save).toHaveBeenCalled();
        expect(viagemMock.assentosDisponiveis).toEqual(12);
        expect(viagemMock.save).toHaveBeenCalled();
    });
});

