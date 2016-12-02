var app = angular.module("sampleApp", ["firebase"]);
app.controller("SampleCtrl", function($firebaseAuth, $http) {
  var auth = $firebaseAuth();
  var self = this;
  self.newUser = {};
  var currentUser = {};

  // This code runs whenever the user logs in
  self.logIn = function(){
    auth.$signInWithPopup("google").then(function(firebaseUser) {
      console.log("FIREBASE USER: ", firebaseUser);
      console.log("Firebase Authenticated as: ", firebaseUser.user.displayName);
    }).catch(function(error) {
      console.log("Authentication failed: ", error);
    });
  };

  // This code runs whenever the user changes authentication states
  // e.g. whevenever the user logs in or logs out
  // this is where we put most of our logic so that we don't duplicate
  // the same things in the login and the logout code
  auth.$onAuthStateChanged(function(firebaseUser){
    // firebaseUser will be null if not logged in
    if(firebaseUser) {
      currentUser = firebaseUser;
      // This is where we make our call to our server
      firebaseUser.getToken().then(function(idToken){
        console.log("ID TOKEN: ", idToken);
        $http({
          method: 'GET',
          url: '/privateData',
          headers: {
            id_token: idToken
          }
        }).then(function(response){
          self.secretData = response.data;
          console.log("self.secretData: ", self.secretData);
        });
      });
    } else {
      console.log('Not logged in or not authorized.');
      self.secretData = [];
    }

  });

  // This code runs when the user logs out
  self.logOut = function(){
    auth.$signOut().then(function(){
      console.log('Logging the user out!');
    });
  };

  self.submitNewUser = function() {
    event.preventDefault();
    console.log(self.newUser);
    self.newUser = {};
    currentUser.getToken().then(function(idToken){
      console.log("ID TOKEN: ", idToken);
      $http({
        method: 'POST',
        url: '/privateData',
        headers: {
          id_token: idToken
        },
        data: self.newUser

  }

});
