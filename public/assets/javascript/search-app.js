$(document).ready(function() {
    
    var provider = new firebase.auth.GoogleAuthProvider();
    var database = firebase.database();
    var uid;
    console.log(database);


    function priorSearches() {
    uid = firebase.auth().currentUser.uid;

    database.ref().child('users/').child(uid).child('books/')
        .on("value", function(userSnapshot) {
            $("#priorSearches").empty();
            userSnapshot.forEach(function (snapshot) {

            // store the snapshot.val() in a variable for convenience
            var sv = snapshot.val();

            // store the snapshot key in a variable
            var key = snapshot.key;
            console.log(key);

                var cardTitle = $("<h5 class='card-title capitalize'>").text(sv);
                var bookLink = $("<a target='_blank' class='btn btn-primary bookSearch'>").attr("href", "index.html").text("Search again");
                bookLink.attr("data-id", sv);
                var remove = $("<button type='submit' class='remove btn btn-primary btn-sm'><i class='fa fa-trash'></i></button>").attr("data-key", key);
                var cardBody = $("<div class='card-body search-card-body'>").append(cardTitle, bookLink, remove);
                var card = $("<div class='card search-card'>").append(cardBody);
                $("#priorSearches").append(card);
                });

            // Handle the errors
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
        });
}

    firebase.auth().onAuthStateChanged(function(user) {
        window.user = user; // user is undefined if no user signed in
        console.log(user);

        if (user === null && window.location.pathname !== "/"){
            window.location.assign("/");
        }

        if (user !== null) {
            $("#signIn").hide();
            $("#signOut").show();
            $("#userName").text(user.displayName + " (My Account)");
            $("#userEmail").text(user.email);
            priorSearches();
        } else {
            $("#signIn").show();
            $("#signOut").hide();
            $("#userName, #userEmail").empty();
            $("#priorSearches").empty();
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
                console.log('Signout Successful');
            }, function(error) {
                console.log('Signout Failed');
            });
    }

    $("#signIn").on("click", function() {
        googleSignin();
    });

    $("#signOut").on("click", function() {
        googleSignout();
    });

$(document).on("click", ".bookSearch", function() {
    searchTerm = $(this).attr("data-id");
    localStorage.setItem("searchterm", searchTerm);
});

$(document).on("click", ".fa-home", function() {
    localStorage.removeItem("searchterm");
});

$(document).on("click", ".remove", function(e) {
        e.preventDefault();
        var key = $(this).attr("data-key");
        $(this).closest(".search-card").remove();
        // var id = $(this).closest("tr").data("id");
        database.ref().child('users/').child(uid).child('books/').child(key).remove();
    });

});