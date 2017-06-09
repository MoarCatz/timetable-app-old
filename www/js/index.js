// How many chips to allow
var chipThreshold = 5;
// Array of selected chips' tags
var usedTags = [];
var lastToastTimer, lastReasonToastTimer, lastUndoToastTimer;

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
    document.querySelector('ons-card.empty').classList.remove('hide');
  }
}

function showOccupy() {
  // Show the modal about a free room
  var modal = document.getElementById('occupy');
  modal.querySelector('h5').innerHTML = this.innerHTML;
  modal.show();
}

function showOccupied() {
  // Show the modal about an occupied room
  var modal = document.getElementById('occupied');
  modal.querySelector('h5').innerHTML = this.innerHTML;
  modal.querySelector('h6').innerHTML = 'Лев Челядинов, 10Е';
  modal.getElementById('until').innerHTML = 'С 6 по 7 урок';
  modal.getElementById('reason').innerHTML = 'Спецкурс по математике с Масленниковой М. И.';
  modal.show();
}

function toggleSwitch(event) {
  // Toggle the switch when its container button gets pressed
  if (event.target.matches('.switch__touch, .switch__toggle')) {
    return;
  }
  var switch_ = this.querySelector('ons-switch');
  if (!switch_.getAttribute('checked')) {
    switch_.setAttribute('checked', 'true');
  }
  else {
    switch_.removeAttribute('checked');
  }
}

function stripInnerTags(elem) {
  /**
   * Removes everything but the text from inside the given node.
   * @param  {Element} elem   Element to strip the tags from.
   */
   elem.innerHTML = elem.textContent;
}

function openLesson() {
  // Open the card with the selected lesson
  var btn = this.querySelector('button');
  for (var i = 0; i < this.lessonCards.length; ++i) {
    this.lessonCards[i].classList.remove('selected');
  }
  document.getElementById('lesson' + btn.innerHTML).classList.add('selected');
}

function getNodeIndex(elem) {
  /**
   * Gets the index of the element among its siblings.
   * @param  {Element} elem   Element to get the index of.
   */
   return [].indexOf.call(elem.parentElement.children, elem);
}

function jumpToCarouselPage() {
  // Jump to the corresponding carousel page when a dot gets pressed
  this.carousel.setActiveIndex(getNodeIndex(this));
}

