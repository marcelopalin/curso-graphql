
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
    }).then(function () {
        return knex('usuarios').insert([
            { nome: 'Administrador', email: 'admin@mail.com', senha: 'senha123' },
            { nome: 'User', email: 'user@mail.com', senha: 'senha123' },
        ])
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('usuarios')
};
