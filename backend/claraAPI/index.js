var express = require("express");
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();
var con = require('./config');
var mysql = require('mysql');
var conTest = mysql.createConnection({
  host: 'db-l5jpoe4odyyvypgiwexyddrqfu.clhelwr0pylt.ca-central-1.rds.amazonaws.com',
  user: 'Clara',
  password: 'T1meMachine',
  database: 'ClaraIdeas'
});
var authenticateController = require('./controllers/authenticate-controller');
var registerController = require('./controllers/register-controller');

const fetch = require('node-fetch')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* route to handle login and registration */
app.post('/api/register', registerController.register);
app.post('/api/authenticate', authenticateController.authenticate);
// all data sets 
app.get('/tableLookUp', function (req, res) {
  // var id = req.param('id');
  var sql;
  if (req.query.getNames==='true'){
    sql = 'SELECT name FROM tableLookUp' 
  }else if (req.query.tableName) {
    sql = 'SELECT * FROM tableLookUp WHERE name= \'' + req.query.tableName + '\''
  } else {
    sql = 'SELECT * FROM tableLookUp '
  }
  con.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": "Error Execute Sql" });
    } else {
      res.json({ "Error": false, "Message": "Success", "tableId": rows });
    }
  });
})

// traffic information
app.get('/trafficCollisions', function (req, res) {

  var sql = 'SELECT  ENVIRONMENT_CONDITION as `name`, COUNT(*) as `accidents`  FROM `Traffic Collisions` group by ENVIRONMENT_CONDITION'

  con.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": "Error Execute Sql" });
    } else {
      res.json({ "Error": false, "Message": "Success", "id": rows });
    }
  });
})
// parking information
app.get('/ParkingInfractions/violations', function (req, res) {

  var sql = 'select `Violation Description` as name, count(`Violation Description`) as value from `Parking Infractions` where MONTHNAME(date)!= \'November\' group by `Violation Description` having count(`Violation Description`)>1000'

  con.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": "Error Execute Sql" });
    } else {
      res.json({ "Error": false, "Message": "Success", "id": rows });
    }
  });
})
app.get('/ParkingInfractions/feesPerDate', function (req, res) {

  var sql = 'select ticket.month ,tickets, Fee from (select MONTHNAME(date) as month, count(date)as tickets from `Parking Infractions` where MONTHNAME(date)!= \'November\' GROUP BY YEAR(date), MONTH(date)) as ticket, (select  MONTHNAME(date) as month , sum(`FEE`) as Fee from `Parking Infractions` where MONTHNAME(date)!= \'November\' GROUP BY YEAR(date), MONTH(date)) as fees where ticket.month=fees.month '

  con.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": "Error Execute Sql" });
    } else {
      res.json({ "Error": false, "Message": "Success", "id": rows });
    }
  });
})
app.get('/ParkingInfractions/locationFees', function (req, res) {

  var sql = 'select `Violation Location` as Location , sum(`Fee`) as Revenue from `Parking Infractions` where MONTHNAME(date)!= \'November\' group by `Violation Location` having Revenue >8000'

  con.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": "Error Execute Sql" });
    } else {
      res.json({ "Error": false, "Message": "Success", "id": rows });
    }
  });
})

//suggestions page
app.post('/suggestions', function (req, res) {
  var sql = ' INSERT INTO suggestions (security, cost, efficiency, insights, ux, description, status) values (\'' + req.body.security + '\',' + req.body.cost + ',' + req.body.efficiency + ',' + req.body.insight + ',' + req.body.ux + ',\'' + req.body.description + '\', \'submited\')';
  con.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": "Error Execute Sql" });
    } else {
      res.json({ "Error": false, "Message": "Success", "id": rows });
    }
  });
})

// data management 
app.get('/dataManagement/getProps', function (req, res) {
  //use props
  var sql = 'SELECT propId, dataTypes FROM props where tableId in (select tableId from tableLookUp where name=\'' + req.query.tableName + '\')'
  con.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": "Error Execute Sql" });
    } else {
      res.json({ "Error": false, "Message": "Success", "id": rows });
    }
  });
})
//get all offical datatypes
app.get('/dataManagement/getDataTypes', function (req, res) {
  var sql = 'select distinct dataType, category from dataTypes'
  con.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": "Error Execute Sql" });
    } else {
      res.json({ "Error": false, "Message": "Success", "id": rows });
    }
  });
})

