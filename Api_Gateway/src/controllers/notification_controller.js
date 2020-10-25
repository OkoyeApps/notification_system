const { saveNotification } = require('../services/notification_service');

class Notification_Controller {
    constructor() {

    }

    addNotification(req, res, next) {
        const { user_id, message } = req.body;
        saveNotification(user_id, message)
        .then(result => res.status(result.status).send(result))
        .catch(error => res.status(error.status).send(error));
    }
}


module.exports = new Notification_Controller();