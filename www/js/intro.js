function checkIntroFields() {
  var carousel = document.querySelector('ons-carousel');

  var introName = document.getElementById('#intro-name').value;
  var introClass = document.getElementById('#intro-class').textContent;

  if (introClass == 'Выберите класс') {
    // If the class field is empty, switch to the last slide and show an alert
    ons.notification.toast('Пожалуйста, выберите свой класс', {timeout: 1500});
    carousel.setActiveIndex(3);
  }
  else {
    // If the name field is empty, set it to default value
    if (!introName) introName = 'Аноним';
    // Seed the database
    db.transaction(function (tx) {
      tx.executeSql('INSERT INTO settings VALUES ("name", ?)', [introName]);
      tx.executeSql('INSERT INTO settings VALUES ("class", ?)', [introClass]);
      tx.executeSql('INSERT INTO settings VALUES ("changes-top", "0")', []);
      tx.executeSql('INSERT INTO settings VALUES ("receive-push", "1")', []);
      tx.executeSql('INSERT INTO settings VALUES ("receive-morning-push", "0")', []);
      tx.executeSql('INSERT INTO settings VALUES ("receive-evening-push", "0")', []);
      tx.executeSql('INSERT INTO settings VALUES ("morning-time", "07:00")', []);
      tx.executeSql('INSERT INTO settings VALUES ("evening-time", "21:00")', []);
    });

    // Update the menu information
    document.getElementById('#menu-user-name').textContent = introName;
    document.getElementById('#menu-user-class').textContent = introClass;

    // Register in OneSignal
    window.plugins.OneSignal.registerForPushNotifications();
    // Register device for class-specific notifications
    window.plugins.OneSignal.sendTags({class: introClass});

    // Switch to Home
    fn.load('home.html');
  }
}
