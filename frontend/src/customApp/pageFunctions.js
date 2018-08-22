/* CATPROPSFUNNCION
Purpose:take all props and put them in a category that can be best understood to create graphs out of  then send it off to be createCompare function
How it works: 
    - loops all props categorizing them in to 6 different categories (type(number or text), value(number), finacial(number), data, location , dimensions)
    - date only take two of installation_data , update_date, create_date else it takes at least one 
    - send each array to createCompare function
Parameters: props: the data sets propIds
returns: array that was retruned from createcompare functions
*/
function catPropsFunction(props) {
    var type = [];
    var value = [];
    var finacial = [];
    var date = [];
    var hours = [];
    var location = [];
    var otherDate = [];
    var dimensions = [];
    var rank = [];
    props.forEach((prop, index) => {
        if (prop.dataTypes === 'Text-Type' || prop.dataTypes === 'Number-Type') {
            type.push(prop.propId);
        } else if (prop.dataTypes === 'Number-Value') {
            value.push(prop.propId)
        } else if (prop.dataTypes === 'Number-Financial') {
            finacial.push(prop.propId)
        } else if (prop.dataTypes === 'Date-MM:DD:YYYY' || prop.dataTypes === 'Date-YYYY-MM-DD') {
            if (prop.propId === 'INSTALLATION_DATE' && date.length < 2) {
                date.push(prop.propId)
            }
            if (prop.propId === 'UPDATE_DATE' && date.length < 2) {
                date.push(prop.propId)
            } else if (prop.propId === 'CREATE_DATE' && date.length < 2) {
                date.push(prop.propId)
            } else if (date.length < 1) {
                otherDate.push(prop.propId)
            }
        } else if (prop.dataTypes === 'Date-HH:MM:SS') {
            if (hours.length === 0) {
                hours.push(prop.propId)
            }
        } else if (prop.dataTypes === 'Location-Street') {
            location.push(prop.propId)
        } else if (prop.dataTypes === 'Number-Dimensions') {
            dimensions.push(prop.propId)
        }
        else if (prop.dataTypes === 'Number-Rank') {
            rank.push(prop.propId)
        }
    });

    if (date.length === 0 && otherDate.length > 0) {
        date.push(otherDate[0]);
    }
    return createCompare(type, value, finacial, date, location, dimensions, hours, rank);
}
/* OBJECTMAKER
Purpose: create an object for each potential graph 
How it works: 
    -loop loopVar
        -create an object with x,y,xtype,Ytype, graph, (swap x and y if neccesary) 
    - adds new object to compare array
Parameters: x (Array), loopVar (y array), graph (string, graph type), compare (array of all objects),xType(x data type), yType (y data type), swap (boolean (to swap x and y or not))
Returns: return compare Array
*/
function objectMaker(x, loopVar, graph, compare, xType, yType, swap) {
    var object = {}
    loopVar.forEach((yVar, index) => {
        if (swap) {
            object = {
                x: yVar,
                y: x,
                xType: yType,
                yType: xType,
                graph: graph
            }
        } else {
            object = {
                x: x,
                y: yVar,
                xType: xType,
                yType: yType,
                graph: graph
            }
        }
        compare.push(object)
    })
    return compare
}
/* CREATECOMPARE
Purpose: To create an array of objects each objects contains two data types to compare and a graphs that would work best to display the relationship between data types
How it works: 
    -loop through each datatype array
        - checks any of the predecided approproite datatypes to compare with the current datatype is avaible 
            -send the two data types and the picked graph type to objectMaker to create an object for this comparison
            -adds the object to compare array
Parameters: type, value , fin ,data, loc, dim (all string arrays, contain propIds)
Returns: compare (Array)
 */
