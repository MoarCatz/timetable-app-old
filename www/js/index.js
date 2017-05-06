document.addEventListener('show', function(event) {
  var act = document.getElementsByClassName('activator');

  for (var i = 0; i < act.length; ++i) {
    act[i].onmousedown = function() {
      var reveal = this.parentElement.nextElementSibling;
      if (reveal.style.height) {
        reveal.style.height = null;
      } else {
        reveal.style.height = '100%';
      }
    };

    var closeBt = act[i].parentElement.nextElementSibling.getElementsByClassName('card-title')[0].getElementsByTagName('i')[0];
    closeBt.onmousedown = function() {
      var reveal = this.parentElement.parentElement.parentElement.parentElement;
      if (reveal.style.height) {
        reveal.style.height = null;
      } else {
        reveal.style.height = '100%';
      }
    };
  }
});