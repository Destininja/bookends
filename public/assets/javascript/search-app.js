$(document).ready(function() {
    
    var provider = new firebase.auth.GoogleAuthProvider();
    var database = firebase.database();

    function priorSearches() {
    var uid = firebase.auth().currentUser.uid;

    database.ref().child('users/').child(uid).child('books/')
        .on("value", function(userSnapshot) {
            $("#priorSearches").empty();
            userSnapshot.forEach(function (snapshot) {

            // store the snapshot.val() in a variable for convenience
            var sv = snapshot.val();

            // store the snapshot key in a variable
            key = snapshot.key;
            console.log(key);

                var cardTitle = $("<h5 class='card-title capitalize'>").text(sv);
                var bookLink = $("<a target='_blank' class='btn btn-primary bookSearch'>").attr("href", "index.html").text("Search again");
                bookLink.attr("data-id", sv);
                var cardBody = $("<div class='card-body search-card-body'>").append(cardTitle, bookLink);
                var card = $("<div class='card search-card'>").append(cardBody);
                $("#priorSearches").append(card);
            

            // create button to remove train from table and database
            //var remove = $("<td class='text-center'><button type='submit' class='remove btn btn-primary btn-sm'><i class='fa fa-trash'></i> Remove</button></td>");

                });

            // Handle the errors
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
        });
}

    firebase.auth().onAuthStateChanged(function(user) {
        window.user = user; // user is undefined if no user signed in
        console.log(user);
        if (user) {
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
                console.log('Signout Successful')
            }, function(error) {
                console.log('Signout Failed')
            });
    }

    $("#signIn").on("click", function() {
        googleSignin();
    });

    $("#signOut").on("click", function() {
        googleSignout();
    });

});

$(document).on("click", ".bookSearch", function() {
    searchTerm = $(this).attr("data-id");
    localStorage.setItem("searchterm", searchTerm);
});