$(document).ready(function() {
    // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAJsodCShMn6f8Guj4aTv9zblwktDD09vE",
    authDomain: "eventhub-c78fc.firebaseapp.com",
    databaseURL: "https://eventhub-c78fc.firebaseio.com",
    projectId: "eventhub-c78fc",
    storageBucket: "eventhub-c78fc.appspot.com",
    messagingSenderId: "646028280332"
  };
  firebase.initializeApp(config);


const database = firebase.database();


// class member {
//   constructor(firstName, lastName, zip) {
//   // this._uid = uid,  
//   this._email = null,
//   this._firstName = firstName,
//   this._lastName = lastName,
//   this._zip = zip,
//   this._loggedIn = false
//   }
// };

var STATE = {
  LOGGEDOFF: 1,
  LOGGEDIN: 2,
};

// Working on chat stuff

$("#comment").submit(function() {
    database.ref().set({
      name: $("#name").val(),
      message: $("#message").val(),
    //   md5Email: md5($("#email").val()),
    //   postedAt: Firebase.ServerValue.TIMESTAMP
    });
  
    $("input[type=text], textarea").val("");
    return false;
  });


//--------------------------------------------------------AUTHENTICATION------------------------------------------------------

//--------------------------------------------------------CREATE ACCOUNT------------------------------------------------------

// $('#sign-up-button').on('click', function createNewAccount() {
//   var firstName = $('#Form-name5').val();
//   var lastName = $('#Form-name6').val();
//   var password = $('#Form-pass5').val();
//   var email = $('#Form-email5').val();
//   var zip = $('#Form-zip').val();
  

//   firebase.auth().createUserWithEmailAndPassword(email, password)
//     .then(function(user) {
//       user = firebase.auth().currentUser;
//     });
//     membersRef = firebase.database().ref('/members');
//     let newMember = new member(firstName, lastName, zip);
//     membersRef.push().set(newMember);

//     $('#Form-name5').val("");
//     $('#Form-name6').val("");
//     $('#Form-email5').val("");
//     $('#Form-zip').val("");
//     $(".close").trigger("click");
//     console.log(email);
//     console.log(password);
//     console.log(user);

// });



//-------------------------------------------------SIGN IN VIA PREVEIOSLY CREATED ACCOUNT-------------------------------

// $("#login-button").on("click", function signInWithEmailAndPassword(email, password) {
//   var email = $('#modalLRInput10').val();
//   var password = $('#modalLRInput11').val();
//   $('#modalLRInput10').val("")
//   $('#modalLRInput11').val("")
//   $("#close-button").trigger("click");

//   firebase.auth().signInWithEmailAndPassword(email, password);
//   console.log(email);
//   console.log(password);
//   console.log(user);
// }

  
// );

//----------------------------------------------------SIGN OUT--------------------------------------------------------------

// $("#log-out-button").on("click", function() {
//   firebase.auth().signOut()
//   .then(function() {
//     // Sign-out successful.
//   })
//   .catch(function(error) {
//     // An error happened
//   });
// });
// $(document).ready(function () {

//     $(document).on("click", "#searchButton", function () {
//         var search = $("#searchField").val()
//         apiEvents(search);
//     });

    // $("#searchField").keyup(function (event) {
    //     if (event.keyCode === 13) {
    //         var search = $("#searchField").val();
    //         event.preventDefault();
    //         search = "";
    //     }
    // });



    function apiEvents(eventSearch) {
        console.log(eventSearch)
        const apiKey = "apikey=rrFQUi7azSu6BIs8pNUwk9tDZHSTv8YY&"
        const apiTM = "https://app.ticketmaster.com/discovery/v2/"
        let keyword = "keyword=" + $("#searchField").val() + "&";
        let zip = "city=" + $("#city").val();
        if ($("#searchField").val() !== ""){
            let query = apiTM + "events.json?" + apiKey + keyword + zip
            api(query);
            console.log("keyword");
            console.log(query);
        }else{
            let query = apiTM + "events.json?" + apiKey + zip
            api(query)
            console.log("no keyword");
            console.log(query);
        }

    }
        function api(query){
        $.ajax({
            url: query,
            method: "GET"
        }).then(function (response) {
            for (i = 0; i < 10; i++) {
                console.log("eventSearch")
                console.log(response._embedded.events[i])
                let result = {
                    name : response._embedded.events[i].name,
                    date : response._embedded.events[i].dates.start.localDate,
                    time : response._embedded.events[i].dates.start.localTime,
                    image: response._embedded.events[i].images[8].url,
                    venue: response._embedded.events[i]._embedded.venues[0].name
                
                }

                addCard(result)
                // console.log(result.name, result.date, result.time)
                // $("#results").append(result.name + " " + result.venue + " " + result.date + " " + result.time + " " + "<img src='" + result.image + "' height='200' /></br>")
            }
        });
    };

function addCard(data){
    var newRow = $("<h4 class='card-title" + [i] + "'>").append("<a>" + data.name +"</a>")

    $(".card-body").append(newRow);
    //     $("<td id='data'>").html("<img src='./assets/icons/" + data.mode + ".png'/> - " + data.name),
    //     $("<td id='data'>").text(data.dest),
    //     $("<td id='data'>").text(data.time),
    //     $("<td id='data'>").text(data.frequency),
    //     $("<td id='data'>").text(data.arrival),
    // );
};


});







