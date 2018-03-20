$(document).ready(function() {
    
    var provider = new firebase.auth.GoogleAuthProvider();
    var database = firebase.database();

    firebase.auth().onAuthStateChanged(function(user) {
        window.user = user; // user is undefined if no user signed in
        console.log(user);
        if (user) {
            $("#book-input").val(localStorage.getItem("searchterm"));
            $("#signIn").hide();
            $("#signOut").show();
            $("#userName").text(user.displayName + " (My Account)");
            $("#userEmail").text(user.email);
        } else {
            $("#signIn").show();
            $("#signOut").hide();
            $("#userName, #userEmail").empty();
        }
    });

    function googleSignin() {
        firebase.auth()

            .signInWithRedirect(provider).then(function(result) {
                var token = result.credential.accessToken;
                var user = result.user;

                console.log(token)
                console.log(user)
            }).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;

                console.log(error.code)
                console.log(error.message)
            });
    }

    // firebase.auth().signInWithRedirect(provider);

    function googleSignout() {
        firebase.auth().signOut()

            .then(function() {
                console.log('Signout Successful')
            }, function(error) {
                console.log('Signout Failed')
            });
    }

    $("#signIn").on("click", function() {
        googleSignin();
        localStorage.removeItem("searchterm");
    });

    $("#signOut").on("click", function() {
        localStorage.removeItem("searchterm");
        googleSignout();
    });

    $("#search-form").on("submit", function(e) {

        e.preventDefault();

        $("#books").empty();

        book = $("#book-input").val().trim().toLowerCase();

        //database.ref("users/").push(newTrain);

        if (user) {

        var uid = firebase.auth().currentUser.uid;
        database.ref().child('users/').child(uid).update({
            name: user.displayName,
            email: user.email
        });
        database.ref().child('users/').child(uid).child('books/').push(book);
}


        var queryURL = "http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=Alexande-BookEnds-PRD-9f1a91299-b1690a3c&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&paginationInput.entriesPerPage=12&categoryID=267&currencyID=USD&keywords=book%" + book;
        $.ajax({
            dataType: "jsonp",
            method: "GET",
            url: queryURL,
        }).then(function(response) {

            var results = response.findItemsByKeywordsResponse[0].searchResult[0].item;
            console.log(results);

            for (var i = 0; i < results.length; i++) {

                var cardTitle = $("<h5 class='card-title'>").text(results[i].title);
                console.log(results[i].title);
                var bookImage = $("<img class='card-img-top'>").attr("src", results[i].galleryURL);
                var imageHolder = $("<div class='image-holder'>");
                imageHolder.append(bookImage);
                console.log(results[i].galleryURL);
                var bookLink = $("<a target='_blank' class='btn btn-primary'>").attr("href", results[i].viewItemURL).text("Buy It!");
                console.log(cardTitle.text());
                console.log(results[i].viewItemURL);
                var currency = results[i].sellingStatus[0].currentPrice[0]["__value__"]
                currency = parseFloat(currency).toFixed(2);
                console.log(currency);
                var bookPrice = $("<p class='card-text'>").text("$" + currency);
                console.log(results[i].sellingStatus[0].currentPrice[0]);
                var cardBody = $("<div class='card-body'>").append(cardTitle, bookPrice, bookLink);
                var card = $("<div class='card ebay-card'>").append(imageHolder, cardBody);
                $("#books").append(card);

            }

        });
        localStorage.removeItem("searchterm");
        $("#book-input").val("");

    });

});