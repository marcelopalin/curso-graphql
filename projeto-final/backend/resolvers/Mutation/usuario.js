const bcrypt = require('bcrypt-nodejs')
const db = require('../../config/db')
const { perfil: obterPerfil } = require('../Query/perfil')
const { usuario: obterUsuario } = require('../Query/usuario')

/** Colocaremos todas as mutations dentro do objeto
 * const mutations e vamos exportá-lo lá embaixo.
 *  Porque depois quando precisar chamar uma função
 *  dentro da outra usaremos mutations.novoUsuario()
 *  ao invés de usar this.novoUsuario()
 */
const mutations = {

    /** Mutation chamada criado em:
     *  projeto-final/backend/schema/Mutation.graphql
     *  registrarUsuario() que recebe um Input:
     *  UsuarioRegistrarInput que está definido em:
     *  projeto-final/backend/schema/Usuario.graphql
     *  Necessita (nome, email e senha)
     * 
     *  No Playground:
     *   mutation {
     *       registrarUsuario(
     *           dados: { nome: "Pedro", email: "pp@mail.com", senha: "senha123" }
     *       ) {
     *           id
     *           nome
     *           email
     *           token
     *           perfis {
     *           nome rotulo
     *           }
     *       }
     *   } 
     * 
     */
    registrarUsuario(_, { dados }) {

        /** Pega o nome da constante que definiu acima
         * e vai passar o usuário.
         */
        return mutations.novoUsuario(_, {
            dados: {
                nome: dados.nome,
                email: dados.email,
                senha: dados.senha,
            }
        })
    },
    /**
     * 
     * mutation {
     *    novoUsuario(dados: 
     *      { nome: "Marcelo", email: "mp@mail.com", idade: 27 }) {
     *        id
     *        nome
     *        email
     *        perfil {
     *          nome
     *        }
     *    }
     * }
     * 
     * 
     */
    async novoUsuario(_, { dados }, ctx) {
        ctx && ctx.validarAdmin()
        try {
            const idsPerfis = []

            // Se não foi passado perfis é que a
            // chamada vem do registrarUsuario que é público
            // e não deve permitir poder escolher o perfil
            // será cadastrado como perfil comum!
            if(!dados.perfis || !dados.perfis.length) {
                dados.perfis = [{
                    nome: 'comum'
                }]
            }

            for(let filtro of dados.perfis) {
                const perfil = await obterPerfil(_, {
                    filtro
                })
                if(perfil) idsPerfis.push(perfil.id)
            }

            // criptografar a senha
            // Vamos chamar a função Sincrona
            const salt = bcrypt.genSaltSync()
            dados.senha = bcrypt.hashSync(dados.senha, salt)

            delete dados.perfis
            const [ id ] = await db('usuarios')
                .insert(dados)

            for(let perfil_id of idsPerfis) {
                await db('usuarios_perfis')
                    .insert({ perfil_id, usuario_id: id })
            }

            return db('usuarios')
                .where({ id }).first()
        } catch(e) {
            throw new Error(e.sqlMessage)
        }
    },
    async excluirUsuario(_, args, ctx) {
        ctx && ctx.validarAdmin()
        try {
            const usuario = await obterUsuario(_, args)
            if(usuario) {
                const { id } = usuario
                await db('usuarios_perfis')
                    .where({ usuario_id: id }).delete()
                await db('usuarios')
                    .where({ id }).delete()
            }
            return usuario
        } catch(e) {
            throw new Error(e.sqlMessage)
        }

    },
    async alterarUsuario(_, { filtro, dados }, ctx) {
        ctx && ctx.validarUsuarioFiltro(filtro)
        try {
            const usuario = await obterUsuario(_, { filtro })
            if(usuario) {
                const { id } = usuario
                if(ctx.admin && dados.perfis) {
                    await db('usuarios_perfis')
                        .where({ usuario_id: id }).delete()

                    for(let filtro of dados.perfis) {
                        const perfil = await obterPerfil(_, {
                            filtro
                        })
                        
                        if(perfil) {
                            await db('usuarios_perfis')
                                .insert({
                                    perfil_id: perfil.id,
                                    usuario_id: id
                                })
                        }
                    }
                }

                //Antes de Alterar vamos criptografar a senha
                if(dados.senha) {
                    // criptografar a senha
                    const salt = bcrypt.genSaltSync()
                    dados.senha = bcrypt.hashSync(dados.senha, salt)
                }

                delete dados.perfis
                await db('usuarios')
                    .where({ id })
                    .update(dados)
            }
            return !usuario ? null : { ...usuario, ...dados }
        } catch(e) {
            throw new Error(e)
        }
    }
}

module.exports = mutations