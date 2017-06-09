function preparePages() {
  // Set up pages with needed information
  db.transaction(function (tx) {
    // Insert the user's name and class into the menu
    tx.executeSql('SELECT * FROM settings WHERE key="name"', [], function (tx, results) {
      document.getElementById('menu-user-name').textContent = results.rows.item(0).value;
    });
    tx.executeSql('SELECT * FROM settings WHERE key="class"', [], function (tx, results) {
      document.getElementById('menu-user-class').textContent = results.rows.item(0).value;
    });
  });
};

// If Firefox, redirect to home straight away
if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
  fn.load('home.html');
}
else {
  db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM settings WHERE key="class"', [], function (tx, results) {
      // If it is the first launch, navigate user to the Intro
      if (!results.rows.length) {
        fn.load('intro.html');
      }
      // Otherwise, fill in the data and redirect to Home
      else {
        preparePages();
        fn.load('home.html');
      }
    }, null);
  });
}
