import React from 'react';
import { Link } from 'react-router-dom';

export default function({ collapsed }) {
  return (
    <div className="isoLogoWrapper">
      {collapsed
        ? <div>
            <h3>
              <Link to="/dashboard">
              <img
                src={require('../../image/claraCats01.svg') } 
                alt='claraCat'
               // width={100}
                height={30}
              />
              </Link>
            </h3>
          </div>
        : <h3>
       
          
            <Link to="/dashboard">
         
             
           
            <img
                src={require('../../image/clara.png') } 
                alt='claraCat'
               // width={100}
                height={30}
              />
              
            </Link>
         
          </h3>}
    </div>
  );
}
