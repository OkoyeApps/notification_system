//store online people
const online_members = [];

//store online notifications
let notifications = [];
let online_members_objects = {};
let redis_client = undefined;
let subForMessage = false;
let personalSocket = undefined;

const NotificationSocket = (io, redisClient) => {
    const subscriber = redisClient.duplicate();
    const publisher = redisClient.duplicate();
    redis_client = redisClient;
    io.of("/notification").on("connect", (socket) => {
        initOnlineMembers(redisClient);
        initNotificationMessages(redisClient);

        socket.on('online', (data) => {
            online_members_objects[data.user_id] = socket.id;
            console.log("online members", online_members_objects, data);
            saveNewuserDetailsTo(redisClient);
            socket.emit("all_notification", notifications.filter(x => x.to === data.user_id));
        });

        socket.on("notify", (data) => {
            personalSocket = socket;
            saveNewNotification(redisClient, io);
            publisher.publish("add_notification", JSON.stringify(data));
        });

        socket.on('notification_recieved', data => {
            deleteUserMessage(data);
        });

        initMessageSubscriber(socket)(redis_client, subscriber);
    });

    subscriber.subscribe("notification_added");
};

const initMessageSubscriber = (socket) => (redis_client, subscriber) => {
    if (!subForMessage) {
        subscriber.on('message', subscriptionHandler(redis_client, socket));
        subForMessage = true;
    }
};

const deleteUserMessage = (user_id) => {
    console.log("delete socket call", user_id);
    redis_client.get('notifications', (err, notification) => {
        let filteredData = JSON.parse(notification).filter(x => x.to !== user_id);
        console.log("filtered data", filteredData);
        redis_client.set("notifications", JSON.stringify(filteredData));
    });
};

const subscriptionHandler = (redisclient, socket) => (channel, message) => {
    switch (channel) {
        case "notification_added":
            emitNewNotification(message, socket);
            saveNewNotification(redisclient);
        default:
            break;
    }
};


const emitNewNotification = (data, socket) => {
    notifications.push(JSON.parse(data));
    socket.to(online_members_objects[JSON.parse(data).to]).emit('new_notification', data);
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