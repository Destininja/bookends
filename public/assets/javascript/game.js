$(document).ready(function () {
  var queryURL ="https://www.googleapis.com/books/v1/volumes?q=Catcher+in+the&download=epub&filter=ebooks&key=AIzaSyCQStCvIKDiy83OxGJgzbvRlWJ3kyrVJyo"
  var dataSet = [];
  $.ajax({
    url: queryURL,
    method: "GET",
    dataType: "jsonp"
  }).then(function (response) {
    var data = response.items;

    // console.log(data);
    //title description infoLink
    for (var i=0; i < data.length; i++) {
      // console.log(data[i].volumeInfo.title)
      dataSet.push(
        { title: data[i].volumeInfo.title, description: data[i].volumeInfo.description, review: data[i].volumeInfo.infoLink }
      )
    }
  });
 // dataSet[i].title

  console.log(dataSet)

  // data.forEach((item) => {
  //   dataSet.push({title: item.volumeInfo.title})
  // })

 // data.forEach(function(item) {

  //})

  // vare newDataSet = [{title: asd, description: asd, link: asd}, ...]

}); //$(document).ready(function ()