//update props with maped datatypes for a specific data set
app.post('/dataManagement/postPropsDataTypes', function (req, res) {
  var sql = 'update props set dataTypes=\'' + req.body.dataType + '\' where   propId=\'' + req.body.propId + '\'  and tableId in (select tableId from tableLookUp where name=\'' + req.body.tableName + '\')';

  con.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": "Error Execute Sql" });
    } else {
      res.json({ "Error": false, "Message": "Success", "id": rows });
    }
  });
})

// set default tag for data set
app.post('/dataManagement/postDefaultTags', function (req, res) {

  var d = new Date();
  var today = d.getFullYear() + '/' + d.getMonth() + '/' + d.getDate();

  var sql = 'update tableLookUp set defaultTag=\'' + req.body.tagName + '\' ,statusId=\'submitted\', submittedBy=\'' + req.body.user + '\' ,submittedOn=\'' + today + '\' where name=\'' + req.body.tableName + '\'';
  con.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": err });
    } else {
      res.json({ "Error": false, "Message": "Success", "id": rows });
    }
  });
})
//set data set status for data mapping if rejected it has feedback as well
app.post('/dataManagement/postTableStatus', function (req, res) {
  var sql;
  if (req.body.status === 'accepted') {
    sql = 'update tableLookUp set  statusId=\'' + req.body.status + '\' where name=\'' + req.body.tableName + '\'';
  } else {
    sql = 'update tableLookUp set  statusId=\'' + req.body.status + '\' , feedback=\'' + req.body.feedback + '\'  where name=\'' + req.body.tableName + '\'';
  }

  con.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": "Error Execute Sql" });
    } else {
      res.json({ "Error": false, "Message": "Success", "id": rows });
    }
  });
})

//add new data type
app.post('/dataManagement/postNewDatatype', function (req, res) {
  var sql = 'insert into dataTypes (category, dataType) values (\'' + req.body.category + '\',\'' + req.body.datatype + '\')';
  con.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": err });
    } else {
      res.json({ "Error": false, "Message": "Success", "id": rows });
    }
  });
})

// add a notificaiton
app.post('/postNotifications', function (req, res) {
  var today = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
  var sql = 'insert into notifications (email, receipt,subTitle, noteDate, title) values (\'' + req.body.email + '\',\'delivered\', \'' + req.body.subTitle + '\',\'' + today + '\', \'' + req.body.title + '\')';
  con.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": err });
    } else {
      res.json({ "Error": false, "Message": "Success", "id": rows });
    }
  });
})

//get notifciaiton for a particular user
app.get('/getNotifications', function (req, res) {
  var sql = 'select * from notifications where email=\'' + req.query.email + '\' and receipt=\'' + req.query.receipt + '\''
  con.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": err });
    } else {
      res.json({ "Error": false, "Message": "Success", "id": rows });
    }
  });
})

