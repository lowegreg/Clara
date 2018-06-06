
var fetch = require("node-fetch");
const kelvinToCelsius = require('kelvin-to-celsius');
var timestamp= require("unix-timestamp")

var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'db-l5jpoe4odyyvypgiwexyddrqfu.clhelwr0pylt.ca-central-1.rds.amazonaws.com',
    user     : 'Clara',
    password : 'T1meMachine',
    database : 'Clara'
  });
function formatWeather(data){
    var date=timestamp.toDate(timestamp.now()-14400)
    var rise= timestamp.toDate(data.sys.sunrise-14400)
    var set=timestamp.toDate(data.sys.sunset-14400)

    
    var saveData={
        date:date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds(), 
        temp: kelvinToCelsius(data.main.temp),
        pressure: data.main.pressure,
        humidity: data.main.humidity,
        tempMin: kelvinToCelsius(data.main.temp_min),
        tempMax: kelvinToCelsius(data.main.temp_max),
        visibility: data.visibility,
        windSpeed: data.wind.speed,
        sunRise: rise.getFullYear()+'-'+rise.getMonth()+'-'+rise.getDate()+' '+rise.getHours()+':'+rise.getMinutes()+':'+rise.getSeconds(), 
        sunSet: set.getFullYear()+'-'+set.getMonth()+'-'+set.getDate()+' '+set.getHours()+':'+set.getMinutes()+':'+set.getSeconds(), 
        clouds: data.clouds.all,
        weatherCondition: data.weather[0].main,
        weatherDescrip: data.weather[0].description,
        icon:  parseInt(data.weather[0].icon.substring(1,3))

    }

    var sql='insert into Weather  (date, temp, pressure, humidity, tempMin, tempMax, visibility, windSpeed, sunRise, sunSet, clouds, weatherCondition, weatherDescrip, icon) values (\''+saveData.date+'\','+saveData.temp+','+saveData.pressure+','+saveData.humidity+','+saveData.tempMin+','+saveData.tempMax+','+saveData.visibility+','+saveData.windSpeed+',\''+saveData.sunRise+'\',\''+saveData.sunSet+'\','+saveData.clouds+',\''+saveData.weatherCondition+'\',\''+saveData.weatherDescrip+'\',\''+saveData.icon+'\')'
    connection.query(sql, function(err, rows){ });
    console.log(sql)
 }


var myInt = setInterval(function () {
    fetch('http://api.openweathermap.org/data/2.5/weather?q=Kitchener,Canada&appid=56f1c20d2794d95ab99078c6de99ed2c', {method: 'GET', mode: 'cors'})
    .then((response) =>  response.json())
    .then(responseJson=> {
      formatWeather(responseJson)
    })
    .catch((error) => { 
      console.error(error);
    });
}, 7200000);//7200000 2 hours


