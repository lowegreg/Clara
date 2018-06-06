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
  // var id = req.param('id');
  var sql;

  if (req.query.tableName){
    sql = 'SELECT * FROM tableLookUp WHERE name= \''+req.query.tableName +'\''
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
  var sql= 'SELECT propId, dataTypes FROM props where tableId in (select tableId from tableLookUp where name=\''+req.query.tableName+'\')' 
  con.query(sql, function(err, rows){
    if (err){
      res.json({"Error": true, "Message":"Error Execute Sql"});
    } else {
      res.json({"Error": false,"Message": "Success", "id" : rows});
    }
  });
})
//get all offical datatypes
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

//update props with maped datatypes for a specific data set
app.post('/dataManagement/postPropsDataTypes', function(req, res){
  var sql= 'update props set dataTypes=\''+req.body.dataType+'\' where   propId=\''+req.body.propId+'\'  and tableId in (select tableId from tableLookUp where name=\''+req.body.tableName+'\')';

  con.query(sql, function(err, rows){
    if (err){
      res.json({"Error": true, "Message":"Error Execute Sql"});
    } else {
      res.json({"Error": false,"Message": "Success", "id" : rows});
    }
  });
})

// set default tag for data set
app.post('/dataManagement/postDefaultTags', function(req, res){
    
    var d = new Date();
    var today = d.getFullYear()+'/'+d.getMonth()+'/'+d.getDate();
   
    var sql= 'update tableLookUp set defaultTag=\''+req.body.tagName+'\' ,statusId=\'submitted\', submittedBy=\''+req.body.user+'\' ,submittedOn=\''+today+'\' where name=\''+req.body.tableName+'\'';
    con.query(sql, function(err, rows){
      if (err){
        res.json({"Error": true, "Message":err});
      } else {
        res.json({"Error": false,"Message": "Success", "id" : rows});
      }
    });
})
//set data set status for data mapping if rejected it has feedback as well
app.post('/dataManagement/postTableStatus', function(req, res){
  var sql;
  if (req.body.status==='accepted'){
    sql= 'update tableLookUp set  statusId=\''+req.body.status+'\' where name=\''+req.body.tableName+'\'';
  }else{
    sql= 'update tableLookUp set  statusId=\''+req.body.status+'\' , feedback=\''+ req.body.feedback+'\'  where name=\''+req.body.tableName+'\'';
  }

  con.query(sql, function(err, rows){
    if (err){
      res.json({"Error": true, "Message":"Error Execute Sql"});
    } else {
      res.json({"Error": false,"Message": "Success", "id" : rows});
    }
  });
})

//add new data type
app.post('/dataManagement/postNewDatatype', function(req, res){
  var sql= 'insert into dataTypes (category, dataType) values (\''+req.body.category+'\',\''+req.body.datatype+'\')';
  con.query(sql, function(err, rows){
    if (err){
      res.json({"Error": true, "Message":err});
    } else {
      res.json({"Error": false,"Message": "Success", "id" : rows});
    }
  });
})

// add a notificaiton
app.post('/postNotifications', function(req, res){
  var today = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
  var sql= 'insert into notifications (email, receipt,subTitle, noteDate, title) values (\''+req.body.email+'\',\'delivered\', \''+req.body.subTitle+'\',\''+today+'\', \''+req.body.title+'\')';
  con.query(sql, function(err, rows){
    if (err){
      res.json({"Error": true, "Message":err});
    } else {
      res.json({"Error": false,"Message": "Success", "id" : rows});
    }
  });
})

//get notifciaiton for a particular user
app.get('/getNotifications', function(req, res){
  var sql= 'select * from notifications where email=\''+req.query.email+'\' and receipt=\''+req.query.receipt+'\''
  con.query(sql, function(err, rows){
    if (err){
      res.json({"Error": true, "Message":err});
    } else {
      res.json({"Error": false,"Message": "Success", "id" : rows});
    }
  });
})