// mark notificaiton as read
app.post('/updateNotifications', function (req, res) {
  var sql = 'UPDATE notifications SET receipt=\'read\' WHERE id=' + req.body.id
  con.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": err });
    } else {
      res.json({ "Error": false, "Message": "Success", "id": rows });
    }
  });
})
// universal select all
app.get('/selectGraphData', function (req, res) {
  var sql = 'Select COUNT(`' + req.query.y + '`) as y, `' + req.query.x + '` as x from `' + req.query.tableName + '` group by `' + req.query.x + '`  order by COUNT(`' + req.query.y + '`) desc limit 5'

  if (req.query.xType === 'date' && req.query.yType === 'type') {
    sql = 'Select count(`' + req.query.y + '`) as z,  MONTHNAME(' + req.query.x + ') as y, `' + req.query.y + '` as x from `' + req.query.tableName + '` as main inner join (select `' + req.query.y + '` as name from `' + req.query.tableName + '`  as t1 group by `' + req.query.y + '` order by count(`' + req.query.y + '`) desc limit 5) as compare  on main.`' + req.query.y + '` = compare.name where ( select count(*) from (select count(`' + req.query.y + '`) as length from `' + req.query.tableName + '` as t1 group by `' + req.query.y + '`)  as t2)>1 and ( select count(*) from (select count(MONTHNAME(' + req.query.x + ')) as length from `' + req.query.tableName + '` as t3 group by MONTHNAME(' + req.query.x + '))  as t4)>1 group by MONTHNAME(' + req.query.x + '), `' + req.query.y + '`  order by MONTH(' + req.query.x + '), COUNT(`' + req.query.y + '`) desc'
  } else if (req.query.xType === 'type' && req.query.yType === 'loc' || (req.query.xType === 'fin' && req.query.yType === 'loc')) {
    sql = 'Select count(`' + req.query.y + '`) as z, `' + req.query.y + '` as y, `' + req.query.x + '` as x from `' + req.query.tableName + '`  where ( select count(*) from (select count(`' + req.query.y + '`) as length from `' + req.query.tableName + '` as t1 group by `' + req.query.y + '`)  as t2)>1 and ( select count(*) from (select count(`' + req.query.x + '`) as length from `' + req.query.tableName + '` as t3 group by `' + req.query.x + '`)  as t4)>1 group by `' + req.query.y + '`, `' + req.query.x + '`  order by COUNT(`' + req.query.x + '`) desc limit 10'
  } else if (req.query.xType === 'date' && req.query.yType === 'value') {
    sql = 'Select sum(' + req.query.y + ') as y, MONTHNAME(' + req.query.x + ') as x from `' + req.query.tableName + '` where ( select count(*) from (select count(' + req.query.y + ') as length from `' + req.query.tableName + '` as t1 group by ' + req.query.y + ')  as t2)>1 and ( select count(*) from (select count(`' + req.query.x + '`) as length from `' + req.query.tableName + '` as t3 group by ' + req.query.x + ')  as t4)>1  group by MONTH(' + req.query.x + ')   order by sum(' + req.query.y + ') desc limit 10'
  } else if (req.query.yType === 'value') {
    sql = 'select * from (Select sum(' + req.query.y + ') as y, ' + req.query.x + ' as x from `' + req.query.tableName + '` where ( select count(*) from (select count(' + req.query.y + ') as length from `' + req.query.tableName + '` as t1 group by ' + req.query.y + ')  as t2)>1 and ( select count(*) from (select count(`' + req.query.x + '`) as length from `' + req.query.tableName + '` as t3 group by ' + req.query.x + ')  as t4)>1  group by (' + req.query.x + ')   order by sum(' + req.query.y + ') desc limit 10 ) as inside where y>0'
  }
  else if (req.query.xType === 'date' || (req.query.xType === 'fin' && req.query.yType === 'date')) {
    sql = 'Select COUNT(`' + req.query.y + '`) as y, MONTHNAME(' + req.query.x + ') as x from `' + req.query.tableName + '` where ( select count(*) from (select count(`' + req.query.y + '`) as length from `' + req.query.tableName + '` as t1 group by `' + req.query.y + '`)  as t2)>1 and ( select count(*) from (select count(`' + req.query.x + '`) as length from `' + req.query.tableName + '` as t3 group by `' + req.query.x + '`)  as t4)>1 group by MONTH(' + req.query.x + ')  '
  }

  con.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": err });
    } else {
      res.json({ "Error": false, "Message": "Success", "id": rows });
    }
  });
})



//////////////  ideas API end points ///////////////////////////////////


app.post('/findPost', function (req, res) {
  // var id = req.param('id');

  var sql;
  if (req.body.postID === -1 || typeof req.body.postID === 'undefined') {
    sql = 'SELECT * FROM ideas '
  } else {
    sql = 'SELECT * FROM ideas  where postID=' + req.body.postID
  }

  conTest.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": err });
    } else {
      res.json({ "Error": true, "value": rows, "status": 200 });
    }
  });
})

