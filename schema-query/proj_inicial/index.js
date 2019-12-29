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