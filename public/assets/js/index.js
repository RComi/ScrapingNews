// Grab the articles as a json and creat cards on the home page to view
//the articles and their summaries
$(document).ready(function () {
  $.getJSON("/articles", function (data) {
    // For each articles in the db
    for (var i = 0; i < data.length; i++) {
      if (data.indexOf(data[i].title) >= -1) {
        // Display the apropos information on the page
        $("#article").append("<div class='card' style='width: 22rem;' id='" + data[i]._id + "'>" +
          "<img class='card-img-top'src='" + data[i].image + "' alt='Card image cap'>" +
          "<div class='card-body'><h5 class='card-title'>" + data[i].title + "</h5>" +
          "<a href='/articles/" + data[i]._id + "' id='" + data[i]._id + "' ' class='btn btn-primary' role='button'>View Article</a></div></div>");
      }
    }
  });
});