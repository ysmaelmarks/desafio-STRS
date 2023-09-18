import { criarUsuario } from '../../controllers/usuario-controller.js';
import Usuario from '../../models/usuarios-model.js';

const mockRequest = (overrides = {}) => ({
    params: {},
    body: {},
    ...overrides,
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.setHeader = jest.fn().mockReturnValue(res);
    return res;
};

describe('Testes para criarUsuario', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Deve criar um novo usuário com sucesso', async () => {
        const usuarioMock = {
            nome: 'Alice',
            login: 'alice',
            senha: 'senha123',
            tipo: 'cliente',
        };

        // Mock da função findOne para retornar null, indicando que o login não está em uso
        Usuario.findOne = jest.fn().mockResolvedValue(null);

        // Mock da função save para criar o usuário
        Usuario.prototype.save = jest.fn();

        const req = mockRequest({
            body: usuarioMock,
        });

        const res = mockResponse();

        await criarUsuario(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Usuário criado com sucesso.' });

        // Verifica se a função findOne foi chamada com o login do usuário
        expect(Usuario.findOne).toHaveBeenCalledWith({ login: 'alice' });

        // Verifica se a função save foi chamada para criar o usuário
        expect(Usuario.prototype.save).toHaveBeenCalled();
    });

    it('Deve retornar erro se o login já estiver em uso', async () => {
        // Mock dos dados do usuário
        const usuarioMock = {
            nome: 'Alice',
            login: 'alice',
            senha: 'senha123',
            tipo: 'cliente',
        };

        // Mock da função findOne para retornar um usuário com o mesmo login, indicando que o login já está em uso
        Usuario.findOne = jest.fn().mockResolvedValue(usuarioMock);

        const req = mockRequest({
            body: usuarioMock,
        });

        const res = mockResponse();

        await criarUsuario(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'O login já está em uso.' });

        // Verifique se a função findOne foi chamada com o login do usuário
        expect(Usuario.findOne).toHaveBeenCalledWith({ login: 'alice' });
    });
});
