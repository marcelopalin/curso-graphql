// const db = require('../config/db')

// db('perfis')
// .then(res => console.log(res))
// .finally(() => db.destroy()) /** Isso você NÃO FARÁ NA SUA API - pois o Knex 
// controla o Pull de conexões para não ficar abrindo e fechando */ 
/** ------------------------------------------------------------------ */


/** Usando Map para obter só os nomes dos Perfis */

// const db = require('../config/db')

// // db('perfis')
// // .then(res => {
// //     const resp = res.map(p => p.nome)
// //     return resp
// // })
// // .then(nomes => console.log(nomes))
// // .finally(() => db.destroy()) 


// //ou

// db('perfis')
// .then(res => res.map(p => p.nome))
// .then(nomes => console.log(nomes))
// .finally(() => db.destroy()) 


/** ------------------------------------------------------------------ */



/** O Knex te permite chamar o Map sem usar o Then */

// const db = require('../config/db')

// // db('perfis')
// // .then(res => res.map(p => p.nome))
// // .then(nomes => console.log(nomes))
// // .finally(() => db.destroy()) 

// /** Podemos usar o Map direto */
// db('perfis')
// .map(p => p.nome)
// .then(nomes => console.log(nomes))
// .finally(() => db.destroy()) 

// /** 
//  * Resp:
//  * [ 'comum', 'admin', 'cadastrador', 'visitante' ]
//  */
/** ------------------------------------------------------------------ */

/** Outra forma de fazer Select */

// const db = require('../config/db')

// db('perfis').select('id', 'nome')
// .then(res => console.log(res))
// .finally(() => db.destroy()) 

/** 
 * Resp:
 * $ node testes/consulta.js
  [ RowDataPacket { id: 2, nome: 'admin' },
  RowDataPacket { id: 3, nome: 'cadastrador' },
  RowDataPacket { id: 1, nome: 'comum' },
  RowDataPacket { id: 7, nome: 'visitante' } ]
 */
/** ------------------------------------------------------------------ */


/** Outra forma de fazer Select 2 */

// const db = require('../config/db')

// db.select('id', 'nome')
// .from('perfis')
// .then(res => console.log(res))
// .finally(() => db.destroy()) 

/** 
 * Resp:
 * $ node testes/consulta.js
  [ RowDataPacket { id: 2, nome: 'admin' },
  RowDataPacket { id: 3, nome: 'cadastrador' },
  RowDataPacket { id: 1, nome: 'comum' },
  RowDataPacket { id: 7, nome: 'visitante' } ]
 */
/** ------------------------------------------------------------------ */



/** Outra forma de fazer Select 2 - COM LIMITE */

const db = require('../config/db')

db.select('id', 'nome')
.from('perfis').limit(2)
.then(res => console.log(res))
.finally(() => db.destroy()) 

/** 
 * Resp:
 * $ node testes/consulta.js
[ RowDataPacket { id: 2, nome: 'admin' },
  RowDataPacket { id: 3, nome: 'cadastrador' } ]
 */
/** ------------------------------------------------------------------ */