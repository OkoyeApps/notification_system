const Mongoose = require('mongoose');

const NotificationSchema = Mongoose.Schema({
    user_id: { type: Number },
    message: { type: String, required: true },
    seen: { type: Boolean, default: false },

}, { timestamps: true });


module.exports = Mongoose.model("notification", NotificationSchema);
