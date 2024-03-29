const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/kashyapMovieProj')

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description :{
        type: String,
        required: true,
    },
    year: {
        type: Date,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    rating: {
        type: String,
        required: true,
    },
    movimage: {
        type: String,
        required: true,
    },
}, { timestamps: true })

const movieModel = mongoose.model('movie', movieSchema)

module.exports = { movieModel };