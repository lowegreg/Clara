var express=require("express");
var cors = require('cors');
var bodyParser=require('body-parser');
var app = express();
var con        = require('./config');
var authenticateController=require('./controllers/authenticate-controller');
var registerController=require('./controllers/register-controller');
const fetch = require('node-fetch')

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

/* route to handle login and registration */
app.post('/api/register',registerController.register);
app.post('/api/authenticate',authenticateController.authenticate);
// all data sets 
app.get('/tableLookUp', function(req, res){
  var id = req.param('id');
  var sql;

  if (id){
    sql = 'SELECT * FROM tableLookUp WHERE tableId= '+id
  } else {
    sql = 'SELECT * FROM tableLookUp '
  } 
  con.query(sql, function(err, rows){
    if (err){
      res.json({"Error": true, "Message":"Error Execute Sql"});
    } else {
      res.json({"Error": false,"Message": "Success", "tableId" : rows});
    }
  });
})

// traffic information
app.get('/trafficCollisions', function(req, res){

  var sql= 'SELECT  ENVIRONMENT_CONDITION as `name`, COUNT(*) as `accidents`  FROM `Traffic Collisions` group by ENVIRONMENT_CONDITION'

  con.query(sql, function(err, rows){
    if (err){
      res.json({"Error": true, "Message":"Error Execute Sql"});
    } else {
      res.json({"Error": false,"Message": "Success", "id" : rows});
    }
  });
})
// parking information
app.get('/ParkingInfractions/violations', function(req, res){

  var sql= 'select `Violation Description` as name, count(`Violation Description`) as value from `Parking Infractions` where MONTHNAME(date)!= \'November\' group by `Violation Description` having count(`Violation Description`)>1000'

  con.query(sql, function(err, rows){
    if (err){
      res.json({"Error": true, "Message":"Error Execute Sql"});
    } else {
      res.json({"Error": false,"Message": "Success", "id" : rows});
    }
  });
})
app.get('/ParkingInfractions/feesPerDate', function(req, res){

  var sql= 'select ticket.month ,tickets, Fee from (select MONTHNAME(date) as month, count(date)as tickets from `Parking Infractions` where MONTHNAME(date)!= \'November\' GROUP BY YEAR(date), MONTH(date)) as ticket, (select  MONTHNAME(date) as month , sum(`FEE`) as Fee from `Parking Infractions` where MONTHNAME(date)!= \'November\' GROUP BY YEAR(date), MONTH(date)) as fees where ticket.month=fees.month '

  con.query(sql, function(err, rows){
    if (err){
      res.json({"Error": true, "Message":"Error Execute Sql"});
    } else {
      res.json({"Error": false,"Message": "Success", "id" : rows});
    }
  });
})
app.get('/ParkingInfractions/locationFees', function(req, res){

  var sql= 'select `Violation Location` as Location , sum(`Fee`) as Revenue from `Parking Infractions` where MONTHNAME(date)!= \'November\' group by `Violation Location` having Revenue >8000'

  con.query(sql, function(err, rows){
    if (err){
      res.json({"Error": true, "Message":"Error Execute Sql"});
    } else {
      res.json({"Error": false,"Message": "Success", "id" : rows});
    }
  });
})

//suggestions page
app.post('/suggestions', function(req, res){
  var sql= ' INSERT INTO suggestions (security, cost, efficiency, insights, ux, description, status) values (\'' + req.body.security+'\','+ req.body.cost+','+ req.body.efficiency+','+req.body.insight+','+req.body.ux+',\''+req.body.description+'\', \'submited\')';
  con.query(sql, function(err, rows){
    if (err){
      res.json({"Error": true, "Message":"Error Execute Sql"});
    } else {
      res.json({"Error": false,"Message": "Success", "id" : rows});
    }
  });
})

// data management 
app.get('/dataManagement/getProps', function(req, res){
 
  //use props
  var sql= 'SELECT propId FROM props where tableId in (select tableId from tableLookUp where name=\''+req.query.tableName+'\')' 
  con.query(sql, function(err, rows){
    if (err){
      res.json({"Error": true, "Message":"Error Execute Sql"});
    } else {
      res.json({"Error": false,"Message": "Success", "id" : rows});
    }
  });
})

app.get('/dataManagement/getDataTypes', function(req, res){
 
 
  var sql= 'select distinct dataType, category from dataTypes' 
  con.query(sql, function(err, rows){
    if (err){
      res.json({"Error": true, "Message":"Error Execute Sql"});
    } else {
      res.json({"Error": false,"Message": "Success", "id" : rows});
    }
  });
})

app.post('/dataManagement/postPropsDataTypes', function(req, res){

  var sql= 'update props set dataTypes=\''+req.body.dataType+'\' where   propId=\''+req.body.propId+'\'  and tableId in (select tableId from tableLookUp where name=\''+req.body.tableName+'\')';
  console.log(sql);
  con.query(sql, function(err, rows){
    if (err){
      res.json({"Error": true, "Message":"Error Execute Sql"});
    } else {
      res.json({"Error": false,"Message": "Success", "id" : rows});
    }
  });
})

app.post('/dataManagement/postDefaultTags', function(req, res){
    var sql= 'update tableLookUp set defaultTag=\''+req.body.tagName+'\' ,statusId=\'submitted\' where name=\''+req.body.tableName+'\'';
  console.log(sql)
    con.query(sql, function(err, rows){
      if (err){
        res.json({"Error": true, "Message":"Error Execute Sql"});
      } else {
        res.json({"Error": false,"Message": "Success", "id" : rows});
      }
    });
  })

app.listen(3000, function () {
  console.log(' REST server started.');
});