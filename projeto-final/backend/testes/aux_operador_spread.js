let usuario = {
    nome: 'Marcelo Palin',
    email: 'marcelo.palin@mail.com',
    idade: 48
}

let newnome = 'Pedro Palin'
let newmail = 'pedropalin@mail.com'

let result = {...usuario, newnome, newmail}
console.log(result)
console.log('\n\n')

/** Agora, onde as Keys já existem, ele 'atualiza'
 * ou 'sobrescreve' o valor
 *  vamos definir as variáveis com as mesmas
 *  keys que já existem em usuario
 */

usuario = {
    nome: 'Marcelo Palin',
    email: 'marcelo.palin@mail.com',
    idade: 48
}

let nome = 'Pedro Palin'
let email = 'pedropalin@mail.com'
let idade = 10

let result2 = {...usuario, nome, email}

console.log(result2)