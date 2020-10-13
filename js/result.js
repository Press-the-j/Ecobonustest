groupSave.forEach((el)=>{
  let groupKey=el.getAttribute('data-group-result');
  let name = el.getAttribute('name');
  let val = el.value;

  if (resultObj[groupKey]){
    resultObj[groupKey].push({[name]: val })
  }else {
    resultObj[groupKey]={[name] : val}
  }

  console.log(resultObj);
})
{
  "ragioneSociale": "string",
  "piva": "string",
  "indirizzo": "string",
  "citta": "string",
  "cap": "string",
  "provincia": "string",
  "stato": "string",
  "email": "string",
  "cellulare": "string",
  "bonus110": [
    {
      "indirizzo": "string",
      "citta": "string",
      "provincia": "string",
      "tipologia": {
        "name": "string",
      },
      "superficie": 0,
      "locali": 0,
      "statoImmobile": {
        "name": "string",
      },
      "climatizzazione": {
        "tipoGenerazione": {
            "name" :"string"
        },
        "tipoGeneratore": {
          "name": "string",
        },
        "radiatore": {
          "name": "string",
        }
      },
      "involucroOpaco": {
        "paretiEsterne": {
          "name": "string",
        },
        "cappotto": true,
      },
      "involucroTrasp": {
        "telaio": {
          "name": "string",
        },
        "vetro": {
          "name": "string",
        },
      },
      "efficienzaEnergetica": "string",
      "categoriaCatastale": "string"
    }
  ],
}