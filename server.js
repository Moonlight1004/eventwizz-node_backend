const express = require("express");
const defaultRoutes = require("./routes");
const helmet = require("helmet");
const { notFound, errorHandler } = require("./middlewares/error");
const apiResponseMiddleware = require("./middlewares/response");
const authMiddleware = require("./middlewares/auth");
const { configuration, dbConnect } = require("./utils/configUtils");

const app = express();

// initial configuration
configuration(app);

// connect to mongodb
dbConnect();

// helmet helps you secure your Express apps by setting various HTTP headers 
app.use(helmet());

// used to parse the incoming requests with JSON payloads and is based upon the bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// adding response middleware to structure all API responses in specific format
app.use(apiResponseMiddleware);

// adding auth middleware to check if user token is valid or not before running protected apis
app.all("*", authMiddleware);

// adding all api routes to app
app.use("/", defaultRoutes);

// adding error middleware that will return error message in case of server error
app.use(notFound);
app.use(errorHandler);

const PORT = 8000;


app.listen(PORT, async () => {
  console.log(`server up on port ${PORT}`);
});
