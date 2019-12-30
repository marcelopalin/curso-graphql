# NESTE CAPÍTULO VAMOS TRABALHAR COM MUTATIONS

Vamos trabalhar com as outras 3 operações do CRUD.
LEMBRANDO QUE AINDA NÃO ESTAMOS TRABALHANDO COM BANCO DE DADOS, apenas
o arquivo data/db.js

- Projeto está dentro da pasta **mutation**

Iniciando, abra mutation no terminal:

```
npm i
npm start
```

Acesse a url e consulte os usuários, lembrando que ainda não implementamos
a parte de clientes aqui.
Também foi retirado os atributos 'salario' e 'vip' de Usuários.

Lembrando, podemos consultar os dados com ou sem "fragment";

Sem fragment:

```graphql
query {
  usuarios {
    id
    nome
    email
    idade
    perfil {
      nome
    }
  }
  usuario(id: 1){
    nome
  }
  perfis {
    id
    nome
  }
  perfil(id: 1) {
    nome
  }
}
```

Consultando com 'fragment':

```graphql
 fragment
  usuarioCompleto
  on
  Usuario {
    id
    nome
    email
    idade
    perfil{
      nome
    }
    status
  }

{
  usuario(id: 2) {
    ...usuarioCompleto
  }
 usuarios {
    ...usuarioCompleto
  }  
}
```

Resultado:

```json
{
  "data": {
    "usuario": {
      "id": 2,
      "nome": "Rafael Junior",
      "email": "rafajun@wemail.com",
      "idade": 31,
      "perfil": {
        "nome": "administrador"
      },
      "status": "INATIVO"
    },
    "usuarios": [
      {
        "id": 1,
        "nome": "João Silva",
        "email": "jsilva@zemail.com",
        "idade": 29,
        "perfil": {
          "nome": "comum"
        },
        "status": "ATIVO"
      },
      {
        "id": 2,
        "nome": "Rafael Junior",
        "email": "rafajun@wemail.com",
        "idade": 31,
        "perfil": {
          "nome": "administrador"
        },
        "status": "INATIVO"
      },
      {
        "id": 3,
        "nome": "Daniela Smith",
        "email": "danismi@umail.com",
        "idade": 24,
        "perfil": {
          "nome": "comum"
        },
        "status": "BLOQUEADO"
      }
    ]
  }
}
```

# FUNÇÃO QUE GERA O ID ÚNICO DO USUÁRIO

Em mutation/projeto/data/db.js vamos criar:

```javascript
function proximoId() {
    return id++
}
```

E substituímos nos dados onde o campo for id:

```javascript
const usuarios = [{
    id: proximoId(),
    nome: 'João Silva',
    email: 'jsilva@zemail.com',
    idade: 29,
    perfil_id: 1,
    status: 'ATIVO'
}, {
    id: proximoId(),
    nome: 'Rafael Junior',
    email: 'rafajun@wemail.com',
    idade: 31,
    perfil_id: 2,
    status: 'INATIVO'
}, {
    id: proximoId(),
    nome: 'Daniela Smith',
    email: 'danismi@umail.com',
    idade: 24,
    perfil_id: 1,
    status: 'BLOQUEADO'
}]
```

No caso de Perfim, vamos manter HARDCODE mesmo.

# AULA 33 - MUTATIONS

Assim como temos um TYPE QUERY, AGORA TEREMOS O TYPE MUTATIONS.

Vamos criar o arquivo mutation/projeto/schema/Mutation.graphql
e importar ele no mutation/projeto/schema/index.graphql

```graphql
#import Usuario, Perfil from 'Usuario.graphql'
#import Query from 'Query.graphql'
#import Mutation from 'Mutation.graphql'
```

A mesma coisa que acontecia na Query acontecerá na Mutation.
Para cada ponto de entrada criado na Mutation:

```graphql
type Mutation {
    # Virgula opcional
    # Mutations de Usuario
    novoUsuario(
        dados: UsuarioInput!
    ): Usuario!

    excluirUsuario(
        filtro: UsuarioFiltro!
    ): Usuario

    alterarUsuario(
        filtro: UsuarioFiltro!
        dados: UsuarioInput!
    ): Usuario

    # Mutations de Perfil
    novoPerfil(
        dados: PerfilInput!
    ): Perfil!

    excluirPerfil(
        filtro: PerfilFiltro!
    ): Perfil

    alterarPerfil(
        filtro: PerfilFiltro!
        dados: PerfilInput!
    ): Perfil
}
```

Vamos criar um Resolver em: 
mutation/projeto/resolvers/Mutation/usuario.js
mutation/projeto/resolvers/Mutation/perfil.js
E vamos importa-las dentro de:
mutation/projeto/resolvers/Mutation/index.js

```graphql
const usuario = require('./usuario')
const perfil = require('./perfil')

 module.exports = {
    ...usuario,
    ...perfil,
 }
```

# RESOLVERS DE USUÁRIO

```javascript
const { usuarios, proximoId } = 
    require('../../data/db')

function indiceUsuario(filtro) {
    if(!filtro) return -1
    const { id, email } = filtro
    if(id) {
        return usuarios
            .findIndex(u => u.id === id)
    } else if(email) {
        return usuarios
            .findIndex(u => u.email === email)
    }
    return -1
}

module.exports = {
    // { nome, email, idade }
    novoUsuario(_, { dados }) {
        const emailExistente = usuarios
            .some(u => u.email === dados.email)

        if(emailExistente) {
            throw new Error('E-mail cadastrado')
        }

        const novo = {
            id: proximoId(),
            ...dados,
            perfil_id: 1,
            status: 'ATIVO'
        }

        usuarios.push(novo)
        return novo
    },
    excluirUsuario(_, { filtro }) {
        const i = indiceUsuario(filtro)
        if(i < 0) return null
        const excluidos = 
            usuarios.splice(i, 1)
        return excluidos ? 
            excluidos[0] : null
    },
    alterarUsuario(_, { filtro, dados }) {
        const i = indiceUsuario(filtro)
        if(i < 0) return null

        usuarios[i].nome = dados.nome
        usuarios[i].email = dados.email
        if(dados.idade) {
            usuarios[i].idade = dados.idade
        }

        // const usuario = {
        //     ...usuarios[i],
        //     ...args
        // }

        // usuarios.splice(i, 1, usuario)
        // return usuario
        return usuarios[i]
    }
}
```