app.post('/postOrder/recent', function (req, res) {
  // var id = req.param('id');
  var sql;
  var whereClause = ' '
  if (req.body.status.length > 0 || req.body.deps.length > 0) {
    whereClause = 'where ('
  }
  for (var i = 0; i < req.body.status.length; i++) {
    whereClause = ' ' + whereClause + ' status = \'' + req.body.status[i] + '\''
    if (i + 1 < req.body.status.length) {
      whereClause = whereClause + ' or '
    } else {
      whereClause = whereClause + ' ) '
    }
  }
  if (req.body.status.length > 0 && req.body.deps.length > 1) {
    whereClause = whereClause + ' and ( '
  }

  for (var i = 0; i < req.body.deps.length; i++) {
    whereClause = ' ' + whereClause + ' targetDep = \'' + req.body.deps[i] + '\''
    if (i + 1 < req.body.deps.length) {
      whereClause = whereClause + ' or '
    } else {
      whereClause = whereClause + ' ) '
    }
  }

  sql = 'SELECT * FROM ideas  ' + whereClause + ' order by postID DESC'
  conTest.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": "Error Execute Sql" });
    } else {
      res.json({ "Error": true, "value": rows, "status": 200 });
    }
  });
})
app.post('/postOrder/latest', function (req, res) {
  // var id = req.param('id');
  var sql;
  var whereClause = ' '
  if (req.body.status.length > 0) {
    whereClause = 'where '
  }
  for (var i = 0; i < req.body.status.length; i++) {
    whereClause = ' ' + whereClause + ' status = \'' + req.body.status[i] + '\''
    if (i + 1 < req.body.status.length) {
      whereClause = whereClause + ' or '
    }
  }
  //sql = 'SELECT * FROM ideas  '+whereClause+'order by date DESC'
  sql = 'SELECT distinct ideas.postID, ideas.title, ideas.numRatings, ideas.empID, ideas.targetDep, ideas.targetDep, ideas.descrip, \
  ideas.rating, ideas.numClicks,  ideas.date , ideas.status, ideas.firstName, ideas.lastName, ideas.adminFlag, ideas.comments \
  FROM ideas \
  left join ideasHistory on  ideas.postID= ideasHistory.postID\
   '+ whereClause + ' \
  order by ideasHistory.date desc;'

  conTest.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": "Error Execute Sql" });
    } else {
      res.json({ "Error": true, "value": rows, "status": 200 });
    }
  });
})

app.post('/postOrder/highRating', function (req, res) {
  // var id = req.param('id');
  var sql;
  var whereClause = ' '
  if (req.body.status.length > 0) {
    whereClause = 'where '
  }
  for (var i = 0; i < req.body.status.length; i++) {
    whereClause = ' ' + whereClause + ' status = \'' + req.body.status[i] + '\''
    if (i + 1 < req.body.status.length) {
      whereClause = whereClause + ' or '
    }
  }

  sql = 'SELECT * FROM ideas  ' + whereClause + ' order by rating + comments  DESC'

  conTest.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": "Error Execute Sql" });
    } else {
      res.json({ "Error": true, "value": rows, "status": 200 });
    }
  });
})


app.post('/posts/UpdatePostHistory', function (req, res) {
  var d = new Date();
  var month = d.getMonth() + 1
  var today = d.getFullYear() + '-' + month + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
  var message = req.body.message || null
  var sql
  if (message === null) {
    sql = 'insert ideasHistory (postID, empID, type, previous, new, date, message) values (' + req.body.postID + ',' + req.body.empID + ',\'' + req.body.type + '\',\'' + req.body.previous + '\',\'' + req.body.new + '\',\'' + today + '\' , ' + message + ') '
  } else {
    sql = 'insert ideasHistory (postID, empID, type, previous, new, date, message) values (' + req.body.postID + ',' + req.body.empID + ',\'' + req.body.type + '\',\'' + req.body.previous + '\',\'' + req.body.new + '\',\'' + today + '\' , \'' + message + '\') '
  }

  conTest.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": "Error Execute Sql" });
    } else {
      res.json({ "Error": true, "value": rows, "status": 200 });
    }
  });
})
app.post('/contributors', function (req, res) {

  sql = 'select count(*), empID from comments where postId= ' + req.body.postID + ' group by empID'


  conTest.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": err });
    } else {
      res.json({ "Error": true, "value": rows, "status": 200 });
    }
  });
})
app.post('/posts/GetPostStatusHistory', function (req, res) {
  var sql = 'select * from ideasHistory where postID= ' + req.body.postID + ' order by date DESC'

  conTest.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": err });
    } else {
      res.json({ "Error": true, "value": rows, "status": 200 });
    }
  });
})


