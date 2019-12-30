const { perfis } = require('../data/db')

module.exports = {
    /** 
     * Podemos ter Resolvers dentro da Query ou dentro dos seus Tipos para resolver algum
     * atributo. Exemplo: o bd retorna salario_real, e nosso Schema de Usuario precisa
     * do campo salario. Então abaixo vamos criar um resolver chamado "salario" que
     * simplesmente pega o valor de salario_real e retorna o valor para "salario"
     */

    salario(usuario) {
        return usuario.salario_real
    },
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