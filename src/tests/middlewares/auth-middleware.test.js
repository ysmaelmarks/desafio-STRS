import { autenticarMiddlewareCliente, autenticarMiddlewareGerente } from "../../middlewares/auth-middleware.js";
import { verificarToken } from "../../auth/jwt.js";

jest.mock("../../auth/jwt.js");

describe("autenticarMiddlewareCliente", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {
        authorization: "Bearer xxx",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("Deve autenticar-se caso o token for válido e o tipo for cliente", () => {
    // Mock verificarToken para retornar um objeto decodificado com o tipo 'cliente'
    verificarToken.mockReturnValue({ tipo: "cliente" });

    autenticarMiddlewareCliente(req, res, next);

    expect(verificarToken).toHaveBeenCalledWith("xxx");
    expect(next).toHaveBeenCalled();
  });

  it("Deve retornar erro 401 se o token não for fornecido", () => {
    req.headers.authorization = undefined;

    autenticarMiddlewareCliente(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Acesso não autorizado. Token não fornecido.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("Deve retornar erro 401 se o token for inválido", () => {
    // Mock verificarToken para retornar null (token inválido)
    verificarToken.mockReturnValue(null);

    autenticarMiddlewareCliente(req, res, next);

    expect(verificarToken).toHaveBeenCalledWith("xxx");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Acesso não autorizado. Token inválido ou expirado.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("Deve retornar erro 401 se o tipo no token não for cliente", () => {
    // Mock verificarToken para retornar um objeto decodificado com o tipo 'gerente'
    verificarToken.mockReturnValue({ tipo: "gerente" });

    autenticarMiddlewareCliente(req, res, next);

    expect(verificarToken).toHaveBeenCalledWith("xxx");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Acesso não autorizado. Token inválido ou expirado.",
    });
    expect(next).not.toHaveBeenCalled();
  });
});

describe("autenticarMiddlewareGerente", () => {
    let req;
    let res;
    let next;
  
    beforeEach(() => {
      req = {
        headers: {
          authorization: "Bearer xxx",
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
      jest.clearAllMocks();
    });
  
    it("Deve autenticar-se caso o token for válido e o tipo for gerente", () => {
      // Mock verificarToken para retornar um objeto decodificado com o tipo 'gerente'
      verificarToken.mockReturnValue({ tipo: "gerente" });
  
      autenticarMiddlewareGerente(req, res, next);
  
      expect(verificarToken).toHaveBeenCalledWith("xxx");
      expect(next).toHaveBeenCalled();
    });
  
    it("Deve retornar erro 401 se o token não for fornecido", () => {
      req.headers.authorization = undefined;
  
      autenticarMiddlewareGerente(req, res, next);
  
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Acesso não autorizado. Token não fornecido.",
      });
      expect(next).not.toHaveBeenCalled();
    });
  
    it("Deve retornar erro 401 se o token for inválido", () => {
      // Mock verificarToken para retornar null (token inválido)
      verificarToken.mockReturnValue(null);
  
      autenticarMiddlewareGerente(req, res, next);
  
      expect(verificarToken).toHaveBeenCalledWith("xxx");
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Acesso não autorizado. Token inválido ou expirado.",
      });
      expect(next).not.toHaveBeenCalled();
    });
  
    it("Deve retornar erro 401 se o tipo no token não for gerente", () => {
      // Mock verificarToken para retornar um objeto decodificado com o tipo 'cliente'
      verificarToken.mockReturnValue({ tipo: "cliente" });
  
      autenticarMiddlewareGerente(req, res, next);
  
      expect(verificarToken).toHaveBeenCalledWith("xxx");
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Acesso não autorizado. Token inválido ou expirado.",
      });
      expect(next).not.toHaveBeenCalled();
    });
  });