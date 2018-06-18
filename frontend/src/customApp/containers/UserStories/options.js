var bar = {
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        data:['name1', 'name2', 'name3'],
        position: 'bottom',
        type: 'scroll',
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    yAxis : [
        {
            type : 'value'
        }
    ],
    xAxis : [
        {
            type : 'category',
            axisTick : {show: false},
            data : ['d1','d2','d3','d4','d5','d6','d7']
        }
    ],
    series : [
        {
            name:'name1',
            type:'bar',
            stack:'top',
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            },
            data:[200, 170, 240, 244, 200, 220, 210]
        },
        {
            name:'name3',
            type:'bar',
            stack:'top',
            label: {
                normal: {
                    show: true
                }
            },
            data:[320, 302, 341, 374, 390, 450, 420]
        },
        {
            name:'name2',
            type:'bar',
            stack:'top',
            label: {
                normal: {
                    show: true,
                    // position: 'left'
                }
            },
            data:[120, 132, 101, 134, 190,230, 210]
        }
    ]
};
var circleBar = {
    angleAxis: {
    },
    radiusAxis: {
        type: 'category',
        show: false,
        data: ['d1', 'd2', 'd3', 'd4'],
        z: 10
    },
    polar: {
    },
    series: [{
        type: 'bar',
        data: [1, 2, 3, 4],
        coordinateSystem: 'polar',
        name: 'A',
        stack: 'a'
        }, {
            type: 'bar',
            data: [2, 4, 6, 8],
            coordinateSystem: 'polar',
            name: 'B',
            stack: 'a'
        }, {
            type: 'bar',
            data: [1, 2, 3, 4],
            coordinateSystem: 'polar',
            name: 'C',
            stack: 'a'
        }],
    legend: {
        show: true,
        data: ['A', 'B', 'C'],
        type: 'scroll',
    }
};
var pie = {

    tooltip : {
        trigger: 'item',
        formatter: "{b} :</br>{c} ({d}%)"
    },
    legend: {
        orient: 'horizontal',
        left: 'left',
        data: ['l1','l2','l3','l4','l5'],
        type: 'scroll',
    },
    series : [
        {
            // name: 'yname',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
                {value:335, name:'l1'},
                {value:310, name:'l2'},
                {value:234, name:'l3'},
                {value:135, name:'l4'},
                {value:1548, name:'l5'}
            ],
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
var line = {
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line'
    }]
};

function getOptions(type){
    if (type===null){
        return
    }
    switch(type.value){
        case 'Bar Graph':
            return bar;
        case 'Circle Bar Graph':
            return circleBar;
        case 'Pie Graph':
            return pie;
        case 'Line Graph':
            return line;
        default:
            return line;
    }
}

export {
    getOptions,
};