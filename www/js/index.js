// How many chips to allow
var chipThreshold = 5;

function genSubjects(cls) {
  /**
   * Generates random subjects for a given class.
   * @param  {String} cls   Class name.
   * @return {Array}        An array of 7 subjects.
   */
  var subjects = ['Математика', 'Информатика', 'Физика', 'Обществознание', 'Русский язык', 'Литература', 'Нет урока'];
  var selected = [];
  for (var i = 0; i < 7; ++i) {
    selected.push(subjects[Math.floor(Math.random() * subjects.length)]);
  }
  return selected;
}

function closeDialog(id) {
  /**
   * Closes the dialog with the given ID.
   * @param  {String} id    Dialog's ID.
   */
  document.getElementById(id).hide();
}

document.addEventListener('show', function(event) {
  // Set up card-reveal
  var act = document.getElementsByClassName('activator');

  function revealCard() {
    // Display the card-reveal with a slide animation
    var reveal = this.parentElement.nextElementSibling;
    reveal.style.height = '100%';
  }

  function hideCard() {
    // Hide the card-reveal with a slide animation
    var reveal = this.parentElement.parentElement.parentElement.parentElement;
    reveal.style.height = null;
  }

  for (var i = 0; i < act.length; ++i) {
    act[i].onmousedown = revealCard;

    var closeBt = document.getElementById('reveal-close');
    closeBt.onmousedown = hideCard;
  }

  function removeChip() {
    // Action to take on a chip's removal
    var idx = usedTags.indexOf(this.tag);

    if (usedTags.length === chipThreshold) {
      // If the limit is not exceeded, allow selection
      this.dropdownButton.removeAttribute('disabled');
    }

    // Delete the corresponding row from the table
    var rowHead = document.querySelector('thead th:nth-child(' + (idx + 2) + ')');
    var rowBody = document.querySelectorAll('tbody td:nth-child(' + (idx + 2) + ')');
    rowHead.parentElement.removeChild(rowHead);
    for (var i = 0; i < rowBody.length; ++i) {
      rowBody[i].parentElement.removeChild(rowBody[i]);
    }

    usedTags.splice(idx, 1);
    this.parentElement.removeChild(this);
    this.selectButton.removeAttribute('disabled');

    // If there's no more chips, hide the table
    if (!usedTags.length) {
      document.getElementById('comparison-table').classList.add('hide');
      document.querySelector('div.row.empty').classList.remove('hide');
    }

  }

  // Set up dropdowns with selectable content
  var drop = document.getElementsByClassName('dropdown-content');
  var usedTags = [];
  for (var i = 0; i < drop.length; ++i) {
    drop[i].style.width = drop[i].previousElementSibling.offsetWidth + 'px';
    drop[i].style.top = drop[i].previousElementSibling.offsetTop + 'px';
    drop[i].previousElementSibling.onmousedown = function() {
      this.classList.toggle('active');
    };

    var bts = drop[i].getElementsByTagName('ons-button');
    if (drop[i].matches('.set-text')) {
      function dropAction() {
        // Simply replace the button's text with the selected item's
        this.dropdownButton.innerHTML = this.innerHTML;
        this.dropdownButton.classList.toggle('active');
      }
    }
    else {
      function dropAction() {
        // Add a chip
        var chips = this.dropdownButton.parentElement.nextElementSibling;

        var newChip = document.createElement('div');
        // Save the following objects:
        newChip.selectButton = this;  // the button that was used to select the chip;
        newChip.tag = this.textContent;  // the chip's tag;
        newChip.dropdownButton = this.dropdownButton;  // the button that triggers the dropdown

        // Set up the chip node
        newChip.classList.add('chip');
        newChip.innerHTML = this.textContent + '<i class="material-icons close">close</i>';
        newChip.onmousedown = removeChip;

        chips.appendChild(newChip);
        usedTags.push(newChip.tag);

        this.dropdownButton.classList.toggle('active');
        this.setAttribute('disabled', 'true');

        if (usedTags.length === chipThreshold) {
          this.dropdownButton.setAttribute('disabled', 'true');
        }

        // If there's a chip, show the table
        if (usedTags.length === 1) {
          document.getElementById('comparison-table').classList.remove('hide');
          document.getElementsByClassName('empty')[0].classList.add('hide');
        }

        // Add the class to the table
        var tableHeader = document.querySelector('#comparison-table thead tr');
        var newHeading = document.createElement('th');
        newHeading.innerHTML = newChip.tag;
        tableHeader.appendChild(newHeading);

        var subjects = genSubjects(newChip.tag);
        var tableRows = document.querySelectorAll('#comparison-table tbody tr');
        for (var i = 0; i < tableRows.length; ++i) {
          var tableCell = document.createElement('td');
          tableCell.innerHTML = subjects[i];
          tableRows[i].appendChild(tableCell);
        }
      }
    }

    for (var j = 0; j < bts.length; ++j) {
      bts[j].dropdownButton = drop[i].previousElementSibling;
      bts[j].onmousedown = dropAction;
    }
  }

  if (drop.length) {
    // If there's a dropdown, listen for clicks outside it to close it
    var allowed = '.dropdown-act, .dropdown-content li ons-button, .collapsible-header';
    window.onmousedown = function(event) {
      if (!event.target.matches(allowed)) {
        for (var i = 0; i < drop.length; ++i) {
          drop[i].previousElementSibling.classList.remove('active');
        }
      }
    };
  }

  // Prevent SideNav from opening when the table gets scrolled
  var isTouchDown = false;
  var table = document.getElementById('comparison-table');
  if (table) {
    table.ontouchstart = function() { isTouchDown = true  };
    table.ontouchend = function() { isTouchDown = false };
    table.ontouchmove = function(event) {
      if (isTouchDown) {
        event.stopPropagation();
      }
    };

    var isMouseDown = false;
    table.onmousedown = function(event) {
      event.preventDefault();
      isMouseDown = true;
    };
    table.onmouseup = function() {
      event.preventDefault();
      isMouseDown = false;
    };
    table.onmousemove = function(event) {
      event.preventDefault();
      if (isMouseDown) {
        event.stopPropagation();
      }
    };
  }


  var available = document.querySelectorAll(':not(.chips) .chip:not(.taken)');
  var taken = document.querySelectorAll(':not(.chips) .chip.taken');

  function showOccupy() {
    var modal = document.getElementById('occupy');
    modal.querySelector('h5').innerHTML = this.innerHTML;
    modal.show();
  }

  function showOccupied() {
    var modal = document.getElementById('occupied');
    modal.querySelector('h5').innerHTML = this.innerHTML;
    modal.getElementsByTagName('h6')[0].innerHTML = 'Лев Челядинов, 10Е';
    modal.querySelector('#until').innerHTML = 'С 6 по 7 урок';
    modal.querySelector('#reason').innerHTML = 'Спецкурс по математике с Масленниковой М. И.';
    modal.show();
  }


  for (var i = 0; i < available.length; ++i) {
    available[i].onmousedown = showOccupy;
  }

  for (var i = 0; i < taken.length; ++i) {
    taken[i].onmousedown = showOccupied;
  }

  var occupyReason = document.querySelector('textarea');
  if (occupyReason) {
    // Activate the textarea's label on focus
    occupyReason.onfocus = occupyReason.onblur = function() {
      if (!this.value.length) {
        this.nextElementSibling.classList.toggle('active');
      }
      if (this.charCount.innerHTML === '') {
        this.charCount.innerHTML = this.value.length + '/80';
      }
      else {
        this.charCount.innerHTML = '';
      }
    };

    // Add a character counter
    occupyReason.charCount = document.createElement('span');
    occupyReason.charCount.style.float = 'right';
    occupyReason.charCount.style.height = '1px';
    occupyReason.charCount.style.fontSize = '12px';
    occupyReason.onkeyup = function() {
      this.charCount.innerHTML = this.value.length + '/80';
    };
    occupyReason.parentElement.appendChild(occupyReason.charCount);
  }

});

  var showDialog = function(id) {
    document
      .getElementById(id)
      .show();
  };
