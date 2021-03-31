#!/usr/bin/env node

/**
 * Module dependencies.
 */

var initilizer = require('../server');
var path = require('path');
var fs = require('fs');
var http = require('http');
var https = require('https');
const redis = require('redis');
var dbConfiguration = require('./config/db');
const keys = require('../keys');
const socket_connection = require('socket.io');
const socketServices = require('../src/services/socket_services');
const redisAdapter = require('socket.io-redis');

var port = normalizePort(process.env.PORT || '8080');
var serverType = process.env.servertype;
var server = {};


//redis configuration
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

// redisClient.flushall();
// redisClient.flushdb();

const app = initilizer(redisClient);
/**
 * Create Unified server based on the server type environment
 * choose between http and https server.
 */

if (serverType === 'https') {
    let certOptions = {
        key: fs.readFileSync(path.resolve('bin/certs/server.key')),
        cert: fs.readFileSync(path.resolve('bin/certs/server.crt'))
    };
    server = https.createServer(certOptions, app);
} else {
    server = http.createServer(app);
}



/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

app.set('port', port);


/**
 * Database configuration
 */
dbConfiguration();


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    console.table(addr);
    let socketInstance = socket_connection(server);
    socketInstance.adapter(redisAdapter(keys.redisUrl));
    socketServices(socketInstance, redisClient);
    app.set("socket_connection", socketInstance);
    socketInstance.on('connect', () => { });
}