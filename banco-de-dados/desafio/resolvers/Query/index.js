const usuario = require('./usuario')
const perfil = require('./perfil')
const outras = require('./outras')
const empresa = require('./empresa')

/** 
 * Exporto todos os resolvers das Queries
 * que estão em:
 * banco-de-dados\desafio\schema\Query.graphql
 */
 module.exports = {
    ...usuario,
    ...perfil,
    ...outras,
    ...empresa
 }