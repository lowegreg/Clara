function catPropsFunction(props){ 
    var type = [];
    var rank = [];
    var finacial = [];
    var date = [];
    var location = [];
    props.forEach((prop, index) => {
      if(prop.dataTypes==='Text-Type'){
          type.push(prop.propId);
      }else if(prop.dataTypes==='Number-Rank'){
          rank.push(prop.propId)
      }else if(prop.dataTypes==='Number-Financial'){
          finacial.push(prop.propId)
      }else if(prop.dataTypes==='Date-MM:DD:YYYY'||prop.dataTypes==='Date-YYYY-MM-DD'){
          date.push(prop.propId)
      }else if(prop.dataTypes==='Location-Street'){
          location.push(prop.propId)
      }
    });
    return createCompare(type,rank,finacial, date,location);
}


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


function createCompare(type, rank, fin, date, loc){
    var compare = [];
    //type vs fin --> pie
    //type vs date  --> line
    //type vs loc  -> heat map or bar
    //type vs rank -->
    if (type.length!==0){
        type.forEach((input, index)=>{
            if (fin.length!==0){
                compare=objectMaker(input, fin, 'pie', compare,'type','fin');
            }
            if(date.length!==0){
                compare=objectMaker(input,date,'circleBar', compare,'type','date',true);//group bar graph 
            }
            if(loc.length!==0){
                compare=objectMaker(input, loc, 'multiBar', compare,'type','loc');
            }
            if(rank!==0){
                compare=objectMaker(input, rank, 'bar', compare,'type','rank');
            }
        })
    }
    
    //fin vs date --> line
    //fin vs loc  -->heat map or bar
    //fin vs rank --> pie or bar
    if(fin.length!==0){ 
        fin.forEach((input, index)=>{
            if(date.length!==0){
                compare=objectMaker(input, date, 'line', compare,'fin','date',true);
            }if (loc.length!==0){
                compare=objectMaker(input, loc, 'multiBar', compare,'fin','loc');
            }if(rank.length!==0){
                compare=objectMaker(input, rank, 'pie', compare,'fin','rank');
            }
        }) 
    }
    //loc vs rank --> heat map or bar
    //loc vs date --> heat map or line
    if (loc.length!==0){
        loc.forEach((input,index)=>{
            if(rank.length!==0){
                compare=objectMaker(input, rank, 'heatMap', compare,'loc','rank');
            }
            if(date.length!==0){
               // compare=objectMaker(input, date, 'line', compare);// not graph worthy
            }
        })
    } 
    //date vs rank -> line
    if (date.length!==0){
        date.forEach((input,index)=>{
            if(rank!==0){
                compare=objectMaker(input, rank, 'line', compare,'date','rank');
            }
        })
    }
    return compare;
}

function getGraphOptions(graphType, xData,yData, zData, yName){
    if (graphType==='line'){
        return lineGraph(xData, yData)
        
    }else if(graphType==='pie'){
        return pieGraph(xData, yData,yName)
    }else if (graphType==='circleBar'){
        return circleBarGraph(xData, yData, zData)
    }else if(graphType==='multiBar'){
        return multiBarGraph(xData,yData,zData)
    }
    return lineGraph(xData, yData)
}

function formatData(graphObject, xData, yData,zData){
    var dataOut={}
    dataOut={
        title: graphObject.x+' Vs. '+ graphObject.y,
        description:'A descriptions',
        graph: graphObject.graph,
        widthOfCard:'100%',
        xName:graphObject.x,
        yName:graphObject.y,
        options: getGraphOptions(graphObject.graph,xData, yData, zData,graphObject.y )

    }

    
    return dataOut
}

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

function pieGraph(xData,yData, yName){
    
    var option = {
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'horizontal',
            left: 'left',
            data: xData
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
            data: xUnique
        }
    };
    return option
}

function lineGraph(xData,yData){
    var option = {
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

function multiBarConfig(xData,zData,ylength){
    var xUnique = xData.filter((v, i, a) => a.indexOf(v) === i); 
    var xlength= xUnique.length
    var graphData=[];
    for (var i =0; i<xlength; i++){
        var z= zData.slice(i, i+ylength);
        var object =  {
            name:xUnique[i],
            type:'bar',
            label: {
                normal: {
                    show: true,  
                }
            },
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
            data:xUnique,
            position: 'bottom'
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
        series : multiBarConfig(xData,zData, lengthY)
    };
    return option
}

export {
    catPropsFunction,
    formatData,
};