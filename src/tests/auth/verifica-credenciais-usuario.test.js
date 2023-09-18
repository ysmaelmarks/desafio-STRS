import { verificaUsuario } from "../../auth/verifica-credenciais-usuario.js";
import Usuario from "../../models/usuarios-model.js";

jest.mock("../../models/usuarios-model", () => ({
    findOne: jest.fn(),
}));

describe('Testes para verificaUsuario', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Deve retornar um usuário existente', async () => {
        // Cria um usuário fictício com o nome "Alice"
        const usuarioFicticio = {
            _id: 'x1',
            nome: 'Alice',
            login: 'alice123',
            senha: 'senha123',
            tipo: 'cliente',
        };

        // Configure o mock para retornar o usuário fictício quando o login for "alice123"
        Usuario.findOne.mockImplementation(async (filtro) => {
            if (filtro.login === 'alice123') {
                return usuarioFicticio;
            }
            return null;
        });
        const usuarioEncontrado = await verificaUsuario('alice123');
        expect(Usuario.findOne).toHaveBeenCalledWith({ login: 'alice123' });
        expect(usuarioEncontrado).toEqual(usuarioFicticio);
    });

    it('Deve retornar null para um usuário inexistente', async () => {
        Usuario.findOne.mockResolvedValue(null);
        const usuarioEncontrado = await verificaUsuario('usuario_inexistente');
        expect(Usuario.findOne).toHaveBeenCalledWith({ login: 'usuario_inexistente' });
        expect(usuarioEncontrado).toBeNull();
    });

    it('Deve retornar null em caso de erro', async () => {
        Usuario.findOne.mockRejectedValue(new Error('Erro ao buscar usuário'));
        const usuarioEncontrado = await verificaUsuario('usuario_teste');
        expect(Usuario.findOne).toHaveBeenCalledWith({ login: 'usuario_teste' });
        expect(usuarioEncontrado).toBeNull();
    });
});