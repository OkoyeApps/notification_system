const { json } = require("express");

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
        });

        socket.on("notify", (data) => {
            saveNewNotification(redisClient);
            socket.broadcast("")
            // for (let index = 0; index < 5; index++) {
            //     publisher.publish('add_notification', JSON.stringify({ user_id: 5, message: "data from redis" + index }));
            // }
        });
    });
};

/**
 * @description initializes every online memeber in redis store
 * @param {objec} redisclient 
 */
const initOnlineMembers = function (redisclient) {
    redisclient.get('members', (err, members) => {
        console.log("members", members)
        if (members) {
            online_members_objects = JSON.parse(members);
        }
    });
};


/**
 * @description initializes every online memeber in redis store
 * @param {objec} redisclient 
 */
const initNotificationMessages = function (redisclient) {
    redisclient.get('notifications', (err, savedNotification) => {
         console.log("notification", notifications)
        if (savedNotification) {
            notifications = JSON.parse(savedNotification);
        }
    });
};

const saveNewuserDetailsTo = (redisClient) => {

    redisClient.set('members', JSON.stringify(online_members_objects));
};

const saveNewNotification = (redisClient) => {
    redisClient.set('notifications', JSON.stringify(online_members_objects));
};
module.exports = NotificationSocket;