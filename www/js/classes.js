$('.collapsible-header').click(function(event) {
  event.stopPropagation();
  $(this).parents('.collapsible').collapsible('open', $(this).parent().index());
});

$('li.collection-item').click(function() {
  $('a.dropdown-button').text($(this).text())
})