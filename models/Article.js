//dependencies
var mongoose = require('mongoose');

//create schema
var Schema = mongoose.Schema;

//create article schema
var ArticleSchema = new Schema({
  title: {
    type: String,
    unique: true
  },
  summary: {
    type: String
  },
  image: {
    type: String
  },
  link: {
    type: String,
    unique: true
  },
  comment: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

//set up modle object
var Article = mongoose.model("Article", ArticleSchema);

//export model
module.exports = Article;