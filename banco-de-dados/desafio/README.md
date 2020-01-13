# MISTURANDO GRAPHQL com BANCO DE DADOS

## NO BD

- Temos o Knex configurado com as Migrations que cria as tabelas
- usuarios, perfis e usuarios_perfis

Acertei o knexfile.js para:

```javascript
// Update with your config settings.

module.exports = {
  client: 'mysql',
  connection: {
    database: 'projgrapqlbd',
    user:     'admin_grapql',
    password: 'senha123'
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};
```

# Executando as Migrations


Este já foi feito, não precisa executar:

```
npx knex migrate:make tabela_perfis
npx knex migrate:make tabela_usuarios
npx knex migrate:make tabela_usuarios_perfis
```

Ele executará a Migration, criando as tabelas e preenchendo-as
pois no .then fizemos alguns seeders:

```
npx knex migrate:latest
```

# PRONTO - RODE O PROJETO

```
npm start
```

Acesse http://localhost:4000/

No Playground vamos fazer algumas Consultas:

```graphql
# Write your query or mutation here
query {
usuarios{
  id nome email perfis {
    id nome rotulo
  }
}
}
```


## NO GRAPHQL

1) No GraphQL temos que criar os Types e as Querys

Lembrando que no index.js vamos importar os Schemas da seguinte maneira:

```javascript
const schemaPath = './schema/index.graphql'
const server = new ApolloServer({
    typeDefs: importSchema(schemaPath),
    resolvers
})
```

Na pasta **schema** o index.graphql importa os outros arquivos:

```graphql
#import Usuario, Perfil from 'Usuario.graphql'
#import Query from 'Query.graphql'
#import Mutation from 'Mutation.graphql'
```

Vamos começar criando o Type Usuario e Perfil no arquivo **Usuario.graphql**:

```graphql
type Usuario {
    id: Int
    nome: String!
    email: String!
    perfis: [Perfil]
}

input UsuarioInput {
    nome: String
    email: String
    senha: String
    perfis: [PerfilFiltro]
}

input UsuarioFiltro {
    id: Int
    email: String
}

type Perfil {
    id: Int
    nome: String!
    rotulo: String!
    usuarios: [Usuario]
}

input PerfilInput {
    nome: String
    rotulo: String
}

input PerfilFiltro {
    id: Int
    nome: String
}
```

# QUERIES (typeDefs)


PONTO DE ENTRADA DO GRAPHQL!!

Aqui nós definiremos quais consultas estão disponíveis:

**banco-de-dados\desafio\schema\Query.graphql**

```graphql
# Pontos de entrada da sua API!
type Query {
    usuarios: [Usuario]
    usuario(filtro: UsuarioFiltro!): Usuario
    perfis: [Perfil]
    perfil(filtro: PerfilFiltro!): Perfil
}
```

Poderemos CONSULTAR: usuarios, usuario(por id ou email), perfis, perfil (por id ou nome)

Para cada uma destas consultas teremos um resolver, por exemplo:

Para usuários está em: banco-de-dados\desafio\resolvers\Query\usuario.js
Para perfis está em: banco-de-dados\desafio\resolvers\Query\perfil.js


# PROJETO FINAL 

Vamos ver função de LOGIN e REGISTER