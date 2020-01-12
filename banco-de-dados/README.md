# INTRODUÇÃO DO CAPÍTULO

Para mostramos a integração do GRAPHQL com o BD MySQL nós precisaremos
configurar um projeto Node que tenha o Knex


BD treinamento_db;
User: admin_grapql
Pass: senha123


```bash
CREATE DATABASE projgrapqlbd CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE USER 'admin_grapql'@'localhost' IDENTIFIED BY 'senha123';
GRANT ALL PRIVILEGES ON *.* TO 'admin_grapql'@'localhost';
CREATE USER 'admin_grapql'@'%' IDENTIFIED BY 'senha123';
GRANT ALL PRIVILEGES ON *.* TO 'admin_grapql'@'%';
flush privileges;
quit;
```

# INSTALE O KNEX DE FORMA GLOBAL

O Knex.js é um construtor de consultas SQL com "baterias incluídas" para Postgres , 
MSSQL , MySQL , MariaDB , SQLite3 , Oracle e Amazon Redshift, projetado para ser flexível, 
portátil e divertido de usar.
Knex é um módulo que traz uma série de funções que simplificam as operações com dados, evitando o uso direto do SQL. As operações de inserção, consulta, alteração e remoção de dados
podem ser usadas a partir de funções que retornam promisses, o que torna o código mais
claro e objetivo.

```
npm i -g knex
```

Instale no projeto:

```
npm install knex --save

//E o BD que irá utilizar
$ npm install mysql

//Para outros...
npm install pg
$ npm install sqlite3
```

No final seu Package.json ficaria:

```json
  "dependencies": {
    "knex": "^0.16.3",
    "mysql": "^2.16.0"
  }
```

# CRIANDO O ARQUIOVO knewxfile.js

```
npx knex init
```

Deixe apenas a parte final de production e configure a conexão:

```javascript
// Update with your config settings.
const { connection } = require('./.env')

module.exports = {  
  client: 'mysql',
  connection,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};
```

Os dados de login/senha foram transferidos para o arquivo .env.

Adeque conforme seu BD.

```ini
NODE_ENV=development

APP_DB_HOST=localhost
APP_DB_PORT=3306
APP_DB_NAME=projgrapqlbd
APP_DB_USER=admin_grapql
APP_DB_PASSWORD=

APP_AUTH_SECRET=AGAHBOADJFKADLFJLADJFALDFJADLKJFALSDKF
```

# VAMOS CRIAR 3 MIGRATIONS

Nosso BD terá tabelas de Usuários, Perfis e a tabela de relacionamento tabelas_usuarios_perfis.js


```
npx knex migrate:make tabela_perfis
npx knex migrate:make tabela_usuarios
npx knex migrate:make tabela_usuarios_perfis
```

Foram criados 3 arquivos:

```
banco-de-dados\projeto\migrations\20190411153800_tabela_perfis.js
banco-de-dados\projeto\migrations\20190411153845_tabela_usuarios.js
banco-de-dados\projeto\migrations\20190411153942_tabela_usuarios_perfis.js
```

Vamos definir o Schema da Tabela usuarios no MySQL:

```javascript

exports.up = function(knex, Promise) {
    return knex.schema.createTable('usuarios', table => {
        table.increments('id').primary()
        table.string('nome').notNull()
        table.string('email').notNull().unique()
        table.string('senha', 60).notNull()
        table.boolean('ativo')
            .notNull().defaultTo(true)
        table.timestamp('data_criacao')
            .defaultTo(knex.fn.now())
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('usuarios')
};

```

Esta migration já insere os dados de Perfis

```javascript

exports.up = function(knex, Promise) {
    return knex.schema.createTable('perfis', table => {
        table.increments('id').primary()
        table.string('nome').notNull().unique()
        table.string('rotulo').notNull()
    }).then(function () {
        return knex('perfis').insert([
            { nome: 'comum', rotulo: 'Comum' },
            { nome: 'admin', rotulo: 'Administrador' },
            { nome: 'master', rotulo: 'Master' },
        ])
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('perfis')
};
```


Chave primária composta:

