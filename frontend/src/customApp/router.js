import React from 'react';
import { Route } from 'react-router-dom';
import asyncComponent from '../helpers/AsyncFunc';

export default function (url) {
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
      path={`${url}/open_data/:pageType?`}
      component={asyncComponent(() => import('./containers/OpenData/index'))}
    />
  );
  routers.push(
    <Route
      exact
      key="user_settings"
      path={`${url}/user/settings`}
      component={asyncComponent(() => import('./containers/UserSetting/index'))}
    />
  );
  routers.push(
    <Route
      exact
      key="ideas"
      path={`${url}/ideas`}
      component={asyncComponent(() => import('./containers/ideaCreation/App'))}
    />
  );
  routers.push(
    <Route
      exact
      key="create"
      path={`${url}/create`}
      component={asyncComponent(() => import('./containers/UserStories/userCreateStories'))}
    />
  );
  routers.push(
    <Route
      exact
      key="reports"
      path={`${url}/reports`}
      component={asyncComponent(() => import('./containers/Reports/index'))}
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
      path={`${url}/insights/:tableName?`}
      component={asyncComponent(() => import('./containers/insightPages/index'))}
    />
  );
  routers.push(
    <Route
      exact
      key="adminSuggestions"
      path={`${url}/adminSuggestions`}
      component={asyncComponent(() => import('./containers/ideaCreation/AdminSetUp'))}
    />
  );

  return routers;
}
