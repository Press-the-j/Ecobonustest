$(document).ready(function(){
  var current = 1;
  var current_step,next_step,steps, type_user, myTimer,clone_step;
  


    $("#privacy").on("change", function(){
      if ($(this).is(':checked')){
        $(".continua").prop("disabled", false);
      } else if ($(this).not(':checked')){
        $(".continua").prop("disabled", true);
      }
    });

    
    steps = $("fieldset").length -1;
  
    $(".next").on('click',function(e){
      current_step = $(this).parent();
      console.log(current_step);
      next_step = $(this).parent().next();
      next_step.show();
      current_step.hide();
      setProgressBar(++current);
      $(".progress").css("display","block");
      setClock();
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
        .html(percentuale+"%");   
    }


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
      
       /* validazione select */
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

      /*  validazioni checkbox*/
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

     

      // modale su click bottone per nome e cognome
      $(".saveBtn").on('click', function(){

        let valueName = $('#recipient-name').val();
        let valueLName = $('#recipient-lname').val();
        let trimName = $.trim(valueName);
        let trimLName = $.trim(valueLName);
       if ( valueName.trim() || valueLName.trim() && countClick !== 1){
        $('#name').attr('data-toggle', 'hide');
        $('#name').val($.trim(trimName) + " " + $.trim(trimLName));
       }
       let countClick = 1;
      })

      $(".saveBtnBusiness").on('click', function(){

        let valueRag = $('#ragione-sociale').val();
        let trimValueRag = $.trim(valueRag);
       if ( valueRag.trim() || valueLName.trim()){
        $('#rag').attr('data-toggle', 'hide');
        $('#rag').val($.trim(trimValueRag));
       }
        
      })
      /* $(".sismic-intervantion").on("click", function(){
        let parent=$(this).closest('fieldset').get();

      }) */
  });