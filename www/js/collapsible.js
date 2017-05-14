document.addEventListener('show', function(event) {
  var acc = document.getElementsByClassName('collapsible-header');
  var lastActive;

  for (var i = 0; i < acc.length; ++i) {
    acc[i].onmousedown = function() {
      if (lastActive !== undefined && lastActive !== this) {
        lastActive.classList.toggle('active');
        TweenLite.to(lastActive.nextElementSibling, .2, {maxHeight: 0});
        lastActive.nextElementSibling.style.borderBottomWidth = '0';
      }

      var panel = this.nextElementSibling;

      if (!this.classList.toggle('active')) {
        TweenLite.to(panel, .2, {maxHeight: 0});
        panel.style.borderBottomWidth = '0';
      } else {
        TweenLite.to(panel, .2, {maxHeight: panel.scrollHeight});
        panel.style.borderBottomWidth = '1px';
      }
      lastActive = this;
    };
  }
});
