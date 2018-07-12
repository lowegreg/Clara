function newEmptyness(yData, zData, xData, xUnique,yUNum){
    var newZData= new Array(xUnique.length * yUNum)
    newZData.fill(0, 0, xUnique.length * yUNum)
    var index=0;
    var newZIndex=0
    while (index<zData.length){
        var skipAmount=0
        var numTheSame=1
        var allTheSame=true
        
        for (var i=index ; i< xUnique.length+index-1; i++){
            if(yData[i]!==yData[i+1]){
                allTheSame=false
                break;// not all the same
            }else{
                numTheSame++
            }
        }
        if (allTheSame){
            for(var i=index; i< xUnique.length+index; i++){
                newZData.splice(newZIndex, 1, zData[i]);
                newZIndex++
            }
            skipAmount=xUnique.length
        }else{
            for(var i=index; i< numTheSame+index; i++){
                var placement=xUnique.indexOf(xData[i])
                newZData.splice(placement+newZIndex, 1, zData[i])
            }
            skipAmount=numTheSame
            newZIndex=newZIndex+xUnique.length
        }
      
        index=index+skipAmount
    }    
    
    return(newZData)
}


function getZData(zdata, xlength,i){
    var z=[]
    for (var j=i;j< zdata.length;j=j+xlength){
        z.push(zdata[j])
    }
    console.log(z,z.length)
    return z
}


//yData, zData, xData, xUnique,yUNum
var yData = [" DOON VALLEY DR", " DOON VALLEY DR ", " DOON VALLEY DR LOT ", " DOON VALLEY DR LOT ", " DOON VALLEY DR LOT ", " DOON VALLEY DR LOT ", " KING ST W", " KING ST W", " KING ST W ", " KING ST W", "FORSYTH LOT ", "FORSYTH LOT ", "FORSYTH LOT ", "FORSYTH LOT ", "GREEN ST LOT ", "GREEN ST LOT ", "GREEN ST LOT ", "GREEN ST LOT ", "KING ST E LOT ", "KING ST E LOT ", "KING ST E LOT ", "KING ST E LOT ", "QUEEN ST N LOT ", "QUEEN ST N LOT ", "QUEEN ST N LOT ", "QUEEN ST N LOT "]
var zData = [1, 10813, 1, 19, 22750, 11, 8, 3, 13292, 2, 12798, 1, 5, 11, 7672, 1, 59, 1941, 6360, 1, 24, 2, 14045, 1, 10, 2] 
var xData =["PARKED AT EXPIRED METER", "PARKED ON PRIVATE PROPERTY", "PARKED AT EXPIRED METER", "PARKED IN PROHIBITED AREA ", "PARKED ON PRIVATE PROPERTY", "PARKED ON PRIVATE PROPERTY - MUNICIPAL", "PARKED IN PROHIBITED AREA ", "PARKED ON HIGHWAY BETWEEN 2:30 A.M. AND 6:00 A.M.", "PARKED ON PRIVATE PROPERTY", "PARKED OVER TIME LIMIT", "PARKED AT EXPIRED METER", "PARKED IN PROHIBITED AREA ", "PARKED ON PRIVATE PROPERTY", "PARKED ON PRIVATE PROPERTY - MUNICIPAL", "PARKED AT EXPIRED METER", "PARKED IN PROHIBITED AREA ", "PARKED ON PRIVATE PROPERTY", "PARKED ON PRIVATE PROPERTY - MUNICIPAL", "PARKED AT EXPIRED METER", "PARKED ON PRIVATE PROPERTY", "PARKED ON PRIVATE PROPERTY - MUNICIPAL", "PARKED OVER TIME LIMIT", "PARKED AT EXPIRED METER", "PARKED IN PROHIBITED AREA ", "PARKED ON PRIVATE PROPERTY - MUNICIPAL", "PARKED OVER TIME LIMIT"]
var xUnique =xData.filter((v, i, a) => a.indexOf(v) === i);

var yUNum=yData.filter((v, i, a) => a.indexOf(v) === i).length
console.log(xUnique,xUnique.length,yUNum)
//yData, zData, xData, xUnique,yUNum
// var yData=["HOMER WATSON BLVD @ HOMER WATSON BLVD", "HURON RD @ HURON RD", "ADELAIDE ST btwn BELMONT AVE W & LAWRENCE AVE", "BROCK ST btwn QUEEN ST S & WEST AVE", "HURON RD @ HURON RD", "MONTCALM DR @ TECUMSEH CRES", "RITTENHOUSE RD btwn BLOCK LINE RD & TUERR DR", "KINGSWOOD DR @ APPALACHIAN CRES", "KINGSWOOD DR @ APPALACHIAN CRES", "MONTCALM DR @ TECUMSEH CRES", "RITTENHOUSE RD btwn BLOCK LINE RD & TUERR DR"]
// var zData = [3, 3, 2, 2, 2, 2, 2, 1, 1, 1, 1]
// var xData = ["02-Intersection related", "03-At intersection", "04-At/near private drive", "01-Non intersection", "02-Intersection related", "02-Intersection related", "01-Non intersection", "01-Non intersection", "03-At intersection", "01-Non intersection", "10-Parking lot"]
// var xUnique = xData.filter((v, i, a) => a.indexOf(v) === i)
// var yUNum=yData.filter((v, i, a) => a.indexOf(v) === i).length

zdata=newEmptyness(yData, zData, xData, xUnique, yUNum)
console.log(zdata)
for (var i = 0; i < xUnique.length; i++) {
    // getZData(zData, xlength,i)

    getZData(zdata, xUnique.length,i)
   
    
}

console.log(test.filter((v, i, a) => a.indexOf(v) === i))











