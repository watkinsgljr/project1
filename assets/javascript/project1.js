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
                // console.log(result.name, result.date, result.time)
                $("#results").append(result.name + " " + result.venue + " " + result.date + " " + result.time + " " + "<img src='" + result.image + "' height='200' /></br>")
            }
        });
    };


    // function apiVenue(){
    //     console.log(eventSearch)
    //     const apiKey = "apikey=rrFQUi7azSu6BIs8pNUwk9tDZHSTv8YY&"
    //     const apiTM = "https://app.ticketmaster.com/discovery/v2/"
    //     let keyword = "keyword=Aerosmith"
    //     let query = apiTM + "events.json?" + apiKey
    //     console.log(query);
    //     $.ajax({
    //         url: query,
    //         method: "GET"
    //     }).then(function (response) {
    //         for (i = 0; i < 10; i++) {
    //             console.log("eventSearch")
    //             console.log(response._embedded.events[i].classifications[0].genre.name)
    //             console.log(response._embedded.events[i])
    //             $("#results").append(response._embedded.events[i].name + " " + response._embedded.events[i].dates.start.localDate + " " + response._embedded.events[i].dates.start.localTime + "</br>")
    //         }
    //     });
    // };

    // }


    // function apiClass(classSearch) {
    //     console.log(classSearch)
    //     const apiKey = "apikey=rrFQUi7azSu6BIs8pNUwk9tDZHSTv8YY"
    //     const apiTM = "https://app.ticketmaster.com/discovery/v2/"
    //     let query = apiTM + "classifications.json?" + apiKey
    //     console.log(query);
    //     $.ajax({
    //         url: query,
    //         method: "GET"
    //     }).then(function (response) {
    //         for (i = 0; i < 10; i++) {
    //             console.log("classSearch");
    //             console.log(response);
    //             console.log(response._embedded.classifications[i]);
    //             $("$results").text(response);
    //         };
    //     });

    // };

});







