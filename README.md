# Curso GraphQL

# Introdução Básica

Pessoal nada mais digamos assim oportuno do que mostrar para vocês o site do próprio GrafQL pra vocês entenderem um conceito do que é o GraphQL que ele mostra em algumas imagens ilustrativas que tem no site

Depois vamos fazer uma comparação entre um pouquinho do REST um pouquinho do GraphQL e porque o GraphQL ele atende à necessidade de obter dados ou mesmo persistir dados do nosso backend de uma forma mais flexível.

Olhando pra definição de GraphQL que ele tem logo na entrada do site é o seguinte o GraphQL é uma linguagem de consultas de API, ou seja, o GraphQL define a forma de você obter, você pedir para a sua API aquilo que você quer obter como resposta certa e você acaba tirando a responsabilidade do servidor mandar sempre uma resposta chapada com quantidade definida de Campos.

Você coloca essa responsabilidade para o frontend para a sua aplicação cliente seja na aplicação Mobile seja na aplicação Web ou desktop o cliente a sua aplicação Frontend vai dizer aquilo que ela quer e em resposta à sua API Graph que ele vai mandar seus dados que foram solicitados e somente os dados que foram solicitados.

Vamos supor que você tem um webservice se que vai retornar o ID do usuário o nome do usuário. O e-mail do usuário e todas as contas que o usuário tem.

E aí você tem um outro serviço que você quer ter apenas o áudio o nome e o e-mail mas não quer obter todas as contas por exemplo telefônicas de um determinado usuário.

E aí o que é que a maioria das pessoas faz ou pelo menos boa parte dos desenvolvedores fazem a eu tenho aquele serviço que tem os três dados que eu quero. Então vou pegar esse mesmo serviço vou trazer muitas informações com todas as contas telefônicas do usuário mas eu vou usar apenas o nome e o e-mail do usuário.

Ou seja uma parte dos dados simplesmente veio para o de forma desnecessária.
O mais dados do que precisa. Nesse caso no GraphQL isso não vai acontecer porque quem está dizendo o que é que quer receber como resposta ao front end e não à sua aplicação backend.

O fato é que você manda a partir do front end aquilo que você quer que o back end devolvo com a resposta. Dessa forma você tem uma facilidade muito grande para definir aquilo que você quer uma vez que seus dados estão mapeados.

Você consegue navegar não apenas num dado básico mas também nos relacionamentos.

Na próxima aula vamos ver como você pega os dados e mapeia isso para uma estrutura
mais baseada em GraphQL e a partir desses nós você consegue navegar em outros nós.

E o GraphQL resolve isso de uma forma muito inteligente e vai fazer com que você tenha uma flexibilidade absurda para obter os dados.


# GRAPHQL x REST

Pessoal na sala vou falar um pouquinho mais sobre REST x GRAPHQL quais são as diferenças básicas que você tem.

As diferenças básicas eu já falei também que você pode mesclar dentro de uma única aplicação uma API REST e uma API GraphQL sem problema nenhum.

REST = vários ENDPOINTS diferentes

GRAPHQL = apenas UM ENDPOINT

- Quando temos RELACIONAMENTOS! As URLs do REST começam a ficar complexas demais, enquanto o GraphQL você passa a sua consulta no BODY e ele então é interpretado no Backend e retornado a resposta para o FrontEnd.

# PLUG-IN VSCODE GRAPHQL

O vscode 

# PRIMEIRO VAMOS ENTENDER E DESENVOLVER O SCHEMA-QUERY

No diretório curso-graphql/schema-query/projeto digite:

```
npm i
```

Aqui já temos configurado o **nodemon** para restartar a todo momento e a ferramenta de desenvolvimento de consultas do GraphQL que pode ser acessada na porta 4000.

```
npm start
```

Acesse http://localhost:4000/


# PRIMEIRA QUERY + RESOLVERS

Para cada query temos que criar uma função resolver para atender o pedido da query.

O servidor Apollo por padrão cria uma ferramenta para que possamos fazer as consultas
mas quando vamos para Produção esta ferramenta é desabilitada.

Vamos criar dentro de typeDefs o PRIMEIRO TIPO que tem um nome reservado pelo GraphQL.

Tudo que for dentro do type Query são as portas de entrada para o GRAFO. A partir do Nó
que você entrar você pode pegar dados dele, ou navegar para outros nós.
Vamos aprender a criar uma consulta e RESOLVER esta consulta.

