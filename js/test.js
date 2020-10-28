function manageKo(){
  let categoryRealEstateKO=['a/1','a/8','a/9'];
  let subCategoryVal= $('sub-category select.selected-category').val()
  if (arrayIntervantion.includes('trainati') && arrayIntervantion.length==1){
    $('#d5_bis_no').attr('data-myObj', 'ko')
  }
  if($('.choose-category').val() !== 'a' && categoryRealEstateKO.includes(subCategoryVal)) {
    answerObj['d7']='ko'
    
  } else {
    if(arrayIntervantion.includes('trainati') && arrayIntervantion.includes('interventi-sismici') && arrayIntervantion.length ==2){
      let ko = checkKo();
      if(!ko && answerObj["d5"]=="blank"){
        $('#d7_si').attr('data-result', 'TRAIN');
      }
    } else if(arrayIntervantion.includes('riq-energetica') && arrayIntervantion.includes('interventi-sismici') && arrayIntervantion.length ==2){
      let ko = checkKo();
      if(!ko && answerObj["d5"]=="blank"){
        $('#d7_si').attr('data-result', 'RIQ');
      }
    } else if(arrayIntervantion.length == 3) {
      let ko = checkKo();
      if(!ko && answerObj["d5"]=="blank"){
        $('#d7_si').attr('data-result', 'NOSISM');
      }
    }
  }
}