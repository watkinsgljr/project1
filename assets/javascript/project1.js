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



    function apiEvents(eventSearch) {
        console.log(eventSearch)
        const apiKey = "apikey=rrFQUi7azSu6BIs8pNUwk9tDZHSTv8YY&"
        const apiTM = "https://app.ticketmaster.com/discovery/v2/"
        let keyword = "keyword=" + $("#searchField").val() + "&";
        let zip = "city=" + $("#city").val();
        $('input[type=checkbox]').each(function () {
            if (this.checked) {
                console.log($(this).val()); 
            }
        });
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
            for (i = 0; i < 1; i++) {
                console.log("eventSearch")
                console.log(response._embedded.events[i])
                let result = {
                    name : response._embedded.events[i].name,
                    date : response._embedded.events[i].dates.start.localDate,
                    time : response._embedded.events[i].dates.start.localTime,
                    image: response._embedded.events[i].images[8].url,
                    venue: response._embedded.events[i]._embedded.venues[0].name
                
                }
            googleApi(result.venue);
                $("#results").append(result.name + " " + result.venue + " " + result.date + " " + result.time + " " + "<img src='" + result.image + "' height='200' /></br>")
            }
        });
    };

function googleApi(venue){
    const googleKey = "key=AIzaSyAyJOOjrQqnT_rnAVL9Isx0SlP09SOvh5o";
    let query = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?&inputtype=textquery&input=" + venue + "&" + googleKey + "&fields=place_id"
    $.ajax({
        url: query,
        method: "GET",
    }).then(function (answer){
        console.log(answer)
    })


}

});