// mark notificaiton as read
app.post('/updateNotifications', function(req, res){
  var sql= 'UPDATE notifications SET receipt=\'read\' WHERE id='+req.body.id
  con.query(sql, function(err, rows){
    if (err){
      res.json({"Error": true, "Message":err});
    } else {
      res.json({"Error": false,"Message": "Success", "id" : rows});
    }
  });
})
// universal select all
app.get('/selectGraphData', function(req, res){
  var sql= 'Select COUNT(`'+ req.query.y+'`) as y, `'+ req.query.x+ '` as x from `'+req.query.tableName +'` group by `'+req.query.x+'`  order by COUNT(`'+req.query.y+'`) desc limit 5'
 
  if (req.query.xType==='date'&& req.query.yType==='type'){
    sql=  'Select count(`'+req.query.y+'`) as z,  MONTHNAME('+req.query.x+') as y, `'+req.query.y+'` as x from `'+req.query.tableName+'` as main inner join (select `'+req.query.y+'` as name from `'+req.query.tableName+'`  as t1 group by `'+req.query.y+'` order by count(`'+req.query.y+'`) desc limit 5) as compare  on main.`'+req.query.y+'` = compare.name where ( select count(*) from (select count(`'+req.query.y+'`) as length from `'+req.query.tableName+'` as t1 group by `'+req.query.y+'`)  as t2)>1 and ( select count(*) from (select count(MONTHNAME('+req.query.x+')) as length from `'+req.query.tableName+'` as t3 group by MONTHNAME('+req.query.x+'))  as t4)>1 group by MONTHNAME('+req.query.x+'), `'+req.query.y+'`  order by MONTH('+req.query.x+'), COUNT(`'+req.query.y+'`) desc'
  }else if (req.query.xType==='type'&& req.query.yType==='loc' ||(req.query.xType==='fin'&& req.query.yType==='loc' )){
    sql= 'Select count(`'+req.query.y+'`) as z, `'+req.query.y+'` as y, `'+req.query.x+'` as x from `'+req.query.tableName+'`  where ( select count(*) from (select count(`'+req.query.y+'`) as length from `'+req.query.tableName+'` as t1 group by `'+req.query.y+'`)  as t2)>1 and ( select count(*) from (select count(`'+req.query.x+'`) as length from `'+req.query.tableName+'` as t3 group by `'+req.query.x+'`)  as t4)>1 group by `'+req.query.y+'`, `'+req.query.x+'`  order by COUNT(`'+req.query.x+'`) desc limit 10'
  }else if (req.query.xType==='date' &&req.query.yType==='value'){
    sql= 'Select sum('+ req.query.y+') as y, MONTHNAME('+ req.query.x+ ') as x from `'+req.query.tableName +'` where ( select count(*) from (select count('+req.query.y+') as length from `'+req.query.tableName+'` as t1 group by '+req.query.y+')  as t2)>1 and ( select count(*) from (select count(`'+req.query.x+'`) as length from `'+req.query.tableName+'` as t3 group by '+req.query.x+')  as t4)>1  group by MONTH('+req.query.x+')   order by sum('+req.query.y+') desc limit 10'   
  }else if (req.query.yType==='value'){
    sql= 'select * from (Select sum('+ req.query.y+') as y, '+ req.query.x+ ' as x from `'+req.query.tableName +'` where ( select count(*) from (select count('+req.query.y+') as length from `'+req.query.tableName+'` as t1 group by '+req.query.y+')  as t2)>1 and ( select count(*) from (select count(`'+req.query.x+'`) as length from `'+req.query.tableName+'` as t3 group by '+req.query.x+')  as t4)>1  group by ('+req.query.x+')   order by sum('+req.query.y+') desc limit 10 ) as inside where y>0'   
  }
  else if (req.query.xType==='date'||(req.query.xType==='fin'&& req.query.yType==='date')){
    sql= 'Select COUNT(`'+ req.query.y+'`) as y, MONTHNAME('+ req.query.x+ ') as x from `'+req.query.tableName +'` where ( select count(*) from (select count(`'+req.query.y+'`) as length from `'+req.query.tableName+'` as t1 group by `'+req.query.y+'`)  as t2)>1 and ( select count(*) from (select count(`'+req.query.x+'`) as length from `'+req.query.tableName+'` as t3 group by `'+req.query.x+'`)  as t4)>1 group by MONTH('+req.query.x+')  ' 
  }

  con.query(sql, function(err, rows){
    if (err){
      res.json({"Error": true, "Message":err});
    } else {
      res.json({"Error": false,"Message": "Success", "id" : rows});
    }
  });
})

app.get('/weather', function(req, res){
  var sql = 'SELECT * FROM Weather order by date desc'
  con.query(sql, function(err, rows){
    if (err){
      res.json({"Error": true, "Message":"Error Execute Sql"});
    } else {
      res.json({"Error": false,"Message": "Success", "id" : rows});
    }
  })
})

app.listen(3000, function () {
  console.log(' REST server started.');
});