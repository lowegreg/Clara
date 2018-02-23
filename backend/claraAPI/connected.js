var mysql = require('mysql');
var con   = mysql.createConnection({
   host: 'aa3c9aa9sse4d7.clhelwr0pylt.ca-central-1.rds.amazonaws.com',
    user: 'Clara',
    password: 'T1meMachine',
    database: 'Clara'
});
module.exports = con;