const url = require('url');
const { saveNotification, getNotifications } = require('../services/notification_service');
const notificationService = require('../services/notification_service');

class Notification_Controller {
    constructor(redisclient) {
        if (!redisclient) {
            throw new Error("controller expects a typeof redisclient but got " + typeof (redisclient));
        }
        this._publisher = redisclient.duplicate();
    }

    addNotification(req, res, next) {
        const { user_id, message } = req.body;
        this._publisher.publish('add_notification', "testing insert");
        saveNotification(user_id, message)
            .then(result => res.status(result.status).send(result))
            .catch(error => res.status(error.status).send(error));
    }

    getNotications(req, res, next) {
        // console.log("req check", parse(req.originalUrl, true));
        let parsedUrl = url.parse(req.originalUrl, true);
        let { pagenumber, pagesize } = req.query;
        notificationService.getNotifications({ pagenumber, pagesize }, null, null, { baseUrl: parsedUrl.pathname, querystring: { ...parsedUrl.query } })
            .then(result => res.status(result.status).send(result))
            .catch(error => res.status(error.status).send(error));
    }
}


module.exports = Notification_Controller;