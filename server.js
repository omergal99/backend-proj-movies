const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const addMovieRoutes = require('./routes/movie-route')
const addReviewRoutes = require('./routes/review-route')
const addUserRoutes = require('./routes/user-route')

const app = express()
app.use(cors({
  origin: ['http://localhost:8080'],
  credentials: true // enable set cookie
}));
app.use(bodyParser.json())
app.use(express.static('public'));

app.use(cookieParser());
app.use(session({
  secret: 'omer natalia',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.get('/', (req, res) => {
  res.send('Hello World!')
  
})

addMovieRoutes(app)
addReviewRoutes(app)
addUserRoutes(app)

const port = process.env.PORT || 3003;
app.listen(port, () => console.log(`Example app listening on port ${port}`))