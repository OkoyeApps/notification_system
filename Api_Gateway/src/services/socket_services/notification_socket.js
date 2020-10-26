//store online people
const online_members = [];

//store online notifications
let notifications = [];
let online_members_objects = {};



const NotificationSocket = (io, redisClient) => {
    const subscriber = redisClient.duplicate();
    const publisher = redisClient.duplicate();
    io.of("/notification").on("connect", (socket) => {
        console.log("connected socket in notification");

        initOnlineMembers(redisClient);
        initNotificationMessages(redisClient);

        socket.on('online', (data) => {
            console.log("socket online");
            online_members_objects[data.user_id] = socket.id;
            saveNewuserDetailsTo(redisClient);
            // socket.to(socket.id).emit("new_notification", notifications)
        });

        socket.on("notify", (data) => {
            saveNewNotification(redisClient);
            publisher.publish("add_notification", JSON.stringify(data));
        });
        subscriber.subscribe("notification_added");
        subscriber.on('message', subscriptionHandler(redisClient, socket));
    });

};

const subscriptionHandler = (redisclient, socket) => (channel, message) => {
    console.log("subscription recieved", channel, message);
    switch (channel) {
        case "notification_added":
            saveNewNotification(redisclient);
            emitNewNotification(message, socket);

        default:
            break;
    }
};


const emitNewNotification = (data, socket) => {
    console.log("saved not calling");
    notifications.push(data);
    socket.broadcast.emit("new_notification", data);
};
/**
 * @description initializes every online memeber in redis store
 * @param {objec} redisclient 
 */
const initOnlineMembers = function (redisclient) {
    redisclient.get('members', (err, members) => {
        if (members) {
            online_members_objects = JSON.parse(members);
        }
    });
};


/**
 * @description initializes every online memeber in redis store
 * @param {object} redisclient 
 */
const initNotificationMessages = function (redisclient) {
    redisclient.get('notifications', (err, savedNotification) => {
        if (savedNotification) {
            notifications = JSON.parse(savedNotification);
        }
    });
};

const saveNewuserDetailsTo = (redisClient) => {
    redisClient.set('members', JSON.stringify(online_members_objects));
};

const saveNewNotification = (redisClient) => {
    redisClient.set('notifications', JSON.stringify(notifications));
};
module.exports = NotificationSocket;