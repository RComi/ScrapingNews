//dependencies
var express = require("express");
var router = express.Router();

//referencing models
var models = require('../models');

// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");

//default route
router.get('/', function (req, res) {
    res.render("index");
});

// A GET route for scraping the new york times tech website
router.get("/scrape", function (req, res) {
    // First, grab the body of the html with request

    request("https://www.nytimes.com/section/technology", function (err, response, html) {
        // Then, load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(html);
        //var articleArray = [];
        // Now, grab every h2 within an article tag, and do the following:
        $("a.story-link .story-meta").each(function (i, element) {
            // Save an empty result object
            var result = {};
            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children(".headline")
                .text();
            result.summary = $(this)
                .children(".summary")
                .text();
            result.image = $(this)
                .next()
                .children("img")
                .attr("src");
            result.link = $(this)
                .parent("a.story-link")
                .attr("href");


            //creates the article object to be put into mongo
            models.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, send it to the client
                    return res.json(err);
                });
        });
        // If able to successfully scrape and save an Article, route to home
        res.render("index");
    });
});

//Route for getting all Articles from the db
router.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    models.Article.find({})
        .then(function (dbArticle) {
            // If able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's comment
router.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in db...
    models.Article.findOne({
            _id: req.params.id
        })
        // ..and populate all of the comments associated with it
        .populate("comment")
        .exec(function (err, doc) {
            var singleArticle = {
                article: doc
            };
            res.render('article', singleArticle);
        });

});

//Route for saving/updating an Article's associated comment
router.post("/comment", function (req, res) {
    console.log(req.body);
    //Create a new comment and pass the req.body to the entry   
    models.Comment.create(req.body)
        .then(function (dbComment) {
            console.log(req.body);
            //  If a comment was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new comments
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Mongoose query returns a promise, chain another `.then` which receives the result of the query
            return models.Article.findOneAndUpdate({}, {
                $push: {
                    comment: dbComment._id
                }
            }, {
                new: true
            }).populate("comment");
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    res.redirect('back');
});

//exports router
module.exports = router;