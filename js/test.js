jQuery(document).ready(function(){
  function classFunction(){
    if(jQuery('body').width()<1025){ jQuery('.cage_2_1').removeClass('cage_2_1').addClass('cage_1_7');
    }
    else{
      jQuery('.cage_1_7').removeClass('cage_1_7').addClass('cage_2_1');
    }
    if(jQuery('body').width()<761){ jQuery('.cage_1_7').removeClass('cage_1_7').addClass('cage_1_3');
    }
    else{
      jQuery('.cage_1_3').removeClass('cage_1_3').addClass('cage_1_7');
    }
    if(jQuery('body').width()<361){ jQuery('.cage_1_3').removeClass('cage_1_3').addClass('cage_1_2');
    }
    else{
      jQuery('.cage_1_2').removeClass('cage_1_2').addClass('cage_1_3');
    }

    // if(jQuery('body').width()<1025){ jQuery('.cage_2_5').removeClass('cage_2_5').addClass('cage_1_9');
    // }
    // else{
    //   jQuery('.cage_1_9').removeClass('cage_1_9').addClass('cage_2_5');
    // }
    // if(jQuery('body').width()<761){ jQuery('.cage_1_9').removeClass('cage_1_9').addClass('cage_1_4');
    // }
    // else{
    //   jQuery('.cage_1_4').removeClass('cage_1_4').addClass('cage_1_9');
    // }
    // if(jQuery('body').width()<361){ jQuery('.cage_1_4').removeClass('cage_1_4').addClass('cage_1_3');
    // }
    // else{
    //   jQuery('.cage_1_3').removeClass('cage_1_3').addClass('cage_1_4');
    // }

    // if(jQuery('body').width()<1025){ jQuery('.cage_2_9').removeClass('cage_2_9').addClass('cage_1_11');
    // }
    // else{
    //   jQuery('.cage_1_11').removeClass('cage_1_11').addClass('cage_2_9');
    // }
    // if(jQuery('body').width()<761){ jQuery('.cage_1_11').removeClass('cage_1_11').addClass('cage_1_5');
    // }
    // else{
    //   jQuery('.cage_1_5').removeClass('cage_1_5').addClass('cage_1_11');
    // }
    // if(jQuery('body').width()<361){ jQuery('.cage_1_5').removeClass('cage_1_5').addClass('cage_1_4');
    // }
    // else{
    //   jQuery('.cage_1_4').removeClass('cage_1_4').addClass('cage_1_5');
    // }
  }
  
  classFunction();
  jQuery(window).resize(classFunction);
 })