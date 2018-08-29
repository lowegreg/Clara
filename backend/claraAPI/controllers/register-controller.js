var connection = require('./../config');
var bcrypt = require('bcrypt');

module.exports.register=function(req,res){
  var inputValidation = inputValidation(req.body)
  if (inputValidation.status === false) {
    res.json( inputValidation )
  } else {
    var hash = bcrypt.hashSync(req.body.password, 10);
    var today = new Date();
    var users={
      "name": req.body.name,
      "email": req.body.email,
      "password": hash,
      "created_at": today,
      "updated_at": today
    }
    connection.query('INSERT INTO users SET ?',users, function (error, results, fields) {
      if (error) {
        res.json({
          status:false,
          message:`${error.sqlMessage}`
        })
      } else {
        res.json({
          status:true,
          data:results,
          message:'user registered sucessfully'
        })
      }
    });
  }    

  function inputValidation(body) {
    for (var prop in body) {
      if(body[prop] === ""){
        return {status: false,
          message:`${prop} is empty`
        }
      }
        
    }

    if (req.body.password !==req.body.confirmPassword) {
      return {
        status:false,
        message:'Passwords did not match'
      }
    } else if (req.body.email.search("^\\w+@kitchener.ca$") === -1) {
      return {
        status:false,
        message:'Not a City of Kitchener email'
      }
    }
    return {status: true}
  }
}

