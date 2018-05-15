//dependencies
var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new CommentSchema object
var CommentSchema = new Schema({
  // `subject` is type of String
  subject: String,
  // `body` is type of String
  body: String
});

// This creates our model from the above schema, using mongoose's model method
var Comment = mongoose.model("Comment", CommentSchema);

// Export the model
module.exports = Comment;