Vamos criar a consulta Ola() que retorna uma string e um Resolver dentro de Query (que é uma função que recebe
um conjunto de parâmetros)

Exemplo:

```javascript
const { ApolloServer, gql } = require('apollo-server')
const { importSchema } = require('graphql-import')

const typeDefs = gql`
    # Pontos de Entrada da sua API
    # Para cada consulta, você deve criar um resolver
    type Query {
        ola: String
    }
`

const resolvers = {
    Query: {
        ola() {
            return 'Minha primeira query em GraphQL!'
        }
    }
}


const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({ url }) => {
    console.log(`Executando em ${url}`)
})
```


```
npm start
```

Acesse http://localhost:4000/ e na ferramenta digite:

```json
query {
  ola
}
```

Como resposta da consulta obterá:

```json
{
  "data": {
    "ola": "Minha primeira query em GraphQL!"
  }
}
```


Veja que depois de organizado o código temos o index.js agora, ao invés de ter
as seções typeDefs e resolvers, 

```javascript
const typeDefs = gql`
    # Pontos de Entrada da sua API
    # Para cada consulta, você deve criar um resolver
    type Query {
        ola: String
    }
`

const resolvers = {
    Query: {
        ola() {
            return 'Minha primeira query em GraphQL!'
        }
    }
}
```


teremos eles importados de arquivos dentro da pasta **resolvers**
onde o **resolvers/index.js** é importado primeiro e importa o restante


resolvers/index.js: 
```javascript
const Query = require('./Query')
const Produto = require('./Produto')
const Usuario = require('./Usuario')

module.exports = {
    Query,
    Produto,
    Usuario
}
```

E os Schemas são importados de schema-query/projeto/schema/index.graphql

Para que o Nodemon passe a considerar as alterações nos arquivo .graphql tivemos que trocar
a linha de comando para: 

```json
  "scripts": {
    "start": "nodemon --ext js,graphql"
  },
```

Resultado Final do index.js é:


```javascript
const { ApolloServer, gql } = require('apollo-server')
const { importSchema } = require('graphql-import')
const resolvers = require('./resolvers')

const schemaPath = './schema/index.graphql'
const server = new ApolloServer({
    typeDefs: importSchema(schemaPath),
    resolvers
})

server.listen().then(({ url }) => {
    console.log(`Executando em ${url}`)
})
```

# QUAIS CONSULTAS JÁ ESTÃO PRONTAS?

Basta iniciarmos olhando dentro de schema-query/projeto/schema/index.graphql, nele podemos ver:

```graphql
#import Usuario from 'Usuario.graphql'
#import Perfil from 'Perfil.graphql'
#import Tipo from 'Tipo.graphql'
#import Produto from 'Produto.graphql'
#import Query from 'Query.graphql'
#import Cliente from 'Cliente.graphql'

scalar Date
```

Ou seja, temos que olhar os arquivos schema-query/projeto/schema/Usuario.graphql
schema-query/projeto/schema/Produto.graphql e schema-query/projeto/schema/Query.graphql

Se iniciarmos com **Query.graphql** temos:

```graphql
# Pontos de entrada da sua API!
type Query {
    ola: String!
    horaAtual: Date!
    usuarioLogado: Usuario
    produtoEmDestaque: Produto
    numerosMegaSena: [Int!]!
    usuarios: [Usuario]
    clientes: [Cliente]
    usuario(id: Int): Usuario
    cliente(id: Int): Cliente
    perfis: [Perfil]
    tipos: [Tipo]
    perfil(id: Int): Perfil
    tipo(id: Int): Tipo
}
```

Em schema-query/projeto/resolvers/index.js teremos:

```graphql
const Query = require('./Query')
const Produto = require('./Produto')
const Usuario = require('./Usuario')
const Cliente = require('./Cliente')

module.exports = {
    Query,
    Produto,
    Usuario,
    Cliente
}
```

Portanto, para cada um desses pontos de entrada da API teremos um RESOLVER em
schema-query/projeto/resolvers/Query.js:

