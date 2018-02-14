var mongoose = require("mongoose");

var recipeSchema = new mongoose.Schema({
   name: String,
   price: String,
   image: {
      data: Buffer, contentType: String
   },
   description: String,
   createdAt: {type: Date, default: Date.now },
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
   
});

module.exports = mongoose.model("Recipe", recipeSchema);