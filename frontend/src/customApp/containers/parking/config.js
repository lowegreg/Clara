

const  colors = ['#BAA6CA', '#B7DCFA', '#FFE69A', '#788195'];
const  colors2 = ['#244d91', '#3b4a63', '#071a3a', '#788195'];

let mixedDateInfractionsLine = {//top left
    componentName: 'mixed',
    key: 'mixed',
    title: 'Number of Infrations per date',

    colors,

    description:'This tile displays the numner of infractions',
    widthOfCard:'100%',// 100 or 60
    tags:[
        {name:'Parking', route:''},
        {name:'Infractions', route:''},
        {name:'cars', route:''},
        {name:'Tickets', route:''},
        {name:'Line Graph', route:''},
        {name:'Bar Graph', route:''},
        {name:'Mixed Graph', route:''},
        {name:'Revenue', route:''},
      ],
    dataKey:{name:'month', dataOne:'tickets', dataTwo:'Fee'}
};
let locationMoneyLine = {// top right
    componentName: 'LineBarAreaComposedChart',
    key: 'LineBarAreaComposedChart',
    title: 'Parking Tickets Distributed per Month',
    colors: colors2,

    description:'This tile displays the amount of revenue that the city receives per location for parking infractions',
    widthOfCard:'100%',// 100 or 60
    tags:[
        {name:'Parking', route:''},
        {name:'Infractions', route:''},
        {name:'cars', route:''},
        {name:'Tickets', route:''},
        {name:'Line Graph', route:''},],
    dataKey:{name:'month',dataOne:'tickets'}
    };
let violoationTypesDoughnut = { // bottom left
    componentName: 'Doughnut',
    key: 'Doughnut',
    title: 'Number of Infractions per Infractions Types',
    dataKey: 'value',
    description:'This tile displays the number of infraction per infraction type where the number of infractions are over 1000',
    widthOfCard:'100%',
    tags:[
        {name:'Parking', route:''},
        {name:'Infractions', route:''},
        {name:'cars', route:''},
        {name:'Tickets', route:''},
        {name:'Doughnut Graph', route:''},
        {name:'Types of Infractions', route:''},]


};
let SimpleLineCharts = { // bottom right
    componentName: 'SimpleLineCharts',
    key: 'SimpleLineCharts',
    title: 'Parking Infractions Revenue per Location',
    colors,
    description:'This tile displays the amount of revenue that the city receives per location for parking infraction where the amount of revenue is over $8000',
    widthOfCard:'100%',
    tags:[
        {name:'Parking', route:''},
        {name:'Infractions', route:''},
        {name:'cars', route:''},
        {name:'Tickets', route:''},
        {name:'Doughnut Graph', route:''},
        {name:'Types of Infractions', route:''},],
    dataKey:{name:'Location', dataOne:'Revenue'}
};

const doughnutData = {
	labels: [],
	datasets: [{
		data: [],
		backgroundColor: [],
		hoverBackgroundColor: []
	}]
};

function setDoughnutData(apiData){
    doughnutData.labels=apiData.map(apiData => apiData.name);
    doughnutData.datasets[0].data=apiData.map(apiData => apiData.value);
    doughnutData.datasets[0].backgroundColor=getColor(doughnutData.labels.length);
    doughnutData.datasets[0].hoverBackgroundColor=doughnutData.datasets.backgroundColor;
     console.log(doughnutData)
    return doughnutData
}

const mixGraphData = {
    labels: [],
    datasets: [
      {
        label: 'label',
        type: 'line',
        data: [],
        fill: false,
        borderColor: '#37538e',
        backgroundColor: '#37538e',
        pointBorderColor: '#37538e',
        pointBackgroundColor: '#37538e',
        pointHoverBackgroundColor: '#37538e',
        pointHoverBorderColor: '#37538e',
        yAxisID: 'y-axis-2'
      },
      {
        type: 'bar',
        label: 'label2',
        data: [],
        fill: false,
        backgroundColor: '#ba8fd3',
        borderColor: '#ba8fd3',
        hoverBackgroundColor: '#ba8fd3',
        hoverBorderColor: '#ba8fd3',
        yAxisID: 'y-axis-1'
      }
    ]
};

function setMizedGraphData(apiData){
    mixGraphData.labels= apiData.map(apiData => apiData.month)  ;
    mixGraphData.datasets[0].data = apiData.map(apiData => apiData.tickets);
    mixGraphData.datasets[0].label = 'Tickets'; 
    mixGraphData.datasets[1].data = apiData.map(apiData => apiData.Fee);
    mixGraphData.datasets[1].label = 'Fees'; 
    return mixGraphData
}

function getColor(length){
    var randomColour = require('randomcolor');

    var colours=[] ;
     for (var i=0; i< length ; i++){
        colours.push(randomColour({luminosity: 'dark',hue: 'blue' }))
     }
 
    return colours
}

export {
    colors,
    SimpleLineCharts,
    violoationTypesDoughnut,
    locationMoneyLine,
    setMizedGraphData,
    mixedDateInfractionsLine,
    setDoughnutData,
};