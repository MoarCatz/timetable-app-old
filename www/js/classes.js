$('.collapsible-header').click(function(event) {
  event.stopPropagation();
  $(this).parents('.collapsible').collapsible('open', $(this).parent().index());
});

$('li a.btn-flat').click(function() {
  $('a.dropdown-button.change-text').text($(this).text());
});