function createCompare(type, value, fin, date, loc, dim, hours, rank) {
    var compare = [];
    //type vs fin --> pie
    //type vs date  --> multip bar
    //type vs hours --> multip bar
    //type vs loc  -> heat map or circlebar
    //type vs value -->pie
    //type vs rabk --> circleBar
    if (type.length !== 0) {
        type.forEach((input, index) => {
            if (fin.length !== 0) {
                compare = objectMaker(input, fin, 'pie', compare, 'type', 'fin');
            }
            if (date.length !== 0) {
                compare = objectMaker(input, date, 'multiBar', compare, 'type', 'date', true);//group bar graph 
            }
            if (hours.length !== 0) {
                compare = objectMaker(input, hours, 'multiBar', compare, 'type', 'hours', true);//group bar graph 
            }
            if (loc.length !== 0) {
                compare = objectMaker(input, loc, 'circleBar', compare, 'type', 'loc');
            }
            if (value.length !== 0) {
                compare = objectMaker(input, value, 'pie', compare, 'type', 'value'); //need to find a good graph 
            }
            if (rank.length !== 0) {
                compare = objectMaker(input, rank, 'fillLine', compare, 'type', 'rank');
            }
            if (dim !== 0) {// will add too at a later date
                // compare= objectMaker(input, dim, 'multiBar', compare,'type','dim');
            }
        })
    }

    //fin vs date --> line
    //fin vs loc  -->heat map or bar
    //fin vs hours -> line
    //fin vs value --> pie or bar
    //fin vs rank --> pie

    if (fin.length !== 0) {
        fin.forEach((input, index) => {
            if (date.length !== 0) {
                compare = objectMaker(input, date, 'line', compare, 'fin', 'date', true);
            } if (hours.length !== 0) {
                compare = objectMaker(input, hours, 'line', compare, 'fin', 'hours', true);
            } if (loc.length !== 0) {
                compare = objectMaker(input, loc, 'multiBar', compare, 'fin', 'loc');
            } if (value.length !== 0) {
                compare = objectMaker(input, value, 'pie', compare, 'fin', 'value');
            } if (rank.length !== 0) {
                compare = objectMaker(input, rank, 'pie', compare, 'fin', 'rank');
            }
        })
    }
    //loc vs value --> heat map or bar
    //loc vs date --> heat map or line
    if (loc.length !== 0) {
        loc.forEach((input, index) => {
            if (value.length !== 0) {
                compare = objectMaker(input, value, 'line', compare, 'loc', 'value');
            }

            if (date.length !== 0) {
                // compare=objectMaker(input, date, 'line', compare);// not graph worthy
            }
        })
    }
    //date vs value -> line
    //date vs rank -> line
    if (date.length !== 0) {
        date.forEach((input, index) => {
            if (value.length !== 0) {// compare with a type
                compare = objectMaker(input, value, 'line', compare, 'date', 'value');
            }
            if (rank.length !== 0) {
                compare = objectMaker(input, rank, 'line', compare, 'date', 'rank');
            }
        })
    }
    //hours vs value -> line
    //hours vs rank -> line
    if (hours.length !== 0) {
        hours.forEach((input, index) => {
            if (value.length !== 0) {// compare with a type
                compare = objectMaker(input, value, 'line', compare, 'hours', 'value');
            }
            if (rank.length !== 0) {// compare with a type
                compare = objectMaker(input, rank, 'line', compare, 'hours', 'rank');
            }
        })
    }
    
    return compare;
}
/*GET-GRAPH-OPTIONS
Purpose: to dispatch the creation of graph data organization bases on the type of graph that is being made
How it works: 
     -just a switch statment
Parameters: graphType (string , name of graph), xdata (array ), ydata (array), zdata(array not always used), yname (string , propId of y)
Returns: options array from the function it was dispatched to (array)
*/
function getGraphOptions(graphType, xData, yData, zData, yName) {
   
    switch (graphType) {
        case 'line':
            return lineGraph(xData, yData)
        case 'fillLine':
            return fillLineGraph(xData, yData)
        case 'pie':
            return pieGraph(xData, yData, yName)
        case 'circleBar':
            return circleBarGraph(xData, yData, zData)
        case 'multiBar':
            return multiBarGraph(xData, yData, zData)
        default:
            return lineGraph(xData, yData)
    }
}
/* REMOVENULL
Purpose: to eliminate any fields that are labeled null or unknown to create a better representation of data
How it works: '
    -loops data 
        - checks x and y for labels of None , or unknown
        -if it exist and the length of data types is >2 remove it from the data 
Parameters: data (array, results from api call)
Returns: tempData or data (array)
*/
function removeNull(data) {
    var tempData = []
    if (data.length > 2) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].x !== 'None' && data[i].y !== 'None' && data[i].y !== 'UNKNOWN' && data[i].y !== 'unknown' && data[i].x !== 'UNKNOWN' && data[i].x !== 'unknown') {
                tempData.push(data[i])
            }
        }
    } else {
        return data
    }
    return tempData
}
/* GETDESCRIPTION
Purpose: generate a desciptions based on the graph type being used
How it works: just a swich statment
Parameters: x (string, propId of x data), y (string , propid of y data), graph (string) 
Returns:  descrition(string)
*/
function getDescripton(x, y, graph) {
    var description = ''
    switch (graph) {
        case 'multiBar':
            description = 'Comparing ' + x + ' to top 8 of ' + y + ' (or less then top 8)'
            break;
        case 'pie':
            description = 'Comparing the top 10, sum of ' + y + ' per ' + x + '  type (or less then top 10)'
            break;
        case 'line':
            description = 'Compareing ' + x + ' to ' + y + ' avg for the day'
            break;
        case 'fillLine':
            description = 'Comparing ' + x + ' to ' + y + ' by month'
            break;
        case 'circleBar':
            description = 'Comparing the top 7, number of  ' + y + ' per ' + x + '  type (or less then top 7)'
            break;
        default:
            description = ''
    }
    return description
}
/* FORMATEDATA
Purpose: create a object to pass to the graph component that contains ,data, titles, tags, description,graph  
How it works:
    - calculate how many unique values of x there are
    - if 1
        -change graphtype to multibar (gives a better represntaion of the data)
    -call to get a description
    -call to generate the options        

Paramerter:  graphObjects (object,both x and y data ), xdata (array, just x data), ydata (array, just ydata), zdata (array, just zdata not always used)
Returns:  dataout (array)
 */
