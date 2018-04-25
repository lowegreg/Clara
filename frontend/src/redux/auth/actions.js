const actions = {
  CHECK_AUTHORIZATION: 'CHECK_AUTHORIZATION',
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGOUT: 'LOGOUT',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  UPDATE_USER_RESQUEST: 'UPDATE_USER_REQUEST',
  CREATE_DASHBOARD_REQUEST: 'CREATE_DASHBOARD_REQUEST',
  CREATE_DASHBOARD_ERROR: 'CREATE_DASHBOARD_ERROR',
  createDashbaord: (dashboardTitle) => ({
    type: actions.CREATE_DASHBOARD_REQUEST,
    dashboardTitle
  }),
  checkAuthorization: () => ({ type: actions.CHECK_AUTHORIZATION }),
  login: (credentials) => ({
    type: actions.LOGIN_REQUEST,
    credentials
  }),
  logout: () => ({
    type: actions.LOGOUT
  }),
  updateUser: () => ({
    type: actions.UPDATE_USER_RESQUEST,
  })
};
export default actions;
