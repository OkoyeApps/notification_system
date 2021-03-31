const url = require('url');
const notificationService = require('../services/notification_service');

class Notification_Controller {
    constructor(redisclient) {
        if (!redisclient) {
            throw new Error("controller expects a typeof redisclient but got " + typeof (redisclient));
        }
        this._publisher = redisclient.duplicate();
        this._noticiationService = new notificationService(redisclient);
    }

    addNotification(req, res, next) {
        const { user_id, message, title, to } = req.body;
        console.log(req.body);
        this._noticiationService.saveNotification(user_id, message, title, to)
            .then(result => res.status(result.status).send(result))
            .catch(error => res.status(error.status).send(error));
    }

    getNotications(req, res, next) {
        let parsedUrl = url.parse(req.originalUrl, true);
        let { pagenumber, pagesize } = req.query;
        this._noticiationService.getNotifications(req.params.user_id, { pagenumber, pagesize }, null, null, { baseUrl: parsedUrl.pathname, querystring: { ...parsedUrl.query } })
            .then(result => res.status(result.status).send(result))
            .catch(error => res.status(error.status).send(error));
    }
}


module.exports = Notification_Controller;