function formatData(graphObject, xData, yData, zData) {
    var dataOut = {}
    //if unique y then do a bar
    var xu = xData.filter((v, i, a) => a.indexOf(v) === i).length
    var graphType = graphObject.graph
    if (xu === 1) {
        graphType = 'multiBar'
    }

    dataOut = {
        title: graphObject.x + ' Vs. ' + graphObject.y,
        description: getDescripton(graphObject.x, graphObject.y, graphType),
        graph: graphType,
        widthOfCard: '100%',
        tags: [
            { name: graphObject.x, route: '' },
            { name: graphObject.y, route: '' },
            { name: graphType, route: '' },],
        xName: graphObject.x,
        yName: graphObject.y,
        options: getGraphOptions(graphType, xData, yData, zData, graphObject.y)
    }
    return dataOut
}
/* DATACONFIG
Purpose: to put pie graph data in the right object structure
How it works:
    -loop xdata 
        - create an object that hold value of y and name of x
        -add to data array
Parameters: xdata(array), ydata(array)
Returns: data (array)
 */
function dataConfig(xData, yData) {
    var data = []
    for (var i = 0; i < xData.length; i++) {
        var object = {
            value: yData[i],
            name: xData[i]
        }
        data.push(object)
    }
    return (data)
}
/* PIEGRAPH
Purpose: generates the options object specificaily for a pie graph 
How it works:
    -all standard setting are set 
    -data is sent to dataConfig to formate it correctly
Paramerters: xData (array), ydata (array) yName (title/ PropId for ydata)
Returns: option (object)
 */
