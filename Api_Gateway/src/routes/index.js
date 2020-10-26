const NotificationRouter = require('./notification_router');


module.exports = (router, redis) => {
    router.use("/notification", NotificationRouter(redis));
    return router;
};