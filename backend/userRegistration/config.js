var mysql      = require('mysql');

var connection = mysql.createConnection({
    host     : 'aa3c9aa9sse4d7.clhelwr0pylt.ca-central-1.rds.amazonaws.com',
    user     : 'Clara',
    password : 'T1meMachine',
    database : 'Clara'
  });
connection.connect(function(err){
if(!err) {
    console.log("Database is connected");
} else {
    console.log("Error while connecting with database");
}
});
module.exports = connection;