function pieGraph(xData, yData, yName) {

    var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{b} :</br>{c} ({d}%)"
        },
        legend: {
            orient: 'horizontal',
            left: 'left',
            data: xData,
            type: 'scroll',
            backgroundColor: '#ffffff'
        },
        series: [
            {
                // name: yName,
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: dataConfig(xData, yData),
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    return option
}
/* ADDEMPTYNESS
Purpose: add zero values to categories that have nothing , to create a correct graph
How it works:
    -loops zData and puts zeros inplace of categoires that have zero value in respect to a unique xData
Paramerters:  yData (array) ,  zData (array) ,xData (array),xUnique (array of xData unique values), yUNum (value of unique yData )
Returns: newZData (array)
 */
function addEmptyNess(yData, zData, xData, xUnique,yUNum){
    var newZData= new Array(xUnique.length * yUNum)
    newZData.fill(0, 0, xUnique.length * yUNum)
    var index=0;
    var newZIndex=0
    while (index<zData.length){// loop zData (values per category (xData))
        var skipAmount=0
        var numTheSame=1
        var allTheSame=true
        var i
        
        for (i=index ; i< xUnique.length+index-1; i++){// checks if all category appear for a unique yData 
            if(yData[i]!==yData[i+1]){
                allTheSame=false
                break;// not all the same
            }else{
                numTheSame++ // tallies the number of categories that appear for a unique yData
            }
        }
        if (allTheSame){// id all catefories appear
            for( i=index; i< xUnique.length+index; i++){
                newZData.splice(newZIndex, 1, zData[i]);
                newZIndex++
            }
            skipAmount=xUnique.length
        }else{// if no all the categoires appear
            for(i=index; i< numTheSame+index; i++){// loops the number of categories  (unique xData) that do appear
                var placement=xUnique.indexOf(xData[i])// gets the location in  unique xData that categorie is in
                newZData.splice(placement+newZIndex, 1, zData[i])// places the value of zData in the correct position to represent the category (unique xData)
            }
            skipAmount=numTheSame
            newZIndex=newZIndex+xUnique.length
        }
      
        index=index+skipAmount// goes to the next place in the zData array and yDataArray to be formatted
    }  
    return(newZData)
}
/* SEPARATEZDATA
Purpose: to separate zData values in unique xData categories for graphing purposes 
How it works:
    -loops zData istarting at i incrementing by x length
    -adds to a temp array and returns it
Paramerters: zdata (array), xlength (integer ),i (integer))
Returns: newZData (array)
 */
function separateZData(zdata, xlength,i){
    var z=[]
    for (var j=i;j< zdata.length;j=j+xlength){
        z.push(zdata[j])
    }
    return z
}

function circleBarConfig(xData, zData, ylength) {
    var xUnique = xData.filter((v, i, a) => a.indexOf(v) === i);
    var xlength = xUnique.length
    var graphData = [];
    for (var i = 0; i < xlength; i++) {
        var z = separateZData(zData, xlength,i)
        var object = {
            type: 'bar',
            data: z,
            coordinateSystem: 'polar',
            name: xUnique[i],
            stack: 'a'
        }
        graphData.push(object)
    }
    return (graphData)
}
function circleBarGraph(xData, yData, zData) {
    var trimData=[]
    var j
    for (j=0;j<yData.length;j++){
        if (typeof yData[j]==='string'){
            trimData.push(yData[j].trim())
        }else{
            trimData.push(yData[j])
        }
        
    }
    yData=trimData;trimData=[]
    for (j=0;j<xData.length;j++){
        if (typeof xData[j]==='string'){
            trimData.push(xData[j].trim())
        }else{
            trimData.push(xData[j])
        }
    }
    xData=trimData
    
    var yUnique = yData.filter((v, i, a) => a.indexOf(v) === i);
    var xUnique = xData.filter((v, i, a) => a.indexOf(v) === i);
    var lengthY = yUnique.length
    zData=addEmptyNess(yData, zData, xData, xUnique,lengthY)
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} "
        },
        angleAxis: {
        },
        radiusAxis: {
            type: 'category',
            show: false,
            data: yUnique,
            z: 10
        },
        polar: {
        },
        series: circleBarConfig(xData, zData, lengthY),
        legend: {
            show: true,
            data: xUnique,
            type: 'scroll',
            backgroundColor: '#ffffff'
        }
    };
    return option
}
function lineGraph(xData, yData) {
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{b} : {c}"
        },
        xAxis: {
            type: 'category',
            data: xData,
            boundaryGap: false
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: yData,
            type: 'line'
        }]
    };
    return option
}

