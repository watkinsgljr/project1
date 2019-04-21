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

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = "localStartDateTime=" + yyyy + '-' + mm + '-' + dd + "T00:00:00,*&sort=date,asc&";

console.log(today)

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
    { title: "Date" }]
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

  // $(document).ready(function () {
  //   var date_input = $('#date-search'); //our date input has the name "date"
  //   var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
  //   var options = {
  //       format: 'mm/dd/yyyy',
  //       container: container,
  //       todayHighlight: true,
  //       autoclose: true,
  //   };
  //   date_input.datepicker(options);
  // }); 


  //----------------------------------------------------SEARCH BUTTON CLICK EVENT--------------------------------------------------------------
  let searchResults = [];
  let eventQueryResults = [];

  $(document).on("click", "#search-button", function () {
    event.preventDefault();
    table.clear();
    clearEventCards();

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
    var date = $("#date-search").val()
    var dateSearch = "localStartDateTime=" + moment(date).format("YYYY-MM-DDTHH:mm:ss") + ",*&sort=date,asc&"
    let query = apiTM + "events.json?" + apiKey;
    if ($("#city-search").val().length > 0) {
      query += city;

      if ($("#keyword-search").val().length > 0)
        query += keyword;

      if ($("#date-search").val() > 0)
      query += dateSearch;
      console.log(dateSearch)

    } else {
      // alert("Please tell us your search conditions.");
    }
    console.log(query);
    api(query);

  }

  function api(query) {
    $.ajax({
      url: query,
      method: "GET"
    }).then(function (response) {
      console.log(response);
      console.log(response._embedded);
      for (i = 0; i < 6; i++) {
        console.log("eventSearch")
        console.log(response._embedded.events[i])
        let result = {
          id: response._embedded.events[i].id,
          name: response._embedded.events[i].name,
          date: response._embedded.events[i].dates.start.localDate,
          time: response._embedded.events[i].dates.start.localTime,
          image: response._embedded.events[i].images[8].url,
          venue: response._embedded.events[i]._embedded.venues[0].name,
          // seatMap: response._embedded.events[i].seatmap.staticUrl,
          tickets: response._embedded.events[i].url
        }
        // console.log(response._embedded.events[i].seatmap.staticUrl)
        searchResults.push(result);
        let image = "<img id=\"data-image\" src=\"" + result.image + "\">";
        eventQueryResults = [image, result.name, result.venue, result.date, result.id];
        data.push(eventQueryResults);
        let table = $("#event-table").DataTable();
        table.row.add(eventQueryResults).draw();
        //   venue: response._embedded.events[i]._embedded.venues[0].name,
        //   tickets: response._embedded.events[i].url

        // }
        console.log(result)
        // googleId(result.venue);
        // this is the parking map function
        // googlePark(result.venue); 
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



function createEventCards(result, index) {
    $('#city-search').val("")
    $('#keyword-search').val("")
    $("#date-search").val("");
    gridLocation = index + 1;
    let eventCard = "<div id='card-" + gridLocation + "' class='item item-" + gridLocation + "' >"
    let eventImg = "<img class='front' id='eventImg' src='" + result.image + "' />"
    // let cardFront = "<p class='front card-body'>Test</p>"
    let cardData = "<div class='front text-center'>" + result.name + "</br>" + result.date + "</br>" + result.time + "</div>"
    let cardMap = "<div class='back'>" + parkingData + "</div>"
    let ticketUrl = "<a class='back' target='_blank' href='" + result.tickets + "'> Purchase tickets</a>"
    let seatMap = "<div><img  class='back' width='450' height='300' src=" + result.seatMap + "></img></div>"
    let button = "<button type=button class='back text-center btn-primary event-card-btn'>More Info</button>"
    // let cardComplete = eventCard + eventImg  + cardFront + cardMap + "</br>" + cardData + "</br>" + result.date + "</div>"
    let cardComplete = cardData  + button + "</div>"  + "</div>"
    console.log(cardComplete)
    $(".item-" + gridLocation).prepend(eventCard + eventImg + ticketUrl);

    $("#data-" + gridLocation).append(cardComplete);
    $("#card-" + gridLocation).flip();

    // card flip libray @: https://nnattawat.github.io/flip/
    

    
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

// $("#card").flip();
$(document).on("click", "#card-1", function (){
  $("#card-1").flip();
  console.log("flip")
})

$(document).on("click", "#card-2", function (){
  $("#card-2").flip();
  console.log("flip")
})
$(document).on("click", "#card-3", function (){
  $("#card-3").flip();
  console.log("flip")
})
$(document).on("click", "#card-4", function (){
  $("#card-4").flip();
  console.log("flip")
})
$(document).on("click", "#card-5", function (){
  $("#card-5").flip();
  console.log("flip")
})
$(document).on("click", "#card-6", function (){
  $("#card-6").flip();
  console.log("flip")
})


  function clearEventCards() {
    eventCard = "";
    cardImage = "";
    cardBody = "";
    eventTitle = "";
    eventDate = "";
    eventButton = "";
    console.log("events cleared")
  };


  //-------------------------------------------------EVENT CARD BUTTON---------------------------


  $(document).on("click", ".event-card-btn", function () {
    console.log($(this));   
    $("#event-page-main-container").show();
    $("#main-container").hide();
    let buttonValue = $(this)[0].value
    let eventDetails = $.grep(searchResults, function(events) {
      return events.id == buttonValue;  
    });
    console.log(eventDetails);
    console.log(eventButton.val());

    $(".item-7").text(eventDetails[0].name);
    $(".event-page-date").text("Join us on " + eventDetails[0].date);
    $(".event-page-time").text("At " + eventDetails[0].time);

  });

  $(document).on("click", "#back-to-search-results-btn", function() {
    event.preventDefault();
    $("#event-page-main-container").toggle();
    $("#main-container").toggle();


  })














});







