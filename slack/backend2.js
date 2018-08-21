var employees
var paramters=[]
$(document).ready(function () {
    
   
    paramters.emp= {id:getQueryVariable('id'), name:getQueryVariable('firstName')+' '+getQueryVariable('lastName')}
    paramters.week= getQueryVariable('week')
    paramters.daysMissed= getQueryVariable('daysMissed').split(",")
   preview()
 
   var pdf = new jsPDF('p', 'pt', 'letter');
   pdf.cellInitialize();
   pdf.setFontSize(8);
   $.each( $('#weekoutput tr'), function (i, row){
    $.each( $(row).find("td, th"), function(j, cell){
         var txt = $(cell).text().trim()|| " ";
         var width =80; //make 4th column smaller
         pdf.cell(10, 15, width, 15, txt, i);
    });
});
   pdf.cellInitialize();
   pdf.setFontSize(8);
   $.each( $('#empInfo tr'), function (i, row){
    $.each( $(row).find("td, th"), function(j, cell){
         var txt = $(cell).text().trim() || " ";
         var width = (j==5||j==7)?115:60; //make 4th column smaller
         pdf.cell(10, 50, width, 15, txt, i);
    });
});


pdf.cellInitialize();
pdf.setFontSize(8);
   $.each( $('#fullTable tr'), function (i, row){
       $.each( $(row).find("td, th"), function(j, cell){
            var txt = $(cell).text().trim().split(" ").join("\n") || " ";
            var width = (j==0||j==8 || j==10) ? 30 : 50; //make 4th column smaller
            var height = (i>0)? 15 : 30;
            pdf.cell(10, 90, width, height, txt, i);
       });
   });
   pdf.save(getQueryVariable('firstName')+' '+getQueryVariable('lastName') +' '+ getWeekDate(paramters.week)[5] +' (Week Ending) - Timesheet' );


});

function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

function formatDate(date) {
    var monthNames = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct",
        "Nov", "Dec"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + '-' + monthNames[monthIndex] + '-' + year;
}

function getTheDay(day, weekStep) {
    var t = new Date().getDate() + (day - new Date().getDay() - weekStep);
    var days = new Date();
    days.setDate(t);

    return days
}



function getWeekDate(week) {
    var date = []
    switch (week) {
        case 'this':
            for (var i = 0; i < 7; i++) {
                date.push(formatDate(getTheDay(i, 0)))
            }
            break;
        case 'next':
            for (var i = 0; i < 7; i++) {
                date.push(formatDate(getTheDay(i, -7)))
            }
            break;
        case 'last':
            for (var i = 0; i < 7; i++) {
                date.push(formatDate(getTheDay(i, 7)))
            }
            break;
    }
    return date
}

function whatsUnChecked(value) {
    var weekDays = ['Monday', 'Tueday', 'Wednesday', 'Thurday', 'Friday']
    var hours = []
    for (var i = 0; i < weekDays.length; i++) {
        if (paramters.daysMissed.indexOf(weekDays[i])===-1) {
            hours.push(value)
        } else {
            hours.push(0)
        }
    }
    return hours
}

