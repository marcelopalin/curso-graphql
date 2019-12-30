const { usuarios, perfis, clientes, tipos } = require('../data/db')

module.exports = {
    ola() {
        return 'Bom dia!'
    },
    horaAtual() {
        return new Date
    },
    usuarioLogado(obj) {
        // Apenas para mostrar que o objeto é null neste ponto
        // apenas depois de retornado que teremos o objeto
        // console.log(obj)
        return {
            id: 1,
            nome: 'Admin Logado',
            email: 'admin@mail.com',
            idade: 23,
            salario_real: 1234.56,
            vip: true
        }
    },
    produtoEmDestaque() {
        return {
            nome: 'Notebook Gamer',
            preco: 4890.89,
            desconto: 0.5
        }
    },
    numerosMegaSena() {
        // return [4, 8, 13, 27, 33, 54]
        const crescente = (a, b) => a - b
        return Array(6).fill(0)
            .map(n => parseInt(Math.random() * 60 + 1))
            .sort(crescente)
    },
    usuarios() {
        return usuarios
    },
    clientes() {
        return clientes
    },
    cliente(_, { id }) {
        //Usando o destructuring no args já pegamos { id }
        const sels = clientes
            .filter(c => c.id === id)
        return sels ? sels[0] : null
    },    
    tipos() {
        return tipos
    },    
    tipo(_, { id }) {
        const sels = tipos
            .filter(p => p.id === id)
        return sels ? sels[0] : null 
    },    
    usuario(_, { id }) {
        const sels = usuarios
            .filter(u => u.id === id)
        return sels ? sels[0] : null
    },
    perfis() {
        return perfis
    },
    perfil(_, { id }) {
        const sels = perfis
            .filter(p => p.id === id)
        return sels ? sels[0] : null 
    }
}