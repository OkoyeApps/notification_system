const notification_socket = require('./notification_socket');

module.exports = function(socket, redisclient){
    // console.log("here", socket)
    notification_socket(socket, redisclient);
}