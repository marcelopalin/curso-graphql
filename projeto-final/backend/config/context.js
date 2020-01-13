const jwt = require('jwt-simple')

module.exports = async ({ req }) => {
    
    // Descomente somente enquanto estiver 
    // em desenvolvimento
    await require('./simularUsuarioLogado')(req)

    /** Espero receber o Token pelo Header  */
    /** Após o usuário fazer logo eu espero que o Token
     * venha sempre nas requisições
     */
    const auth = req.headers.authorization
    /** Depois de 7 caracteres eu extraio o Token
     * tiro a parte Bearer (espaço)
     */
    const token = auth && auth.substring(7)

    let usuario = null
    /** Verificando se o administrador é Admin */
    let admin = false
    
    if(token) {
        try {
            /** Decodificando o Token para pegar o Payload */
            let conteudoToken = jwt.decode(token,
                process.env.APP_AUTH_SECRET)
            /** Verificando a Validade do Token, se ele expirou */
            if(new Date(conteudoToken.exp * 1000) > new Date()) {
                usuario = conteudoToken
            }
        } catch(e) {
            // token inválido
        }
    }
    
    if(usuario && usuario.perfis) {
        admin = usuario.perfis.includes('admin')
    }

    const err = new Error('Acesso negado!')
    
    /** Apenas como exemplo de como funciona o contexto
     *  em projeto-final/backend/resolvers/Query/usuario.js
     *  na consulta usuarios() mande imprimir o valor de 
     *  versao definido no return.
     */
    let versao = "versão api 1.0"
    return {
        versao,
        usuario,
        admin,
        validarUsuario() {
            if(!usuario) throw err
        },
        validarAdmin() {
            if(!admin) throw err
        },
        validarUsuarioFiltro(filtro) {
            if(admin) return

            if(!usuario) throw err
            if(!filtro) throw err

            const { id, email } = filtro
            if(!id && !email) throw err
            if(id && id !== usuario.id) throw err
            if(email && email !== usuario.email) throw err
        }
    }
}