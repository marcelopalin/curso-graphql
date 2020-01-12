const db = require('../config/db')

async function salvarUsuario(nome, email, senha) {
    /** Se passar um e-mail que não existe SALVA, 
     * senão ATUALIZA
     * Consulte o Usuário completo, se fosse para
     * pegar só um pedaço usava select('id','email')
     */
    let usuario = await db('usuarios')
    .where({ email }).first()
   
    if(!usuario) {
        /** Não existe vamos inserir! Retorna Array com id */
        let [ id ] = await db('usuarios')
            .insert({ nome, email, senha })
        /** Consulta as informações novamente */    
        usuario = await db('usuarios')
            .where({ id }).first()
    } else {

        /** Já existe - faz UPDATE onde o id
         *  é igual ao usuario.id
         */
        await db('usuarios')
            .where({ id: usuario.id })
            .update({ nome, email, senha })

        /** Este operador ... rest (ele agrupa tudo dentro de um array)
         *  Quando fazemos ...usuario, nome, email, senha
         *  Ele coloca todos os campos de usuario consultado
         *  e nome (que já existe ele atualiza - sobrescreve)
         *  e faz o mesmo com email e senha - o seja, teremos
         *  o usuario atualizado.
         */
        usuario = { ...usuario, nome, email, senha }

        /** Uma maneira mais custosa seria consultarmos os dados do
         *  usuario atualizado no BD como abaixo */
        // usuario = await db('usuarios')
        //     .where({ id }).first()        
    }

    return usuario
    
    
}

async function salvarPerfil(nome, rotulo) {
    /** Como o 'nome' é único, vamos pesquisar 
     * Se Existe Atualiza, senão INSERE
     */

    
}

async function adicionarPerfis(usuario, ...perfis) {
    /** Associar um CONJUNTO DE PERFIS a um usuário */

}

async function executar() {
    const usuario = await salvarUsuario('Ana Silva',
        'ana.silva@empresa.com.br', '123456')
    const perfilA = await salvarPerfil('rh_1', 'Pessoal')
    const perfilB = await salvarPerfil('fin_1', 'Financeiro')

    console.log(usuario)
    console.log(perfilA)
    console.log(perfilB)

    await adicionarPerfis(usuario, perfilA, perfilB)
}

executar()
    .catch(err => console.log(err))
    .finally(() => db.destroy())