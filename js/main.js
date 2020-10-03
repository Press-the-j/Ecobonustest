

$(document).ready(function(){
  var current = 1;
  var current_step,next_step,steps, type_user, myTimer,clone_step;
  
    var placesAutocomplete = places({
      appId: 'pl7QEUHBIWGV',
      apiKey: 'bc57f2fb92b40eb8a458abd86c2b3402',
      container: document.querySelector('#address-registered-office')
    });

    $('input').attr('autocomplete', 'off');

    placesAutocomplete.on('change', function resultSelected(e) {
      document.querySelector('#city-registered-office').value = e.suggestion.city || '';
      document.querySelector('#postal-code-registered-office').value = e.suggestion.postcode || '';
    })

    $("#privacy").on("change", function(){
      if ($(this).is(':checked')){
        $(".continua").prop("disabled", false);
      } else if ($(this).not(':checked')){
        $(".continua").prop("disabled", true);
      }
    });

    
    steps = $("fieldset").length -1;
  
    $(".next").on('click',function(e){
      current_step = $(this).closest('fieldset');
      let fieldset_count_page=$(this).closest("fieldset").attr("data-count-page")
      let control=controlInput(fieldset_count_page);
      //if(control){
        console.log('passo i controlli');
        next_step = $(this).closest('fieldset').next();
        console.log(next_step);
        next_step.show();
        current_step.hide();
        setProgressBar(++current);
        $(".progress").css("display","block");
        setClock();
        $('.error').text('')
      //}
    });
  
    $(".previous").on('click',function(){
      current_step = $(this).parent();
      next_step = $(this).parent().prev();
      next_step.show();
      current_step.hide();
      setProgressBar(--current);
    });
    
    $(".previous-reg").on('click', function(){
    
      current_step = $(this).parent();
      next_step = $(this).parent().prev();
      next_step.show();
      current_step.hide();
      setProgressBar(--current);
      console.log(clone_step);
      clone_step.forEach(element => {
        let el_page=element.getAttribute("data-count-page") -1;
        ($("fieldset[data-count-page='"+ el_page + "']")).after(element)
      });
     
    })
    setProgressBar(current);
  
    // barra di progresso, cambio percentuale
  
    function setProgressBar(curStep){
      var percentuale = parseFloat(100 / steps) * curStep;
      percentuale = percentuale.toFixed();
      $(".progress-bar")
        .css("width",percentuale+"%")
        // .html(percentuale+"%");   
    }

//test

// da richiamare quando metteremo il timer
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
          //location.reload();
        }
      }, 1000)
    }

    

  

    function info(){

        // parte info impresa
        $( "#impresa" ).click(function() {
          $(".info").fadeIn();
        });
    
        $( ".chiudiInfo" ).click(function() {
          $(".info").fadeOut();
        });
    
       // parte info persona fisica
       $( "#personaFisica" ).click(function() {
        $(".info2").fadeIn();
      });
    
      $( ".chiudiInfo2" ).click(function() {
        $(".info2").fadeOut();
      });
       
      }
    
      info(); 


      $(".type-user").on("click", function(){
        let type=$(this).attr("data-typeUser");
        type_user=type;
        let current_st=$(this).closest("fieldset");
        current_st.hide();
                
        if(type_user==="person"){
          var remove_step=current_st.siblings(".business")
        } else if(type_user==="business"){
          var remove_step=current_st.siblings(".person")
        }
        
        clone_step=remove_step.clone(true).get()
        remove_step.remove();

        current_st.next().show()
        setClock();
        setProgressBar(++current);
      });
      
       /* //!validazione select */
      $(".choose-category").on('change', function(){
        let selectedCategory= $(this).val();
        if(selectedCategory !=="none"){
          $(".category-real-estate").siblings(".next").prop("disabled", false)
        } else {
          $(".category-real-estate").siblings(".next").prop("disabled", true)
        }
        $(".sub-category").removeClass("active");
        $(".category-"+selectedCategory).addClass("active");
        $(".category-real-estate-btn").addClass("active");
      })

      /* //! validazioni checkbox*/
      $(".owner-title input").on('click', function(){
        $(".owner-title input").prop('checked', false);
        $(this).prop('checked', true);
        $(".owner-title").siblings(".next").prop("disabled", false);
      })

      $(".category-user input").on('click', function(){
        $(".category-user input").prop('checked', false);
        $(this).prop('checked', true);
        $(".category-user").siblings(".next").prop("disabled", false);
      })

      $(".intervention-trainant input").on('click', function(){
        if($(".none-check").is(":checked") && $(this).hasClass("none-check")){
          $(".intervention-trainant input").prop('checked', false);
          $(".none-check").prop('checked',true)
        } else if($(".none-check").is(":checked") && !$(this).hasClass("none-check")){
          $(".none-check").prop('checked',false)
        }
        if($(".intervention-trainant input:checked").length){
          $(".intervention-trainant").siblings(".next").prop("disabled", false);
        } else {
          $(".intervention-trainant").siblings(".next").prop("disabled", true);
        }
      })

      //! funzione di controllo per sbloccare next al completamento di tutti gli inputin pagina
        //? dare classe input-control agli input che devono essere controllati
      function controlInput(countPage){
        let inputs = $(`fieldset[data-count-page=${countPage}] .input-control`).get()
        let select=$(`fieldset[data-count-page=${countPage}] .select-control`).get()
        let emptyInput=false
        inputs.forEach(element => {
          if(element.value.length==0){
            emptyInput=true
            let errorBox=element.nextElementSibling
            let label=element.previousElementSibling.innerHTML
            errorBox.innerHTML=`${label} deve essere compilato `;
          }
        })
        select.forEach(element => {
          if(element.value=="none"){
            console.log(element);
            emptyInput=true
            let errorBox=element.nextElementSibling
            let label=element.previousElementSibling.innerHTML
            errorBox.innerHTML=`${label} deve essere compilato `;
          }
        });
        if(emptyInput){
          return false
        }
        return true
      }
     //! funzione di controllo dei pop-up, che blocca il salvataggio dei dati negli input se non viene selezionato tutto
        //? dare classe popup-control agli input che devono essere controllati all'interno del popup
        
     function controlPopup(popupId){
      let inputs=$(`#${popupId} .popup-control`).get();
      let emptyInput=false;
      inputs.forEach(element => {
        if(element.value.length==0){
          
          let dataError=element.getAttribute('data-error');
          emptyInput=true
          let errorBox=$(`#${dataError}`).siblings('.error')
          let label=$(`#${dataError}`).siblings('label').text()
          errorBox.text(`${label} deve essere compilato `);
        }
      })
      if(emptyInput){
        return false
      }
      return true
     }
      
      //!funzione per inserire automaticamente i dati dei pop up negli input
        //? dare classe save-pop-up al bottone salva
        //? settare negli input in pagina il data-receive-from uguale all'id del pop up di cui salvare i dati
      $(".save-pop-up").on('click', function(e){
        let pop_up=$(this).closest('.modal').attr('id');
        let control=controlPopup(pop_up);
        console.log(control);
        if(!control){
          e.preventDefault()
        } else {
          $(this).closest('.modal').find('.close').click()
          let fieldset_count_page=$(this).closest("fieldset").attr("data-count-page")
          let pop_up_input =$(this).closest('.modal').find('input').get();
          console.log(pop_up_input);
          
          for(let i=0; i<pop_up_input.length; i++){
            let id_pop_up_input=pop_up_input[i].getAttribute('id');
            console.log(id_pop_up_input);
            if($(`fieldset[data-count-page=${fieldset_count_page}] input[data-receive-from=${id_pop_up_input}]`).length){
              console.log(pop_up_input[i].value);
              let inputText=pop_up_input[i].value;
              console.log(inputText);
              console.log(id_pop_up_input);
              $(`input[data-receive-from=${id_pop_up_input}`).val(inputText)
            }
          }
        }   
        
        
        
      })

      $(".send-val").on("change", function(){
        $(this).siblings(".error").text('')
        let valSelect=$(this).find("option:selected").text();
        let idSelect=$(this).attr('id');
        let hiddenInput=$(`#${idSelect}-input`).get();
        hiddenInput[0].value=valSelect
        console.log(hiddenInput[0].value);
        //hiddenInput.val(valSelect)
      })

      /* $(".sismic-intervantion").on("click", function(){
        let parent=$(this).closest('fieldset').get();

      }) */
  });