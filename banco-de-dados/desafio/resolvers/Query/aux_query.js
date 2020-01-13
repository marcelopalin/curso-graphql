
const fetch = require("node-fetch");

let cnpj = "19373880000170"
let URL_TO_FETCH = `https://receitaws.sagace.online/v1/${cnpj}`


fetch(URL_TO_FETCH)
.then(function(response){
  response.json().then(function(data){
    console.log(data); 
    });
  })
.catch(function(err){ 
  console.error('Failed retrieving information', err);
});