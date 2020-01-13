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
            exp: agora + (3 * 24 * 60 * 60) /** 3 dias Data de expiração */
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