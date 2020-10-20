if(el.checked && !el.classList.contains('multiple-check')){
  let val=el.val;
  ecobonus[name]=val;
} else if(el.checked && el.classList.contains('multiple-check')){
  let val=el.val;
  

  if(typeof JSON.stringify(ecobonus[name]) ==='undefined'){
     
    let element={ ['opzione-1'] : val }
    ecobonus[name]= element

  } else {
    let count=Object.keys(ecobonus[name]).length + 1;
    let element={ ['opzione-' + count] : val }
    $.extend(ecobonus[name], element)
  }
  
}