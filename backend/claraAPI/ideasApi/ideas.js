var express=require("express");
var cors = require('cors');
var bodyParser=require('body-parser');
var app = express();

var mysql = require('mysql');

var con = mysql.createConnection({
    host     : 'db-l5jpoe4odyyvypgiwexyddrqfu.clhelwr0pylt.ca-central-1.rds.amazonaws.com',
    user     : 'Clara',
    password : 'T1meMachine',
    database : 'ClaraTest'
  });
const fetch = require('node-fetch')

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });





app.post('/findPost', function(req, res){
    // var id = req.param('id');
    
    var sql;
    if (req.body.postID===-1|| typeof req.body.postID === 'undefined'){
        sql = 'SELECT * FROM ideas '
    }else{
        sql = 'SELECT * FROM ideas  where postID='+req.body.postID
    }
  
    con.query(sql, function(err, rows){
      if (err){
        res.json({"Error": true, "Message":err});
      } else {
        res.json({"Error": true, "value":rows, "status": 200});
      }
    });
  })

  app.post('/postOrder/recent', function(req, res){
    // var id = req.param('id');
    var sql;
    var whereClause=' '
    if( req.body.status.length>0||req.body.deps.length>0){
        whereClause='where ('
    }
    for (var i =0; i<req.body.status.length; i++){
        whereClause=' '+ whereClause+' status = \''+ req.body.status[i]+'\''
        if (i+1<req.body.status.length ){
            whereClause= whereClause+' or '
        }else{
            whereClause= whereClause+' ) '
        }
    }
    if (req.body.status.length>0 && req.body.deps.length>0){
        whereClause= whereClause+' and ( '
    }
    for (var i =0; i<req.body.deps.length; i++){
        whereClause=' '+ whereClause+' targetDep = \''+ req.body.deps[i]+'\''
        if (i+1<req.body.deps.length ){
            whereClause= whereClause+' or '
        }else{
            whereClause= whereClause+' ) '
        }
    }
    sql = 'SELECT * FROM ideas  '+whereClause+' order by postID DESC'
    con.query(sql, function(err, rows){
    if (err){
      res.json({"Error": true, "Message":"Error Execute Sql"});
    } else {
      res.json({"Error": true, "value":rows, "status": 200});
    }
  });
})  
app.post('/postOrder/latest', function(req, res){
    // var id = req.param('id');
    var sql;
    var whereClause=' '
    if( req.body.status.length>0){
        whereClause='where '
    }
    for (var i =0; i<req.body.status.length; i++){
        whereClause=' '+ whereClause+' status = \''+ req.body.status[i]+'\''
        if (i+1<req.body.status.length ){
            whereClause= whereClause+' or '
        }
    }
    //sql = 'SELECT * FROM ideas  '+whereClause+'order by date DESC'
    sql='SELECT distinct ideas.postID, ideas.title, ideas.numRatings, ideas.empID, ideas.targetDep, ideas.targetDep, ideas.descrip, \
    ideas.rating, ideas.numClicks,  ideas.date , ideas.status, ideas.firstName, ideas.lastName, ideas.adminFlag, ideas.comments \
    FROM ideas \
    left join ideasHistory on  ideas.postID= ideasHistory.postID\
     '+whereClause+' \
    order by ideasHistory.date desc;'
    
    con.query(sql, function(err, rows){
      if (err){
        res.json({"Error": true, "Message":"Error Execute Sql"});
      } else {
        res.json({"Error": true, "value":rows, "status": 200});
      }
    });
  })

  app.post('/postOrder/highRating', function(req, res){
    // var id = req.param('id');
    var sql;
    var whereClause=' '
    if( req.body.status.length>0){
        whereClause='where '
    }
    for (var i =0; i<req.body.status.length; i++){
        whereClause=' '+ whereClause+' status = \''+ req.body.status[i]+'\''
        if (i+1<req.body.status.length ){
            whereClause= whereClause+' or '
        }
    }
   
    sql = 'SELECT * FROM ideas  '+whereClause+' order by rating DESC'

    con.query(sql, function(err, rows){
      if (err){
        res.json({"Error": true, "Message":"Error Execute Sql"});
      } else {
        res.json({"Error": true, "value":rows, "status": 200});
      }
    });
  })

 
  app.post('/posts/UpdatePostHistory', function(req, res){
    var d = new Date();
    var month= d.getMonth()+1
    var today = d.getFullYear()+'-'+month+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    var message = req.body.message || null
    var  sql
    if( message===null){
        sql = 'insert ideasHistory (postID, empID, type, previous, new, date, message) values ('+req.body.postID+','+req.body.empID+',\''+req.body.type+'\',\''+req.body.previous+'\',\''+req.body.new+'\',\''+today+'\' , '+message+') '    
    }else{
        sql = 'insert ideasHistory (postID, empID, type, previous, new, date, message) values ('+req.body.postID+','+req.body.empID+',\''+req.body.type+'\',\''+req.body.previous+'\',\''+req.body.new+'\',\''+today+'\' , \''+message+'\') '   
    }

    con.query(sql, function(err, rows){
      if (err){
        res.json({"Error": true, "Message":"Error Execute Sql"});
      } else {
        res.json({"Error": true, "value":rows, "status": 200});
      }
    });
  })
  app.post('/contributors', function(req, res){
  
    sql = 'select count(*), empID from comments where postId= '+req.body.postID+' group by empID'   
    

    con.query(sql, function(err, rows){
      if (err){
        res.json({"Error": true, "Message":err});
      } else {
        res.json({"Error": true, "value":rows, "status": 200});
      }
    });
  })
  app.post('/posts/GetPostStatusHistory', function(req, res){
    var  sql = 'select * from ideasHistory where postID= '+req.body.postID+' order by date DESC'

    con.query(sql, function(err, rows){
      if (err){
        res.json({"Error": true, "Message":err});
      } else {
        res.json({"Error": true, "value":rows, "status": 200});
      }
    });
  })


