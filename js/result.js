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

function saveData(countPage){
  let inputs=$(`fieldset[data-count-page=${countPage}] .save-data-input`).get();
  let selects=$(`fieldset[data-count-page=${countPage}] .save-data-select`);
  let checkboxes=$(`fieldset[data-count-page=${countPage}] .save-data-checkbox`).get();
  let groupSave=$(`fieldset[data-count-page=${countPage}] .group-save`).get();
  var arrOfKey=[];

  console.log(groupSave);

  inputs.forEach((el)=>{
    /* //? se l'elemento ha una classe group-save, avrà un data-group-result il cui nome sara la chiave sotto cui raggruppare i data nell'oggetto
    if(el.classList.contains('group-save')){
      let groupKey = el.getAttribute('data-group-result');

      let name = el.getAttribute('name');
      let val = el.value;
      resultObj[groupKey]= {
        [name] : val
      };
      console.log(resultObj);
    } */
  })

  checkboxes.forEach((el)=>{
    if (el.checked){
      let name = el.getAttribute('name');
      resultObj[name]=true
    } else {
      let name = el.getAttribute('name');
      resultObj[name]=false
    }
  })

  groupSave.forEach((el)=>{
    let groupKey=el.getAttribute('data-group-result');
    if(!arrOfKey.includes(groupKey)){
      arrOfKey.push(groupKey);
    }
    
  })

  if(arrOfKey.length){
    for(let i=0; i<arrOfKey.length; i++){
      let 
    }
  }


 
}