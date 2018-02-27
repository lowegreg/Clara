var express    = require('express');
var cors = require('cors');
var app        = express();
var con        = require('./connected');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  })

app.get('/tableLookUp', function(req, res){
    var id= req.param('id');
    var sql;

    if (id){
       sql= 'SELECT * FROM tableLookUp WHERE tableId= '+id
    }else{
        sql= 'SELECT * FROM tableLookUp '
    } 
    con.query(sql, function(err, rows){
       if(err){
           res.json({"Error": true, "Message":"Error Execute Sql"});
       }else{
           res.json({"Error": false,"Message": "Success", "tableId" : rows});
       }
    });
})


app.get('/trafficCollisions', function(req, res){

    var sql= 'SELECT * FROM `Traffic Collisions` '

    con.query(sql, function(err, rows){
       if(err){
           res.json({"Error": true, "Message":"Error Execute Sql"});
       }else{
           res.json({"Error": false,"Message": "Success", "id" : rows});
       }
    });
})


//app.listen(3000); // to do on local
app.listen(3000, function () {
    console.log(' REST server started.');
  });