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