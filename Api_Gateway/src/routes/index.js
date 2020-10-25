const NotificationRouter = require('./notification_router');


module.exports = (router) => {
    router.use("/notification", NotificationRouter());
    return router;
};