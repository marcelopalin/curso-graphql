const perfis = [
    { id: 1, nome: 'comum' },
    { id: 2, nome: 'administrador' }
]

const tipos = [
    { id: 1, nome: 'Consultoria' },
    { id: 2, nome: 'Comercializadora' }
]

const usuarios = [{
    id: 1,
    nome: 'João Silva',
    email: 'jsilva@zemail.com',
    idade: 29,
    perfil_id: 1,
    status: 'ATIVO'
}, {
    id: 2,
    nome: 'Rafael Junior',
    email: 'rafajun@wemail.com',
    idade: 31,
    perfil_id: 2,
    status: 'INATIVO'
}, {
    id: 3,
    nome: 'Daniela Smith',
    email: 'danismi@umail.com',
    idade: 24,
    perfil_id: 1,
    status: 'BLOQUEADO'
}]

const clientes = [{
    id: 1,
    situacao_cadastral: 2,
    data_situacao_cadastral: '2013-11-06',
    cnpj: '19373880000170',
    razao_social: 'AMPERE CONSULTORIA EMPRESARIAL LTDA.',
    nome_fantasia: 'AMPERE CONSULTORIA',
    cnae_fiscal: "7020-4/00 Atividades de consultoria em gestão empresarial, exceto consultoria técnica específica",
    correio_eletronico: "ivan.queiroz@ampereconsultoria.com.br",
    ddd_telefone_1: "11 30611908",
    bairro: "ALPHAVILLE",
    cep: '6541055',
    capital_social: 5000,
    opcao_pelo_simples: 1,
    tipo_id: 1,
    status: 'ATIVO'
}, {
    id: 2,
    situacao_cadastral: 2,
    data_situacao_cadastral: '2012-02-02',
    cnpj: '15027346000150',
    razao_social: 'MEGA WATT COMERCIALIZACAO DE ENERGIA LTDA',
    nome_fantasia: 'MEGA WATT',
    cnae_fiscal: "3513-1/00 Comércio atacadista de energia elétrica",
    correio_eletronico: "tatiane@camerge.com.br",
    ddd_telefone_1: "48 33462469",
    bairro: "TRINDADE",
    cep: '88036540',
    capital_social: 2685000,
    opcao_pelo_simples: 0,
    tipo_id: 2,
    status: 'ATIVO'
}]

module.exports = { usuarios, perfis, clientes, tipos }