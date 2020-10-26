const notification_socket = require('./notification_socket');

module.exports = function(socket, redisclient){
    notification_socket(socket, redisclient);
}