/* 
        $LEGGENDA 

  ? commenti che spiegano a cosa serve la funzione/variabile/handler
  
  * per approfondimenti sull'uso della funzione/variabile/handler

  ^ divisori dello script(vediamo se riusciamo ad usare webpack in futuro)

  todo per le cose da fare in futuro, spunti o idee
  
  ! per segnalare errori, cose da canclerrare

*/


$(document).ready(function(){
 
  
  var next_step;
  var current_step;

  //? variabile a cui assegnare il tipo di utente
  var type_user; 
  //? timer della pagina a cui assegno un setInterval
  var myTimer;
  //? variabile in cui salvo le pagine clonate
  var clone_step;
  var sismicIntervention={};
  //? variabili delle progress bar
  var steps
  var current = 1;
  //? variabile in cui salvo l'oggetto derivante dal csv della zona sismica
  var seismicValutationObj;
  //? oggetto di risposta che sara inviata al server
  var resultObj={}
  var nameUser;
  //? variabile di appoggio per la tipologia dell'appartamento, cosi da disabilitare poi le checkbox
  var typo;
  var arrayControlCheckbox=["stabile condominiale", "appartamento all’interno di un condominio", "villa plurifamiliare"]
  //? array con le checkbox checckate nella pagina di qualificazione dell'intervento, serviranno poi per gestire i vari ko/ok
  var arrayIntervantion=[]

  //? URL e Endpoint per popolare le select
  const ENDPOINTS =['tipologia', 'stato-immobile','tipo-generazione','tipo-generatore','radiatore','pareti-esterne','telaio', 'vetro']
  const URLSELECT="http://ectm-env.eba-wmhap9wv.eu-south-1.elasticbeanstalk.com/"

  //^<-------------funzioni di build-------------->

  $.getScript( "js/validation.js", function( data ) {
  });
  $.ajax({
    type: "GET",
    url: "./data/classificazione-sismica-2020.csv",
    
    success: function (response) {
      seismicValutationObj= $.csv.toObjects(response);
      
    }
  }); 
  populateSelect()
  //^<-------------------------------------------->

  //^<--------------Handler---------------------->
  //todo bisogna assegnare un errore nel caso l'utente prova ad andare avanti senza accettare la privacy


  //? Fix per i popover al restringimento della pagina
  $('.label-info-cursor').on('click', function(){
    if($(window).length < 480){
      $(this).attr('data-placement', 'bottom');
    } else {
      $(this).attr('data-placement', 'right');
    }
    $(this).popover('toggle');
  })
  
  //? handler persalvare il nome dell'utente da mostrare
  $('.save-name').on('keyup', function(){
    nameUser = $(this).val()
    console.log(nameUser);
  })

  //? L'utente può andare avanti solo se accetta privacy
    //! sarà sostituito da validazione di jquery validation
 /*  $("#privacy").on("change", function () {
    if ($(this).is(":checked")) {
        let btn_next = $(this)
            .closest(".form-group")
            .siblings(".bottoni")
            .children(".next");
        btn_next.prop("disabled", false);
    } else if ($(this).not(":checked")) {
        let btn_next = $(this)
            .closest(".form-group")
            .siblings(".bottoni")
            .children(".next");
        btn_next.prop("disabled", true);
    }
  });   */  
    
  $(".next").on('click',function(){
    current_step = $(this).closest('fieldset');
    let fieldset_count_page=current_step.attr("data-count-page")

    //* la classe clicked-answer serrvirà in fase di salvataggio dei dati
    if($(this).hasClass('save-data-array')){
      $(this).addClass('clicked-answer')
    }
    let control=controlInput(fieldset_count_page);
    if(control){
      //* funzione per gestire gli eventi dinamici delle pagine
      checkPage(fieldset_count_page)
      
      //* funzione di salvataggio dei dati in un ogetto
      saveData(fieldset_count_page);

      //! per test------------------------->
      let result = JSON.stringify(resultObj);
      console.log(result);
      //!---------------------------------->

      next();
    }
  });

  $(".previous").on("click", function () {
    current_step = $(this).closest("fieldset");
    let fieldset_count_page= current_step.attr("data-count-page")
    //* pulisco i bottoni SI/NO dalla classe clicked-answer
      //! secondo me c'è spreco di iterazioni si può fare meglio
    $('.save-data-array').removeClass('clicked-answer')
    
    cleanDataPrevious(fieldset_count_page)
    
    previous();

    if($(this).hasClass('reset')){
      resetStatus()
    }
   
    
  });

  //? funzione che cerca nell'oggetto seismicValutationObj e ritorna la valutazione in base al comune
  $('.getValutation').on('click', function(){
    let val=$(this).siblings('input').val()
    let result= $('.result-valutation')
    
    for (let el of seismicValutationObj){
      if(el.Denominazione.toLowerCase()===val.toLowerCase()){
        result.val(el["Classificazione 2020"])
        break
      } else {
        result.val("non abbiamo trovato nessun risultato")
        
      }
    }
  })

  //? fix per il focus sugli switch e su gli input
  $('.switch-check').on('focusin', function(){
    setTimeout(function(){
      document.activeElement.blur();
    }, 1)
  })    
  
  $('input[data-modal]').on('focusin', function(){
    setTimeout(function(){
      document.activeElement.blur();
    }, 1)
  })
  //?<----------------------------------------->
  
  //? funzione che nel fieldset 2 salva il tipo di user scelto, cancella le pagine che non devono essere viste e salva il tipo di user
  $(".type-user").on("click", function () {
    current_step=$(this).closest("fieldset");
    let fieldset_count_page=current_step.attr('data-count-page')
    let type = $(this).attr("data-typeUser");
    //* setta la variabile globale type-user in base alla scelta dell'utente
    type_user = type;

    //* se l'utente è una persona salvo in una variabile i fieldset per i dati dell'impresa e viceversa
    if (type_user === "person") {
        var remove_step = current_step.siblings(".business");
    } else if (type_user === "business") {
        var remove_step = current_step.siblings(".person");
    }
    //* prima li clona con tutti gli handler, trasformando il risultato in un array di elementi, poi li rimuovo dalla pagina
    //*nel caso l'utente torni indietro queste pagine verrano reinserite nel DOM
    clone_step = remove_step.clone(true).get();
    remove_step.remove();

    next(fieldset_count_page)
  
  });
  
  //? validazione select
  $(".choose-category").on("change", function () {
    let selectedCategory = $(this).val();
    if (selectedCategory !== "none") {
        $(".category-real-estate")
            .siblings(".bottoni")
            .find(".next")
            .prop("disabled", false);
    } else {
        $(".category-real-estate")
            .siblings(".bottoni")
            .find(".next")
            .prop("disabled", true);
    }
    $(".sub-category").removeClass("active");
    $(".sub-category select").removeClass("selected-category");
    
    $(".category-" + selectedCategory).addClass("active ");
    $(".category-" + selectedCategory + " select").addClass("selected-category");
  })    
  //? validazioni checkbox
  $(".validate-checkbox input").on("click", function () {
      let parent=$(this).closest(".validate-checkbox")
      parent.find("input").prop("checked", false);
      $(this).prop("checked", true);
      parent
          .siblings(".bottoni")
          .find(".next")
          .prop("disabled", false);
  });

  $(".intervention-trainant input").on("click", function () {
    if ($(".none-check").is(":checked") && $(this).hasClass("none-check")) {
        $(".intervention-trainant input").prop("checked", false);
        $(".none-check").prop("checked", true);
    } else if (
        $(".none-check").is(":checked") &&
        !$(this).hasClass("none-check")
    ) {
        $(".none-check").prop("checked", false);
    }
    if ($(".intervention-trainant input:checked").length) {
        $(".intervention-trainant")
            .siblings(".bottoni")
            .find(".next")
            .prop("disabled", false);
    } else {
        $(".intervention-trainant")
            .siblings(".bottoni")
            .find(".next")
            .prop("disabled", true);
    }
});

  //? funzione per inserire automaticamente i dati dei modal negli input
    //* dare classe save-pop-up al bottone salva
    //* settare negli input in pagina il data-receive-from uguale all'id dell'input nel pop up di cui salvare i dati
  $(".save-pop-up").on('click', function(e){
    let pop_up=$(this).closest('.modal').attr('id');
    let inputs=$(this).closest('.modal').find('.popup-control').get()
    let selects=$(this).closest('.modal').find('.select-control').get()
    let emptyInput=false
    inputs.forEach(element => {
      let inputId=element.getAttribute('id')
      let validate=validator.element(`#${inputId}`)
      if(!validate){
        emptyInput=true
      }
    })
    selects.forEach(element=>{
      let selectId=element.getAttribute('id')
      let validate = validator.element(`#${selectId}`)
      if(!validate){
        console.log($(`#${selectId}`).val());
        emptyInput=true
      }
    })

    if(!emptyInput){
      $(this).closest('.modal').find('.close').click()
      let fieldset_count_page=$(this).closest("fieldset").attr("data-count-page")
      let pop_up_input =$(this).closest('.modal').find('input').get();
      for(let i=0; i<pop_up_input.length; i++){
        let id_pop_up_input=pop_up_input[i].getAttribute('id');
        
        if($(`fieldset[data-count-page=${fieldset_count_page}] input[data-receive-from=${id_pop_up_input}]`).length){
          
          let inputText=pop_up_input[i].value;
          let inputValue=pop_up_input[i].getAttribute('data-value-select')
          
          $(`input[data-receive-from=${id_pop_up_input}`).val(inputText)
          $(`input[data-receive-from=${id_pop_up_input}`).attr('data-value-select', inputValue )
          
          
        }
      }
    }
  })

  //? Cappotto termico(modal): se checked salva true su un input nascosto in pagina
  $('#coat').on('change', function(){
    if ($(this).is(':checked')){
      $('#coat_input').val('true')
    } else {
      $('#coat_input').val('false')
    }

    console.log($('#coat_input').val());
  })

  //? funzione per prendere i vari input nel modal che si riferiscono all'indirizzo, e salvarli in una unica stringa
  $('.save-address').on('click',function(){
      let selector = $(this).data('save');
      let address=$(`#route_${selector}`).val();
      let streetNumber=$(`#street_number_${selector} `).val();
      let city=$(`#locality_${selector} `).val();
      let postal_code=$(`#postal_code_${selector} `).val();
    
    $(`#address_${selector}`).val(`${address} ${streetNumber} ${city} ${postal_code} `)
  })

  //? funzione che scrive il valore della option selezionata all'interno dei pop-up, in input nascosti su cui poi fare i dovuti controlli
    //* dare classe send-val alla select
    //* dare lo stesso id delle select all'input, aggiungendo "-input"
  $(".send-val").on("change", function () {
      $(this).siblings(".error").text("");
      let textSelect = $(this).find("option:selected").text();
      let valSelect = $(this).find("option:selected").val();
      let idSelect = $(this).attr("id");
      let hiddenInput = $(`#${idSelect}-input`).get();
      hiddenInput[0].value = textSelect;
      hiddenInput[0].setAttribute('data-value-select', valSelect)
  });

  //? funzione per inserire e pulire input del nome
  $(".send-val-name").on("keyup", function () {
    if($(this).hasClass('person')){
      var valName = $("#name-popup").val();
      var valSurname = $("#surname-popup").val();
      var destination= '#complete-name'
    } else {
      var valName=$('#name-referent-registration').val();
      var valSurname=$('#surname-referent-registration').val();
      var destination='#referent-complete-name'
    }
    let name = valName
        .split(" ")
        .filter((i) => i)
        .join(" ");
    let surname = valSurname
        .split(" ")
        .filter((i) => i)
        .join(" ");
    $(destination).val(name + " " + surname);   
  });

  //? validazione dell'input di tipo date
    //! sarà sostituita dalla validazione di jquery validation
  $('#date').on('change', function(){
    let date = new Date();
    let thisYear = date.getFullYear();
    let errorBox = $(this).siblings('.error');
    let dateArr=$('#date').val().split('-');
    if(dateArr[0]<1900 || dateArr[0]>thisYear){
      errorBox.text('Data di nascita non valida')
    } else {
      errorBox.text('')
    }
  })

  //? fix per i modal su iphone------------->
  $('.open-modal').on('click', function(){
    let modal = $(this).data('modal');
    $(`#${modal}`).modal('show');
    //$('body').css('overflow','hidden')
  })

  $('.close-modal').on('click', function(){
    $('.close').click()
  })
  //?<--------------------------------------->
  //? funzione che mostra nasconde degli input in base al tipo di immobile
  $('#type-real-estate').on('change',function() {
      if ($(this).val() === 'Stabile condominiale') {
        $('.condominium').show();
        $('.condominium-hide').hide()
        $('.toggle-reverse').removeClass('select-control save-data-array')
        $('.toggle-control').addClass('input-control save-data-array');
        
      } else {
        $('.condominium').hide();
        $('.condominium-hide').show()
        $('.toggle-reverse').addClass('select-control save-data-array')
        $('.toggle-control').removeClass('input-control save-data-array');
      }
    });
  
  //^<--------------------------------------------->

  //^<---------------functions--------------------->
  //todo bisogna pulire e sistemare la funzione di slavataggio data(operazione chirurgica)

  function populateSelect(){
    ENDPOINTS.forEach((el)=>{
      $.ajax({
        type: "GET",
        url: URLSELECT + el,
        success: function (response) {
          let key;
          for (var k in response._embedded) {
            key=k;
            break
          }
          createSelect(response._embedded[key], el)         
        },
        error: function(err){
          console.log(err);
        }
      });
    })
  }  

  function createSelect(options, select){
    
    options.forEach((el)=>{
      let text = el.name;
      let option = document.createElement('option');
          option.setAttribute('value', text);
          option.textContent = text
      document.querySelector(`[data-select=${select}]`).appendChild(option);
    })
  }

  function next(){
    next_step=current_step.next();
    let countPage=next_step[0].getAttribute('data-count-page');
    //* funzione per settare i testi dinamici
    setDynamicText(parseInt(countPage));
    current_step.hide();
    next_step.show();
    setProgressBar(++current);
  }

  function previous(fieldset_count_page){
    next_step= current_step.prev();
    let countPage=next_step[0].getAttribute('data-count-page');
    setDynamicText(parseInt(countPage))
    current_step.hide();
    next_step.show();
    setProgressBar(--current);
  }

  function resetStatus(){
    for (let key in resultObj) {
      if (key !== 'marketing-check'){
        delete resultObj[key]
      }
    }
    clone_step.forEach((element) => {
        let el_page = element.getAttribute("data-count-page") - 1;
        $("fieldset[data-count-page='" + el_page + "']").after(element);
    });
    
    clone_step = "";
  }
  
  function cleanDataPrevious(countPage){
    let count=countPage.toString()

    switch (count){
      case '10' :
      case '11' :
        if(arrayIntervantion.length !== 0){
          arrayIntervantion=[];
          console.log(arrayIntervantion);
        }
    }
  }

  function saveData(countPage){
    
    let commonField=$(`fieldset[data-count-page=${countPage}] .save-data`).get();
    let arrField=$(`fieldset[data-count-page=${countPage}] .save-data-array`).get();
    let ecobonus = {}
    var arr = [];

    commonField.forEach((el)=>{
      let name=el.getAttribute('name');
      let type = el.getAttribute('type')
      if(el.getAttribute('type')=='checkbox'){
        let val= el.checked ? true : false 
        resultObj[name]=val  
      } else {
        let val=el.value;
        resultObj[name]=val;
      }
    })
    
    //? tutte le voci all'interno dell'array bonus110
     //* l'oggetto ecobonus rappresenta l'array bonus110, all'interno dell'oggetto resultObj
    if(arrField.length){
      arrField.forEach(el => {
        let name = el.getAttribute('name');
        //* salvo i dati nelle select in pagina
        if(el.classList.contains('select-control')){
          let val = el.options[el.selectedIndex].text;
          ecobonus[name]={ "name" : val}
        //* salvo i dati raggruppandoli sotto una chiave definita nell'attribute 'data-group'; 
        } else if(el.classList.contains('group-save')){
          let groupKey=el.getAttribute('data-group');
          var val = el.value;
          //* poiche le select nei modal vengono salvate in input hidden,questi input li salvo come fossero select(per matchare ciò che si aspetta back-end)
          if (el.classList.contains('from-select')){
            var element={ [name]: {"name" : val} }
          } else if (el.classList.contains('save-checkbox') && el.checked) {
              if(!(groupKey in resultObj['bonus110'][0])){
                var element={[name] : val}
              //* altrimenti aggiungo le voci
              } else {
                resultObj['bonus110'][0][groupKey][name]=val
              }       
          } else if(el.classList.contains('clicked-answer')) {
            let val = el.getAttribute('data-response-answer');
            resultObj['bonus110'][0][groupKey][name] = val;
          } else if(el.classList.contains('blank-check')) {
            if(el.checked){
              arrayIntervantion.push(el.getAttribute('data-manage-blank'))
              console.log(arrayIntervantion);
              let val = el.value;;
              resultObj['bonus110'][0][groupKey][name]=val
            }
          } else if(el.classList.contains('result-valutation')) {
            let val = parseInt(el.value);
            console.log(val);
            if (val !== 4) {
              resultObj['bonus110'][0][groupKey][name]= 'ok'
            } else {
              //! qui manca il caso in cui l'utente oltre ad interventi antisismici faccia acnhe altri interventi; sarebbe un ko parziale
              if (arrayIntervantion.includes('interventi-sismici') && arrayIntervantion.length == 1){
                resultObj['bonus110'][0][groupKey][name]= 'ko'
              }
            }
          } else if(el.classList.contains('d7-valutation')) {
            let val = el.getAttribute('data-response-answer');
            resultObj['bonus110'][0][groupKey][name]=val
          } else if(el.classList.contains("modal-single-check")) {
            var element ={[name] : val}
          }
          //* se la chiave sotto cui vengono raggrupati i dati non esiste la creo
          
          if(typeof JSON.stringify(ecobonus[groupKey]) ==='undefined'){
            ecobonus[groupKey]= element
          //* altrimenti aggiungo le voci
          } else {
            $.extend(ecobonus[groupKey], element)
          }       
          //* come nel caso di categoria-catastale, mi salvo i dati di diverse selectsalvandoli sotto una key
        } else if(el.classList.contains('group-save-select')){
          let val=el.options[el.selectedIndex].text;
          let groupKey=el.getAttribute('data-group');
          var element={ [name]: {"name" : val} }

          if(typeof JSON.stringify(ecobonus[groupKey]) ==='undefined'){
            ecobonus[groupKey]= element
          } else {
            $.extend(ecobonus[groupKey], element)
          }
          //? se sono input normali, semplicemente prendo il valore e lo salvo        
        
        } else if(el.classList.contains('common-save')) {
          let val=el.value;
          ecobonus[name]=val;
        }
      });
    }
   
    if (isObjectDefined(ecobonus)){
      //? se la chiave bonus110 è vuote  inserisco l'array
      if(typeof JSON.stringify(resultObj["bonus110"]) ==='undefined'){
        arr.push(ecobonus);
        resultObj["bonus110"]=arr;
      } else {
      //? altrimenti, inserisco gli elementi nell'array
        let updateArr = resultObj["bonus110"][0];
        $.extend(updateArr, ecobonus);
        resultObj["bonus110"]=[updateArr]
      }     
    }
    
    manageKo()
  }

  function manageKo(){
    let categoryRealEstateKO=['a/1','a/8','a/9'];
    let subCategoryVal= $('sub-category select.selected-category').val()
    if (arrayIntervantion.includes('trainati') && arrayIntervantion.length==1){
      $('#d5_bis_no').attr('data-response-answer', 'ko')
    } else if($('.choose-category').val() !== 'a' && !(categoryRealEstateKO.includes(subCategoryVal))) {
      $('#d7_si').attr('data-response-answer', 'ko');
    }
  }

  //? funzione per settare il testo dinamicamente nell'head
  function setDynamicText(countPage){
    let fieldText = $('.dynamic-text');
    let fieldSmallText = $('.head-small-text');
    let count =countPage.toString()
    console.log('numero-pagina: '+count);
    switch (count) {
      case '2' :
        fieldText.text('Iniziamo!!');
        fieldSmallText.text('(Per la registrazione impiegheremo circa 5 minuti')
        break;
      case '3' :
        fieldText.text('Piacere!');
        fieldSmallText.text('(Proseguiamo, impiegheremo circa 5 minuti)');
        break;
      case '4' : 
        fieldText.text('Piacere!');
        break;
      case '5' :
        fieldSmallText.text('(Entriamo nel vivo della richiesta. impiegeheremo circa 5 minuti)');
        fieldText.text('Ciao '+ nameUser +"!");
        break;
      default:
        fieldSmallText.text('(Passiamo agli ultimi requisiti, impiegheremo 5 minuti)')
        fieldText.text('Ciao '+ nameUser +"!");
        break  
    }
  }

  function checkPage(countPage) {
    let count = countPage.toString();
   
    switch(count) {
      case '1' :
        $(".progress-wrap").css("display", "flex");
        $(".head-small-text").css("display", "block");
        break;
      //! ho spostato le pagine controlla che i count sia giusto
      /* case '6' :
        if(type_user==='person'){
          console.log('entrato');
          if (arrayControlCheckbox.includes(typo)){
            let checkToDisable=[4,5,6,7];
            disbaleCheck('check', checkToDisable);
          } else {
            let checkToDisable=[1,2,4,5,6,7];
            disbaleCheck('check', checkToDisable)
          }
        }
        break; */
      case '9' : 
        checkSismic(countPage);
        break;
    }

  }

  function disbaleCheck(select, arrNumb) {
    arrNumb.forEach((el)=>{
      $(`#${select}-${el}`).closest('.check-wrap').css('display', 'none')
    })
  }

  function setProgressBar(curStep){
    steps=$("fieldset").length; 
    var percentuale = parseFloat(100 / steps) * curStep;
    percentuale = percentuale.toFixed();
    $(".progress-bar")
      .css("width",percentuale+"%")
  }

  //? funzione che setta timer
  function setClock(){
    clearInterval(myTimer)
    $(".clock").css("display", "block")
    let timer = 30;
    let clock=$(".clock_second");
    clock.text(timer);

    myTimer=setInterval(function(event){
      timer--;
      if(timer<=9){
        timer = "0" + timer;
      } 
      clock.text(timer)    
      if(timer==0){
        clearInterval(myTimer);
        location.reload();
      }
      
    }, 1000)
  }

  //? questa è una funzione provvisoria per nascondere o mostrare il fieldset 10 in base alla scelta dell'utente nella precedente checkbox
    //* se l'utente checca l'input con classe sismic- intervention-check, la pagina si deve vedere

  function checkSismic(currentStep){
    if($('.sismic-intervention-check').is(':checked')) {
      if(sismicIntervention["removed"]){
      let clone_step=sismicIntervention["clone"]
      $(`fieldset[data-count-page=${currentStep}]`).after(clone_step);
      }
      
    } else {
      sismicIntervention["removed"]=true
      let remove_step=$('.sismic-intervention').clone(true).get()
      sismicIntervention["clone"]=remove_step[0];
      console.log(sismicIntervention.clone)
      $('.sismic-intervention').remove()         
    }
  }

  //? funzione di controllo per validare gli input e le select in pagina
    //* dare classe input-control agli input che devono essere controllati, e classe select-control alle select che devono essere controllate
  //todo si potrebbe pensare di attuare il controllo direttamente nella funzione di salvataggio

  function controlInput(countPage){
    //? seleziono il fieldset padre tramite il countPage passato 
    let inputs = $(`fieldset[data-count-page=${countPage}] .input-control`).get()
    let selects=$(`fieldset[data-count-page=${countPage}] .select-control`).get()
    let checkboxes= $(`fieldset[data-count-page=${countPage}] .checkbox-control`).get()
    let emptyInput=false
    //? controllo gli input all'interno del fieldset 
    inputs.forEach((element) => {
      let inputId=element.getAttribute('id')
      let validate=validator.element(`#${inputId}`)
      
      if (!validate){
        emptyInput=true
      }
    })
    selects.forEach((element) => {
      let selectId=element.getAttribute('id')
      let validate = validator.element(`#${selectId}`)
      
      if(!validate){
        emptyInput=true
      }
      
    });
    checkboxes.forEach((element)=> {
      let checkboxId = element.getAttribute('id');
      let validate = validator.element(`#${checkboxId}`);

      if(!validate){
        emptyInput=true
      }
    })
    if (emptyInput) {
        return false;
    }
    return true;
  }

  function isObjectDefined (Obj) {
    if (Obj === null || typeof Obj !== 'object' ||
      Object.prototype.toString.call(Obj) === '[object Array]') {
      return false
    } else {
      for (var prop in Obj) {
        if (Obj.hasOwnProperty(prop)) {
          return true
        }
      }
      return JSON.stringify(Obj) !== JSON.stringify({})
    }
  }

  //^<---------------------------------------------->
/* 
    let map;

    function initMap() {
      map = new google.maps.Map(document.getElementById("map-registered-office"), {
        center: { lat: 	0, lng: 0},
        zoom: 1,
      });
    }
    const componentForm = {
      street_number: "short_name",
      route: "long_name",
      locality: "long_name",
      //administrative_area_level_1: "short_name",
      //country: "long_name",
      postal_code: "short_name",
    };
    

    var inputGoogle=document.getElementById('address-registered-office');
    function initAutocomplete(){
      autocomplete = new google.maps.places.Autocomplete(inputGoogle, {types:["geocode"]});
      autocomplete.setFields(["address_components", "geometry"]);
      autocomplete.bindTo("bounds", map);
      autocomplete.addListener("place_changed", function(){
        const place = autocomplete.getPlace();
        
        const marker = new google.maps.Marker({
          map,
          anchorPoint: new google.maps.Point(0, -29),
        });
        console.log(place);
      
        for (const component in componentForm) {
          document.getElementById(component).value = "";
          document.getElementById(component).disabled = false;
        }
        for (const component of place.address_components) {
          const addressType = component.types[0];
      
          if (componentForm[addressType]) {
            const val = component[componentForm[addressType]];
            document.getElementById(addressType).value = val;
          }
        }
        
        markers = [];
        if (!place.geometry) {
          // User entered the name of a Place that was not suggested and
          // pressed the Enter key, or the Place Details request failed.
          window.alert("No details available for input: '" + place.name + "'");
          return;
        }
    
        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17); // Why 17? Because it looks good.
        }
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);
      });
    }

   
    function geolocate() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          const circle = new google.maps.Circle({
            center: geolocation,
            radius: position.coords.accuracy,
          });
          autocomplete.setBounds(circle.getBounds());
        });
      }
    }


    initMap()
    initAutocomplete() */
  });

  // google maps autocomplete
