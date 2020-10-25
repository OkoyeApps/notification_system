var Joi = require('joi');
module.exports = (schema) => (req, res, next) => {
    var result = validate(req.body, schema);
		if (result){
			res.status(500).send(result);
		} else {
			next();
		}
    next();
}

 function validate(data, schema) {
        var result = Joi.validate(data, schema);
        if (result.error == null) {
            return;
        } else {
            return result.error.details.map(error => error.message);
        }
}
    