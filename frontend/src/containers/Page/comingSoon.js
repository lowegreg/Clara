import React from 'react';
import Countdown from 'react-count-down';


import Image from '../../image/claraCats04.svg';

import FourZeroFourStyleWrapper from './404.style';


class FourZeroFour extends React.Component {
  render() {
    const options = {
      endDate: '03/01/2019 10:55 AM',
      prefix: 'until my birthday!'
    };
  
    return (
      <FourZeroFourStyleWrapper className="iso404Page">
        <div >
          <h1>Hey! Thank you for checking out our app.</h1>
          <h3>
            It’s not quite ready yet, but we are working hard and it will be
            ready in approximately:
          </h3>
          <Countdown options={options} />
        </div>

        <div className="iso404Artwork">
          <img alt="#" src={Image} />
        </div>
      </FourZeroFourStyleWrapper>
    );
  }
}

export default FourZeroFour;
