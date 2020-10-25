const { Router } = require('express');
const _router = Router({ strict: true });
const noticationCtrl = require('../controllers/notification_controller');


const Notification_Router = () => {
    _router.post("/", noticationCtrl.addNotification);
    return _router;
};

module.exports = Notification_Router;