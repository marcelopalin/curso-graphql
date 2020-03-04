REQUISITOS:

- BD MYSQL CONFIGURADO - DETALHES NO README

```sql
BD projgrapqlbd;
User: admin_grapql
Pass: senha123


CREATE DATABASE projgrapqlbd CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE USER 'admin_grapql'@'localhost' IDENTIFIED WITH mysql_native_password BY 'senha123';
GRANT ALL PRIVILEGES ON *.* TO 'admin_grapql'@'localhost';
CREATE USER 'admin_grapql'@'%' IDENTIFIED WITH mysql_native_password BY 'senha123';
GRANT ALL PRIVILEGES ON *.* TO 'admin_grapql'@'%';
flush privileges;
quit;
```

> Crie o arquivo **.env**


# COMO USAR?

Acesse http://localhost:4000/ e no Playground do ApolloServer digite:

```graphql
query {
  login(dados: { email: "palin@mail.com", senha: "senha123" }) {
    id
    nome
    email
    token
    perfis {
      nome
    }
  }
}
```

# SIMULANDO USUÁRIO LOGADO

Vá no arquivo **projeto-final/backend/config/context.js** e descomente a linha:

```javascript
const jwt = require('jwt-simple')

module.exports = async ({ req }) => {
    
    // Descomente somente enquanto estiver 
    // em desenvolvimento
    await require('./simularUsuarioLogado')(req)
```

Vá no Playground e digite:

```graphql
query {
  usuarios{
    id nome email
  }
}
```

E você obterá os resultados:

```graphql
{
  "data": {
    "usuarios": [
      {
        "id": 1,
        "nome": "Marcelo",
        "email": "palin@mail.com"
      },
      {
        "id": 6,
        "nome": "José da Silva",
        "email": "jsilva@mail.com"
      }
    ]
  }
}
```

# COMO REGISTRAR UM USUÁRIO?

```graphql
mutation {
  registrarUsuario(
    dados: { nome: "Alexandre Furstenberger", email: "alexandre.furstenberger@mail.com", senha: "senha123" }
  ) {
    id
    nome
    email
    token
    perfis {
      nome rotulo
    }
  }
}
```

Resposta:

```json
{
  "data": {
    "registrarUsuario": {
      "id": 9,
      "nome": "Alexandre Furstenberger",
      "email": "alexandre.furstenberger@mail.com",
      "token": null,
      "perfis": [
        {
          "nome": "comum",
          "rotulo": "Comum"
        }
      ]
    }
  }
}
```



# COMO CADASTRAR UM NOVO USUÁRIO?

```graphql
mutation {
  novoUsuario(dados: { nome: "UserAPI", email: "user@mail.com" }) {
    id
    nome
    email
    perfis {
      nome
    }
  }
}
```

Obs: esta é uma rota protegida e somente o Perfil Admin pode utilizá-la,
mas quando você ativa em 
**projeto-final/backend/config/context.js**:

```javascript
const jwt = require('jwt-simple')

module.exports = async ({ req }) => {
    
    // Descomente somente enquanto estiver 
    // em desenvolvimento
    await require('./simularUsuarioLogado')(req)
```
você simula como se fosse um adminstrador.


Resposta:

```json
{
  "data": {
    "novoUsuario": {
      "id": 7,
      "nome": "UserAPI",
      "email": "user@mail.com",
      "perfis": [
        {
          "nome": "comum"
        }
      ]
    }
  }
}
```


# CONTEXT

O arquivo **projeto-final/backend/config/context.js** é verificado toda vez que é feita uma requisição. Ele é responsável por saber se o usuário está logado ou é autorizado executar a consulta.


projeto-final/backend/resolvers/index.js


# COMO FUNCIONA SEM O FRONTEND?

- Consultando direto pelo Playground do Apollo Server.

O ponto de entrada da API são as "queries" no arquivo: projeto-final/backend/schema/index.graphql

Depois de instalado **graphql-import** a importação dos arquivos:

```graphql
#import Usuario, Perfil from 'Usuario.graphql'
#import Query from 'Query.graphql'
#import Mutation from 'Mutation.graphql'
```