app.post('/posts', function (req, res) {
  var d = new Date();
  var month = d.getMonth() + 1
  var today = d.getFullYear() + '-' + month + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();

  var sql = ' INSERT INTO ideas (title, numRatings, empID, targetDep, descrip, rating, numClicks,date,status, firstName, LastName, comments,adminFlag, cost, efficiency, insights, ux) value (\'' + req.body.title + '\',' + req.body.rating + ',' + req.body.empID + ',\'' + req.body.targetDep + '\',\'' + req.body.descrip + '\',' + req.body.rating + ',' + req.body.numClicks + ',\'' + today + '\',\'' + req.body.status + '\', \'' + req.body.firstName + '\',\'' + req.body.lastName + '\',' + req.body.comments + ', ' + req.body.adminFlag + ', ' + req.body.cost + ', ' + req.body.efficiency + ', ' + req.body.insights + ', ' + req.body.ux + ' )';

  conTest.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": err });
    } else {
      res.json({ "Error": false, "status": 200, "value": rows });
    }

  });
})

app.post('/posts/deletePostByStatus', function (req, res) {
  var sql = 'update ideas set  status= \'deleted\' where postID=' + req.body.postID;

  conTest.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": err });
    } else {
      res.json({ "Error": false, "status": 200, "value": rows });
    }

  });
})


app.post('/postOrder/me', function (req, res) {// recent(created), highRating, latest (update)
  var join=' '
  if (req.body.sort==='latest'){
    join=' left join ideasHistory on  ideas.postID= ideasHistory.postID '
  }
  var sql = 'SELECT * FROM ideas'+join+' where ideas.empID=' + req.body.empID+' and ( ';
  var whereClause=''
  for (var i = 0; i < req.body.status.length; i++) {
    whereClause = ' ' + whereClause + ' status = \'' + req.body.status[i] + '\''
    if (i + 1 < req.body.status.length) {
      whereClause = whereClause + ' or '
    } else {
      whereClause = whereClause + ' ) '
    }
  }
  
  var sort=' sort by '
  if (req.body.sort==='recent'){
    sort=' order by postID DESC '
  }else if (req.body.sort==='highRating'){
    sort=' order by rating + comments  DESC '
  }else if (req.body.sort==='latest'){
    sort=' order by ideasHistory.date desc '
  }
  sql=sql+whereClause+sort
  conTest.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": err });
    } else {
      res.json({ "Error": false, "status": 200, "value": rows });
    }
  });
})
app.post('/postOrder/follow', function (req, res) {
  var sql = 'SELECT * FROM ideas where empID=' + req.body.empID;
  // follow table empid and postID
  // select * from ideas where postId in (select postId from follow where empid='+body.empId+')

  conTest.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": err });
    } else {
      res.json({ "Error": false, "status": 200, "value": [] });
    }
  });
})


app.put('/like/addLike', function (req, res) {
  var sql = 'update ideas set rating= rating +1 where postID=' + req.body.postID;

  conTest.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": err });
    } else {
      res.json({ "Error": false, "status": 200, "value": [] });
    }
  });
})
app.put('/like', function (req, res) {
  var sql = 'insert into likes (postID, empID) values (' + req.body.postID + ',' + req.body.empID + ')';

  conTest.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": err });
    } else {
      res.json({ "Error": false, "status": 200, "value": [] });
    }
  });
})
app.put('/dislike', function (req, res) {
  var sql = 'update ideas set rating= rating -1 where postID=' + req.body.postID;

  conTest.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": err });
    } else {
      res.json({ "Error": false, "status": 200, "value": [] });
    }
  });
})
app.post('/findLike', function (req, res) {

  var sql = 'select * from likes where postID=' + req.body.postID + ' and empID=' + req.body.empID;

  conTest.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": err });
    } else {
      res.json({ "Error": false, "status": 200, "value": rows });
    }
  });
})
app.put('/dislike/remLike', function (req, res) {
  var sql = 'delete from likes  where postID=' + req.body.postID; +'and empID=' + req.body.empID

  conTest.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": err });
    } else {
      res.json({ "Error": false, "status": 200, "value": [] });
    }
  });
})


app.post('/admin/UpdateAdminFlag', function (req, res) {
  var flag = 0
  if (req.body.flag === true) {
    flag = 1
  }
  var sql = 'update ideas set adminFlag=' + req.body.flag + '  where postID=' + req.body.postID;


  conTest.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": err });
    } else {
      res.json({ "Error": false, "status": 200, "value": [] });
    }
  });
})

app.post('/admin/ChangeStatus', function (req, res) {
  var sql = 'update ideas set status=\'' + req.body.status + '\'  where postID=' + req.body.postID;


  conTest.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": err });
    } else {
      res.json({ "Error": false, "status": 200, "value": [] });
    }
  });
})

