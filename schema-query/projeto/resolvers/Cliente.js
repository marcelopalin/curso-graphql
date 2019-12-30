const { tipos } = require('../data/db')

module.exports = {
    /**
     * Outro resolver que serve para resolver o campo tipo_id retornando
     * apenas o "perfil"
     * @param {cliente} cliente 
     */
     
    tipo(cliente) {
        const sels = tipos.filter(obj => obj.id === cliente.tipo_id)
        return sels ? sels[0] : null
    }
}