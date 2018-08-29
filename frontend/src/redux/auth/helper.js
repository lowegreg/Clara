//calls the login api and returns either errors or json web token and user info
export function loginAPI(user, password, code) {
  return fetch('http://35.182.255.76/auth/local', {
    headers: {
      'Accept': 'application/x-www-form-urlencoded',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: "POST",
    body: `identifier=${user}&password=${password}`,
  })
    .then(response => response.json())
    .catch(error => error)
    .then(data => data)
}
//gets the users dashbaords using their user id and the json web token
export function getDashboards(userId, jwt) {
  return fetch(`http://35.182.255.76/dashboard/user/${userId}`, {
    headers: {
      'Authorization': `Bearer ${jwt}`,
    },
    method: "GET",
  })
    .then(response => response.json())
    .catch(error => error)
    .then(data => data)
}
//gets the user profile using their user id and json web token
export function getUser(userId, jwt) {
  return fetch(`http://35.182.255.76/user/${userId}`, {
    headers: {
      'Accept': 'application/x-www-form-urlencoded',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${jwt}`
    },
    method: "GET",
  })
    .then(response => response.json())
    .catch(error => error)
    .then(data => data)
}
// gets dashboards that are shared amongst the department
export function getSharedDash(departmentId, jwt) {
  return fetch(`http://35.182.255.76/shareddash/department/${departmentId}`, {
    headers: {
      'Accept': 'application/x-www-form-urlencoded',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${jwt}`
    },
    method: "GET",
  })
    .then(response => response.json())
    .catch(error => error)
    .then(data => data)
}