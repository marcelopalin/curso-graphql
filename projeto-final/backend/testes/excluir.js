const db = require('../config/db')

// excluir por id
db('usuarios').where({ id: 1 })
    .delete()
    .then(res => console.log(res))
    .finally(() => db.destroy())


// Para EXCLUIR TUDO - retire o Where! 
// db('perfis')
//     .delete()
//     .then(res => console.log(res))
//     .finally(() => db.destroy())