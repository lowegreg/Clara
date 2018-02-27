var connection = require('./../config');
var bcrypt = require('bcrypt');

module.exports.register=function(req,res){
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
            message:'there are some error with query'
        })
      }else{
          res.json({
            status:true,
            data:results,
            message:'user registered sucessfully'
        })
      }
    });
}