projeto-final/backend/schema/Query.graphql nós temos os pontos de Entrada da API, os resolvers estão implementadas em: projeto-final/backend/resolvers/Query/index.js

```graphql
# Pontos de entrada da sua API!
type Query {
    login(dados: UsuarioLoginInput!): Usuario
    usuarios: [Usuario]
    usuario(filtro: UsuarioFiltro!): Usuario
    perfis: [Perfil]
    perfil(filtro: PerfilFiltro!): Perfil
}
```

Os resolvers das "queries" Query são:

```javascript
const usuario = require('./usuario')
const perfil = require('./perfil')

 module.exports = {
    ...usuario,
    ...perfil,
 }
```

Que estão divididas nos arquivos **projeto-final/backend/resolvers/Query/perfil.js** e **projeto-final/backend/resolvers/Query/usuario.js**:

```javascript
const db = require('../../config/db')
const bcrypt = require('bcrypt-nodejs')
/** Função que obtem o Token do JWT, passando o Payload
 * e o Secret
 */
const { getUsuarioLogado } = require('../comum/usuario')

module.exports = {

    /**
     * 
     * Testando o Login:
     * 
     * query {
        login(dados: { email: "palin@mail.com", senha: "senha123" }) {
            id
            nome
            email
            token
            perfis {
            nome
            }
        }
        }
     * 
     * 
     */

    async login(_, { dados }) {

        /** Verifica se encontra o usuário */
        const usuario = await db('usuarios')
            .where({ email: dados.email })
            .first()

        /** Se não encontrar retorna uma msg genérica */
        if(!usuario) {
            throw new Error('Usuário/Senha inválido')
        }

        /** Compara a senha se é igual a criptografada */
        const saoIguais = bcrypt.compareSync(dados.senha,
            usuario.senha)

        /** Se não são iguais retorna mensagem genérica */
        if(!saoIguais) {
            throw new Error('Usuário/Senha inválido')
        }

        /** Função que Gera um Token JWT com o 
         * Payload e Secret */
        return getUsuarioLogado(usuario)
    },

    usuarios(parent, args, ctx) {
        /** 
         * Retorna os usuários
         * Método protegido, somente Admin
         * 3o parâmetro é o contexto onde 
         * pegamos usuario logado e outras
         * coisas mais que desejamos compartilhar
         * com as funcoes
         */
        console.log(ctx.versao)
        ctx && ctx.validarAdmin()
        return db('usuarios')
    },
    usuario(_, { filtro }, ctx) {
        ctx && ctx.validarUsuarioFiltro(filtro)
        
        if(!filtro) return null
        const { id, email } = filtro
        if(id) {
            return db('usuarios')
                .where({ id })
                .first()
        } else if(email) {
            return db('usuarios')
                .where({ email })
                .first()
        } else {
            return null
        }
    },
}
```

# MUTATIONS - sempre que for gerar efeito colateral, ou seja, alterar dados no backend. 

Iniciamos criando as Queries de Mutation:

**projeto-final/backend/schema/Mutation.graphql**

ANTES:

```javascript
    novoUsuario(_, { nome, email, idade }) {
        const novo = {
            id: proximoId(),
            nome,
            email,
            idade,
            perfil_id: 1        
        }
    }
        
```

Depois que aprendemos sobre o Input, a Mutation deve ficar assim:

Em projeto-final/backend/schema/Usuario.graphql:
```graphql
input UsuarioInput {
    nome: String
    email: String
    senha: String
    perfis: [PerfilFiltro]
}
```
Mutation final:
```
    novoUsuario(
        dados: UsuarioInput!
    ): Usuario!
```

# FAZENDO OS TESTES COM O FRONTEND

- Na pasta projeto-final/frontend está a parte do Frontend que é um projeto Vue com Vuetify.

Não esqueça de desabilitar em **projeto-final/backend/config/context.js**:

```javascript
const jwt = require('jwt-simple')

module.exports = async ({ req }) => {
    
    // Descomente somente enquanto estiver 
    // em desenvolvimento
    //await require('./simularUsuarioLogado')(req)
```

Instale os pacotes e execute:

```
npm run serve
```

Acesse na porta http://localhost:8080/

Assim que fizer a autenticação com um usuário com permissões de administrador você conseguirá listar usuários.