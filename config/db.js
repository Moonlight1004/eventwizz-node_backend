const { config } = require("dotenv");

config();

// Config file for mongo db to connect via mongoose library
const dbConfig = {
    url : process.env.MONGODB_URL,
};

module.exports = dbConfig;