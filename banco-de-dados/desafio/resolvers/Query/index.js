const usuario = require('./usuario')
const perfil = require('./perfil')
const outras = require('./outras')

/** 
 * Exporto todos os resolvers das Queries
 * que estão em:
 * banco-de-dados\desafio\schema\Query.graphql
 */
 module.exports = {
    ...usuario,
    ...perfil,
    ...outras
 }