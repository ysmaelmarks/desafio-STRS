import { gerarToken, verificarToken } from "../../auth/jwt.js";

describe('Testes para gerarToken', () => {
  it('Deve gerar um token válido', () => {
      const dados = {
          id: 1,
          nome: 'Alice',
      };
      const token = gerarToken(dados);
      
      // Verifique se o token foi gerado
      expect(token).toBeTruthy();
      
      // Verifique se o token é uma string
      expect(typeof token).toBe('string');
  });
});

describe('Testes para verificarToken', () => {
  it('Deve verificar um token válido', () => {
      const dados = {
          id: 1,
          nome: 'Alice',
      };
      const token = gerarToken(dados);
      
      // Verifique se a função não lança erro (token válido)
      expect(() => verificarToken(token)).not.toThrow();
  });

  it('Deve lançar um erro para um token inválido', () => {
      const tokenInvalido = 'token_invalido';
      
      // Verifique se a função lança um erro (token inválido)
      expect(() => verificarToken(tokenInvalido)).toThrow('Token inválido ou expirado');
  });
});