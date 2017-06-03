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

// If it is the first launch, show the intro
window.page = 'home.html';
var appLaunchCount = window.localStorage.getItem('launchCount');
if (!appLaunchCount) {
  window.localStorage.setItem('launchCount', 1);
  window.page = 'intro.html';
}