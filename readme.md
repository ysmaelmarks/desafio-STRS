a montar :)
bugs:

    12:30:
        reserva-controller.test.js - 3 testes falham por conta do uso do método .save() no código,
        como utilizei objetos mockados para construir os testes, não há como usar o método fora
        de um BD, optei por não remover os métodos do código diretamente, pois eles estão funcionando
        nas requisições. Estou tentando procurar uma solução para resolver esse problema.
    17:26:
        reserva-controller.test.js - resolvido, adicionei método mockado diretamente no objeto mockado.
        viagem-controller.test.js - por algum motivo está sendo retornado problema de importação
        nesse arquivo. 