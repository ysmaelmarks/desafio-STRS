import jwt from "jsonwebtoken";

const secretKey = process.env.sKEY;
export const gerarToken = (dados) => {
  return jwt.sign(dados, secretKey, { expiresIn: 86400 });
};

export const verificarToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    console.log("aqui", decoded)
    return decoded;
  } catch (error) {
    throw new Error("Token inválido ou expirado");
  }
};