```javascript
const { usuarios, perfis, clientes, tipos } = require('../data/db')

module.exports = {
    ola() {
        return 'Bom dia!'
    },
    horaAtual() {
        return new Date
    },
    usuarioLogado(obj) {
        // Apenas para mostrar que o objeto é null neste ponto
        // apenas depois de retornado que teremos o objeto
        console.log(obj)
        return {
            id: 1,
            nome: 'Admin Logado',
            email: 'admin@mail.com',
            idade: 23,
            salario_real: 1234.56,
            vip: true
        }
    },
    produtoEmDestaque() {
        return {
            nome: 'Notebook Gamer',
            preco: 4890.89,
            desconto: 0.5
        }
    },
    numerosMegaSena() {
        // return [4, 8, 13, 27, 33, 54]
        const crescente = (a, b) => a - b
        return Array(6).fill(0)
            .map(n => parseInt(Math.random() * 60 + 1))
            .sort(crescente)
    },
    usuarios() {
        return usuarios
    },
    clientes() {
        return clientes
    },
    cliente(_, { id }) {
        //Usando o destructuring no args já pegamos { id }
        const sels = clientes
            .filter(c => c.id === id)
        return sels ? sels[0] : null
    },    
    tipos() {
        return tipos
    },    
    tipo(_, { id }) {
        const sels = tipos
            .filter(p => p.id === id)
        return sels ? sels[0] : null 
    },    
    usuario(_, { id }) {
        const sels = usuarios
            .filter(u => u.id === id)
        return sels ? sels[0] : null
    },
    perfis() {
        return perfis
    },
    perfil(_, { id }) {
        const sels = perfis
            .filter(p => p.id === id)
        return sels ? sels[0] : null 
    }
}
```

Lembrando que as consultas estão definidas em schema-query/projeto/schema/Query.graphql
Na ferramenta execute as seguintes consultas:

```graphql
# Write your query or mutation here
query {
  ola
  horaAtual
  usuarioLogado {
    id
    nome
    email
    idade
    salario
  }
  produtoEmDestaque {
    nome
    preco
    desconto
    precoComDesconto
  }
  numerosMegaSena
  usuarios {
    id
    nome
    email
    idade
    salario
    vip
    perfil {
      nome
    }
  }
  clientes {
    id
    situacao_cadastral
    data_situacao_cadastral
    cnpj
    razao_social
    nome_fantasia
    cnae_fiscal
    capital_social
    tipo {
      nome
    }
  }
  usuario(id: 1){
    nome
  }
  cliente(id: 1){
    cnpj
    razao_social
    nome_fantasia
    tipo {
      nome
    }
  }
  perfis {
    id
    nome
  }
  tipos {
    id
    nome
  } 
  perfil(id: 1) {
    nome
  }
  tipo(id: 1) {
    nome
  }
}
```


E a resposta esperada é:


```graphql
{
  "data": {
    "ola": "Bom dia!",
    "horaAtual": "2019-12-30T00:56:20.385Z",
    "usuarioLogado": {
      "id": 1,
      "nome": "Admin Logado",
      "email": "admin@mail.com",
      "idade": 23,
      "salario": 1234.56
    },
    "produtoEmDestaque": {
      "nome": "Notebook Gamer",
      "preco": 4890.89,
      "desconto": 0.5,
      "precoComDesconto": 2445.445
    },
    "numerosMegaSena": [
      1,
      19,
      21,
      33,
      57,
      57
    ],
    "usuarios": [
      {
        "id": 1,
        "nome": "João Silva",
        "email": "jsilva@zemail.com",
        "idade": 29,
        "salario": null,
        "vip": null,
        "perfil": {
          "nome": "comum"
        }
      },
      {
        "id": 2,
        "nome": "Rafael Junior",
        "email": "rafajun@wemail.com",
        "idade": 31,
        "salario": null,
        "vip": null,
        "perfil": {
          "nome": "administrador"
        }
      },
      {
        "id": 3,
        "nome": "Daniela Smith",
        "email": "danismi@umail.com",
        "idade": 24,
        "salario": null,
        "vip": null,
        "perfil": {
          "nome": "comum"
        }
      }
    ],
    "clientes": [
      {
        "id": 1,
        "situacao_cadastral": 2,
        "data_situacao_cadastral": "2013-11-06",
        "cnpj": "19373880000170",
        "razao_social": "AMPERE CONSULTORIA EMPRESARIAL LTDA.",
        "nome_fantasia": "AMPERE CONSULTORIA",
        "cnae_fiscal": "7020-4/00 Atividades de consultoria em gestão empresarial, exceto consultoria técnica específica",
        "capital_social": 5000,
        "tipo": {
          "nome": "Consultoria"
        }
      },
      {
        "id": 2,
        "situacao_cadastral": 2,
        "data_situacao_cadastral": "2012-02-02",
        "cnpj": "15027346000150",
        "razao_social": "MEGA WATT COMERCIALIZACAO DE ENERGIA LTDA",
        "nome_fantasia": "MEGA WATT",
        "cnae_fiscal": "3513-1/00 Comércio atacadista de energia elétrica",
        "capital_social": 2685000,
        "tipo": {
          "nome": "Comercializadora"
        }
      }
    ],
    "usuario": {
      "nome": "João Silva"
    },
    "cliente": {
      "cnpj": "19373880000170",
      "razao_social": "AMPERE CONSULTORIA EMPRESARIAL LTDA.",
      "nome_fantasia": "AMPERE CONSULTORIA",
      "tipo": {
        "nome": "Consultoria"
      }
    },
    "perfis": [
      {
        "id": 1,
        "nome": "comum"
      },
      {
        "id": 2,
        "nome": "administrador"
      }
    ],
    "tipos": [
      {
        "id": 1,
        "nome": "Consultoria"
      },
      {
        "id": 2,
        "nome": "Comercializadora"
      }
    ],
    "perfil": {
      "nome": "comum"
    },
    "tipo": {
      "nome": "Consultoria"
    }
  }
}
```

