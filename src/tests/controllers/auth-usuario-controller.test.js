import { authLogin } from "../../controllers/auth-usuario-controller.js"; 
import * as jwt from "../../auth/jwt.js"; 
import * as verificaCredenciaisUsuario from "../../auth/verifica-credenciais-usuario";

// Mock para req, res, next
const mockRequest = () => {
  return {
    body: {},
  };
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);
  return res;
};

// Mock para verificaUsuario
jest.mock("../../auth/verifica-credenciais-usuario", () => ({
  verificaUsuario: jest.fn(),
}));

// Mock para gerarToken
jest.mock("../../auth/jwt", () => ({
  gerarToken: jest.fn(),
}));

// Mock para cookie.serialize
jest.mock("cookie", () => ({
  serialize: jest.fn(),
}));

describe("Testes para authLogin", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Limpa todos os mocks após cada teste
  });

  it("Deve autenticar o usuário com sucesso", async () => {
    const req = mockRequest();
    const res = mockResponse();
    const usuarioAutenticado = { id: 1, nome: "Alice", tipo: "cliente" };

    jwt.gerarToken.mockReturnValue("token");
    verificaCredenciaisUsuario.verificaUsuario.mockResolvedValue(usuarioAutenticado);

    await authLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Login bem-sucedido" });
  });

  it("Deve retornar erro quando as credenciais são inválidas", async () => {
    const req = mockRequest();
    const res = mockResponse();

    verificaCredenciaisUsuario.verificaUsuario.mockResolvedValue(null);

    await authLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Credenciais inválidas" });
  });

  it("Deve retornar erro ao autenticar o usuário", async () => {
    const req = mockRequest();
    const res = mockResponse();

    verificaCredenciaisUsuario.verificaUsuario.mockRejectedValue(new Error("Erro ao autenticar")); 

    await authLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Erro ao autenticar o usuário" });
  });
});
