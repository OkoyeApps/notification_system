var mongoose = require('mongoose');
const { get } = require('https');
const uri = process.env.DB_URI;
const Model = require('../../src/models/notification_model');


module.exports = function init() {
    if (uri) {
        mongoose.connect(
            uri, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        },
            (err) => {
                if (err) {
                    console.log("Database connection failed");
                }
                else {
                    console.log("Sucessfully connected to MongoDB");
                    seedDatabase();
                }
            }

        );
    } else {
        throw new Error("DB URI not found, please kindly check your connection strings to mongoose");
    }
};

/**
 * Seeding logic for database should go here
 */
function seedDatabase() {
    Model.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            get("https://random-data-api.com/api/food/random_food?size=20", res => {
                const { statusCode } = res;
                const contentType = res.headers['content-type'];
                let error;
                // Any 2xx status code signals a successful response but
                // here we're only checking for 200.
                if (statusCode !== 200) {
                    error = new Error('Request Failed.\n' +
                        `Status Code: ${statusCode}`);
                } else if (!/^application\/json/.test(contentType)) {
                    error = new Error('Invalid content-type.\n' +
                        `Expected application/json but received ${contentType}`);
                }
                if (error) {
                    console.error(error.message);
                    // Consume response data to free up memory
                    res.resume();
                    return;
                }

                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => { rawData += chunk; });
                res.on('end', () => {
                    try {
                        const parsedData = JSON.parse(rawData);
                        console.log(parsedData);
                        let formattedData = parsedData.map(data => {
                            return { message: data.description, user_id: data.uid, title: data.dish };
                        });
                        Model.create(formattedData);
                    } catch (e) {
                        console.error(e.message);
                    }
                });
            }).on('error', (e) => {
                console.error(`Got error: ${e.message}`);
            });
        }
    });

}