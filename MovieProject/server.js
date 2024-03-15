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

            const movie = new movieModel(details)
            try {
                await movie.save();
                res.redirect('/movielist');
            } catch (error) {
                console.error(error);
            }
        } else {

        }
    })
})


// deleteData
app.get('/deleteData/:id', async (req, res) => {
    var id = req.params.id
    var image = await movieModel.findOne({ _id: id })
    var result = await movieModel.deleteOne({ _id: id })
    if (result.acknowledged) {
        fs.unlink(`upload/${image.movimage}`, (err) => {
            if (err) {
                console.log(err);
            }
            console.log("success");
        })
        res.redirect('/movielist')
    }
})

// edit Data
app.get('/editData/:id', async (req, res) => {
    var id = req.params.id
    var result = await movieModel.findOne({ _id: id })
    res.render('./Pages/editmovie', { movies: result })
})

app.post('/editData/:id', async (req, res) => {
    var id = req.params.id;
    upload(req, res, async () => {
        try {
            var oldMovie = await movieModel.findOne({ _id: id });

            var details = {
                title: req.body.title,
                description: req.body.description,
                year: req.body.year,
                genre: req.body.genre,
                rating: req.body.rating,
            };

            if (req.file) {
                if (oldMovie.movimage) {
                    fs.unlink(`upload/${oldMovie.movimage}`, (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Old image deleted successfully");
                        }
                    });
                }
                details.movimage = req.file.filename;
            } else {
                details.movimage = oldMovie.movimage;
            }
            await movieModel.updateOne({ _id: id }, details);
            res.redirect('/movielist');
        } catch (error) {
            console.error(error);
        }
    });
});



// port Listen at
app.listen(8000, () => {
    console.log('Server Start at port 8000');
})