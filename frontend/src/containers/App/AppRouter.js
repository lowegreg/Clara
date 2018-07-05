import React from 'react';
import { Switch, Route } from 'react-router-dom';
import asyncComponent from '../../helpers/AsyncFunc';
import getDevRouters from '../../customApp/router';

class AppRouter extends React.Component {
  render() {
    const { url } = this.props;
    return (
      <Switch>
        <Route
          exact
          path={`${url}/`}
          component={asyncComponent(() => import('../../customApp/containers/ClaraHomeScreen/index.js'))}
        />
        <Route
          exact
          path={`${url}/widgets`}
          component={asyncComponent(() => import('../Widgets/index.js'))}
        />
        <Route
          exact
          path={`${url}/breadcrumb`}
          component={asyncComponent(() =>
            import('../Uielements/Breadcrumb/breadcrumb')
          )}
        />
        <Route
          exact
          path={`${url}/dropdown`}
          component={asyncComponent(() =>
            import('../Uielements/Dropdown/dropdown')
          )}
        />
        <Route
          exact
          path={`${url}/op_badge`}
          component={asyncComponent(() => import('../Uielements/Badge'))}
        />
        <Route
          exact
          path={`${url}/op_card`}
          component={asyncComponent(() => import('../Uielements/Card'))}
        />
        <Route
          exact
          path={`${url}/op_carousel`}
          component={asyncComponent(() => import('../Uielements/Carousel'))}
        />
        <Route
          exact
          path={`${url}/op_collapse`}
          component={asyncComponent(() => import('../Uielements/Collapse'))}
        />
        <Route
          exact
          path={`${url}/op_tooltip`}
          component={asyncComponent(() => import('../Uielements/Tooltip/'))}
        />
        <Route
          exact
          path={`${url}/rating`}
          component={asyncComponent(() => import('../Uielements/rating/'))}
        />
        <Route
          exact
          path={`${url}/tree`}
          component={asyncComponent(() => import('../Uielements/Tree/'))}
        />
        <Route
          exact
          path={`${url}/op_tag`}
          component={asyncComponent(() => import('../Uielements/Tag'))}
        />
        <Route
          exact
          path={`${url}/op_timeline`}
          component={asyncComponent(() => import('../Uielements/Timeline'))}
        />
        <Route
          exact
          path={`${url}/op_popover`}
          component={asyncComponent(() => import('../Uielements/Popover'))}
        />
        <Route
          exact
          path={`${url}/pagination`}
          component={asyncComponent(() =>
            import('../Uielements/Pagination/pagination')
          )}
        />
        <Route
          exact
          path={`${url}/reactDates`}
          component={asyncComponent(() =>
            import('../AdvancedUI/ReactDates/reactDates')
          )}
        />
        <Route
          exact
          path={`${url}/codeMirror`}
          component={asyncComponent(() => import('../AdvancedUI/codeMirror'))}
        />
        <Route
          exact
          path={`${url}/uppy`}
          component={asyncComponent(() => import('../AdvancedUI/uppy'))}
        />
        <Route
          exact
          path={`${url}/dropzone`}
          component={asyncComponent(() => import('../AdvancedUI/dropzone'))}
        />
        {getDevRouters(url)}
      </Switch>
    );
  }
}

export default AppRouter;
