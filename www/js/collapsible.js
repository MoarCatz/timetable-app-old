document.addEventListener('show', function(event) {
  var acc = document.getElementsByClassName('collapsible-header');
  var lastActive;

  for (var i = 0; i < acc.length; ++i) {
    acc[i].onmousedown = function() {
      if (lastActive !== undefined && lastActive !== this) {
        lastActive.classList.toggle('active');
        lastActive.nextElementSibling.style.maxHeight = null;
        lastActive.nextElementSibling.style.borderBottomWidth = '0';
      }

      this.classList.toggle('active');

      /* Set max-height to animate the dropdown
      Source: https://www.w3schools.com/howto/howto_js_accordion.asp */
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
        panel.style.borderBottomWidth = '0';
      } else {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        panel.style.borderBottomWidth = '1px';
      }
      lastActive = this;
    };
  }
});
