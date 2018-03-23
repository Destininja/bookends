(function() {

    $(document).ready(function() {

        // declare variables for Firebase functions
        var provider = new firebase.auth.GoogleAuthProvider();
        var database = firebase.database();
        var uid;

        // function to render search history
        function priorSearches() {

            // get current user's Google id
            uid = firebase.auth().currentUser.uid;

            // get search history from Firebase and create cards
            database.ref().child('users/').child(uid).child('books/')
                .on("value", function(userSnapshot) {
                    $("#sortable").empty();
                    userSnapshot.forEach(function(snapshot) {

                        // store the snapshot.val() in a variable for convenience
                        var sv = snapshot.val();

                        // store the snapshot key in a variable for remove button
                        var key = snapshot.key;

                        var cardTitle = $("<h5 class='card-title capitalize'>").text(sv);
                        var bookLink = $("<a target='_blank' class='btn btn-primary bookSearch'>").attr("href", "index.html").text("Search again");
                        bookLink.attr("data-id", sv);
                        var remove = $("<button type='submit' class='remove btn btn-primary btn-sm'><i class='fa fa-trash'></i></button>").attr("data-key", key);
                        var cardBody = $("<div class='card-body search-card-body'>").append(cardTitle, bookLink, remove);
                        var card = $("<div class='card search-card ui-state-default'>").html("<span class='ui-icon ui-icon-arrowthick-2-e-w'></span><span class='ui-icon ui-icon-arrowthick-2-n-s'></span>").append(cardBody);
                        $("#sortable").append(card);
                    });

                    // Handle the errors
                }, function(errorObject) {
                    console.log("Errors handled: " + errorObject.code);
                });
        }

        // check for state change for sign in
        firebase.auth().onAuthStateChanged(function(user) {
            window.user = user; // user is undefined if no user signed in

            // if user signs out, redirect them to main page
            if (user === null && window.location.pathname !== "index.html") {
                window.location.assign("index.html");
            }

            // if user is signed in
            if (user !== null) {
                // display user info
                $("#signIn").hide();
                $("#signOut").show();
                $("#userName").text(user.displayName + " (My Account)");
                $("#userEmail").text(user.email);

                // call function to render search history
                priorSearches();
            } else {

                // change to default display if no user
                $("#signIn").show();
                $("#signOut").hide();
                $("#userName, #userEmail").empty();
                $("#sortable").empty();
            }
        });

        // Google sign in function
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

        // Google sign out function
        function googleSignout() {
            firebase.auth().signOut()
                .then(function() {
                    console.log('Signout Successful');
                }, function(error) {
                    console.log('Signout Failed');
                });
        }

        // click event for Google sign in
        $("#signIn").on("click", function() {
            googleSignin();
        });

        // click event for Google sign out
        $("#signOut").on("click", function() {
            googleSignout();
        });

        // jQuery UI sorting function to move order of saved searches
        $(function() {
            $("#sortable").sortable({
                containment: '.wrapper',
                tolerance: "pointer",
                helper: 'clone',
                opacity: 0.70,
                zIndex: 10000,
                appendTo: "body"
            });
            $("#sortable").disableSelection();
        });

        // click function to place search term in local storage. A new tab opens with the search term loaded in the input
        $(document).on("click", ".bookSearch", function() {
            searchTerm = $(this).attr("data-id");
            localStorage.setItem("searchterm", searchTerm);
        });

        // click function to remove search term from local storage when the user clicks the home button
        $(document).on("click", ".fa-home", function() {
            localStorage.removeItem("searchterm");
        });

        // click function to remove a search term from database and delete its card from DOM
        $(document).on("click", ".remove", function(e) {
            e.preventDefault();
            var key = $(this).attr("data-key");
            $(this).closest(".search-card").remove();
            database.ref().child('users/').child(uid).child('books/').child(key).remove();
        });

    });

})();