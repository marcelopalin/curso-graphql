# PROBLEMA

Se você estiver montando o BD na máquina e no momento que executar o comando
```
npm knex migrate:latest
```

Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client

Problema típico do MySQL 8.

# SOLUÇÃO 01

```
ALTER USER 'admin_grapql'@'localhost' IDENTIFIED WITH mysql_native_password BY 'senha123';
ALTER USER 'admin_grapql'@'%' IDENTIFIED WITH mysql_native_password BY 'senha123';
```

Where root as your user localhost as your URL and password as your password

Then run this query to refresh privileges:

flush privileges;


# SOLUÇÃO 02

Deletar o usuário e cadastrar novamente de forma correta:

```
DROP USER admin_grapql;
```

E cria novamente:
```bash
CREATE DATABASE projgrapqlbd CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE USER 'admin_grapql'@'localhost' IDENTIFIED WITH mysql_native_password BY 'senha123';
GRANT ALL PRIVILEGES ON *.* TO 'admin_grapql'@'localhost';
CREATE USER 'admin_grapql'@'%' IDENTIFIED WITH mysql_native_password BY 'senha123';
GRANT ALL PRIVILEGES ON *.* TO 'admin_grapql'@'%';
flush privileges;
quit;
```

# PROBLEMA 02

migration file "20190411112543_tabela_perfis.js" failed
migration failed with error: alter table `perfis` add unique `perfis_nome_unique`(`nome`) - ER_TOO_LONG_KEY: Specified key was too long; max key length is 1000 bytes

Faça um comando:
```
npx knex migrate:rollback
```

Altere a migration para limitar o nome do perfil para 20 caracteres:

```js
exports.up = function(knex, Promise) {
  return knex.schema.createTable('perfis', table => {
      table.increments('id').primary()
      table.string('nome',20).notNull().unique()
      table.string('rotulo').notNull()
  }).then(function () {
      return knex('perfis').insert([
          { nome: 'comum', rotulo: 'Comum' },
          { nome: 'admin', rotulo: 'Administrador' },
      ])
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('perfis')
};
```

E faça isto também em:

```js
exports.up = function(knex, Promise) {
    return knex.schema.createTable('usuarios', table => {
        table.increments('id').primary()
        table.string('nome', 100).notNull()
        table.string('email', 100).notNull().unique()
        table.string('senha', 60)
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

**obs:** se o rollback não funcionar faça um drop no BD e crie ele novamente

```sql
DROP DATABASE projgrapqlbd;
```

```sql
CREATE DATABASE projgrapqlbd CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

Resposta:

https://stackoverflow.com/questions/8746207/1071-specified-key-was-too-long-max-key-length-is-1000-bytes

Resposta curta é que você não deve indexar colunas VARCHAR tão longas de qualquer maneira, porque o índice será muito volumoso e ineficiente.

 A melhor prática é usar índices de prefixo para indexar apenas uma substring esquerda dos dados. A maioria dos seus dados terá muito menos que 255 caracteres.

Você pode declarar um comprimento de prefixo por coluna ao definir o índice. Por exemplo:

...
KEY `index` (`parent_menu_id`,`menu_link`(50),`plugin`(50),`alias`(50))
...

Veja a tabela de origem:

```
CREATE TABLE IF NOT EXISTS `pds_core_menu_items` (
  `menu_id` varchar(32) NOT NULL,
  `parent_menu_id` int(32) unsigned DEFAULT NULL,
  `menu_name` varchar(255) DEFAULT NULL,
  `menu_link` varchar(255) DEFAULT NULL,
  `plugin` varchar(255) DEFAULT NULL,
  `menu_type` int(1) DEFAULT NULL,
  `extend` varchar(255) DEFAULT NULL,
  `new_window` int(1) DEFAULT NULL,
  `rank` int(100) DEFAULT NULL,
  `hide` int(1) DEFAULT NULL,
  `template_id` int(32) unsigned DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `layout` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`menu_id`),
  KEY `index` (`parent_menu_id`,`menu_link`,`plugin`,`alias`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```



Mas qual é o melhor tamanho de prefixo para uma determinada coluna? Aqui está um método para descobrir:

SELECT
 ROUND(SUM(LENGTH(`menu_link`)<10)*100/COUNT(`menu_link`),2) AS pct_length_10,
 ROUND(SUM(LENGTH(`menu_link`)<20)*100/COUNT(`menu_link`),2) AS pct_length_20,
 ROUND(SUM(LENGTH(`menu_link`)<50)*100/COUNT(`menu_link`),2) AS pct_length_50,
 ROUND(SUM(LENGTH(`menu_link`)<100)*100/COUNT(`menu_link`),2) AS pct_length_100
FROM `pds_core_menu_items`;
Indica a proporção de linhas que não têm mais que um determinado comprimento de string na menu_linkcoluna. Você pode ver uma saída como esta:

+---------------+---------------+---------------+----------------+
| pct_length_10 | pct_length_20 | pct_length_50 | pct_length_100 |
+---------------+---------------+---------------+----------------+
|         21.78 |         80.20 |        100.00 |         100.00 |
+---------------+---------------+---------------+----------------+
Isso indica que 80% das suas strings têm menos de 20 caracteres e todas as strings têm menos de 50 caracteres. Portanto, não é necessário indexar mais do que um tamanho de prefixo de 50 e, certamente, não é necessário indexar o comprimento total de 255 caracteres.

PS: Os tipos de dados INT(1)e INT(32)indicam outro mal-entendido sobre o MySQL. O argumento numérico não tem efeito relacionado ao armazenamento ou ao intervalo de valores permitido para a coluna. INTé sempre 4 bytes e sempre permite valores de -2147483648 a 2147483647. O argumento numérico é sobre valores de preenchimento durante a exibição, que não tem efeito, a menos que você use a ZEROFILLopção