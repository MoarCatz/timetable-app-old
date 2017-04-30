$(function() {
  $('.button-collapse').sideNav({
    draggable: true
  });

  $('.button-collapse').click(function() {
    $('a.dropdown-button.active').click();
  })
});
