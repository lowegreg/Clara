var employees

$(document).ready(function () {
    
    $.ajax({
        url: 'workers.json',
        success: function (data) {
            employees = data
            var sel = document.getElementById('list');
            var fragment = document.createDocumentFragment();
            data.employees.forEach(function (emp, index) {
                var opt = document.createElement('option');
                opt.innerHTML = emp.name;
                opt.id = emp.empId;
                opt.value = emp.name;
                fragment.appendChild(opt);
            });
            sel.appendChild(fragment);
        }
    });
 

});



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
        case 'now':
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
    var weekDays = ['mon', 'tue', 'wed', 'thur', 'fri']
    var hours = []
    for (var i = 0; i < 5; i++) {
        if (document.getElementById(weekDays[i]).checked) {
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
    var headers = ['Rec#', 'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'TRC', 'JobCd', 'Step', 'HourlyRt', 'Account']
    var weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']
    var body = document.body,
        tbl = document.createElement('table'); // main table
    tbl.setAttribute("id", "fullTable");

    tbl.style.width = '1000px';
    tbl.style.border = '2px solid black';

    for (var i = 0; i < 23; i++) {
        var tr = tbl.insertRow();

        for (var j = 0; j < 13; j++) {
            if (i === 0 && j >= 1 && j <= 7) {
                var td = tr.insertCell();
                td.appendChild(document.createTextNode(headers[j]));
                if (j === 1 || j === 7) td.style.backgroundColor = '#cecece'
            } else if (i === 1 && j >= 1 && j <= 7) {
                var td = tr.insertCell();
                td.appendChild(document.createTextNode(weekDays[j - 1]));
                if (j === 1 || j === 7) td.style.backgroundColor = '#cecece'
            } else if (i === 2 && j >= 1 && j <= 7) {
                var td = tr.insertCell();
                td.appendChild(document.createTextNode(report.days[j - 1]));
                if (j === 1 || j === 7) td.style.backgroundColor = '#cecece'
            } else if (i === 0) {
                var td = tr.insertCell();
                td.appendChild(document.createTextNode(headers[j]));
                if (j === 1 || j === 7) td.style.backgroundColor = '#cecece'
            } else if (i < 3 && (j <= 1 || j >= 7)) {
                var td = tr.insertCell();
                td.appendChild(document.createTextNode(''));
                 td.style.boarder = '1px solid black';

            } else if (j === 0 && i > 2) {
                var td = tr.insertCell();
                td.appendChild(document.createTextNode(i - 2));
                td.style.border = '1px solid black';
            } else if (j >= 2 && j <= 6 && i === 3) {
                var td = tr.insertCell();
                td.appendChild(document.createTextNode(report.hours[j - 2]));
                td.style.border = '1px solid black';
            } else if (i === 3 && j === 12) {
                var td = tr.insertCell();
                td.appendChild(document.createTextNode(5951401));
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
    var w = document.getElementById("week");
    var week = w.options[w.selectedIndex].value;
    var e = document.getElementById("list");
    var emp = e.options[e.selectedIndex];

    if (emp.value === 'all') {
        for (var i = 0; i < employees.employees.length - 1; i++) {
            name= employees.employees[i].name
            var report = {
                weekEndDate: getWeekDate(week)[5],
                emplid: employees.employees[i].empId,// later added
                name: employees.employees[i].name,// later added
                aurthorized: document.getElementById("manager").value,
                days: getWeekDate(week),
                hours: whatsUnChecked(document.getElementById("hours").value)
            }
            tableCreate(report)
            if (i!==employees.employees.length-2){
                var body = document.body;
                var p = document.createElement('p');
                p.style='page-break-before: always' 
                body.appendChild(p);
            }
        }
    } else {
        name= emp.value
        var report = {
            weekEndDate: getWeekDate(week)[5],
            emplid: emp.id,// later added
            name: emp.value,// later added
            aurthorized: document.getElementById("manager").value,
            days: getWeekDate(week),
            hours: whatsUnChecked(document.getElementById("hours").value)
        }
        tableCreate(report)
    }

}

function pdf() {
    if (previewed) {
        var w = document.getElementById("week");
        var week = w.options[w.selectedIndex].value;
        document.title = name +' '+ getWeekDate(week)[5] +' (Week Ending) - Timesheet' 
        var x = document.getElementById("info00");
        x.remove(x.selectedIndex);
    }
}