(function() {

    $(document).ready(function() {

        // declare variables for Firebase functions
        var provider = new firebase.auth.GoogleAuthProvider();
        var database = firebase.database();

        // check for state change for sign in
        firebase.auth().onAuthStateChanged(function(user) {
            window.user = user; // user is undefined if no user signed in

            // if user is signed in
            if (user) {

                // empty local storage value if coming from account redirect
                $("#book-input").val(localStorage.getItem("searchterm"));
                // display user info
                $("#signIn").hide();
                $("#signOut").show();
                $("#userName").text(user.displayName + " (My Account)");
                $("#userEmail").text(user.email);
            } else {
                // change to default display if no user
                $("#signIn").show();
                $("#signOut").hide();
                $("#userName, #userEmail").empty();
            }
        });

        // Google sign in function
        function googleSignin() {
            firebase.auth()

                .signInWithRedirect(provider).then(function(result) {
                    var token = result.credential.accessToken;
                    var user = result.user;

                    console.log(token);
                    console.log(user);
                }).catch(function(error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;

                    console.log(error.code);
                    console.log(error.message);
                });
        }

        // Google sign out function
        function googleSignout() {
            firebase.auth().signOut()

                .then(function() {
                    console.log('Signout Successful');
                }, function(error) {
                    console.log('Signout Failed');
                });
        }

        // click event for Google sign in. Also clears local storage so user doesn't see previous data from account redirect
        $("#signIn").on("click", function() {
            googleSignin();
            localStorage.removeItem("searchterm");
        });

        // click event for Google sign out. Also clears local storage so next user doesn't see previous data from account redirect
        $("#signOut").on("click", function() {
            localStorage.removeItem("searchterm");
            googleSignout();
        });

        // user input submit event for book search
        $("#search-form").on("submit", function(e) {

            // stop the form submit
            e.preventDefault();

            // empty any previous search results
            $("#googleDisplay, #books").empty();

            // assign user input to variable
            book = $("#book-input").val().trim().toLowerCase();

            // if a user is logged in, add their user information to Firebase and push each search term into the child node 'books'
            if (user) {

                var uid = firebase.auth().currentUser.uid;
                database.ref().child('users/').child(uid).update({
                    name: user.displayName,
                    email: user.email
                });
                database.ref().child('users/').child(uid).child('books/').push(book);
            }

            // API CALLS

            // Google Books API Call

            // set query url with inserted user input
            var queryURLGoogle = "https://www.googleapis.com/books/v1/volumes?q=" + book +
                "&maxResults=1&key=AIzaSyCQStCvIKDiy83OxGJgzbvRlWJ3kyrVJyo"

            // ajax call using get and jsonp
            $.ajax({
                url: queryURLGoogle,
                method: "GET",
                dataType: "jsonp"
            }).then(function(response) {
                console.log(response);

                // if we get a response, assign variables and create Google results card. Append it to the Google display
                if (response.items) {

                    var data = response.items[0].volumeInfo;
                    var googleImage;

                    // if Google result has an image, use it
                    if (data.imageLinks) {
                        var googleImageUrl = data.imageLinks.thumbnail;
                        googleImageUrl = googleImageUrl.replace("http://", "https://");
                        googleImage = $("<img class='card-img-top'>").attr("src", googleImageUrl);
                    } else {

                        // otherwise, use 'no image available'
                        googleImage = $("<img class='card-img-top'>").attr("src", "assets/images/no_image.png");
                    }
                    var googleHolder = $("<div class='image-holder'>");
                    googleHolder.append(googleImage);
                    var googleTitle = $("<h3 class='card-title'>").text(data.title);
                    var googleAuthors = $("<h5 class='card-title'>").text(data.authors);
                    var googleDate = $("<p>").text("Published: " + data.publishedDate);
                    var googleISBN = $("<p>").text("ISBN: " + data.industryIdentifiers[0].identifier);
                    var googleCat = $("<p>").text(data.categories);
                    var googleUrl = data.infoLink;
                    googleUrl = googleUrl.replace("http://", "https://");
                    var googleLink = $("<a target='_blank' class='btn btn-primary'>").attr("href", googleUrl).text("Go To Google");
                    var descriptor = $("<p class='descriptor' data-text-swap='Description -' data-text-original='Description +'>").text("Description +");
                    var googleDesc = $("<p class='google-desc'>").text(data.description);
                    var googleBody = $("<div class='card-body google-body'>").append(googleTitle, googleAuthors, googleDate, googleISBN, googleCat, descriptor, googleDesc, googleLink);
                    var googleCard = $("<div class='card google-card'>").append(googleHolder, googleBody);
                    $("#googleDisplay").append(googleCard);
                } else {

                    // if no results, create an error card and instruct user to try another search
                    var googleError = $("<p>").html("You searched for '" + book + "'.<br>No Google results found. Please try searching again.");
                    var errorCard = $("<div class='card error-card'>").append(googleError);
                    $("#googleDisplay").append(errorCard);
                }
            });

            // eBay API call

            // set query url with inserted user input
            var queryURLEbay = "https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=Alexande-BookEnds-PRD-9f1a91299-b1690a3c&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&paginationInput.entriesPerPage=12&categoryID=267&currencyID=USD&keywords=book%" + book;

            // ajax call using get and jsonp
            $.ajax({
                dataType: "jsonp",
                method: "GET",
                url: queryURLEbay,
            }).then(function(response) {

                // set variable for returned object
                var results = response.findItemsByKeywordsResponse[0].searchResult[0].item;

                // if we get a response, loop through them and create up to 12 eBay results cards. Append them to the eBay display
                if (results) {

                    for (var i = 0; i < results.length; i++) {

                        var cardTitle = $("<h5 class='card-title'>").text(results[i].title);
                        var bookImage;

                        // if eBay result has an image, use it
                        if (results[i].galleryURL) {
                            var url = results[i].galleryURL[0];
                            url = url.replace("http://", "https://");
                            bookImage = $("<img class='card-img-top'>").attr("src", url);
                        } else {

                            // otherwise, use 'no image available'
                            bookImage = $("<img class='card-img-top'>").attr("src", "assets/images/no_image.png");
                        }
                        var imageHolder = $("<div class='image-holder'>");
                        imageHolder.append(bookImage);
                        var linkUrl = results[i].viewItemURL[0];
                        linkUrl = linkUrl.replace("http://", "https://");
                        var bookLink = $("<a target='_blank' class='btn btn-primary'>").attr("href", linkUrl).text("Buy It!");
                        var currency = results[i].sellingStatus[0].currentPrice[0]["__value__"];

                        // currency conversion
                        currency = parseFloat(currency).toFixed(2);
                        var bookPrice = $("<p class='card-text'>").text("$" + currency);
                        var cardBody = $("<div class='card-body'>").append(cardTitle, bookPrice, bookLink);
                        var card = $("<div class='card ebay-card'>").append(imageHolder, cardBody);
                        $("#books").append(card);
                    }
                } else {

                    // if no results, create an error card and instruct user to search on eBay
                    var ebayError = $("<p>").html("You searched for '" + book + "'.<br>No buying results found. Try searching on <a href='https://www.ebay.com' target='_blank'>eBay</a> instead.");
                    var errorCard = $("<div class='card error-card'>").append(ebayError);
                    $("#books").append(errorCard);
                }
            });

            // remove data from local storage (in the case of redirect) and clear input after each new search
            localStorage.removeItem("searchterm");
            $("#book-input").val("");
        });

        // click function for Google description toggle
        $(document).on("click", ".descriptor", function() {

            // expand or collapse this panel
            $(".google-desc").slideToggle("slow");

            // swap out text
            var el = $(this);
            el.text() === el.data("text-swap") ?
                el.text(el.data("text-original")) :
                el.text(el.data("text-swap"));
        });

        // click function for app description toggle
        $("#about-click").on("click", function() {

            // expand or collapse this panel
            $("#about").slideToggle("slow");

            // swap out text
            var el = $(this);
            el.text() === el.data("text-swap") ?
                el.text(el.data("text-original")) :
                el.text(el.data("text-swap"));
        });

    });

})();