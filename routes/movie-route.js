const movieService = require('../services/movie-service.js')
const reviewService = require('../services/review-service.js')

// function checkAdmin(req, res, next) {
//     console.log('INSIDE MIDDLEWARE: ', req.session.user);
//     if (!req.session.user || !req.session.user.isAdmin ) {
//         res.status(401).end('Unauthorized');
//         return;
//     }
//     next();
// }

function addMovieRoutes(app) {
    // MOVIES REST API:

    // LIST
    app.get('/movie', (req, res) => {
        // console.log('req query',req.body)
        if (req.body) {
            //console.log('123123',req.query)
            movieService.query(req.query)
                .then(movies => res.json(movies))
        }
        else
            movieService.query()
                .then(movies => res.json(movies))

    })

    // SINGLE - GET Full details including reviews
    app.get('/movie/:movieId', (req, res) => {
        const movieId = req.params.movieId;
        movieService.getById(movieId)
            .then((movie) => {
                res.json(movie)
            })
    })

    // DELETE
    // app.delete('/movie/:movieId', (req, res) => {
    //     const movieId = req.params.movieId;
    //     movieService.remove(movieId)
    //         .then(() => res.end(`Movie ${movieId} Deleted `))
    // })

    // CREATE
    app.post('/movie', (req, res) => {
        const movie = req.body;
        movieService.add(movie)
            .then(movie => {
                res.json(movie)
            })
    })

    // UPDATE rate
    app.put('/movie', (req, res) => {
        const movieId = req.body.movieId;
        const rate = req.body.rate;
        const userID = req.body.loggedInUser;
        movieService.updateMovieRate(movieId, rate,userID)
            .then(review => res.json(review))
    })


}


module.exports = addMovieRoutes;