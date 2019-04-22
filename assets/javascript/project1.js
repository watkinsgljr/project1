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

  let eventDetails = [];
  let eventKey;


  //-------------------------------------------------DATA TABLE LOGIC------------------------------------------------
  const database = firebase.database();
  var data = [];

  table = $('#event-table').DataTable({
    data: data,

    columns: [{ title: "Event" },
    { title: "Name" },
    { title: "Location" },
    { title: "Date" }]
  });



  //-------------------------------------------------CREATE DATA TABLE BASED ON USER SEARCH-------------------------------

  $("#see-more").on("click", function showTable() {
    event.preventDefault();
    $("#event-table-div").show();
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
    apiEvents(search);
  });



  function apiEvents(eventSearch) {
    console.log(eventSearch)
    const apiKey = "apikey=rrFQUi7azSu6BIs8pNUwk9tDZHSTv8YY&"
    const apiTM = "https://app.ticketmaster.com/discovery/v2/"
    let keyword = "keyword=" + $("#keyword-search").val() + "&";
    let city = "city=" + $("#city-search").val() + "&";
    let size = "size=6";
    let query = apiTM + "events.json?" + apiKey;
    if ($("#city-search").val().length > 0) {
      query += city;

      if ($("#keyword-search").val().length > 0)
        query += keyword;

    } else {
      alert("Please tell us your search conditions.");
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
      for (i = 0; i < response._embedded.events.length; i++) {
        console.log("eventSearch")
        console.log(response._embedded.events[i])
        let result = {
          id: response._embedded.events[i].id,
          name: response._embedded.events[i].name,
          date: response._embedded.events[i].dates.start.localDate,
          time: response._embedded.events[i].dates.start.localTime,
          image: response._embedded.events[i].images[8].url,
          venue: response._embedded.events[i]._embedded.venues[0].name
        }
        searchResults.push(result);
        let image = "<img id=\"data-image\" src=\"" + result.image + "\">";
        eventQueryResults = [image, result.name, result.venue, result.date, result.id];
        data.push(eventQueryResults);
        let table = $("#event-table").DataTable();
        table.row.add(eventQueryResults).draw();
        createEventCards(result, i);
      }
    });
  };

  //------------------------------------------------------------------------GOOGLE APIS--------------------------------------------------------------

  function googleId(id) {
    const googleKey = "key=AIzaSyAyJOOjrQqnT_rnAVL9Isx0SlP09SOvh5o";
    const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
    const TARGET_URL = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?&inputtype=textquery&input=' + id + "&" + googleKey + "&fields=place_id"
    const URL = PROXY_URL + TARGET_URL
    // cors solution = https://stackoverflow.com/questions/45185061/google-places-api-cors
    $.ajax({
      url: URL,
      method: "GET",
    }).then(function (answer) {
      googlePlace(answer.candidates[0].place_id)
    })
  };

  // function to gain detailed data using place_id

  function googlePlace(venue) {
    const googleKey = "key=AIzaSyAyJOOjrQqnT_rnAVL9Isx0SlP09SOvh5o";
    const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
    // edit the fields of the below target URL to change the data we are getting back
    const TARGET_URL = 'https://maps.googleapis.com/maps/api/place/details/json?&placeid=' + venue + "&" + googleKey + "&fields=url"
    const URL = PROXY_URL + TARGET_URL
    $.ajax({
      url: URL,
      method: "GET",
    }).then(function (answer) {
      $(".item-11").html("<iframe width='100%' height='250' frameborder='0' style='border:0' src='https://www.google.com/maps/embed/v1/place?" + googleKey + "&q=place_id:" + venue + "'></iframe>")

    })
  };

  function googlePark(venue) {
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
      success: function () {
        var map = "<iframe width='450' height='250' frameborder='0' style='border:0' src='" + TARGET_URL + venue + "&" + googleKey + "'></iframe>"
        map2 = map;
      }
    })
    mappingData(map2)



    // .then (function (map){
    //     // console.log(parking)
    //     // console.log(TARGET_URL)
    //     var map ="<iframe width='450' height='250' frameborder='0' style='border:0' src='" + TARGET_URL + venue + "&" + googleKey + "'></iframe>"
    //     return map;
    // })

  }

  function mappingData(mapData) {
    parkingData = mapData
  };






  //-------------------------------------------------CREATE EVENT CARDS BASED ON USER SEARCH-------------------------------

  let queryResultsArray = [];

  let eventCard;
  let cardImage;
  let cardBody;
  let eventTitle;
  let eventDate;
  let eventButton;
  let gridLocation;


  function createEventCards(result, index) {
    $(".grid-container").css("height", "110vh");
    if (index < 6) {
      $('#city-search').val("")
      $('#keyword-search').val("")
      $("#date-search").val("");
      gridLocation = index + 1;

      // ------ELEMENTS GENERATED AND ASSIGNED VARIABLE-----------
      eventCard = $("<div>");
      eventCardBack = $("<div>");
      cardImage = $("<img>");
      cardBody = $("<div>");
      eventTitle = $("<a>");
      let eventTitleText;
      eventDate = $("<p>");
      eventButton = $("<a>");
      let eventURL;
      // EVENT CARD---------------------------------------------------
      eventCard.addClass("card event-card front");
      eventCardBack.addClass("card event-card back card-back");
      eventCardBack.text("card event-card back");
      eventCardBack.attr("autoSize", "false");
      eventCardBack.attr("forceWidth", "true");
      eventCardBack.attr("forceHeight", "true");

      //EVENT IMAGE---------------------------------------------------
      cardImage.addClass("card-img-top");
      cardImage.attr("alt", "card image cap");
      cardImage.attr("src", result.image);
      cardImage.prependTo(eventCard);
      //CARD BODY ELEMENTS--------------------------------------------
      cardBody.addClass("card-body2");
      eventTitle.addClass("card-title");
      eventTitle.text(result.name)
      eventDate.addClass("card-text");
      eventDate.text(result.date);
      eventButton.addClass("btn btn-primary event-card-btn");
      eventButton.val(result.id)
      eventButton.text("See Details");
      cardBody.appendTo(eventCard);
      eventTitle.prependTo(cardBody);
      eventDate.appendTo(cardBody);
      eventButton.appendTo(cardBody);
      eventCard.appendTo($(".item-" + gridLocation));
      eventCardBack.appendTo($(".item-" + gridLocation));
      $(".item-" + gridLocation).flip();
    };
  }

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
    let buttonValue = $(this)[0].value;
    eventDetails = $.grep(searchResults, function (events) {
      return events.id == buttonValue;
    });
    console.log(eventDetails);
    console.log(eventButton.val());

    $(".item-7").text(eventDetails[0].name);
    $(".event-page-date").text("Join us on " + eventDetails[0].date);
    $(".event-page-time").text("At " + eventDetails[0].time);
    $("#comment-btn").val(eventButton.val());
    eventKey = $("#comment-btn").val();
    console.log($("#comment-btn").val());
    $(".event-page-image").css({ "background-image": "url(" + eventDetails[0].image + ")", "background-size": "75% 75%", "margin": "auto", "background-position": "center" });
    loadComments(eventKey);
    // googleId(venueQuery);
  });

  $(document).on("click", "#back-to-search-results-btn", function () {
    event.preventDefault();
    $("#event-page-main-container").toggle();
    $("#main-container").toggle();


  })

 //-------------------------------------------------CHECK FOR COMMENTS DATABASE---------------------------

  function loadComments(eKey) {

    database.ref("/commentsRef").once("value").then(function (snapshot) {
      console.log(snapshot.val());
      snapshotValue = snapshot.val();
      snapshotValueArray = Object.values(snapshotValue);
      console.log(snapshotValueArray);

      let commentIdMatch = $.grep(snapshotValueArray, function (comment) {
        return comment.eventId == eKey;
      });
      console.log(commentIdMatch);
      if (commentIdMatch.length > 0) {
        commentIdMatch.commentsRef.appendTo($("#comment-text-area"))
      }
    });
  }

  //-------------------------------------------------FLIP CARD CLICK EVENT------------------------------------

  $(document).on("click", $(".item-" + gridLocation), function () {
    $(this).flip();
  })

  //-------------------------------------------------COMMENTS SECTION LOGIC------------------------------------

  $("#comment-btn").on("click", function (event) {
    event.preventDefault();
    $("#comment-text-area").text(" ");

    let commentField = $('#comment-text-area').val();

    database.ref("commentsRef").once("value").then(function (snapshot) {
      console.log(snapshot);
    })


    database.ref("/eventsRef").push().set({
      eventId: eventKey,
      eventDetails: eventDetails[0]
    });

    database.ref("commentsRef").child.push().set({
      eventId: eventKey,
      name: "Greg",
      message: commentField
    });
  });




  //-------------CHAT EVENT LISTENER---------------


  database.ref("/commentsRef").on('child_added', function (snapshot) {


    var message = snapshot.val();
    addComment(message.name, message.message);
  });

  function addComment(name, message) {
    comment = name + ": " + message;
    $("comment-div").prepend(comment);
  }














});







