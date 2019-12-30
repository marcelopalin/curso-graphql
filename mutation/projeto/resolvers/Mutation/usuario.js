const { usuarios, proximoId } = 
    require('../../data/db')

function indiceUsuario(filtro) {
    if(!filtro) return -1
    const { id, email } = filtro
    if(id) {
        return usuarios
            .findIndex(u => u.id === id)
    } else if(email) {
        return usuarios
            .findIndex(u => u.email === email)
    }
    return -1
}

module.exports = {
    // { nome, email, idade }
    novoUsuario(_, { dados }) {

        // Validação - consulta se e-mail já existe
        const emailExistente = usuarios
            .some(u => u.email === dados.email)

        // Se existe, lança uma Exception
        if(emailExistente) {
            throw new Error('E-mail já cadastrado! Não pode ser duplicado!')
        }

        const novo = {
            id: proximoId(),
            ...dados,
            perfil_id: 1,
            status: 'ATIVO'
        }

        usuarios.push(novo)
        return novo
    },
    excluirUsuario(_, { filtro }) {
        const i = indiceUsuario(filtro)
        if(i < 0) return null

        // Primeiro parâmetro é a posição do elemento
        // no segundo a quantidade de elementos que desejo
        // ser excluído
        const excluidos = 
            usuarios.splice(i, 1)
        // Se excluidos estiver setado, vou devolver apenas
        // o elemento indice 0
        return excluidos ? 
            excluidos[0] : null
    },
    alterarUsuario(_, { filtro, dados }) {
        const i = indiceUsuario(filtro)
        if(i < 0) return null

        usuarios[i].nome = dados.nome
        usuarios[i].email = dados.email
        if(dados.idade) {
            usuarios[i].idade = dados.idade
        }

        // const usuario = {
        //     ...usuarios[i],
        //     ...args
        // }

        // usuarios.splice(i, 1, usuario)
        // return usuario
        return usuarios[i]
    }
}