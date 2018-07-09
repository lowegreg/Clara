var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'db-l5jpoe4odyyvypgiwexyddrqfu.clhelwr0pylt.ca-central-1.rds.amazonaws.com',
  user: 'Clara',
  password: 'T1meMachine',
  database: 'ClaraTest'// change to Clara if you want main DB  (currently set to ClaraTest for testing purposes)
});

// require csvtojson
var file='./ParkingData.json'
var parking = require(file);

for (var i=340000; i<parking.length; i++){
  var sql= 'Insert into `Parking Infractions` (Date, `Violation Location`, `Violation Description`, Fee)  values \
          (\''+parking[i].Date+'\', \''+parking[i]['Violation Location']+'\', \''+parking[i]['Violation Description']+'\', '+parking[i].Fee+')'
 
  insert(sql)
}

async function insert (sql){     
  await connection.query(sql, function (err, rows) {
    if (err){
      console.log(err)
    } 
    
  });
}


 
    
  

