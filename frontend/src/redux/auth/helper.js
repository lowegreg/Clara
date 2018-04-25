
export function loginAPI(user, password, code) {
  return fetch('http://localhost:1337/auth/local',  {
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
  
export function getDashboards(userId,jwt) {
  return fetch(`http://localhost:1337/dashboard/user/${userId}`,  {
    headers: {
      'Authorization': `Bearer ${jwt}`,
    },
    method: "GET",
  })
  .then(response => response.json())
  .catch(error => error)
  .then(data => data)
}

export function getUser(userId,jwt){
  return fetch(`http://localhost:1337/user/${userId}`,  {
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
