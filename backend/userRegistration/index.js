var express=require("express");
var bodyParser=require('body-parser');
var app = express();
var authenticateController=require('./controllers/authenticate-controller');
var registerController=require('./controllers/register-controller');


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

/* route to handle login and registration */
app.post('/api/register',registerController.register);
app.post('/api/authenticate',authenticateController.authenticate);
app.get('/api/hello', (req, res) => {
    res.send({ express: 'Hello From Express' });
});
app.listen(5000);