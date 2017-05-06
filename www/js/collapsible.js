document.addEventListener('show', function(event) {
  var acc = document.getElementsByClassName('collapsible-header');

  for (var i = 0; i < acc.length; ++i) {
    acc[i].onmousedown = function() {
      this.classList.toggle("active");

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
    };
  }
});
