const db = require('../config/db')

const novoUsuario = {
    nome: 'Pedro',
    email: 'pedro@empresa.com.br',
    senha: '12345678'
}

// update... db('...').where({...}).update({...})

async function exercicio() {
    
    // Chamada AWAIT - count
    // Retorna um Array, pera pegarmos o Objeto usamos firt()
    // 'as qtde' é o nome da resposta Tipo: { qtde: 0 }
    // Para pegarmos valor vamos usar o Destructure
    // const { qtde } = .. 
    const { qtde } = await db('usuarios')
        .count('* as qtde').first()

    // inserir (se a tabela estiver vazia)
    if(qtde === 0) {
        // Só quero que ele passe para a próxima linha
        // depois que eu tiver um usuário inserido!
        await db('usuarios').insert(novoUsuario)
    }

    // Vamos Consultar o ID do usuário Inserido
    // Para posteriormente alterarmos
    let { id } = await db('usuarios')
        .select('id').limit(1).first()
    
    // Outro Await - Consulta para ALTERAR
    await db('usuarios').where({ id })
        .update({
            nome: 'Pedro Alaminos Palin',
            email: 'pedro.palin@empresa.com.br'
        })

    return db('usuarios').where({ id })
}

/** CHAMADA DA FUNÇÃO ASYNC 
 *  Você pode usar a MESMA estrutura da PROMISE
 *  Dentro da função vou chamar várias vezes o Knex só que vou 
 *  usar o Await! Quando ele passar pelo Await ele só continua
 *  após terminar a instrução.
 */
exercicio()
    .then(usuario => console.log(usuario))
    .finally(() => db.destroy())