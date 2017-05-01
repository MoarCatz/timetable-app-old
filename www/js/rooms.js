$(document).ready(function(){
  $('.modal').modal();
});

var $occupied = $('#occupied');
var $occupy = $('#occupy');
$('.chip').click(function() {
  if ($(this).hasClass('taken')) {
    $occupied.find('h5').text($(this).text());
    $occupied.find('h6').text('Лев Челядинов, 10Е');
    $occupied.find('#reason').text('Спецкурс по математике с Масленниковой М.И.');
    $occupied.find('#until').text('С 6 по 7 урок');

    $occupied.modal('open');
  }
  else {
    $occupy.find('h5').text($(this).text());

    $occupy.modal('open');
  }
});