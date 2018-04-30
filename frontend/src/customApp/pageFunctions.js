/* CATPROPSFUNNCION
Purpose:take all props and put them in a category that can be best understood to create graphs out of  then send it off to be createCompare function
How it works: 
    - loops all props categorizing them in to 6 different categories (type(number or text), value(number), finacial(number), data, location , dimensions)
    - date only take two of installation_data , update_date, create_date else it takes at least one 
    - send each array to createCompare function
Parameters: props: the data sets propIds
returns: array that was retruned from createcompare functions
*/
function catPropsFunction(props){ 
    var type = [];
    var value = [];
    var finacial = [];
    var date = [];
    var location = [];
    var otherDate = [];
    var dimensions = []
    props.forEach((prop, index) => {
      if(prop.dataTypes==='Text-Type' || prop.dataTypes==='Number-Type'){
          type.push(prop.propId);
      }else if(prop.dataTypes==='Number-Value'){
          value.push(prop.propId)
      }else if(prop.dataTypes==='Number-Financial'){
          finacial.push(prop.propId)
      }else if(prop.dataTypes==='Date-MM:DD:YYYY'||prop.dataTypes==='Date-YYYY-MM-DD'){
          if (prop.propId==='INSTALLATION_DATE' && date.length<2){
            date.push(prop.propId)
          }
          if (prop.propId==='UPDATE_DATE'&& date.length<2){
            date.push(prop.propId)
          }else if (prop.propId==='CREATE_DATE'&& date.length<2){
            date.push(prop.propId)
          }else if(date.length<1){
            otherDate.push(prop.propId)
          }
          
      }else if(prop.dataTypes==='Location-Street'){
            location.push(prop.propId)
       }else if(prop.dataTypes==='Number-Dimensions'){
            dimensions.push(prop.propId)
      }
    });

    if (date.length===0 && otherDate.length>0 ){
        date.push(otherDate[0]);
    }
    return createCompare(type,value,finacial, date,location, dimensions);
}
/* OBJECTMAKER
Purpose: create an object each potential graph 
How it works: 
    -loop loopVar create and object with x,y,xtype,Ytype, graph, (swap x and y if neccesary) 
    - adds new object to compare array
Parameters: x (Array), loopVar (y array), graph (string, graph type), compare (array of all objects),xType(x data type), yType (y data type), swap (boolean (to swap x and y or not))
Returns: return compare Array
*/
function objectMaker(x,loopVar,graph, compare, xType,yType,swap){
    var object={}
    loopVar.forEach((yVar, index)=>{  
        if (swap){
            object={
                x:yVar,
                y:x,
                xType:yType,
                yType:xType,
                graph:graph
            }
        }else{
            object={
                x:x,
                y:yVar,
                xType:xType,
                yType:yType,
                graph:graph
            }
        }
        compare.push(object)
    })
    return compare
}
/* CREATECOMPARE
Purpose: To create an array of objects that each objects contains two data types to compare and a graphs that would work best to display the relationship between data types
How it works: 
    -loop through each datatype array
        - checks any of the predecided approproite datatypes to compare with the current datatype is avaible 
            -send the two data types and the picked graph type to objectMaker to create an object for this comparison
            -adds the object ot compare array
Parameters: type, value , fin ,data, loc, dim (all string arrays, contain propIds)
Returns: compare (Array)
 */
