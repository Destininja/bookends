window.firebase = function() {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDewozUrqAzuCD6X0dys4T9PEMAYhMtsZ0",
    authDomain: "bookends-janptp1g4.firebaseapp.com",
    databaseURL: "https://bookends-janptp1g4.firebaseio.com",
    projectId: "bookends-janptp1g4",
    storageBucket: "",
    messagingSenderId: "927262703566"
  };
  firebase.initializeApp(config);

  return firebase;
}()