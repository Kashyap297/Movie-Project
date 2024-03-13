const express = require('express')
const app = express()
const ejs = require('ejs')
const fs = require('fs')
const multer = require('multer')

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static('upload'))
app.set('view engine', 'ejs')

const { movieModel } = require('./schema.js')

const storage = multer.diskStorage(
    {
        destination: (req, file, cb) => {
            return cb(null, './upload')
        },
        filename: (req, file, cb) => {
            return cb(null, Date.now() + file.originalname)
        }
    }
)

var upload = multer({ storage: storage }).single('file')

// home
app.get('/', (req, res) => {
    res.render('./Pages/home')
})

// retrive Data
app.get('/movielist', async (req, res) => {
    const movies = await movieModel.find({})
    res.render('./Pages/index', { movies: movies })
})

// add data
app.get('/addmovie', (req, res) => {
    res.render('./Pages/addmovie')
})


// post data
app.post('/upload', async (req, res) => {
    upload(req, res, async () => {
        if (req.file) {
            var details = {
                title: req.body.title,
                description: req.body.description,
                year: req.body.year,
                genre: req.body.genre,
                rating: req.body.rating,
                movimage: req.file.filename
            }

            if (!/^\d{4}$/.test(details.year)) {
                return res.status(400).send("Invalid year format.");
            }

            const movie = new movieModel(details)
            try {
                await movie.save();
                res.redirect('/movielist');
            } catch (error) {
                console.error(error);
                res.status(500).send("Error saving movie details.");
            }
        } else {

        }
    })
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