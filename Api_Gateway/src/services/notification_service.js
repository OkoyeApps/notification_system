const Notification_Model = require('../models/notification_model');

class Notification {
    constructor(notificationClass) {
        this._notification = notificationClass 
    }

    saveNotification(user_id, message) {
        if (user_id && message) {
            const newNotification = {
                message: message,
                user_id: user_id
            };
            return Notification_Model.create(newNotification).then(result => {
                //Publish a message for notification service here
                return { success: true, data: result.toObject(), status : 200 };
            }).catch(error => {
                //log error here later
                return { success: false, error: error, status : 500 };
            });
        } else {
            return Promise.reject({ success: false, error: new Error("incomplete message"), status : 500 });
        }
    }
}

module.exports = new Notification(new Notification_Model());