function getColor() {
    var picked
    var one = '#7B9257'
    var two = '#21325F'
    var three = '#2D3446'
    var four = '#324D92'
    var five = '#8FA6DF'
    var six = '#3A3153'
    var seven = '#879CD2'
    var eight = '#314C53'
    var random = Math.floor(Math.random() * 8) + 1
    switch (random) {
        case 1:
            picked = one
            break;
        case 2:
            picked = two
            break;
        case 3:
            picked = three
            break;
        case 4:
            picked = four
            break;
        case 5:
            picked = five
            break;
        case 6:
            picked = six
            break;
        case 7:
            picked = seven
            break;
        case 8:
            picked = eight
            break;
        default:
            picked = eight    
    }
    return picked
    //return '#'+(Math.random()*0xFFFFFF<<0).toString(16);

}

function fillLineGraph(xData, yData) {
    var color = getColor()
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{b} : {c}"
        },
        xAxis: {
            type: 'category',
            data: xData,
            boundaryGap: false
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: yData,
            type: 'line',
            areaStyle: { color: color },
            color: color
        }]
    };
    return option
}
function separateData(ux, oa, uyAll) {
    var temp = false
    var array = []
    //goal -> group all infractions in order of date null if infractions dne for that month null
    //get all objects with.x =ux
    var uxArray = []
    for (var i = 0; i < oa.length; i++) {
        if (oa[i].x === ux) {
            uxArray.push(oa[i])
        }
    }

    temp = null
    for (i = 0; i < uyAll.length; i++) {
        for (var j = 0; j < uxArray.length; j++) {
            if (uyAll[i] === uxArray[j].y) {
                temp = uxArray[j].z
            }
        }
        array.push(temp)
        temp = null
    }

    return array;
}
function createMultiObject(x, y, z) {
    var array = []
    for (var i = 0; i < z.length; i++) {
        var object = {
            x: x[i],
            y: y[i],
            z: z[i]
        }
        array.push(object)
    }

    return array
}
function multiBarConfig(xData, zData, ylength, yData) {
    var xUnique = xData.filter((v, i, a) => a.indexOf(v) === i);
    var yUnique = yData.filter((v, i, a) => a.indexOf(v) === i);
    var xlength = xUnique.length
    var graphData = [];
    var objectArray = createMultiObject(xData, yData, zData)
    for (var i = 0; i < xlength; i++) {
        var z = separateData(xUnique[i], objectArray, yUnique)//zData.slice(i, i+ylength);
        var object = {
            name: xUnique[i],
            type: 'bar',
            stack: 'top',
            data: z,
        }
        graphData.push(object)
    }
    return (graphData)
}
function multiBarGraph(xData, yData, zData) {
    var yUnique = yData.filter((v, i, a) => a.indexOf(v) === i);
    var xUnique = xData.filter((v, i, a) => a.indexOf(v) === i);
    var lengthY = yUnique.length
    var interval = 0
    if (lengthY > 9) interval = 1
    if (lengthY > 19) interval = 2
    if (lengthY > 29) interval = 3
    if (lengthY > 39) interval = 4
    if (lengthY > 100) interval = 10
    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: xUnique.map(String),
            position: 'bottom',
            type: 'scroll',
            backgroundColor: '#ffffff'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                //axisTick : {show: false},
                data: yUnique,
                axisLabel: {
                    interval: interval,
                    rotate: -25
                },
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: multiBarConfig(xData, zData, lengthY, yData)
    };
    return option
}
export {
    catPropsFunction,
    removeNull,
    formatData,
};