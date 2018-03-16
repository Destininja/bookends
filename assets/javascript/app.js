$("#search-form").on("submit", function(e) {

    		 e.preventDefault();

    		 $("#books").empty();

    		 book = $("#book-input").val().trim().toLowerCase();

    		

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
            var card = $("<div class='card'>").append(imageHolder, cardBody);
            $("#books").append(card);

        }

    });

    $("#book-input").val("");

    });