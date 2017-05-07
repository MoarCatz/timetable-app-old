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

  var drop = document.getElementsByClassName('dropdown-content');
  for (var i = 0; i < drop.length; ++i) {
    drop[i].style.width = drop[i].previousElementSibling.offsetWidth + 'px';
    drop[i].previousElementSibling.onmousedown = function() {
      this.classList.toggle('active');
    };

    var bts = drop[i].getElementsByTagName('ons-button');
    for (var j = 0; j < bts.length; ++j) {
      bts[j].dropdownButton = drop[i].previousElementSibling;
      bts[j].onmousedown = function() {
        this.dropdownButton.innerHTML = this.innerHTML;
        this.dropdownButton.classList.toggle('active');
      };
    }
  }

  if (drop.length) {
    window.onmousedown = function(event) {
      if (!event.target.matches('.dropdown-content, .dropdown-act, .dropdown-content li ons-button, .collapsible-header')) {
        for (var i = 0; i < drop.length; ++i) {
          drop[i].previousElementSibling.classList.remove('active');
        }
      }
    };
  }
});