app.post('/comments', function (req, res) {
  var d = new Date();
  var month = d.getMonth() + 1
  var today = d.getFullYear() + '-' + month + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
  var sql = 'insert into comments (postID, empID, `desc`, date,firstName) values (' + req.body.postID + ',' + req.body.empID + ',\'' + req.body.desc + '\',\'' + today + '\', \'' + req.body.firstName + '\')'


  conTest.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": err });
    } else {
      res.json({ "Error": false, "status": 200, "value": rows });
    }
  });
})

app.post('/addComments', function (req, res) {
  var sql = 'update ideas set comments= comments+1 where postID= ' + req.body.postID

  conTest.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": err });
    } else {
      res.json({ "Error": false, "status": 200, "value": rows });
    }
  });
})
app.post('/subtractComments', function (req, res) {
  var sql = 'update ideas set comments= comments-1 where postID= ' + req.body.postID

  conTest.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": err });
    } else {
      res.json({ "Error": false, "status": 200, "value": rows });
    }
  });
})
app.post('/deleteComment', function (req, res) {
  var sql = 'delete from comments where commentID=' + req.body.commentID

  conTest.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": err });
    } else {
      res.json({ "Error": false, "status": 200, "value": rows });
    }
  });
})
app.post('/getComments', function (req, res) {
  var sql = 'select * from comments where postID =' + req.body.postID
  conTest.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": err });
    } else {
      res.json({ "Error": false, "status": 200, "value": rows });
    }
  });
})
app.post('/postOrder/news', function (req, res) {
  var sql = 'select \
  *\
  from ideas\
  where postID in (\
  SELECT  distinct (ideasHistory.postID) FROM ideasHistory  left join ideas on ideasHistory.postID= ideas.postID   order by ideasHistory.date\
  )\
  limit 4'

  conTest.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": err });
    } else {
      res.json({ "Error": false, "status": 200, "value": rows });
    }
  });
})

app.post('/postOrder/meLatest', function (req, res) {
  var sql = 'select \
  *\
  from ideas\
  where postID in (\
  SELECT  distinct (ideasHistory.postID) FROM ideasHistory  left join ideas on ideasHistory.postID= ideas.postID   order by ideasHistory.date\
  )\
  and empId='+ req.body.empID + '\
  limit 4'

  conTest.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": err });
    } else {
      res.json({ "Error": false, "status": 200, "value": rows });
    }
  });
})
app.post('/admin/GetHotPosts', function (req, res) {
  var sql
  if (typeof req.body.status !== 'undefined') {
    sql = 'select * from ideas where status=\'' + req.body.status + '\'   order by rating + comments DESC'
  } else {
    sql = 'select * from ideas   order by rating + comments DESC'
  }

  conTest.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": err });
    } else {
      res.json({ "Error": false, "status": 200, "value": rows });
    }
  });
})
app.post('/admin/GetColdPosts', function (req, res) {
  var sql;
  if (typeof req.body.status !== 'undefined') {
    sql = 'select * from ideas where status=\'' + req.body.status + '\'   order by rating + comments ASC'
  } else {
    sql = 'select * from ideas   order by rating + comments ASC'
  }

  conTest.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": err });
    } else {
      res.json({ "Error": false, "status": 200, "value": rows });
    }
  });
})
app.post('/admin/GetPosts', function (req, res) {
  var sql = ''
  if (req.body.status === 'cost' || req.body.status === 'efficiency' || req.body.status === 'insights' || req.body.status === 'ux') {
    sql = 'select * from ideas order by ' + req.body.status + ' DESC'
  } else {
    sql = 'select * from ideas where status=\'' + req.body.status + '\' order by date DESC'
  }
  conTest.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": err });
    } else {
      res.json({ "Error": false, "status": 200, "value": rows });
    }
  });
})
app.get('/weather', function (req, res) {
  var sql = 'SELECT * FROM Weather order by date desc'
  con.query(sql, function (err, rows) {
    if (err) {
      res.json({ "Error": true, "Message": "Error Execute Sql" });
    } else {
      res.json({ "Error": false, "Message": "Success", "id": rows });
    }
  })
})

app.listen(3000, function () {
  console.log(' REST server started.');
});