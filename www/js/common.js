$(function() {
  $('.button-collapse').sideNav({
    draggable: true,
    closeOnClick: true
  });

  $('.button-collapse').click(function() {
    $('a.dropdown-button.active').click();
  });
});