# UsuarioInput

Veja que para recebermos os argumentos para criarmos um Novo Usuário por exemplo, precisaríamos do 'nome', 'email' e 'idade'.
Para simplificar nossa sintaxe em Usuario.graphql criamos:

```graphql
input UsuarioInput {
    nome: String
    email: String
    idade: Int
}
```

Ao invés do nosso resolver ser:

```javascript
    // { nome, email, idade } será um UsuarioInput
    novoUsuario(_, { nome, email, idade }) {
        const emailExistente = usuarios
            .some(u => u.email === dados.email)

        if(emailExistente) {
            throw new Error('E-mail cadastrado')
        }

        const novo = {
            id: proximoId(),
            ...dados,
            perfil_id: 1,
            status: 'ATIVO'
        }

        usuarios.push(novo)
        return novo
    },
```

Resolver Final com UserInput no Schema:

Schema = 

```graphql
    novoUsuario(
        dados: UsuarioInput!
    ): Usuario!
```

Resolver:

```javascript
    // { nome, email, idade } = UsuarioInput
    // que chamamos de dados
    novoUsuario(_, { dados }) {
        const emailExistente = usuarios
            .some(u => u.email === dados.email)

        if(emailExistente) {
            throw new Error('E-mail cadastrado')
        }

        const novo = {
            id: proximoId(),
            ...dados, //Diferença vem aqui - usamos um Destructuring
            perfil_id: 1,
            status: 'ATIVO'
        }

        usuarios.push(novo)
        return novo
    },
```

# EXECUTANDO A MUTATION - CRIAR UM USUÁRIO

```graphql
mutation {
  novoUsuario(dados: { nome: "Ana Paula", email: "ana@mail.com", idade: 33 }) {
    id
    nome
    idade
    perfil {
      nome
    }
  }
}
```

# VALIDAÇÃO DO EMAIL AO CRIAR NOVO USUÁRIO

Como estamos utilizando um BD na memória, toda alteração no código
reinicia o servidor, pois se tentarmos inserir 2x o mesmo usuário será lançado uma exceção pois os e-mails não podem se repetir.

E se executarmos a exclusão 2x receberemos null quando o usuário não for encontrado para ser deletado.

```graphql
mutation {
  novoUsuario(dados: { nome: "Marcelo", email: "meu@mail.com", idade: 48 }) {
    id
    nome
    email
    idade
    perfil {
      nome
    }
  }
  
  excluirUsuario(filtro: {id: 2}){
    nome id email
  }
  
}
```

Resposta caso tentemos executar pela 2x:

```json
{
  "errors": [
    {
      "message": "E-mail já cadastrado! Não pode ser duplicado!",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": [
        "novoUsuario"
      ],
      "extensions": {
        "code": "INTERNAL_SERVER_ERROR",
        "exception": {
          "stacktrace": [
            "Error: E-mail já cadastrado! Não pode ser duplicado!",
            "    at novoUsuario (/home/mpi/www/curso-graphql/mutation/projeto/resolvers/Mutation/usuario.js:27:19)",
            "    at field.resolve (/home/mpi/www/curso-graphql/mutation/projeto/node_modules/graphql-extensions/dist/index.js:128:26)",
            "    at resolveFieldValueOrError (/home/mpi/www/curso-graphql/mutation/projeto/node_modules/graphql/execution/execute.js:480:18)",
            "    at resolveField (/home/mpi/www/curso-graphql/mutation/projeto/node_modules/graphql/execution/execute.js:447:16)",
            "    at /home/mpi/www/curso-graphql/mutation/projeto/node_modules/graphql/execution/execute.js:263:18",
            "    at /home/mpi/www/curso-graphql/mutation/projeto/node_modules/graphql/jsutils/promiseReduce.js:32:10",
            "    at Array.reduce (<anonymous>)",
            "    at promiseReduce (/home/mpi/www/curso-graphql/mutation/projeto/node_modules/graphql/jsutils/promiseReduce.js:29:17)",
            "    at executeFieldsSerially (/home/mpi/www/curso-graphql/mutation/projeto/node_modules/graphql/execution/execute.js:260:37)",
            "    at executeOperation (/home/mpi/www/curso-graphql/mutation/projeto/node_modules/graphql/execution/execute.js:238:55)"
          ]
        }
      }
    }
  ],
  "data": null
}
```

# MUTATION - ALTERAÇÃO DE USUÁRIOS

```javascript
    alterarUsuario(_, { filtro, dados }) {

        // Consulta se o usuário existe, 
        // senão retorna null
        const i = indiceUsuario(filtro)
        if(i < 0) return null

        // Atualiza o Nome, E-mail e Idade
        usuarios[i].nome = dados.nome
        usuarios[i].email = dados.email
        if(dados.idade) {
            usuarios[i].idade = dados.idade
        }


        // Outra maneira de fazer iss
        // const usuario = {
        //     ...usuarios[i],
        //     ...args
        // }

        // usuarios.splice(i, 1, usuario)
        // return usuario
        return usuarios[i]
    }
```

Na ferramento do ApolloServer execute a seguinte consulta:

```

```