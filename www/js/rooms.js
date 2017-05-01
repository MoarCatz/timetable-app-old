$(document).ready(function(){
  $('.modal').modal();
});

function showModal(modal) {
  modal.addClass('open');
  modal.css({'display': 'block', 'opacity': '1', 'transform': 'scaleX(1)', 'top': '10%'});
}

function hideModal(modal) {
  modal.removeClass('open');
  modal.css({'display': 'none', 'opacity': '0', 'transform': 'scaleX(0.7)', 'top': '4%'});
}

var $occupied = $('#occupied');
var $occupy = $('#occupy');

$('.chip').click(function() {
  if ($(this).hasClass('taken')) {
    $occupied.find('h5').text($(this).text());
    $occupied.find('h6').text('Лев Челядинов, 10Е');
    $occupied.find('#reason').text('Спецкурс по математике с Масленниковой М.И.');
    $occupied.find('#until').text('С 6 по 7 урок');

    showModal($occupied);
  }
  else {
    $occupy.find('h5').text($(this).text());

    showModal($occupy);
  }
});

$occupied.find('.modal-close').click(function() {
  hideModal($occupied);
});

$occupy.find('.modal-close').click(function() {
  hideModal($occupy);
});