import Viagem from '../../models/viagem-model.js';
import Reserva from '../../models/reserva-model.js';
import {criarViagem, remarcarViagem, cancelarViagem,} from '../../controllers/viagem-controller.js';

const mockRequest = (overrides = {}) => ({
    body: {},
    params: {},
    ...overrides,
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Testes para criarViagem', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Deve criar uma viagem com sucesso', async () => {
        const req = mockRequest({
            body: {
                destino: 'Destino',
                dataPartida: new Date(),
                dataChegada: new Date(),
                preco: '100.00',
                assentosDisponiveis: 10,
            },
        });

        const res = mockResponse();

        await criarViagem(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Viagem criada com sucesso' })
        );
    });
});

describe('Testes para remarcarViagem', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Deve remarcar uma viagem com sucesso', async () => {
        const viagemMock = {
            _id: 'x1',
            destino: 'Destino Original',
            dataPartida: new Date(),
            dataChegada: new Date(),
            preco: '100.00',
            assentosDisponiveis: 10,
            save: jest.fn().mockResolvedValue({})    
        };

        Viagem.findById = jest.fn().mockResolvedValue(viagemMock);

        const req = mockRequest({
            params: { viagemId: 'x1' },
            body: {
            destino: 'Novo Destino',
            dataPartida: new Date(),
            dataChegada: new Date(),
            preco: '200.00',
            assentosDisponiveis: 150,
        },
        });

        const res = mockResponse();

        await remarcarViagem(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Viagem remarcada com sucesso' })
        );

        expect(viagemMock.save).toHaveBeenCalled();
    });

    it('Deve retornar erro ao remarcar uma viagem', async () => {
        Viagem.findById = jest.fn().mockResolvedValue(null);

        const req = mockRequest({
            params: { viagemId: 'viagem_id' },
            body: { destino: 'Novo Destino' },
        });

        const res = mockResponse();

        await remarcarViagem(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Viagem não encontrada' })
        );
    });
});

describe('Testes para cancelarViagem', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('Deve cancelar uma viagem com sucesso', async () => {
      const viagemMock = {
        _id: 'viagem_id',
        destino: 'Destino Original',
        dataPartida: new Date(),
        dataChegada: new Date(),
        preco: '100.00',
        assentosDisponiveis: 10,
        save: jest.fn().mockResolvedValue({})
      };
  
      Viagem.findById = jest.fn().mockResolvedValue(viagemMock);
      Viagem.prototype.save = jest.fn().mockResolvedValue(viagemMock);
      Reserva.updateMany = jest.fn().mockResolvedValue({ nModified: 5 });
  
      const req = mockRequest({
        params: { viagemId: 'viagem_id' },
      });
  
      const res = mockResponse();
  
      await cancelarViagem(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Viagem cancelada com sucesso' })
      );
  
      expect(viagemMock.save).toHaveBeenCalled();
      expect(Reserva.updateMany).toHaveBeenCalled();
    });
  
    it('Deve retornar erro ao cancelar uma viagem', async () => {
      Viagem.findById = jest.fn().mockResolvedValue(null);
  
      const req = mockRequest({
        params: { viagemId: 'viagem_id' },
      });
  
      const res = mockResponse();
  
      await cancelarViagem(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Viagem não encontrada' })
      );
    });
  });