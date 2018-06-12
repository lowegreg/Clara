var UserProfile = (function() {
  var empID = "30470";
  var Dep = "IT";
  var View = "lab";
  var firstName = "Eric";
  var lastName = "Gordon";
  //var database = "http://ec2-35-182-65-42.ca-central-1.compute.amazonaws.com/";
  //API Gateway
  var database =  "http://35.182.224.114:3000/"//"http://localhost:3001/";
  var email = "erickgordon96@gmail.com";
  var depOnly = true;

  var getID = function() {
    return empID;
  };

  var getEmail = function() {
    return email;
  };

  var getDep = function() {
    return Dep;
  };

  var getView = function() {
    return View;
  };

  var getName = function() {
    return firstName;
  };
  var getLastName = function() {
    return lastName;
  };

  var getDatabase = function() {
    return database;
  };

  var getDepDefault = function() {
    return depOnly;
  };

  var setInfo = function(id, mail, dep, view, first, last) {
    empID = id;
    email = mail;
    Dep = dep;
    View = view;
    firstName = first;
    lastName = last;
  };

  var setDepDefault = function(newDefault) {
    depOnly = newDefault;
  };

  return {
    getID: getID,
    getEmail: getEmail,
    getDep: getDep,
    getView: getView,
    getName: getName,
    getLastName: getLastName,
    getDatabase: getDatabase,
    getDepDefault: getDepDefault,
    setInfo: setInfo,
    setDepDefault: setDepDefault
  };
})();

export default UserProfile;
