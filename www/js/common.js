window.fn = {};

window.fn.open = function() {
  var menu = document.getElementById('menu');
  menu.open();
};

window.fn.load = function(page) {
  var menu = document.getElementById('menu');
  var navi = document.getElementById('navi');
  menu.close();
  navi.resetToPage(page, {animation: 'none'});
};