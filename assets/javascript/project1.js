

$(document).ready(function() {
    var config = {
        apiKey: "AIzaSyDNsnbqtn30Qcp7CRpXujCZl7M-zxwDH5k",
        authDomain: "eventhub-938dc.firebaseapp.com",
        databaseURL: "https://eventhub-938dc.firebaseio.com",
        projectId: "eventhub-938dc",
        storageBucket: "eventhub-938dc.appspot.com",
        messagingSenderId: "881180896330"
      };
      firebase.initializeApp(config);
});

class member {
  constructor(firstName, lastName, zip) {
  // this._uid = uid,  
  this._email = null,
  this._firstName = firstName,
  this._lastName = lastName,
  this._zip = zip,
  this._loggedIn = false
  }
};

var STATE = {
  LOGGEDOFF: 1,
  LOGGEDIN: 2,
};




//--------------------------------------------------------AUTHENTICATION------------------------------------------------------

//--------------------------------------------------------CREATE ACCOUNT------------------------------------------------------

$('#sign-up-button').on('click', function createNewAccount() {
  var firstName = $('#Form-name5').val();
  var lastName = $('#Form-name6').val();
  var password = $('#Form-pass5').val();
  var email = $('#Form-email5').val();
  var zip = $('#Form-zip').val();
  

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function(user) {
      user = firebase.auth().currentUser;
    });
    membersRef = firebase.database().ref('/members');
    let newMember = new member(firstName, lastName, zip);
    membersRef.push().set(newMember);

    $('#Form-name5').val("");
    $('#Form-name6').val("");
    $('#Form-email5').val("");
    $('#Form-zip').val("");
    $(".close").trigger("click");
    console.log(email);
    console.log(password);
    console.log(user);

});



//-------------------------------------------------SIGN IN VIA PREVEIOSLY CREATED ACCOUNT-------------------------------

$("#login-button").on("click", function signInWithEmailAndPassword(email, password) {
  var email = $('#modalLRInput10').val();
  var password = $('#modalLRInput11').val();
  $('#modalLRInput10').val("")
  $('#modalLRInput11').val("")
  $("#close-button").trigger("click");

  firebase.auth().signInWithEmailAndPassword(email, password);
  console.log(email);
  console.log(password);
  console.log(user);
}

  
);

//----------------------------------------------------SIGN OUT--------------------------------------------------------------

$("#log-out-button").on("click", function() {
  firebase.auth().signOut()
  .then(function() {
    // Sign-out successful.
  })
  .catch(function(error) {
    // An error happened
  });
});
