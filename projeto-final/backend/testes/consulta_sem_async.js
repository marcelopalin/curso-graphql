/** Mostrando a parte de Sincronismo antes de iniciarmos o Async/Await */
/** Se colocarmos um console.log('fim'); depois da Promise Select,
 * você acha que ele será executado antes ou depois?
 * 
 */
/** Filtrando WhereIn */

const db = require('../config/db')

db.select('id', 'nome')
.from('perfis')
.whereIn('id', [1,2,3])
//.first()
.then(res => console.log(res)) /** retorna array - não tem first() */
.finally(() => db.destroy()) 

console.log('Fim da Consulta!')

/** Veja que a última instrução foi executada primeiro! */
/** Porque a PROMISE não é Bloqueante, QUANDO ela estiver pronta
 * ela vai executar o THEN!
 */

/** 
 * Resp:
$ node testes/consulta_sem_async.js
Fim da Consulta!
[ RowDataPacket { id: 2, nome: 'admin' },
  RowDataPacket { id: 3, nome: 'cadastrador' },
  RowDataPacket { id: 1, nome: 'comum' } ]
 */
/** ------------------------------------------------------------------ */

