import React, { Component } from 'react';
import WelcomeCard from '../../components/welcomeCard'

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showWelcome: true,
    };
    this.clickHandler = this.clickHandler.bind(this)
  }

  clickHandler(event) {
    this.setState({
      showWelcome: false
    })
  }

  render() {
    var welcomeCard = null
    if (this.state.showWelcome) {
      welcomeCard = <WelcomeCard clickHandler={this.clickHandler} />
    } else {
      welcomeCard = null
    }
    return (
      <div >
        {welcomeCard}
      </div>
      //place thier dashboard
      
    );
  }
}
