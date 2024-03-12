const express = require('express')
const app = express()
const ejs = require('ejs')
const fs = require('fs')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static('upload'))
app.set('view engine', 'ejs')

const { movieModel } = require('./schema.js')

// home
app.get('/', (req, res) => {
    res.render('./Pages/home')
})

// retrive Data
app.get('/movielist', async (req, res) => {
    const movies = await movieModel.find()
    res.render('./Pages/index', { movies: movies })
})

// add data
app.get('/addmovie', (req, res) => {
    res.render('./Pages/addmovie')
})

// post data
app.post('/addbook', async (req, res) => {
    const book = req.body;

    const newBook = new movieModel(book);
    await newBook.save();

    res.redirect('/booklist')
})


// deleteData
app.get('/deleteBook/:id', async (req, res) => {
    const userId = req.params.id;
    var result = await movieModel.deleteOne(({ _id: userId }))
    res.redirect('/booklist')
})

// edit Data
app.get('/editBook/:id', async (req, res) => {
    const userId = req.params.id;

    const book = await movieModel.findById(userId);

    res.render('./Pages/editbook', { book });
})

// post Data
app.post('/editBook/:id', async (req, res) => {
    const userId = req.params.id;
    const updatedBookData = req.body;

    const updatedBook = await movieModel.findByIdAndUpdate(userId, updatedBookData, { new: true });

    res.redirect('/booklist');
})

// port Listen at
app.listen(8000, () => {
    console.log('Server Start at port 8000');
})