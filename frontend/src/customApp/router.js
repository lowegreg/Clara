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
      key="coming soon"
      path={`${url}/comingSoon`}
      component={asyncComponent(() => import('../containers/Page/comingSoon'))}
    />
  );
  routers.push(
    <Route
      exact
      key="parking Infractions"
      path={`${url}/parking Infractions`}
      component={asyncComponent(() => import('./containers/Parking/index'))}
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
  routers.push(
    <Route
      exact
      key="claraSuggestion"
      path={`${url}/claraSuggestion`}
      component={asyncComponent(() => import('./containers/claraSuggestion'))}
    />
  );
  routers.push(
    <Route
      exact
      key="dataManagement"
      path={`${url}/dataManagement/:tableName?`}
      component={asyncComponent(() => import('./containers/DataManagement/index'))}
    />
  );
  routers.push(
    <Route
      exact
      key="dataManagementAdmin"
      path={`${url}/dataManagementAdmin`}
      component={asyncComponent(() => import('./containers/AdminDataManagement/index'))}
    />
  );
  routers.push(
    <Route
      exact
      key="insights"
      path={`${url}/insights`}
      component={asyncComponent(() => import('./containers/insightPages/index'))}
    />
  );
  return routers;
}
