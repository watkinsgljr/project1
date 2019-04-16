$(document).ready(function () {

    $(document).on("click", "#searchButton", function () {
        var search = $("#searchField").val()
        apiEvents(search);
    });

    // $("#searchField").keyup(function (event) {
    //     if (event.keyCode === 13) {
    //         var search = $("#searchField").val();
    //         event.preventDefault();
    //         search = "";
    //     }
    // });

    // ticketmaster API - this function also sends the venue 'name' to the googleId function, and that function passes the place_id to the googlePlace function, which returns detailed info about the venue

    function apiEvents(eventSearch) {
        console.log(eventSearch)
        const apiKey = "apikey=rrFQUi7azSu6BIs8pNUwk9tDZHSTv8YY&"
        const apiTM = "https://app.ticketmaster.com/discovery/v2/"
        let keyword = "keyword=" + $("#searchField").val() + "&";
        let zip = "city=" + $("#city").val();
        $('input[type=checkbox]').each(function () {
            // below section is if we want to include checkboxes
            if (this.checked) {
                // console.log($(this).val()); 
            }
        });
        if ($("#searchField").val() !== ""){
            let query = apiTM + "events.json?" + apiKey + keyword + zip
            api(query);
            // console.log("keyword");
            // console.log(query);
        }else{
            let query = apiTM + "events.json?" + apiKey + zip
            api(query)
            // console.log("no keyword");
            // console.log(query);
        }

    }
        function api(query){
        $.ajax({
            url: query,
            method: "GET"
        }).then(function (response) {
            for (i = 0; i < 1; i++) {
                // console.log("eventSearch")
                console.log(response._embedded.events[i])
                let result = {
                    name : response._embedded.events[i].name,
                    date : response._embedded.events[i].dates.start.localDate,
                    time : response._embedded.events[i].dates.start.localTime,
                    image: response._embedded.events[i].images[8].url,
                    venue: response._embedded.events[i]._embedded.venues[0].name,
                    lat: response._embedded.events[i]._embedded.venues[0].location.latitude,
                    long: response._embedded.events[i]._embedded.venues[0].location.longitude,
                    tickets: response._embedded.events[i].url
                }
            googleId(result.venue);
            googlePark(result.venue); // this is the parking map function
                $("#results").append(result.name + " " + result.venue + " " + result.date + " " + result.time + " " + result.tickets + "<img src='" + result.image + "' height='200' /></br>")
            }
        });
    };

    // function to get place id from google api

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
        console.log(answer.candidates[0].place_id)
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
        // console.log(answer)
        // https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=LAT,LONG&radius=500&types=parking&sensor=false&key=APIKEY
        $("#map").html("<iframe width='450' height='250' frameborder='0' style='border:0' src='https://www.google.com/maps/embed/v1/place?" + googleKey + "&q=place_id:" + venue + "'></iframe>")

    })
};

function googlePark(venue){
    const googleKey = "key=AIzaSyAyJOOjrQqnT_rnAVL9Isx0SlP09SOvh5o";
    const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
    const TARGET_URL = 'https://www.google.com/maps/embed/v1/search?q=parking+near+'
    const URL = PROXY_URL + TARGET_URL + venue + "&" + googleKey
    // cors solution = https://stackoverflow.com/questions/45185061/google-places-api-cors
    $.ajax({
        url: URL,
        method: "GET",
    }).then(function (parking){
        console.log(parking)
        console.log(TARGET_URL)
        $("#parking").html("<iframe width='450' height='250' frameborder='0' style='border:0' src='" + TARGET_URL + venue + "&" + googleKey + "'></iframe>")

    })

}




});







