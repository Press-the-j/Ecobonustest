$(document).ready(function(){

    $("#privacy").on("change", function(){
      if ($(this).is(':checked')){
        $(".continua").prop("disabled", false);
      } else if ($(this).not(':checked')){
        $(".continua").prop("disabled", true);
      }
    });

    var current = 1;
    var current_step,next_step,steps;
  
    steps = $("fieldset").length;
  
    $(".next").click(function(){
      current_step = $(this).parent();
      next_step = $(this).parent().next();
      next_step.show();
      current_step.hide();
      setProgressBar(++current);
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

  
  
  });