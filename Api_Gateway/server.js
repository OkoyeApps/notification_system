var express = require('express');
var app = express();
var morgan = require('morgan');
require('dotenv').config();
var compression = require('compression');
var router = express.Router();
var cors = require('cors');
const redis = require('redis');
const keys = require('./keys');
const appRouter = require('./src/routes/index.js');

const initializer = (redisClient) => {
    const rootRouter = appRouter(router, redisClient);

    app.set('redis_client', redisClient);

    app.use(compression());
    app.use(morgan('dev'));
    app.use(express.static("public"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use('/api', rootRouter);

    app.get("/notification", (req, res) => {
        return res.sendFile(__dirname + "/public/notification.html");
    });
    return app;
};


// app.all('*', (req, res) => res.status(200).send({ message: 'server is live' }));

module.exports = initializer;