$(function() {
  $('.chips-autocomplete').material_chip({
    autocompleteOptions: {
      data: {
      "8А": null,
      "9А": null,
      "9Б": null,
      "9В": null,
      "9Е": null,
      "10А": null,
      "10Б": null,
      "10В": null,
      "10Г": null,
      "10Д": null,
      "10Е": null,
      "10З": null,
      "10К": null,
      "11А": null,
      "11Б": null,
      "11В": null,
      "11Г": null,
      "11Д": null,
      "11Е": null,
      "11З": null,
      "11К": null,
      "8Л": null,
      "8С": null,
      "9Л": null,
      "9С": null,
      "10Л": null,
      "10М": null,
      "10С": null,
      "11Л": null,
      "11М": null,
      "11С": null
      },
      limit: 11,
      minLength: 1,
      placeholder: 'Введите классы'
    }
  });

  var allowedTags = new Set(["8А", "9А", "9Б", "9В", "9Е", "10А", "10Б", "10В",
  "10Г", "10Д", "10Е", "10З", "10К", "11А", "11Б", "11В", "11Г", "11Д", "11Е",
  "11З", "11К", "8Л", "8С", "9Л", "9С", "10Л", "10М", "10С", "11Л", "11М", "11С"]);

  var chipCount = 0;
  var usedChips = [];
  var $table = $('table');

  $('.chips-autocomplete').on('chip.add', function(e, chip) {
    // Validate the chip
    chip.tag = chip.tag.toUpperCase();
    if (!allowedTags.has(chip.tag) || usedChips.indexOf(chip.tag) !== -1) {
      $('.chip').last().remove();
      return;
    }

    // Correct the case of the chip tag
    $('.chip').last().text(chip.tag).append($('<i class="material-icons close">close</i>'));

    // Turn off the corresponding button in the dropdown
    $('a.btn-flat:contains(' + chip.tag + ')').addClass('disabled');

    // Remember the chip
    usedChips.push(chip.tag);
    $table.parents('.row').removeClass('hide');
    $('.empty').addClass('hide');

    // If there's 3 chips, disable the inputs
    if (chipCount == 2) {
      $('.chips .input').prop('disabled', true);
      $('.dropdown-button').addClass('disabled');
    }
    ++chipCount;

    // Add a row to the table
    $table.find('thead tr').append($('<th>' + chip.tag + '</th>'));
    var subjects = genSubjects(chip.tag);
    $table.find('tbody tr').each(function() {
      $(this).append('<td>' + subjects[$(this).index()] + '</td>');
    });
  });

  $('.chips-autocomplete').on('chip.delete', function(e, chip) {
    --chipCount;
    // Forget the chip
    var idx = usedChips.indexOf(chip.tag);
    usedChips.splice(idx, 1);
    if (!usedChips.length) {
      $table.parents('.row').addClass('hide');
      $('.empty').removeClass('hide');
    }

    // Turn on the corresponding button in the dropdown
    $('a.btn-flat:contains(' + chip.tag + ')').removeClass('disabled');

    // If there's less than 3 chips, allow input again
    if (chipCount == 2) {
      $('.chips .input').prop('disabled', false);
      $('.dropdown-button').removeClass('disabled');
    }

    // Delete the corresponding row from the table
    $('thead th:nth-child(' + (idx + 2) + ')').remove();
    $('tbody td:nth-child(' + (idx + 2) + ')').remove();
  });

  $('.collapsible-body .btn-flat').click(function() {
    // Simulate entering the class into the textfield
    $('.chips input').val($(this).text()).focusin().trigger({
      type: 'keydown',
      which: 13
    });
  });

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
});