$(document).ready(function () {
  var config = {
    apiKey: "AIzaSyDNsnbqtn30Qcp7CRpXujCZl7M-zxwDH5k",
    authDomain: "eventhub-938dc.firebaseapp.com",
    databaseURL: "https://eventhub-938dc.firebaseio.com",
    projectId: "eventhub-938dc",
    storageBucket: "eventhub-938dc.appspot.com",
    messagingSenderId: "881180896330"
  };
  firebase.initializeApp(config);


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

  var parkingData = null;

  //-------------------------------------------------DATA TABLE LOGIC------------------------------------------------
  let database = firebase.database();
  let queryObjectRef = database.ref("/queryObj")
  var data = [];

  table = $('#event-table').DataTable({
    data: data,

    columns: [{ title: "Event" },
    { title: "Name" },
    { title: "Location" },
    { title: "Date" },
    { title: "Time" }]
  });

  //-------------------------------------------------CREATE DATA TABLE BASED ON USER SEARCH-------------------------------

  $("#see-more").on("click", function generateEventTable() {
    for (i = 0; i < 1; i++);
    event = result.url;
    name = result.name;
    location = result.venue;
    date = result.localDate;
    time = result.localTime;
    newEvent = [event, name, location, date, time];
    data.push(newEvent);
    let table = $("#event-table").DataTable();
    table.row.add(newEvent).draw();

  });



  //--------------------------------------------------------AUTHENTICATION------------------------------------------------------

  //--------------------------------------------------------CREATE ACCOUNT------------------------------------------------------

  $('#sign-up-button').on('click', function createNewAccount() {
    var firstName = $('#Form-name5').val();
    var lastName = $('#Form-name6').val();
    var password = $('#Form-pass5').val();
    var email = $('#Form-email5').val();
    var zip = $('#Form-zip').val();


    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function (user) {
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

  $("#log-out-button").on("click", function () {
    firebase.auth().signOut()
      .then(function () {
        // Sign-out successful.
      })
      .catch(function (error) {
        // An error happened
      });
  });


  //----------------------------------------------------SEARCH BUTTON CLICK EVENT--------------------------------------------------------------


  $(document).on("click", "#search-button", function () {
    event.preventDefault();
    var search = $("#city-search").val()
    var keyword = $("#keyword-search").val()
    var date = $("#date-search").val()
    apiEvents(search);
  });





  function apiEvents(eventSearch) {
    console.log(eventSearch)
    const apiKey = "apikey=rrFQUi7azSu6BIs8pNUwk9tDZHSTv8YY&"
    const apiTM = "https://app.ticketmaster.com/discovery/v2/"
    let keyword = "keyword=" + $("#keyword-search").val() + "&";
    let city = "city=" + $("#city-search").val() + "&";
    let size = "size=6";
    // var keyword = $("#keyword-search").val() + "&";
    var date = "startDateTime" + $("#date-search").val() + "&";
    if ($("#city-search").val() !== "") {
      let query = apiTM + "events.json?" + apiKey + keyword + city + date;
      api(query);
    //   console.log("keyword");
    //   console.log(query);
    } else {
      let query = apiTM + "events.json?" + apiKey + city + date;
      api(query)
    //   console.log("no keyword");
    //   console.log(query);
    }

  }
  function api(query) {
    $.ajax({
      url: query,
      method: "GET"
    }).then(function (response) {
    //   console.log(response);
      for (i = 0; i < 6; i++) {
        let result = {
          name: response._embedded.events[i].name,
          date: response._embedded.events[i].dates.start.localDate,
          time: response._embedded.events[i].dates.start.localTime,
          image: response._embedded.events[i].images[8].url,
          venue: response._embedded.events[i]._embedded.venues[0].name,
          tickets: response._embedded.events[i].url

        }
        console.log(result)
        googleId(result.venue);
        // this is the parking map function
        googlePark(result.venue); 
        createEventCards(result, i);
      }
    });
  };


  function googleId(id){
    const googleKey = "key=AIzaSyAyJOOjrQqnT_rnAVL9Isx0SlP09SOvh5o";
    const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
    const TARGET_URL = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?&inputtype=textquery&input=' + id + "&" + googleKey + "&fields=place_id"
    const URL = PROXY_URL + TARGET_URL
    // cors solution = https://stackoverflow.com/questions/45185061/google-places-api-cors
    $.ajax({
        url: URL,
        method: "GET",
    }).then(function (answer){
        googlePlace(answer.candidates[0].place_id)
    })
};

    // function to gain detailed data using place_id

function googlePlace(venue){
    const googleKey = "key=AIzaSyAyJOOjrQqnT_rnAVL9Isx0SlP09SOvh5o";
    const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
    // edit the fields of the below target URL to change the data we are getting back
    const TARGET_URL = 'https://maps.googleapis.com/maps/api/place/details/json?&placeid=' + venue + "&" + googleKey + "&fields=url"
    const URL = PROXY_URL + TARGET_URL
    $.ajax({
        url: URL,
        method: "GET",
    }).then(function (answer){
        $("#map").html("<iframe width='450' height='250' frameborder='0' style='border:0' src='https://www.google.com/maps/embed/v1/place?" + googleKey + "&q=place_id:" + venue + "'></iframe>")

    })
};

function googlePark(venue){
    const googleKey = "key=AIzaSyAyJOOjrQqnT_rnAVL9Isx0SlP09SOvh5o";
    const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
    const TARGET_URL = 'https://www.google.com/maps/embed/v1/search?q=parking+near+'
    const URL = PROXY_URL + TARGET_URL + venue + "&" + googleKey
    // cors solution = https://stackoverflow.com/questions/45185061/google-places-api-cors
    var map2;
    $.ajax({
        async: false,
        url: URL,
        method: "GET",
        success: function (){
            var map ="<iframe width='450' height='250' frameborder='0' style='border:0' src='" + TARGET_URL + venue + "&" + googleKey + "'></iframe>"
            map2 = map;
        },
    })
    mappingData(map2)


    
    // .then (function (map){
    //     // console.log(parking)
    //     // console.log(TARGET_URL)
    //     var map ="<iframe width='450' height='250' frameborder='0' style='border:0' src='" + TARGET_URL + venue + "&" + googleKey + "'></iframe>"
    //     return map;
    // })
    
}

function mappingData(mapData){
    parkingData = mapData
}
    
//-------------------------------------------------CREATE EVENT CARDS BASED ON USER SEARCH-------------------------------

let queryResultsArray = [];


function createEventCards(result, index) {
    $('#city-search').val("")
    $('#keyword-search').val("")
    $("#date-search").val("");
    gridLocation = index + 1;
    let eventCard = "<div id='card' class='card item item-" + gridLocation + "' >"
    let eventImg = "<img class='front' id='eventImg' src='" + result.image + "' />"
    let cardData = "<div class='back'>" + result.name
    let cardMap = "<div class= 'back'>" + parkingData   + "</div>"
    let cardComplete = eventCard + eventImg + cardMap + "</br>" + cardData + "</br>" + result.date + "</div>"
    console.log(eventCard + cardData + cardMap + "</div>")
    $(".item-" + gridLocation).append(cardComplete);

    // card flip libray @: https://nnattawat.github.io/flip/
    $("#card").flip();
    

    
    // // ------ELEMENTS GENERATED AND ASSIGNED VARIABLE-----------
    // let eventCard = $("<div>");
    // let cardImage = $("<img>");
    // let cardBody = $("<div>");
    // let eventTitle = $("<a>");
    // let eventTitleText;
    // let eventDate = $("<p>");
    // let eventButton = $("<a>");
    // let cardBack = parkingData;
    // let eventURL;
    // // EVENT CARD---------------------------------------------------
    // eventCard.addClass("card");
    // eventCard.attr("id", "card")

    // //EVENT IMAGE---------------------------------------------------
    // cardImage.addClass("card-img-top front");
    // cardImage.attr("alt", "card image cap");
    // cardImage.attr("src", result.image);
    // cardImage.prependTo(eventCard);
    // //CARD BODY ELEMENTS--------------------------------------------
    // cardBody.addClass("card-body front");
    // eventTitle.addClass("card-title front");
    // eventTitle.text(result.name)
    // eventDate.addClass("card-text front");
    // eventDate.text(result.date);
    // eventButton.addClass("btn btn-primary front");
    // eventButton.text("See More");
    // cardBody.appendTo(eventCard);
    // eventTitle.prependTo(cardBody);
    // eventDate.appendTo(cardBody);
    // eventButton.appendTo(cardBody);
    // eventCard.prependTo($(".item-" + gridLocation));

    
    
}

$("#card").flip();
$(document).on("click", "#card", function (){
  $("#card").flip();
  console.log("flip")
})




});









