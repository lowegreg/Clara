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
app.get('/api/hello',function(req, res) {
    console.log("hello");
    res.send({ express: 'Hello From Express' });
});

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

    var sql= 'SELECT  ENVIRONMENT_CONDITION as `name`, COUNT(*) as `accidents`  FROM `Traffic Collisions` group by ENVIRONMENT_CONDITION'

    con.query(sql, function(err, rows){
       if(err){
           res.json({"Error": true, "Message":"Error Execute Sql"});
       }else{
           res.json({"Error": false,"Message": "Success", "id" : rows});
       }
    });
})

app.listen(5000); // to do on local
// app.listen(3000, function () {
//     console.log(' REST server started.');
//   });