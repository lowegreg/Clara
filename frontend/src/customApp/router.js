import React from 'react';
import { Route } from 'react-router-dom';
import asyncComponent from '../helpers/AsyncFunc';

export default function(url) {
  const routers = [];
  routers.push(
    <Route
      exact
      key="gitSearch"
      path={`${url}/githubSearch`}
      component={asyncComponent(() => import('./containers/GithubSearch'))}
    />
  );
  routers.push(
    <Route
      exact
      key="blank_page"
      path={`${url}/blank_page`}
      component={asyncComponent(() => import('./containers/blankPage'))}
    />
  );
  routers.push(
    <Route
      exact
      key="parkingInfractions"
      path={`${url}/parkingInfractions`}
      component={asyncComponent(() => import('./containers/parking/parkingInfractions'))}
    /> 
  );
  routers.push(
    <Route
      exact
      key="open_data"
      path={`${url}/open_data`}
      component={asyncComponent(() => import('./containers/OpenData/index'))}
    />
  );
  return routers;
}
