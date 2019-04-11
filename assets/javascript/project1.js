

$(document).ready(function () {

    $(document).on("click", "#searchButton", function(){
        var search = $("#searchField").val()
        apiTM(search);
    });









function apiTM(eventSearch) {
    console.log(eventSearch)
    const apiKey = "apikey=rrFQUi7azSu6BIs8pNUwk9tDZHSTv8YY"
    const apiTM = "https://app.ticketmaster.com/discovery/v2/"
    let query = apiTM + "attractions.json?" + apiKey
    console.log(query);
    $.ajax({
        url: query,
        method: "GET"
    }).then(function (response) {
        for (i = 0; i < 10; i++) {
            console.log("success")
            console.log(response[i])
            $("$results").text(response)
        }
    })
};







});