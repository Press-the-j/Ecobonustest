$(document).ready(function(){
  var current = 1;
  var current_step,next_step,steps, type_user, myTimer,cloneStep;
  


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
        clock.text(timer)
        if(timer<=9){
          $(".zero").text("0");
        }
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
        removeStep.remove();

        current_st.next().show()
        // setClock();
        setProgressBar(++current);
      });
      
      $(".choose-category").on('change', function(){
        let selectedCategory= $(this).children("option:selected").val();
        $(".sub-category").removeClass("active");
        $(".category-"+selectedCategory).addClass("active");
        $(".category-real-estate-btn").addClass("active");
      })

      $(".owner-title input").on('click', function(){
        $(".owner-title input").prop('checked', false);
        $(this).prop('checked', true);
        $(".next").prop("disabled", false);
      })

      $(".category-user input").on('click', function(){
        $(".category-user input").prop('checked', false);
        $(this).prop('checked', true);
        $(".next").prop("disabled", false);
        

      })

      // modale su click bottone per nome e cognome
      $(".saveBtn").on('click', function(){

        valueName = $('#recipient-name').val();
        valueLName = $('#recipient-lname').val();
       if ( valueName.trim() || valueLName.trim()){

        $('#name').val(valueName + " " + valueLName);
       }
        
      })

      $(".saveBtnBusiness").on('click', function(){

        valueRag = $('#ragione-sociale').val();
       if ( valueRag.trim() || valueLName.trim()){

        $('#rag').val(valueRag);
       }
        
      })
      /* $(".sismic-intervantion").on("click", function(){
        let parent=$(this).closest('fieldset').get();

      }) */
  });