app.post('/posts', function(req, res){
var d = new Date();
var month= d.getMonth()+1
var today = d.getFullYear()+'-'+month+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();

var sql= ' INSERT INTO ideas (title, numRatings, empID, targetDep, descrip, rating, numClicks,date,status, firstName, LastName, comments,adminFlag, cost, efficiency, insights, ux) value (\'' + req.body.title+'\','+ req.body.rating+','+ req.body.empID+',\''+req.body.targetDep+'\',\''+req.body.descrip+'\','+req.body.rating+','+req.body.numClicks+',\''+today+'\',\''+req.body.status+'\', \'Bill\',\'Smith\','+req.body.comments+', '+req.body.adminFlag+', '+req.body.cost+', '+req.body.efficiency+', '+ req.body.insights+', '+req.body.ux+' )';

  con.query(sql, function(err, rows){
    if (err){
      res.json({"Error": true, "Message":err});
    } else {
      res.json({"Error": false, "status": 200, "value" : rows});
    }
    
  });
})

app.post('/posts/deletePostByStatus', function(req, res){
    var sql= 'update ideas set  status= \'deleted\' where postID='+req.body.postID;
    
      con.query(sql, function(err, rows){
        if (err){
          res.json({"Error": true, "Message":err});
        } else {
          res.json({"Error": false, "status": 200, "value" : rows});
        }
        
      });
    })


app.post('/postOrder/me', function(req, res){
    var sql= 'SELECT * FROM ideas where empID='+req.body.empID; 
    

      con.query(sql, function(err, rows){
        if (err){
          res.json({"Error": true, "Message":err});
        } else {
          res.json({"Error": false, "status": 200, "value" : rows});
        }
    });
})
app.post('/postOrder/follow', function(req, res){
    var sql= 'SELECT * FROM ideas where empID='+req.body.empID; 
    // follow table empid and postID
    // select * from ideas where postId in (select postId from follow where empid='+body.empId+')

        con.query(sql, function(err, rows){
        if (err){
            res.json({"Error": true, "Message":err});
        } else {
            res.json({"Error": false, "status": 200, "value" : []});
        }
        });
})


app.put('/like/addLike', function(req, res){
    var sql= 'update ideas set rating= rating +1 where postID='+req.body.postID; 

        con.query(sql, function(err, rows){
        if (err){
            res.json({"Error": true, "Message":err});
        } else {
            res.json({"Error": false, "status": 200, "value" : []});
        }
        });
})
app.put('/like', function(req, res){
    var sql= 'insert into likes (postID, empID) values ('+req.body.postID+','+req.body.empID+')'; 

        con.query(sql, function(err, rows){
        if (err){
            res.json({"Error": true, "Message":err});
        } else {
            res.json({"Error": false, "status": 200, "value" : []});
        }
        });
})
app.put('/dislike', function(req, res){
    var sql= 'update ideas set rating= rating -1 where postID='+req.body.postID; 

        con.query(sql, function(err, rows){
        if (err){
            res.json({"Error": true, "Message":err});
        } else {
            res.json({"Error": false, "status": 200, "value" : []});
        }
        });
})
app.post('/findLike', function(req, res){
    
    var sql= 'select * from likes where postID='+req.body.postID+' and empID='+req.body.empID; 

        con.query(sql, function(err, rows){
        if (err){
            res.json({"Error": true, "Message":err});
        } else {
            res.json({"Error": false, "status": 200, "value" : rows});
        }
        });
})
app.put('/dislike/remLike', function(req, res){
    var sql= 'delete from likes  where postID='+req.body.postID;+'and empID='+req.body.empID

        con.query(sql, function(err, rows){
        if (err){
            res.json({"Error": true, "Message":err});
        } else {
            res.json({"Error": false, "status": 200, "value" : []});
        }
        });
})


