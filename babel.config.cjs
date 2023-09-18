module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "20.6.1" // Escolha a versão do Node.js que você está usando
        },
        modules: "commonjs" // Configuração para transformar módulos ESM em CommonJS
      }
    ]
  ]
};