function createCompare(type, value, fin, date, loc,dim){
    var compare = [];
    //type vs fin --> pie
    //type vs date  --> multip bar
    //type vs loc  -> heat map or circlebar
    //type vs value -->pie
    if (type.length!==0){
        type.forEach((input, index)=>{
            if (fin.length!==0){
                compare=objectMaker(input, fin, 'pie', compare,'type','fin');
            }
            if(date.length!==0){
                compare=objectMaker(input,date,'multiBar', compare,'type','date',true);//group bar graph 
            }
            if(loc.length!==0){
                compare=objectMaker(input, loc, 'circleBar', compare,'type','loc');
            }
            if(value!==0){
              compare=objectMaker(input, value, 'pie', compare,'type','value'); //need to find a good graph 
            }
            if(dim!==0){// will add too at a later date
               // compare= objectMaker(input, dim, 'multiBar', compare,'type','dim');
            }
        })
    }
    
    //fin vs date --> line
    //fin vs loc  -->heat map or bar
    //fin vs value --> pie or bar
    if(fin.length!==0){ 
        fin.forEach((input, index)=>{
            if(date.length!==0){
                compare=objectMaker(input, date, 'line', compare,'fin','date',true);
            }if (loc.length!==0){
                compare=objectMaker(input, loc, 'multiBar', compare,'fin','loc');
            }if(value.length!==0){
                compare=objectMaker(input, value, 'pie', compare,'fin','value');
            }
        }) 
    }
    //loc vs value --> heat map or bar
    //loc vs date --> heat map or line
    if (loc.length!==0){
        loc.forEach((input,index)=>{
            if(value.length!==0){
                compare=objectMaker(input, value, 'heatMap', compare,'loc','value');
            }
            if(date.length!==0){
               // compare=objectMaker(input, date, 'line', compare);// not graph worthy
            }
        })
    } 
    //date vs value -> line
    if (date.length!==0){
        date.forEach((input,index)=>{
            if(value!==0){// compare with a type
                compare=objectMaker(input, value, 'line', compare,'date','value');
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
Returns: options array from the function it was dispatched too (array)
*/
function getGraphOptions(graphType, xData,yData, zData, yName){

    switch(graphType){
        case 'line':
            return lineGraph(xData, yData)
        case 'pie':
            return pieGraph(xData, yData,yName)
        case 'circleBar':
            return circleBarGraph(xData, yData, zData)
        case 'multiBar':
            return multiBarGraph(xData,yData,zData)
        default:
            return lineGraph(xData, yData)

    }

}
/* REMOVENULL
Purpose: to eleimiate any fields that are labeled with something that is null or unknown to create a better representaion of data
How it works: '
    -loops data 
        - checks x and y for labels of None , or unknown
        -if it exist and the lenght of data types is >2 remove it from the data 
Parameters: data (array, results from api call)
Returns: tempData or data (array)
*/
function removeNull(data){
    var tempData=[]
    if (data.length>2){
        for (var i=0; i< data.length; i++){
            if (data[i].x!=='None'&&data[i].y!=='None'&&data[i].y!=='UNKNOWN'&&data[i].y!=='unknown'&&data[i].x!=='UNKNOWN'&&data[i].x!=='unknown'){
                tempData.push(data[i])
            }
        }
    }else {
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
function getDescripton(x,y,graph){
    var description=''
    switch(graph){
        case 'multiBar':
            description= 'Comparing '+x+' to top 5 of '+y+' (or less then top 5)'
            break;
        case 'pie':
            description='Comparing the top 10, sum of '+y+' per '+x+'  type (or less then top 10)' 
            break;
        case 'line':
            description='Compareing '+x+' to '+y+'by month'
            break; 
        case 'circleBar':
            description='Comparing the top 10, number of  '+y+' per '+x+'  type (or less then top 10)'
            break;  
        default :
            description=''             
    }
    return description
}
/* FORMATEDATA
Purpose: create a object to pass to the graph component that contains ,data, titles, tags, description,graph  
How it works:
    - calculate ohow many unique values of x there are
    - if 1
        -change graphtype to multibar (gives a better represntaion of the data)
    -call to get a description
    -call to generate the options        

Paramerter:  graphObjects (object,both x and y data ), xdata (array, just x data), ydata (array, just ydata), zdata (array, just zdata not always used)
Returns:  dataout (array)
 */
function formatData(graphObject, xData, yData,zData){
    var dataOut={}
        //if unique y then do a bar
    var xu=  xData.filter((v, i, a) => a.indexOf(v) === i).length  
    var graphType=graphObject.graph
    if (xu===1 ){
        graphType='multiBar'
    }
        
    dataOut={
        title: graphObject.x+' Vs. '+ graphObject.y,
        description:getDescripton(graphObject.x,graphObject.y,graphType ),
        graph: graphType,
        widthOfCard: '100%',
        tags:[
            {name:graphObject.x, route:''},
            {name:graphObject.y, route:''},
            {name:graphType, route:''},],
        xName:graphObject.x,
        yName:graphObject.y,
        options: getGraphOptions(graphType,xData, yData, zData,graphObject.y )
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
function dataConfig(xData,yData){
    var data=[]
    for (var i =0; i<xData.length; i++){
        var object={
            value:yData[i],
            name:xData[i]
        }
        data.push(object)
    }
    return(data)
}
/* PIEGRAPH
Purpose: generate the options object specificaily for a pie graph 
How it works:
    -all standard setting are set 
    -data is sent to dataConfig to formate it correctly
Paramerters: xData (array), ydata (array) yName (title/ PropId for ydata)
Returns: option (object)
 */
function pieGraph(xData,yData, yName){
    
    var option = {
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'horizontal',
            left: 'left',
            data: xData,
            type: 'scroll',
        },
        series : [
            {
                name: yName,
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:dataConfig(xData,yData),
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
function circleBarConfig(xData,zData,ylength){
    var xUnique = xData.filter((v, i, a) => a.indexOf(v) === i); 
    var xlength= xUnique.length
    var graphData=[];
    for (var i =0; i<xlength; i++){
        var z= zData.slice(i, i+ylength);
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
function circleBarGraph(xData,yData,zData){
    var yUnique = yData.filter((v, i, a) => a.indexOf(v) === i); 
    var xUnique = xData.filter((v, i, a) => a.indexOf(v) === i); 
    var lengthY = yUnique.length
    
    var option = {
        tooltip : {
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
        series: circleBarConfig(xData,zData, lengthY),
        legend: {
            show: true,
            data: xUnique,
            type: 'scroll',
        }
    };
    return option
}
function lineGraph(xData,yData){
    var option = {
        tooltip : {
            trigger: 'item',
            formatter: "{b} : {c}"
        },
        xAxis: {
            type: 'category',
            data: xData
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
function separateData(ux, oa, uyAll){
    var temp=false
    var array=[]
    //goal -> group all infractions in order of date null if infractions dne for that month null
        //get all objects with.x =ux
    var uxArray=[]
    for(var i=0;i< oa.length;i++){
        if (oa[i].x===ux){
            uxArray.push(oa[i])
        }
    }

    temp=null    
    for (i=0; i<uyAll.length;i++){
        for(var j=0; j<uxArray.length;j++ ){ 
            if (uyAll[i]===uxArray[j].y){
                temp=uxArray[j].z
            }
        }
        array.push(temp)
        temp=null
    }        

    return array;
}
function createMultiObject(x,y,z){
    var array=[]
    for(var i=0; i< z.length; i++){
        var object={
            x:x[i],
            y:y[i],
            z:z[i]
        }
        array.push(object)
    }
  
    return array
}
function multiBarConfig(xData,zData,ylength,yData){
    var xUnique = xData.filter((v, i, a) => a.indexOf(v) === i);
    var yUnique = yData.filter((v, i, a) => a.indexOf(v) === i);  
    var xlength= xUnique.length
    var graphData=[];
    var objectArray= createMultiObject(xData,yData,zData)
    for (var i =0; i<xlength; i++){
        var z= separateData(xUnique[i], objectArray,yUnique )//zData.slice(i, i+ylength);
        var object =  {
            name:xUnique[i],
            type:'bar',
            stack:'top',
            data:z,
        }
        graphData.push(object)
    }
    return (graphData)
}
function multiBarGraph(xData,yData,zData){
    var yUnique = yData.filter((v, i, a) => a.indexOf(v) === i); 
    var xUnique = xData.filter((v, i, a) => a.indexOf(v) === i); 
    var lengthY = yUnique.length
    var option = {
        tooltip : {
            trigger: 'axis',
            axisPointer : {        
                type : 'shadow'       
            }
        },
        legend: {
            data:xUnique.map(String),
            position: 'bottom',
            type: 'scroll',
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
           
            {
                type : 'category',
                //axisTick : {show: false},
                data : yUnique,
                axisLabel: {
                    interval: 0,
                    rotate: -25
                },
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : multiBarConfig(xData,zData, lengthY,yData)
    };
    return option
}
export {
    catPropsFunction,
    removeNull,
    formatData,
};