app.post('/admin/UpdateAdminFlag', function(req, res){
    var flag=0
    if (req.body.flag===true){
        flag=1
    }
    var sql= 'update ideas set adminFlag='+req.body.flag+'  where postID='+req.body.postID; 

   
    con.query(sql, function(err, rows){
    if (err){
        res.json({"Error": true, "Message":err});
    } else {
        res.json({"Error": false, "status": 200, "value" : []});
    }
    });
})

app.post('/admin/ChangeStatus', function(req, res){
    var sql= 'update ideas set status=\''+req.body.status+'\'  where postID='+req.body.postID; 


        con.query(sql, function(err, rows){
        if (err){
            res.json({"Error": true, "Message":err});
        } else {
            res.json({"Error": false, "status": 200, "value" : []});
        }
        });
})

app.post('/comments', function(req, res){
    var d = new Date();
    var month= d.getMonth()+1
    var today = d.getFullYear()+'-'+month+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    var sql= 'insert into comments (postID, empID, `desc`, date,firstName) values ('+req.body.postID+','+req.body.empID+',\''+req.body.desc+'\',\''+today+'\', \''+req.body.firstName+'\')' 


    con.query(sql, function(err, rows){
    if (err){
        res.json({"Error": true, "Message":err});
    } else {
        res.json({"Error": false, "status": 200, "value" : rows});
    }
    });
})

app.post('/addComments', function(req, res){
    var sql= 'update ideas set comments= comments+1 where postID= '+req.body.postID 

        con.query(sql, function(err, rows){
        if (err){
            res.json({"Error": true, "Message":err});
        } else {
            res.json({"Error": false, "status": 200, "value" : rows});
        }
        });
})
app.post('/subtractComments', function(req, res){
    var sql= 'update ideas set comments= comments-1 where postID= '+req.body.postID 

        con.query(sql, function(err, rows){
            console.log(err)
        if (err){
            res.json({"Error": true, "Message":err});
        } else {
            res.json({"Error": false, "status": 200, "value" : rows});
        }
        });
})
app.post('/deleteComment', function(req, res){
    var sql= 'delete from comments where commentID='+req.body.commentID

        con.query(sql, function(err, rows){
        if (err){
            res.json({"Error": true, "Message":err});
        } else {
            res.json({"Error": false, "status": 200, "value" : rows});
        }
        });
})
app.post('/getComments', function(req, res){
    var sql= 'select * from comments where postID ='+req.body.postID 
    con.query(sql, function(err, rows){
        if (err){
            res.json({"Error": true, "Message":err});
        } else {
            res.json({"Error": false, "status": 200, "value" : rows});
        }
    });
})
app.post('/postOrder/news', function(req, res){
    var sql= 'select \
    *\
    from ideas\
    where postID in (\
    SELECT  distinct (ideasHistory.postID) FROM ideasHistory  left join ideas on ideasHistory.postID= ideas.postID   order by ideasHistory.date\
    )\
    limit 4'
   
    con.query(sql, function(err, rows){
    if (err){
        res.json({"Error": true, "Message":err});
    } else {
        res.json({"Error": false, "status": 200, "value" : rows});
    }
    });
})

app.post('/postOrder/meLatest', function(req, res){
    var sql=  'select \
    *\
    from ideas\
    where postID in (\
    SELECT  distinct (ideasHistory.postID) FROM ideasHistory  left join ideas on ideasHistory.postID= ideas.postID   order by ideasHistory.date\
    )\
    and empId='+req.body.empID+'\
    limit 4'
   
    con.query(sql, function(err, rows){
    if (err){
        res.json({"Error": true, "Message":err});
    } else {
        res.json({"Error": false, "status": 200, "value" : rows});
    }
    });
})
app.post('/admin/GetHotPosts', function(req, res){
    var sql
    if (typeof  req.body.status!=='undefined'){
        sql= 'select * from ideas where status=\''+req.body.status+'\'   order by rating + comments DESC'
    }else{
        sql= 'select * from ideas   order by rating + comments DESC'
    }

    con.query(sql, function(err, rows){
    if (err){
        res.json({"Error": true, "Message":err});
    } else {
        res.json({"Error": false, "status": 200, "value" : rows});
    }
    });
})
app.post('/admin/GetColdPosts', function(req, res){
    var sql;
    if (typeof  req.body.status!=='undefined'){
        sql= 'select * from ideas where status=\''+req.body.status+'\'   order by rating + comments ASC'
    }else{
        sql= 'select * from ideas   order by rating + comments ASC'
    }
   
    con.query(sql, function(err, rows){
    if (err){
        res.json({"Error": true, "Message":err});
    } else {
        res.json({"Error": false, "status": 200, "value" : rows});
    }
    });
})
app.post('/admin/GetPosts', function(req, res){
    var sql= 'select * from ideas where status=\''+req.body.status+'\' order by date DESC' 
   
    con.query(sql, function(err, rows){
    if (err){
        res.json({"Error": true, "Message":err});
    } else {
        res.json({"Error": false, "status": 200, "value" : rows});
    }
    });
})
app.listen(3001, function () {
  console.log(' REST server started.');
});