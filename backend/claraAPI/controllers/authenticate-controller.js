var connection = require('./../config');
var bcrypt = require('bcrypt');

module.exports.authenticate=function(req,res){
  var email = req.body.email;
  var password = req.body.password;
  var responce = vaildInput(email,password);
  connection.query('SELECT * FROM users WHERE email = ?',[email], function (error, results, fields){
    if (error){
      console.log('something went wrong')
      responce = {
        status:false,
        message:'there are some error with query'
      }
    } else if (responce === null){
      if(results.length > 0 ){
        if(bcrypt.compareSync(password, results[0].password)){
          responce = {
            status:true,
            message:'successfully authenticated'
          }
        } else {
          responce = {
            status:false,
            message:"Email and password does not match"
            };
        }
        
      } else {
        responce = {
          status:false,    
          message:"Email does not exits"
        };
      }
    } 
    res.json(responce)
  });


  function vaildInput(email,password){
    if (email === ""){
      return {
        status:false,
        message:'No email was provided'
      }
    } else if (password === ""){
      return {
        status:false,
        message:'No password was provided'
      }
    } else {
      return null;
    }
  }
}

