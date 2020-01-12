const db = require('../config/db')

// db('usuarios')
// .then(res => console.log(res))
// .finally(() => db.destroy())

//Supondo que passou um email que existe
let email = 'pedro.palin@empresa.com.br'

// Verifica se usuário existe
// let usuario = db('usuarios')
// .where({ email: email }) /** EC6 - quando key = valor usa somente um */
// .then(res => console.log(res))
// .finally(() => db.destroy())

// Se fizesse direto assim, teria que usar Async/Await para 
// imprimir o usuário! Ou então usar o Then! 
// Experimente e veja que não funciona!
// let usuario = db('usuarios')
// .where({ email }).first()

// if(usuario){
//     console.log(usuario)
// }

/** Fazendo com Promisse */
// let usuario = db('usuarios')
// .where({ email })
// .first()
// .then((res) => {console.log(res))

// /** Verá que este comando será executado Primeiro! 
//  * Usuario = undefined
//  * Precisamos usar ASYNC/AWAIT!
//  */
// if(usuario){
//     console.log(`${usuario.nome} existe no BD! `)
// }


/** Com Async/Await */
async function consulta_teste(email){
    let usuario = await db('usuarios')
    .where({ email }).first()

    /** 
     * Agora esta linha só será executada
     * depois que a primeira estiver terminada!
     */
    if(usuario){
        console.log(`${usuario.nome} existe no BD! `)
    }  
    
    return usuario

}

/** Devemos chamar a função para funcioanar
 *  E podemos usar a sintaxe de Promisse nela!
 */

 consulta_teste(email)
 .then(res => console.log(res))







