var mongoose = require('mongoose');
var articleSchema = mongoose.Schema({
    title: String,
    date: String,
    url: String
})

module.exports = mongoose.model("Article", articleSchema)