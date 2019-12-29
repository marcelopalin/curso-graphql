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


Portanto, para criarmos um Tipo Cliente e fazermos consulta devemos seguir os seguintes passos:

Passo I:

Criar schema-query/projeto/schema/Cliente.graphql

```javascript

```

Em schema-query/projeto/schema/index.graphql importe o Schema:

```

```