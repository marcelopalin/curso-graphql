const db = require('../config/db')

/**
 * Vamos inserir um Novo Perfil, para isso vamos criar o Objeto
 */

 const novoPerfil = {
     nome: 'visitante',
     rotulo: 'Visitante'
 }

 /** Para vermos o que o MySQL retorna
  * Toda Insersão retorna um [id] no MySql
  * 
  */
 db('perfis').insert(novoPerfil)
 .then(res => console.log(res))
 .catch(err => console.log(err.sqlMessage))
 .finally(() => db.destroy()) /** Isso você NÃO FARÁ NA SUA API - pois o Knex 
 controla o Pull de conexões para não ficar abrindo e fechando */ 

 /** E ele retorna o ID inserido em um Array */

 /** Resp:
  *  node testes/insert.js
  *  [ 3 ]
  * 
  */

  /** O código ficará rodando.. por isso fizemos apenas aqui o destroy! */