# RELACIONAMENTOS - vamos usar RESOLVER para Relacionar


Um relacionamente entre Usuario e Perfil (ou Cliente e Tipo)

Vamos criar um novo atributo do usuário chamado **perfil_id**:

```json
const usuarios = [{
    id: 1,
    nome: 'João Silva',
    email: 'jsilva@zemail.com',
    idade: 29,
    perfil_id: 1,
    status: 'ATIVO'
}, {
    id: 2,
    nome: 'Rafael Junior',
    email: 'rafajun@wemail.com',
    idade: 31,
    perfil_id: 2,
    status: 'INATIVO'
}, {
    id: 3,
    nome: 'Daniela Smith',
    email: 'danismi@umail.com',
    idade: 24,
    perfil_id: 1,
    status: 'BLOQUEADO'
}]
```

No Schema do Usuário definimos o atributo "perfil" que retorna um Type Perfil:

```graphql
type Usuario {
    id: Int
    nome: String!
    email: String!
    idade: Int
    salario: Float
    vip: Boolean
    perfil: Perfil
    status: UsuarioStatus
}
```

e para relacionarmos vamos criar um RESOLVER em schema-query/projeto/resolvers/Usuario.js
que 

```javascript
const { perfis } = require('../data/db')

module.exports = {
    /**
     * Outro resolver que serve para resolver o campo perfil_id retornando
     * apenas o "perfil"
     * @param {usuario} usuario 
     */
    perfil(usuario) {
        const sels = perfis
            .filter(p => p.id === usuario.perfil_id)
        return sels ? sels[0] : null
    }
}
```

ou, o mesmo que:

```javascript
const { perfis } = require('../data/db')

module.exports = {
    /**
     * Outro resolver que serve para resolver o campo perfil_id retornando
     * apenas o "perfil"
     * @param {obj} obj 
     */
    perfil(obj) {
        const sels = perfis
            .filter(p => p.id === obj.perfil_id)
        return sels ? sels[0] : null /** se filtrado, pega apenas o primeiro */
    }
}
```


# USO DO GRAPHQL

Pode ser usado para INTEGRAR diversas APIs, pois os resolvers podem consultar
as outras APIs e retornar a respostas agregadas.

# FRAGMENT

- Conjunto de dados frequentemente requisitados do Tipo Usuário (por exemplo)

Na ferramenta você cria:

```graphql
fragment usuarioCompleto on Usuario{
	id nome email idade salario vip perfil status
}
```

E para utilizarmos basta fazermos igual ao JS utilizando o Operador Spread (...)
```graphql
usuario(id: 2) {
    ...usuarioCompleto
}
```

Veja como fica (Lembrando que o Fragment não pode estar dentro dos query{ }):

```graphql
fragment
  usuarioCompleto
  on
  Usuario {
    id
    nome
    email
    idade
    salario
    vip
    perfil{
      nome
    }
    status
  }

{
  usuario(id: 2) {
    ...usuarioCompleto
  }
}
```

Resultado

```json
{
  "data": {
    "usuario": {
      "id": 2,
      "nome": "Rafael Junior",
      "email": "rafajun@wemail.com",
      "idade": 31,
      "salario": null,
      "vip": null,
      "perfil": {
        "nome": "administrador"
      },
      "status": "INATIVO"
    }
  }
}
```