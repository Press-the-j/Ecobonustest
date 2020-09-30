$(document).ready(function(){
  var current = 1;
  var current_step,next_step,steps, type_user;
  


    $("#privacy").on("change", function(){
      if ($(this).is(':checked')){
        $(".continua").prop("disabled", false);
      } else if ($(this).not(':checked')){
        $(".continua").prop("disabled", true);
      }
    });

    
    steps = $("fieldset").length -1;
  
    $(".next").click(function(e){
      current_step = $(this).parent();
      console.log(current_step);
      next_step = $(this).parent().next();
      console.log(next_step);
      next_step.show();
      current_step.hide();
      setProgressBar(++current);
      $(".progress").css("display","block");
    });
  
    $(".previous").click(function(){
      current_step = $(this).parent();
      next_step = $(this).parent().prev();
      next_step.show();
      current_step.hide();
      setProgressBar(--current);
    });
  
    setProgressBar(current);
  
    // barra di progresso, cambio percentuale
  
    function setProgressBar(curStep){
      var percentuale = parseFloat(100 / steps) * curStep;
      percentuale = percentuale.toFixed();
      $(".progress-bar")
        .css("width",percentuale+"%")
        .html(percentuale+"%");   
    }

    // $('[data-count-page="1"]').on("change", function(){
    //   if ($(this).is(':hidden')){
    //     $(".progress").css("display","block");
    //     alert("funge");
    //   }
    //   });
  
// da richiamare quando metteremo il timer
    function setClock(){
      let timer = 5;
      let clock=$(".clock");
      clock.text(timer);
      let myTimer=setInterval(function(){
        timer--;
        clock.text(timer)
        if(timer==0){
          clearInterval(myTimer);
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
          var removeStep=current_st.siblings(".business");
        } else if(type_user==="business"){
          var removeStep=current_st.siblings(".person");
        }
        removeStep.remove();

        current_st.next().show()
<<<<<<< HEAD
        
        
=======
        setProgressBar(++current);
        console.log(next_step);
>>>>>>> c61d8ecffe0342a6382f28e4abefcd340467f320
      });
      
      $(".choose-category").on('change', function(){
        let selectedCategory= $(this).children("option:selected").val();
        $(".category-real-estate").removeClass("active");
        $(".category-"+selectedCategory).addClass("active");
        $(".category-real-estate-btn").addClass("active");
      })
  });