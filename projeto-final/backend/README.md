# PROJETO FINAL

Para mostramos a integração do GRAPHQL com o BD MySQL nós precisaremos
configurar um projeto Node que tenha o Knex


BD projgrapqlbd;
User: admin_grapql
Pass: senha123


```bash
CREATE DATABASE projgrapqlbd CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE USER 'admin_grapql'@'localhost' IDENTIFIED WITH mysql_native_password BY 'senha123';
GRANT ALL PRIVILEGES ON *.* TO 'admin_grapql'@'localhost';
CREATE USER 'admin_grapql'@'%' IDENTIFIED WITH mysql_native_password BY 'senha123';
GRANT ALL PRIVILEGES ON *.* TO 'admin_grapql'@'%';
flush privileges;
quit;
```

> ATENÇÃO: depois crie o arquivo **.env**

E acerte as configurações:

```ini
NODE_ENV=development

APP_DB_HOST=localhost
APP_DB_PORT=3306
APP_DB_NAME=projgrapqlbd
APP_DB_USER=admin_grapql
APP_DB_PASSWORD=senha123

APP_AUTH_SECRET=escolher um segredo!
```

# FAÇA AS MIGRATIONS

Para rodar as Migrations faça;

```bash
npx knex migrate:latest
```

Deu um problema no windows pois o MySQL era 5.7, então executei:

```
SET GLOBAL default_storage_engine = 'InnoDB';
```
E funcionou:

```bash
$ npx knex migrate:latest
Using environment: development
Batch 1 run: 3 migrations
```

Para MySQL 8 temos um arquivo chamado PROBLEMAS.md que explica alguns deles.


# PARA TESTAR NO DESENVOLVIMENTO

projeto-final/backend/config/context.js

Como nesta parte já implementamos a proteção das rotas
você deve descomentar a linha simularUsuarioLogado:

```javascript
module.exports = async ({ req }) => {
    // Em desenvolvimento
    await require('./simularUsuarioLogado')(req)
```

Depois vá no PlayGround do ApolloServer e crie registre um usuário;

```
mutation {
  registrarUsuario( 
    dados: { 
      nome: "Marcelo", email: "palin@mail.com", senha: "senha123" }
  ) {
    id nome email token
  }
}

```


# FUNCIONALIDADE REGISTRAR USUÁRIO 

MUTATION

projeto-final/backend/resolvers/Mutation/usuario.js


# O QUE É O JWT JSON Web Token?

https://jwt.io/#debugger-io

O Toke é formado por 3 partes: a parte 3 é a chave
de verificação é alterada dependendo so que você passa como
segredo (string) e o que passará no Payload.

No Payload vamos armazenar as informações de:

```json

```

iat é a data de expiração.


# VAMOS CRIAR A QUERY DE LOGIN

Em 
```
projeto-final/backend/schema/Query.graphql
```

O ponto de entrada é este da Query, passa (email e senha)
retorna o Usuario com Token.
```graphql
login(dados: UsuarioLoginInput!): Usuario
```

## Criando a parte do JWT

Em projeto-final/backend/resolvers/comum/usuario.js

Criamos uma função que recebe um usuário 

```javascript
const jwt = require('jwt-simple')

/** Reutilizando o método - temos o método chamado perfis 
 * que vamos chamar de obterPerfis fazendo:
 * const { perfis: obterPerfis } =
*/
const { perfis: obterPerfis } = require('../Type/Usuario')

module.exports = {
    async getUsuarioLogado(usuario) {

        /** Recebe um usuário, a partir dele vamos 
         * obter os Perfis do usuário, vamos criar 
         * um objeto que representa o Payload do JWT
         */
        /** Utilizando o método obterPerfis importado acima */
        const perfis = await obterPerfis(usuario)
        const agora = Math.floor(Date.now() / 1000)

        const usuarioInfo = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            perfis: perfis.map(p => p.nome),
            iat: agora,
            exp: agora + (3 * 24 * 60 * 60) /** Data de expiração */
        }

        /** Vamos gerar o TOKEN usando o Payload + o 
         * Segredo que está no .env
         */
        const token = jwt.encode(usuarioInfo,
            process.env.APP_AUTH_SECRET)
        
        delete usuarioInfo.perfis
        return {
            ...usuarioInfo,
            token
        }
    }
}
```

# CONTEXTO - 3o Parâmetro do Apollo Server

1) Criaremos o arquivo projeto-final/backend/config/context.js

Como teste 

```javascript
module.exports = ({ req }) => {

console.log('Contexto');

/** Este objeto será o 3o parâmetro de todas as consultas!! */
return {
  versao: 'Versão 1.0'
}

}
```

Vamos em projeto-final/backend/resolvers/Query/usuario.js na consulta usuarios()
como não tem nenhum parâmetro, vamos colocar os 3 parâmetros

