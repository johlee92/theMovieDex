require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const MOVIE = require('./movie');
const helmet = require('helmet');

const app = express();
app.use(morgan());
app.use(cors());
app.use(helmet());

const PORT = 8000;

app.listen(PORT, () => {
    console.log('port is listening');
})

app.use(function validateBearerToken(req, res, next) {

    const apiToken = process.env.API_TOKEN;
    // console.log(apiToken);
    const authToken = req.get('Authorization');
    // console.log(authToken);

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request'});
    }

    next();
})

function handleGetMovie(req, res) {
    let response = MOVIE;

    if (req.query.genre) {
        response = response.filter(movie => {
            return movie.genre.toLowerCase().includes(req.query.genre.toLowerCase());
        });
    };

    if (req.query.country) {
        response = response.filter(movie => {
            return movie.country.toLowerCase().includes(req.query.country.toLowerCase());
        });
    };

    if (req.query.avg_vote) {
        response = response.filter(movie => {
            return movie.avg_vote >= req.query.avg_vote;
        });
    };

    res.json(response);
}

app.get('/movie', handleGetMovie);