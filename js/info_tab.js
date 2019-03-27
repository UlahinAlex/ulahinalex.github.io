$(document).ready(function() {

  var s_round_1 = '.s_round_1';

  $(s_round_1).hover(function() {
    $('.b_round_1').toggleClass('b_round_hover');
    return false;
  });

  $(s_round_1).click(function() {
    $('.flip_box_1').toggleClass('flipped');
    $(this).addClass('s_round_click');
    $('.s_arrow_1').toggleClass('s_arrow_rotate');
    $('.b_round_1').toggleClass('b_round_back_hover');
    return false;
  });

  $(s_round_1).on('transitionend', function() {
    $(this).removeClass('s_round_click');
    $(this).addClass('s_round_back');
    return false;
  });

  var s_round_2 = '.s_round_2';

  $(s_round_2).hover(function() {
    $('.b_round_2').toggleClass('b_round_hover');
    return false;
  });

  $(s_round_2).click(function() {
    $('.flip_box_2').toggleClass('flipped');
    $(this).addClass('s_round_click');
    $('.s_arrow_2').toggleClass('s_arrow_rotate');
    $('.b_round_2').toggleClass('b_round_back_hover');
    return false;
  });

  $(s_round_2).on('transitionend', function() {
    $(this).removeClass('s_round_click');
    $(this).addClass('s_round_back');
    return false;
  });

  var s_round_3 = '.s_round_3';

  $(s_round_3).hover(function() {
    $('.b_round_3').toggleClass('b_round_hover');
    return false;
  });

  $(s_round_3).click(function() {
    $('.flip_box_3').toggleClass('flipped');
    $(this).addClass('s_round_click');
    $('.s_arrow_3').toggleClass('s_arrow_rotate');
    $('.b_round_3').toggleClass('b_round_back_hover');
    return false;
  });

  $(s_round_3).on('transitionend', function() {
    $(this).removeClass('s_round_click');
    $(this).addClass('s_round_back');
    return false;
  });

});