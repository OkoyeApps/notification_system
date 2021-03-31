const { Router } = require('express');
const _router = Router({ strict: true });
const noticationController = require('../controllers/notification_controller');


const Notification_Router = (redisclient) => {
    let noticationCtrl = new noticationController(redisclient);
    _router.post("/", (...args) => noticationCtrl.addNotification(...args));
    _router.get("/:user_id", (...args) => noticationCtrl.getNotications(...args));
    return _router;
};

module.exports = Notification_Router;