function hasClass(elem, cls) {
  /**
   * Tests if the element has a class
   * @param  {Element} elem   Element to check;
   * @param  {String} cls     Class to look for.
   */
  return (' ' + elem.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function dropSetText() {
  // Simply replace the button's text with the selected item's
  this.dropdownButton.textContent = this.textContent;
  this.dropdownButton.classList.toggle('active');
}

function dropAddChip() {
  // Add a chip
  var chips = document.getElementById('selected-classes');

  var newChip = document.createElement('div');
  // Save the following objects:
  newChip.selectButton = this;  // the button that was used to select the chip
  newChip.tag = this.textContent;  // the chip's tag
  newChip.dropdownButton = this.dropdownButton;  // the button that triggers the dropdown

  // Set up the chip node
  newChip.classList.add('chip');
  newChip.innerHTML = newChip.tag + '<i class="material-icons close">close</i>';
  newChip.onmousedown = removeChip;

  chips.appendChild(newChip);
  usedTags.push(newChip.tag);

  this.dropdownButton.classList.toggle('active');
  this.setAttribute('disabled', 'true');

  if (usedTags.length === chipThreshold) {
    this.dropdownButton.setAttribute('disabled', 'true');
  }

  // If there's a chip, show the table
  var tableCard = document.getElementById('comparison-table');
  var emptyCard = document.querySelector('.empty');
  if (usedTags.length === 1) {
    tableCard.classList.remove('hide');
    emptyCard.classList.add('hide');
  }

  // Add the class to the table
  var tableHeader = tableCard.querySelector('thead tr');
  var newHeading = document.createElement('th');
  newHeading.innerHTML = newChip.tag;
  tableHeader.appendChild(newHeading);

  var subjects = genSubjects(newChip.tag);
  var tableRows = tableCard.querySelectorAll('tbody tr');
  for (var i = 0; i < tableRows.length; ++i) {
    var tableCell = document.createElement('td');
    tableCell.innerHTML = subjects[i];
    tableRows[i].appendChild(tableCell);
  }
}

document.addEventListener('show', function(event) {
  // Pages: Classes, Compare, Settings
  // Set up dropdowns with header text replacement or chip addition
  var drop = document.getElementsByClassName('dropdown-content');
  for (var i = 0; i < drop.length; ++i) {
    // Position the dropdown
    drop[i].style.width = drop[i].previousElementSibling.offsetWidth + 'px';
    drop[i].style.top = drop[i].previousElementSibling.offsetTop + 'px';
    drop[i].style.left = drop[i].previousElementSibling.offsetLeft + 'px';
    // Set up the activating button
    drop[i].previousElementSibling.onmousedown = function() {
      this.classList.toggle('active');
    };
    stripInnerTags(drop[i].previousElementSibling);

    // Decide on the dropdown button's action
    var bts = drop[i].getElementsByTagName('ons-button');
    if (hasClass(drop[i], 'set-text')) {
      for (var j = 0; j < bts.length; ++j) {
        bts[j].dropdownButton = drop[i].previousElementSibling;
        bts[j].onmousedown = dropSetText;
        stripInnerTags(bts[j]);
      }
    }
    else {
      for (var j = 0; j < bts.length; ++j) {
        bts[j].dropdownButton = drop[i].previousElementSibling;
        bts[j].onmousedown = dropAddChip;
        stripInnerTags(bts[j]);
      }
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


  // Page: Compare
  // Prevent SideNav from opening when the table gets scrolled
  var isTouchDown = false;
  var table = document.getElementById('comparison-table');
  if (table != null) {
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


  // Page: Vacant Rooms
  // Set up chips to open corresponding modals on click
  var available = document.querySelectorAll(':not(#selected-classes) .chip:not(.taken)');
  var taken = document.querySelectorAll(':not(#selected-classes) .chip.taken');
  for (var i = 0; i < available.length; ++i) {
    available[i].onmousedown = showOccupy;
  }
  for (var i = 0; i < taken.length; ++i) {
    taken[i].onmousedown = showOccupied;
  }

  // Set up label, character counter on a textarea
  var occupyReason = document.querySelector('textarea');
  if (occupyReason != null) {
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


  // Page: Home
  // Set up the action sheet and its activator
  var act = document.querySelector('.activator');
  if (act != null) {
    var sheet = document.getElementById('sheet');
    var sheetBtns = sheet.getElementsByTagName('ons-action-sheet-button');

    // Make button presses change the switch's state
    for (var i = 0; i < sheetBtns.length; ++i) {
      sheetBtns[i].onmousedown = toggleSwitch;
    }

    // Close the action sheet with the last button
    sheetBtns[sheetBtns.length - 1].onmousedown = function() {
      sheet.hide();
    };

    // Open the action sheet with an activator
    act.onmousedown = function() {
      sheet.show();
    };
  }


  // Page: Home, Classes
  // Set up toasts with lesson info
  var lists = document.querySelectorAll('ons-card ons-list');
  var toast = document.querySelector('ons-toast');
  if (toast != null && lists != null && toast.id !== 'intro-toast') {
    toast.querySelector('button').onmousedown = function() {
      clearTimeout(toast.timer);
      toast.hide();
    };

    for (var i = 0; i < lists.length; ++i) {
      var btns = lists[i].getElementsByTagName('ons-list-item');
      for (var j = 0; j < btns.length; ++j) {
        btns[j].onmousedown = function() {
          clearTimeout(lastToastTimer);
          toast.show().then(function() {
            toast.timer = setTimeout(function() {
              if (toast.visible) {
                toast.hide();
              }
            }, 2000);
            lastToastTimer = toast.timer;
          });
        };
      }
    }
  }


  // Page: Teachers
  // Set up autocomplete
  var auto = document.getElementById('auto');
  if (auto != null) {
    var autoInput = auto.querySelector('input');
    new Awesomplete(autoInput, {
  	  list: [
        "Алексеева М. А.",
        "Ананьина Т. А.",
        "Ануфриенко С. А.",
        "Анциферова О. Н.",
        "Арсеньев М. В.",
        "Бабушкина С. В.",
        "Белькова А. В.",
        "Беляева В. В.",
        "Березовский П. П.",
        "Биккин Х. М.",
        "Бондарович Т. П.",
        "Буйначева А. В.",
        "Бутакова И. В.",
        "Васильева Е. В.",
        "Воробьев А. М.",
        "Галиева З. Р.",
        "Гейн К. А.",
        "Гейн Н. А.",
        "Гейн П. А.",
        "Глухарева А. С.",
        "Гольдин А. М.",
        "Гулика С. В.",
        "Гусева З. В.",
        "Давыдова Е. Ю.",
        "Данилова М. Н.",
        "Данчева Е. В.",
        "Девяткова А. А.",
        "Довгошея Л. Ю.",
        "Дробина И. В.",
        "Дубиковский А. С.",
        "Дьячкова А. В.",
        "Еремеева Л. А.",
        "Жердев Д. В.",
        "Зайнетдинова О. Ф.",
        "Зайцева С. Л.",
        "Замов Э. А.",
        "Запасская И. П.",
        "Звонарева А. В.",
        "Зенкина Н. С.",
        "Зырянов О. В.",
        "Зырянов С. В.",
        "Зырянова М. А.",
        "Ибатуллин А. А.",
        "Иванов А. В.",
        "Иванова Е. В.",
        "Иванова М. Э.",
        "Инишева О. В.",
        "Исакова Е. А.",
        "Казакова Ю. О.",
        "Карнаухов Л. М.",
        "Квакина Е. А.",
        "Киселев П. Г.",
        "Климов А. Ю.",
        "Климова Л. И.",
        "Ковалкина И. А.",
        "Кокшина Ю. В.",
        "Колбин С. Ю.",
        "Колесова Г. М.",
        "Колпакова Е. О.",
        "Коновалов А. А.",
        "Копытов А. Н.",
        "Коробицына Э. Г.",
        "Кремешкова С. А.",
        "Кривощапова Ю. А.",
        "Кузнецов А. В.",
        "Кузьмина Л. Г.",
        "Кумейшин К. В.",
        "Кутрачева Л. В.",
        "Кырчиков М. С.",
        "Лакиза Н. В.",
        "Ланских А. В.",
        "Лаптева Е. Р.",
        "Лауфер Т. О.",
        "Лимушин В. П.",
        "Ляпин В. А.",
        "Малоземов О. Ю.",
        "Мартьянов А. А.",
        "Масленникова М. И.",
        "Мезенцев А. Т.",
        "Меньшикова Л. А.",
        "Мехонцева И. В.",
        "Минигулов Н. А.",
        "Михалищева С. С.",
        "Модестова Л. Е.",
        "Назаренко И. Н.",
        "Овчинников А. Г.",
        "Огоновская И. С.",
        "Оснач С. Н.",
        "Паутов А. С.",
        "Петько О. М.",
        "Пиминова А. А.",
        "Пирожок Е. А.",
        "Плотникова В. В.",
        "Погребак Л. М.",
        "Подкорытов А. Л.",
        "Полетаева С. И.",
        "Попович А. Л.",
        "Прокина Г. М.",
        "Прохорова О. И.",
        "Рабинович В. С.",
        "Рачеенкова О. А.",
        "Рохина Т. Т.",
        "Рудько О. И.",
        "Савельева О. Н.",
        "Савинов И. А.",
        "Сандакова С. Л.",
        "Саночкин В. А.",
        "Саночкина Н. Я.",
        "Сапегина Т. В.",
        "Сидорова Е. В.",
        "Симакова Л. А.",
        "Симонова А. А.",
        "Симонова Т. В.",
        "Синдимирова М. В.",
        "Смаилова М. С.",
        "Смирнова Г. С.",
        "Смирнова Е. В.",
        "Смирнова Н. В.",
        "Соколова Е. М.",
        "Соловьев А. Л.",
        "Сотрудник И. С.",
        "Тарасов Д. С.",
        "Тарасова Е. А.",
        "Толмачев Е. П.",
        "Томилова Л. И.",
        "Упоров А. А.",
        "Устинова Т. И.",
        "Феофилова Н. И.",
        "Фертикова Н. С.",
        "Филаретова Е. Г.",
        "Филаретова Н. С.",
        "Фоменко О. А.",
        "Харченко В. В.",
        "Цалковская Л. А.",
        "Чайникова С. А.",
        "Черемичкин С. А.",
        "Черемичкина И. А.",
        "Черноус О. А.",
        "Членова И. А.",
        "Чудимова Л. Н.",
        "Чудновский В. В.",
        "Чуркина Е. Н.",
        "Чухарев А. С.",
        "Шайдаров А. С.",
        "Шапиро О. Е.",
        "Шишеморова С. Б.",
        "Шнырёв М. Е.",
        "Щербак Т. Л."
      ],
  	  minChars: 1
    });
    autoInput.nextElementSibling.classList.add('dropdown-content', 'autocomplete-content');
  }


  // Page: Vacant Rooms
  // Switch cards with a segmented control
  var segment = document.getElementById('segment');
  if (segment != null) {
    var segmBtns = segment.getElementsByClassName('segment__item');
    var lessonCards = document.getElementsByClassName('lesson-rooms');
    for (var i = 0; i < segmBtns.length; ++i) {
      segmBtns[i].lessonCards = lessonCards;
      segmBtns[i].onmousedown = openLesson;
    }
  }


  // Page: Settings
  // Set up buttons on occupation rules
  var reasonToast = document.getElementById('reason-toast');
  var undoToast = document.getElementById('undo-toast');
  if (reasonToast != null) {
    reasonToast.querySelector('button').onmousedown = function() {
      clearTimeout(reasonToast.timer);
      reasonToast.hide();
    };

    undoToast.querySelector('button').onmousedown = function() {
      clearTimeout(undoToast.timer);
      // Unhide the list item and prevent its deletion
      this.parentElement.parentElement.listItem.style.display = 'flex';
      undoToast.hide();
    };

    function showReason() {
      clearTimeout(lastReasonToastTimer);
      reasonToast.show().then(function() {
        reasonToast.timer = setTimeout(function() {
          if (reasonToast.visible) {
            reasonToast.hide();
          }
        }, 2000);
        lastReasonToastTimer = reasonToast.timer;
      });
    }

    function removeRule() {
      var listItem = this.parentElement.parentElement;
      undoToast.listItem = listItem;

      listItem.style.display = 'none';  // Temporarily hide the list item
      clearTimeout(lastUndoToastTimer);
      undoToast.show().then(function() {
        undoToast.timer = setTimeout(function() {
          if (undoToast.visible) {
            undoToast.hide();
          }

          // If the deletion wasn't undone with the toast, remove the list item
          if (listItem.style.display === 'none') {
            listItem.parentElement.removeChild(listItem);
          }
        }, 2000);
        lastUndoToastTimer = undoToast.timer;
      });

    }

    var reasonToggles = document.getElementsByClassName('show-reason');
    for (var i = 0; i < reasonToggles.length; ++i) {
      reasonToggles[i].parentElement.onmousedown = showReason;
      reasonToggles[i].parentElement.nextElementSibling.onmousedown = removeRule;
    }

    document.getElementById('clear-storage').onmousedown = function() {
      window.localStorage.clear();
    }
  }


  // Page: Intro
  // Set up pagination dots
  var carousel = document.querySelector('ons-carousel');
  if (carousel != null) {
    var dots = carousel.querySelector('.dots').getElementsByTagName('i');
    carousel.addEventListener('postchange', function() {
      var activeIdx = carousel.getActiveIndex();
      for (var i = 0; i < dots.length; ++i) {
        dots[i].classList.remove('current');
      }
      dots[activeIdx].classList.add('current');
    });

    for (var i = 0; i < dots.length; ++i) {
      dots[i].carousel = carousel;
      dots[i].onmousedown = jumpToCarouselPage;
    }
  }
});
