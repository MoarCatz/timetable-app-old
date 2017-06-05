window.fn = {};

window.fn.open = function() {
  var menu = document.getElementById('menu');
  menu.open();
};

window.fn.load = function(page) {
  var menu = document.getElementById('menu');
  var navi = document.getElementById('navi');
  menu.close();
  navi.resetToPage(page, {animation: 'none'});
};

// Open the database
var db = openDatabase('timetable', '1.0', 'Main app data storage', 2 * 1024 * 1024);

// Set up the schema
db.transaction(function (tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS settings (key TEXT, value TEXT)', []);
});

// Init OneSignal
document.addEventListener('deviceready', function () {
  // What happens when notification is received
  var notificationOpenedCallback = function(jsonData) {
    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
  };

  window.plugins.OneSignal
    // It is okay to keep the key here since this account is only for testing purposes
    .startInit("1a83588c-f4b3-40b5-9843-2fc6423f6186")
    // Define where should we work with received notifications
    .handleNotificationOpened(notificationOpenedCallback)
    .endInit();
}, false);