function employeeinfo(report) {

    var body = document.body,

        tbl = document.createElement('table'); // first table
    tbl.setAttribute("id", "weekoutput");
    tbl.style.width = '300px';
    tbl.style.border = '1px solid black';
    var tr = tbl.insertRow();
    var td = tr.insertCell();
    td.appendChild(document.createTextNode('WEEK END DATE:'));
    td = tr.insertCell();
    td.appendChild(document.createTextNode(report.weekEndDate));
    body.appendChild(tbl);

    tbl = document.createElement('table'); // second table
    tbl.setAttribute("id", "empInfo");
    tbl.style.width = '1000px';
    tbl.style.border = '2px solid black';
    tr = tbl.insertRow();
    td = tr.insertCell();
    td.appendChild(document.createTextNode('EMPLID:'));
    td = tr.insertCell();
    td.appendChild(document.createTextNode(report.emplid));
    td.style.border = '1px solid black';

    td = tr.insertCell();
    td.appendChild(document.createTextNode('GROUP ID:'));
    td = tr.insertCell();
    td.appendChild(document.createTextNode('      '));
    td.style.border = '1px solid black';
    td.style.width = '40px'

    td = tr.insertCell();
    td.appendChild(document.createTextNode('NAME:'));
    td = tr.insertCell();
    td.appendChild(document.createTextNode(report.name));
    td.style.border = '1px solid black';
    td = tr.insertCell();
    td.appendChild(document.createTextNode('AUTHORIZED:'));
    td = tr.insertCell();
    td.appendChild(document.createTextNode(report.aurthorized));
    td.style.border = '1px solid black';

    body.appendChild(tbl);

}
function tableCreate(report) {

    employeeinfo(report)
    var headers = ['Rec#', 'Day-1', 'Day-2', 'Day-3', 'Day-4', 'Day-5', 'Day-6', 'Day-7', 'TRC', 'JobCd', 'Step', 'HourlyRt', 'Account']
    var weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']
    var body = document.body,
        tbl = document.createElement('table'); // main table
    tbl.setAttribute("id", "fullTable");

    tbl.style.width = '1000px';
    tbl.style.border = '2px solid black';

    for (var i = 0; i < 21; i++) {
        var tr = tbl.insertRow();

        for (var j = 0; j < 13; j++) {
            if (i === 0 && j >= 1 && j <= 7) {
                var td = tr.insertCell();
                td.appendChild(document.createTextNode(headers[j]));
                td.appendChild(document.createTextNode(" "));
                td.appendChild(document.createElement("br"));
                td.appendChild(document.createTextNode(weekDays[j - 1]));
                td.appendChild(document.createTextNode(" "));
                td.appendChild(document.createElement("br"));
                td.appendChild(document.createTextNode(report.days[j - 1]));
                if (j === 1 || j === 7) td.style.backgroundColor = '#cecece'
            }
          
            else if (i === 0) {
                var td = tr.insertCell();
                td.appendChild(document.createTextNode(headers[j]));
                if (j === 1 || j === 7) td.style.backgroundColor = '#cecece'
            } else if (i < 0 && (j <= 1 || j >= 7)) {
                var td = tr.insertCell();
                td.appendChild(document.createTextNode(''));
                 td.style.boarder = '1px solid black';

            } else if (j === 0 && i > 0) {
                var td = tr.insertCell();
                td.appendChild(document.createTextNode(i ));
                td.style.border = '1px solid black';
            } else if (j >= 2 && j <= 6 && i === 1) {
                var td = tr.insertCell();
                td.appendChild(document.createTextNode(report.hours[j - 2]));
                td.style.border = '1px solid black';
            } else if (i === 1 && j === 12) {
                var td = tr.insertCell();
                td.appendChild(document.createTextNode(59501401));
                td.style.border = '1px solid black';
            } else if (j === 1 || j === 7) {
                var td = tr.insertCell();
                td.appendChild(document.createTextNode(' '));
                td.style.backgroundColor = '#cecece'
                td.style.border = '1px solid black';
            } else {
                var td = tr.insertCell();
                td.appendChild(document.createTextNode(' '));
                td.style.border = '1px solid black';


            }


        }
    }
    body.appendChild(tbl);
   
}
var previewed = false

var name=''
function preview() {
    var x = document.getElementById("fullTable");
    x.remove(x.selectedIndex);
    x = document.getElementById("weekoutput");
    x.remove(x.selectedIndex);
    x = document.getElementById("empInfo");
    x.remove(x.selectedIndex);
    previewed = true
    var dHours = document.getElementById("hours").value;
    var week =  paramters.week
    var emp = paramters.emp
  
        name= emp.name
        var report = {
            weekEndDate: getWeekDate(week)[5],
            emplid: emp.id,// later added
            name: emp.name,// later added
            aurthorized: document.getElementById("manager").value,
            days: getWeekDate(week),
            hours: whatsUnChecked(document.getElementById("hours").value)
        }
        tableCreate(report)
        pdf()
    

}

function pdf() {
    if (previewed) {
        var week = paramters.week
        document.title = name +' '+ getWeekDate(week)[5] +' (Week Ending) - Timesheet' 
        var x = document.getElementById("info00");
        x.remove(x.selectedIndex);
    }
}