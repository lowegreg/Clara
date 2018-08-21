const fetch = require('node-fetch')
var express = require("express");
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');
var conTest = mysql.createConnection({
    host: 'db-l5jpoe4odyyvypgiwexyddrqfu.clhelwr0pylt.ca-central-1.rds.amazonaws.com',
    user: 'Clara',
    password: 'T1meMachine',
    database: 'ClaraTest'
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



var allData
var currentData
var startDate
var max
function checkIfItsTime(updateTime) {

    if (startDate.getHours() === 1 && updateTime === 'daily') {//1am daily && startDate.getMinutes()<45
        return true
    } else if (startDate.getDay() === 1 && startDate.getHours() === 1 && startDate.getMinutes() < 30 && (updateTime === 'weekly' || updateTime === '')) { //sunday 1am weekly
        return true
    } else if (startDate.getMinutes() === 0 && updateTime === 'hourly') {// hourly
        return true
    } else {
        return false
    }
    
}


async function start() {

    //get API.json
    var APIList = require('./openData.json');
    //loop APIList
    for (var i = 0; i < APIList.length; i++) {// APIList.length
       
        //data=Call API
        console.log(APIList[i].Title)
        getMax(APIList[i].Title)
        if (checkIfItsTime(APIList[i].Update)) {//Update // if it time for it (hourly, daily, weelkly)
            console.log('running...')
            await callAPI(APIList[i].API)

            for (var j = 0; j < allData.length; j++) {
                if (APIList[i].API.indexOf('opendata.arcgis.com') !== -1) {
                    currentData = allData[j].properties
                } else if(APIList[i].API.indexOf('services1.arcgis.com') !== -1){
                    currentData = allData[j].attributes
                }else {
                    currentData = allData
                }
                
               //if (currentData.OBJECTID > max) {
                    insertIntoClaraDB(createSQLStatement(APIList[i].Title),j )// insert into clara db (only if it does not exist)
                //}
                currentData = null
            }
        }
        console.log('done')

    }
    APIList = null

    return
}

async function callAPI(route) {

    await fetch(route, { method: 'GET', mode: 'cors' })
        .then((response) => response.json())
        .then(responseJson => {
            if (route.indexOf('opendata.arcgis.com') !== -1||route.indexOf('services1.arcgis.com') !== -1) {
                allData = responseJson.features
            } else {
                allData = responseJson
            }

        })
        .catch((error) => {
            console.error(error);
        });;

    return

}

function createSQLStatement(title) {

    var valuesArray = Object.values(currentData)
    var keyArray = Object.keys(currentData)
    var sql = 'insert into \`' + title + '\`  ( '
    // create string of keys
    for (var i = 0; i < keyArray.length; i++) {

        sql = sql + '\`' + keyArray[i] + '\`'
        if (i + 1 < keyArray.length) {
            sql = sql + ' , '
        }
    }
    sql = sql + ') VALUES ('

    //create string of values
    for (var i = 0; i < valuesArray.length; i++) {
        var val = valuesArray[i]
        var isNum = /^\d+$/.test(val) || /^\d*\.?\d*$/.test(val) || /^-?[0-9]\d*(\.\d+)?$/.test(val);
        try {
            if (val !== null && !isNum) {
                val = val.replace(/\'/g, '\\\'')  // formating ' in strings
            }
        } catch (error) {
        }

        sql = sql + '\'' + val + '\''
        if (i + 1 < valuesArray.length) {
            sql = sql + ' , '
        }
        
    }
    sql = sql + ' )'
    valuesArray = null
    keyArray = null
    return sql
}
function insertIntoClaraDB(sql,num) {
    conTest.query(sql, function (err, rows) {
        if (err) {
            if (err.sqlMessage.indexOf("Duplicate") === -1) {  
               console.log(err.sqlMessage)    
            }
            
        } else {
            // console.log({ "Error": false, "Message": "Success", "tableId": rows });
            console.log('new')
        }
    });
    return

}

function getMax(title) {
    conTest.query('select Max(OBJECTID) as max from \`' + title + '\`', function (err, rows) {
        if (err) {
            console.log(err.sqlMessage, title)
        } else {
            max = rows[0].max
        }
    })

}

var myInt = setInterval(function () {
    startDate = new Date();
    start()
    

}, 86400000);//1 day




