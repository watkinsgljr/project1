$(document).ready(function () {

    $(document).on("click", "#searchButton", function () {
        var search = $("#searchField").val()
        apiEvents(search);
        // apiClass(search);
    });


    var userInfo = {
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        zip: $("#zipCode").val()
    }

    var queryOptions = {
        zip: $("#zipCode").val(),
        startDate: $("#startDate").val(),
        event: $("#eventType").val(),
        class: $("#classType").val(),
    }






    function apiEvents(eventSearch) {
        console.log(eventSearch)
        const apiKey = "apikey=rrFQUi7azSu6BIs8pNUwk9tDZHSTv8YY&"
        const apiTM = "https://app.ticketmaster.com/discovery/v2/"
        let keyword = "keyword=Aerosmith"
        let query = apiTM + "events.json?" + apiKey + keyword
        console.log(query);
        $.ajax({
            url: query,
            method: "GET"
        }).then(function (response) {
            for (i = 0; i < 10; i++) {
                console.log("eventSearch")
                console.log(response._embedded.events[i])
                $("$results").text(response)
            }
        });
    };


    function apiClass(classSearch) {
        console.log(classSearch)
        const apiKey = "apikey=rrFQUi7azSu6BIs8pNUwk9tDZHSTv8YY"
        const apiTM = "https://app.ticketmaster.com/discovery/v2/"
        let query = apiTM + "classifications.json?" + apiKey
        console.log(query);
        $.ajax({
            url: query,
            method: "GET"
        }).then(function (response) {
            for (i = 0; i < 10; i++) {
                console.log("classSearch");
                console.log(response);
                console.log(response._embedded.classifications[i]);
                $("$results").text(response);
            };
        });

    };

});







