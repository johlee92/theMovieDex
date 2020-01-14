require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const MOVIE = require('./movie');
const helmet = require('helmet');

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';

const app = express();
app.use(morgan(morganSetting));
app.use(cors());
app.use(helmet());

app.use((error,req, res, next) => {
    let response;
  
    if (process.env.NODE_ENV === 'production') {
      response = { error: { message:'server error' }}
    } else {
      resposne = { error }
    };
  
    res.status(500).json(response)
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Listening on 127.0.0.1:${PORT}`);
})

app.use(function validateBearerToken(req, res, next) {

    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');

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

// separating get function from movie handle
app.get('/movie', handleGetMovie);