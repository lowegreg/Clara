import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { Icon, Spin } from 'antd';
import Box from '../../../components/utility/box';

function convertTime(oldDate){
  var hour = new Date(oldDate).getHours() + 4;
  var min = new Date(oldDate).getMinutes()
  var dayTime = 'AM';
  if(hour>=12){
    hour = hour-12;
    dayTime = 'PM'
  }
  var time = `${hour}:${min} ${dayTime}`;
  return time
}
export default class Weather extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: Date.now(),
      weather: {},
      loading: true,
    };
  }
  //get current weather
  weatherCard = () => {
    fetch('http://35.182.224.114:3000/weather',  { method: 'GET', mode: 'cors' })
    .then((response) => response.json())
    .then(responseJson => {
      if(!responseJson.Error){
        var weather = responseJson.id[0]
        weather.time = convertTime(weather.date)
        this.setState({ weather: weather, loading: false})
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  componentDidMount(){
    this.weatherCard();
    this.interval = setInterval(() => this.setState({ time: Date.now() }), 300000);
  }
  componentWillUnmount() {
    clearInterval(this.time);
  }
  findUpdateTime = () => {
    const time = ((Date.parse(this.state.weather.date)))
    const hour = new Date(time).getHours() ;
    const min = new Date(time).getMinutes();
    const currentDate = Date.now();
    const day = new Date(currentDate).getDate();
    const month = new Date(currentDate).getMonth();
    const year =  new Date(currentDate).getFullYear()
    var futureTime = new Date(year,month,day,(hour+6),min)
    return Date.parse(futureTime)
  }
  componentDidUpdate(prevProps, prevState){
    const update = this.findUpdateTime();
    if(this.state.time > update){ 
      this.weatherCard();
    }
  }
  render() {
    const weather = this.state.weather;
  return (
    <Row style={{ marginTop: '18px' }}>
      <Col style={{height:'175px', width:'400px', paddingLeft:'20px' }}>
        <Box>
          <h5>Current Weather</h5>
          {this.state.loading ? (<Row style={{justifyContent:'center', alignItems:'space-around', marginTop:'50px'}}>
            <Spin/> 
          </Row>) : (
          <Row>
           {this.state.loading &&
           <Row style={{justifyContent:'center', alignItems:'space-around', marginTop:'50px'}}>
            <Spin/> 
          </Row>}
          <Col xs={4} style={{ textAlign: 'center' }}>
            { weather.icon &&
            <img src={require(`../../../image/weather/${weather.icon}.png`)} alt='' height="78" width="91" />}
            <h5>{weather.weatherCondition}</h5>
            <h6>{weather.weatherDescrip}</h6>
          </Col>
          <Col xs={3} style={{ textAlign: 'center', paddingTop: '17px', paddingLeft: '10px' }}>
            <Row style={{textAlign: 'center', justifyContent: 'center'}}><h1>{weather.temp}</h1> <h3>&deg;C</h3></Row>
            <p>
            <Icon type='arrow-up'/>{weather.tempMax} <Icon type='arrow-down'/>{weather.tempMin}</p>
          </Col>
          <Col xs={4} style={{ padding: '17px 0px' }} >
            <p>Time: {weather.time}</p>
            <p>Humidity: {weather.humidity}%</p>
            <p>Winds: {weather.windSpeed} km/h</p>
            <p>Cloud: {weather.clouds}%</p>
          </Col>
          </Row>)}
        </Box>
      </Col>
    </Row>
    );
  }
}