```javascript
table.primary(['usuario_id', 'perfil_id'])
```

```javascript
exports.up = function(knex, Promise) {
    return knex.schema.createTable('usuarios_perfis', table => {
        table.integer('usuario_id').unsigned()
        table.integer('perfil_id').unsigned()
        table.foreign('usuario_id').references('usuarios.id')
        table.foreign('perfil_id').references('perfis.id')
        table.primary(['usuario_id', 'perfil_id'])
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('usuarios_perfis')
};

```

Para rodar as Migrations faça;


```bash
npx knex migrate:latest
```

Deu um problema no windows pois o MySQL era 5.7, então executei:

```
SET GLOBAL default_storage_engine = 'InnoDB';
```
E funcionou:

```bash
$ npx knex migrate:latest
Using environment: development
Batch 1 run: 3 migrations
```


# RESUMO DAS TABELAS

Usuarios: id (key), nome, email, senha, ativo, data_criacao

Perfis: id, nome (Unica), rotulo

Usuarios_Perfis: usuario_id, perfil_id e a chave dupla (usuario_id, perfil_id)

# Criamos a pasta CONFIG

Nela vamos criar o arquivo **db.js** e aqui nós vamos configurar o Knex
A unica coisa que ele precisa saber para funcionar é saber onde está o 
arquivo **knexfile.js**

```javascript
const config = require('../knexfile.js')
module.exports = require('knex')(config)
```

Vamos criar uma pasta de testes para fazer alguns testes:

insert.js:

```javascript
const db = require('../config/db')

/**
 * Vamos inserir um Novo Perfil, para isso vamos criar o Objeto
 */

 const novoPerfil = {
     nome: 'cadastrador',
     rotulo: 'Cadastrador de Dados'
 }

 /** Para vermos o que o MySQL retorna */
 db('perfis').insert(novoPerfil)
 .then(res => console.log(res))
 .catch(err => console.log(err.sqlMessage)) /** Cuidado: aqui é só para desenvolvimento, 
 não exponha suas informações */

 /** E ele retorna o ID inserido em um Array */

 /** Resp:
  *  node testes/insert.js
  *  [ 3 ]
  * 
  */

  /** O código ficará rodando.!!! */
```

Para parar:

```javascript
const db = require('../config/db')

/**
 * Vamos inserir um Novo Perfil, para isso vamos criar o Objeto
 */

 const novoPerfil = {
     nome: 'cadastrador',
     rotulo: 'Cadastrador de Dados'
 }

 /** Para vermos o que o MySQL retorna */
 db('perfis').insert(novoPerfil)
 .then(res => console.log(res))
 .catch(err => console.log(err.sqlMessage))
 .finally(() => db.destroy()) /** Isso você NÃO FARÁ NA SUA API - pois o Knex 
 controla o Pull de conexões para não ficar abrindo e fechando */

 /** Resp:
  *  node testes/insert.js
  *  [ 3 ]
  * 
  */

  /** O código ficará rodando.!!! */
```

Rodando com CODRUNNER do VSCode, instale a extensão e use os comandos:

Ctrl+Alt+N (rodar) e Ctrl+Alt+M (parar) (Obs: desde que esteja visualizando o arquivo
que deseja rodar


# FAZENDO TESTES DE CONSULTA

Crie o arquivo consulta.js

```javascript
const db = require('../config/db')

db('perfis')
.then(res => console.log(res))
.finally(() => db.destroy()) /** Não faremos na API - fechando o Pull do Knex */ 
```

Resposta: Um array com os dados

```bash
$ node testes/consulta.js
[ RowDataPacket { id: 1, nome: 'comum', rotulo: 'Comum' },
  RowDataPacket { id: 2, nome: 'admin', rotulo: 'Administrador' },
  RowDataPacket { id: 3, nome: 'cadastrador', rotulo: 'Cadastrador de Dados' },
  RowDataPacket { id: 7, nome: 'visitante', rotulo: 'Visitante' } ]
```

# Melhorando a Resposta - Fazendo um Map do Array para pegar apenas o Perfil

```

```