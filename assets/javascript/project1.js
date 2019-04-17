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
    for (i = 0; i < 100; i++);
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
    apiEvents(search);
  });





  function apiEvents(eventSearch) {
    console.log(eventSearch)
    const apiKey = "apikey=rrFQUi7azSu6BIs8pNUwk9tDZHSTv8YY&"
    const apiTM = "https://app.ticketmaster.com/discovery/v2/"
    let keyword = "keyword=" + $("#keyword-search").val() + "&";
    let city = "city=" + $("#city-search").val() + "&";
    let size = "size=6";
    if ($("#city-search").val() !== "") {
      let query = apiTM + "events.json?" + apiKey + keyword + city;
      api(query);
      console.log("keyword");
      console.log(query);
    } else {
      let query = apiTM + "events.json?" + apiKey + city;
      api(query)
      console.log("no keyword");
      console.log(query);
    }

  }
  function api(query) {
    $.ajax({
      url: query,
      method: "GET"
    }).then(function (response) {
      console.log(response);
      for (i = 0; i < 6; i++) {
        console.log("eventSearch")
        console.log(response._embedded.events[i])
        let result = {
          name: response._embedded.events[i].name,
          date: response._embedded.events[i].dates.start.localDate,
          time: response._embedded.events[i].dates.start.localTime,
          image: response._embedded.events[i].images[8].url,
          venue: response._embedded.events[i]._embedded.venues[0].name

        }
        createEventCards(result, i);
        
      }
    });
  };




  //-------------------------------------------------CREATE EVENT CARDS BASED ON USER SEARCH-------------------------------

  let queryResultsArray = [];


  function createEventCards(result, index) {
    $('#city-search').val("")
    $('#keyword-search').val("")
    $("#date-search").val("");
    gridLocation = index + 1;

    // ------ELEMENTS GENERATED AND ASSIGNED VARIABLE-----------
    let eventCard = $("<div>");
    let cardImage = $("<img>");
    let cardBody = $("<div>");
    let eventTitle = $("<a>");
    let eventTitleText;
    let eventDate = $("<p>");
    let eventButton = $("<a>");
    let eventURL;
    // EVENT CARD---------------------------------------------------
    eventCard.addClass("card");

    //EVENT IMAGE---------------------------------------------------
    cardImage.addClass("card-img-top");
    cardImage.attr("alt", "card image cap");
    cardImage.attr("src", result.image);
    cardImage.prependTo(eventCard);
    //CARD BODY ELEMENTS--------------------------------------------
    cardBody.addClass("card-body");
    eventTitle.addClass("card-title");
    eventTitle.text(result.name)
    eventDate.addClass("card-text");
    eventDate.text(result.date);
    eventButton.addClass("btn btn-primary");
    eventButton.text("See More");
    cardBody.appendTo(eventCard);
    eventTitle.prependTo(cardBody);
    eventDate.appendTo(cardBody);
    eventButton.appendTo(cardBody);
    eventCard.prependTo($(".item-" + gridLocation))
  }


});









