const fetch = require("node-fetch");
const axios = require('axios');
const db = require('../../config/db')

module.exports = {

    async empresa(_, { filtro }) {

        /** Aqui vamos fazer uma consulta utilizando
         * o filtro. 
         * input EmpresaFiltro {
         *   id: Int
         *   cnpj: String
         *   }
         * 
         * Posso consultar o usuário tanto pelo cnpj quanto pelo id.
         * 
         * {
         *       empresa(
         *           filtro: {
         *           cnpj: '19373880000170'
         *       }
         *       ){
         *           cnpj razao_social nome_fantasia cnae_fiscal
         *       }
         * }
         * 
         */

        /** Se não passou o filtro eu retorno nulo */
        if(!filtro) return null

        /** Senão pego o id ou email passados e: */
        const { id, cnpj } = filtro

        // /** Se tenho ID consulto por id */
        if(id) {
            return null
        /** Se tenho email consulto por email */
        } else if(cnpj) {

            // let empresa = {
            //     cnpj: "19373880000170",
            //     razao_social: "Ampere",
            //     nome_fantasia: "Ampere Consultoria",
            //     cnae_fiscal: "7020-4/00 Atividades de consultoria em gestão empresarial, exceto consultoria técnica específica"
            // }
            let URL = `https://receitaws.sagace.online/v1/${cnpj}`

            // let empresa = await axios.get(URL)
            // .then(res => {
            //     // console.log(res.data)
            //     return res.data
            // })
            // .catch(err => {
            //   console.log(err);
            // });         

            let empresa = await axios.get(URL)
            .then(res => res.data)
            .catch(err => {
              console.log(err);
            });         

            // let empresa = await fetch(URL)
            // .then(function(response){
            //   return response.json()
            //   })
            // .catch(function(err){ 
            //   console.error('Failed retrieving information', err);
            // });

            return empresa
        } else {
            return null
        }
    },
}