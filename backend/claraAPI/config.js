var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'db-l5jpoe4odyyvypgiwexyddrqfu.clhelwr0pylt.ca-central-1.rds.amazonaws.com',
    user     : 'Clara',
    password : 'T1meMachine',
    database : 'ClaraTest'
  });
module.exports = connection;