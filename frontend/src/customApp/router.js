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
  return routers;
}
