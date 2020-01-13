const db = require('../../config/db')

module.exports = {
    usuarios() {
        /** Aqui poderíamos passar um Limit, offset
         *  mas como é para teste apenas retornaremos
         *  o select.
         *  Em localhost:4000 você pode consultar:
         *  
         * 
         */
        return db('usuarios')
    },
    usuario(_, { filtro }) {

        /** Aqui vamos fazer uma consulta utilizando
         * o filtro. 
         * input UsuarioFiltro {
         *   id: Int
         *   email: String
         *   }
         * 
         * Posso consultar o usuário tanto pelo email quanto pelo id.
         * 
         * {
         *       usuario(
         *           filtro: {
         *           id: 1
         *       }
         *       ){
         *           nome email
         *       }
         * }
         * 
         */

        /** Se não passou o filtro eu retorno nulo */
        if(!filtro) return null

        /** Senão pego o id ou email passados e: */
        const { id, email } = filtro

        /** Se tenho ID consulto por id */
        if(id) {
            return db('usuarios')
                .where({ id })
                .first()
        /** Se tenho email consulto por email */
        } else if(email) {
            return db('usuarios')
                .where({ email })
                .first()
        } else {
            return null
        }
    },
}