import React, { Component } from 'react';
import { DataCardWrapper } from './style';
import src from '../../../image/claraCats02.svg';
import Card from '../../../containers/Uielements/Card/card.style';
import { Icon } from 'antd';
import { Col } from 'react-flexbox-grid';

export default class WelcomeCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
    };
  }
  componentDidMount() {
    fetch('http://35.182.255.76/card/5b86b4ad06f22c631cb6159f', {
      headers: {
        'Accept': 'application/x-www-form-urlencoded',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${this.props.jwt}`
      },
      method: "GET",
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ title: responseJson.title, description: responseJson.description })
      })
      .catch(error => {
        //displays server error
        this.setState({ title: 'Welcome to Clara', description: 'Something went wrong, please contacct an admin.' })
        console.error(error)
      })
  }
  render() {
    const { title, description } = this.state;
    return (
      <div >
        <DataCardWrapper>
          <Card
            title={title}
            bordered={false}
            style={{ width: '100%' }}
            extra={
              <button className="isoDeleteBtn" onClick={this.props.clickHandler}>
                <Icon type="close" />
              </button>
            }
          >
            <div className='isoControlBar'>
              <Col style={{width: '33%'}}>
                <img src={src} alt="Clara the cat" style={{ paddingRight: 40 }}></img>
              </Col>
              <Col style={{width: '67%', content: 'center'}}>
                <p>
                  {description}
                </p>
              </Col>
            </div>
          </Card>
        </DataCardWrapper>
      </div>
    );
  }
}
