import React, { Component } from 'react';
import { DataCardWrapper } from '../containers/ClaraHomeScreen/style';
import src from '../../image/claraCats02.svg';
import Card from '../../containers/Uielements/Card/card.style';
import { Icon } from 'antd';

export default class WelcomeCard extends Component {
  render() {
    return (
      <div >
        <DataCardWrapper>
        <Card
          title="Welcome to Clara"
          bordered={false}
          style={{ width: '100%' }}
          extra={
            <button className="isoDeleteBtn" onClick={this.props.clickHandler}>
            <Icon type="close" />
            </button>
            }
          >
          <div className='isoControlBar'>
          <img src={src} alt="Clara the cat" style={{ paddingRight: 40}}></img>
          
          <p text-align='right'>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          </div>
          
        </Card>
        </DataCardWrapper>
      </div>
      
    );
  }
}
