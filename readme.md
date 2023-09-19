## Desafio de Desenvolvimento Backend Node.js: Sistema de Reserva de Viagens Espaciais
#### Para rodar essa aplicação, precisaremos de:
Node.js e Docker

## Instalação

Clone esse repositório e instale suas dependências

```sh
$ git clone https://github.com/ysmaelmarks/desafio-STRS.git
$ cd desafio-STRS/
$ npm i
```

## Uso
#### Rodando o servidor
Para rodar o servidor, use o seguinte comando:
```sh
$ docker compose up
```
## Documentação da API
#### A documentação da API está disponível usando o Swagger. Para acessá-lo, acesse a seguinte URL:
```sh
- http://localhost:3000/docs
```

bugs:

    18/09/23 12:30:
        reserva-controller.test.js - 3 testes falham por conta do uso do método .save() no código,
        como utilizei objetos mockados para construir os testes, não há como usar o método fora
        de um BD, optei por não remover os métodos do código diretamente, pois eles estão funcionando
        nas requisições. Estou tentando procurar uma solução para resolver esse problema.
    18/09/23 17:26:
        reserva-controller.test.js - resolvido, adicionei método mockado diretamente no objeto mockado.
        viagem-controller.test.js - por algum motivo está sendo retornado problema de importação
        nesse arquivo. 