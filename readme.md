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

#### Rodando os testes
Para executar os testes, é necessário configurar uma variável de ambiente `sKEY` no arquivo `.env.test`. Esta variável é necessária para gerar uma key para autenticar a aplicação durante os testes. 
Dentro do arquivo `.env.test`, defina a variável `sKEY` com um valor válido. Por exemplo:
Substitua `xxxx` pelo valor que você deseja usar para gerar keys de teste.
```sh
sKEY = "xxxx"
```
Para o conforto da aplicação, um arquivo .env.test já é disponibilizado nesse repositório.

Para rodar o servidor, use o seguinte comando:
```sh
$ npx jest
```
## Documentação da API
#### A documentação da API está disponível usando o Swagger. Para acessá-lo, acesse a seguinte URL:
```sh
- http://localhost:3000/docs
```











Bugs :

    Descrição:
        viagem-controller.test.js - Está sendo retornado um erro de importação junto ao JEST
    Reprodução:
        $ npx jest
    Status:
        Procurando solução.
        Até então sem sucesso, acredito que, de acordo com algumas pesquisas,
        o problema está relacionado com as funções do mongoose, onde como
        há a necessidade de várias modificações nas Viagens (updateMany()),
        o mongoose retorna um timeout, pois trata-se de mocks.
