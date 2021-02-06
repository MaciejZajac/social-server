const express = require('express');
const bodyParser = require('body-parser');
const morgan = require("morgan");
const mongoose = require('mongoose');
const userRouter = require('./api/routes/user');
const offerRouter = require('./api/routes/offer');
const companyProfileRouter = require('./api/routes/companyProfile');
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const NotFoundError = require('./api/error/not-found-error');
const errorHandler = require('./api/middleware/error-handler');
const connectDB = require("./api/config/db");
const swaggerOptions = require("./api/config/swaggerConfig");
const app = express();


connectDB()

const swaggerSpec = swaggerJSDoc(swaggerOptions);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(morgan("dev"))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
})


app.use(userRouter);
app.use(companyProfileRouter);
app.use(offerRouter);


app.all("*", (req, res) => {
  throw new NotFoundError();
})

app.use(errorHandler)

module.exports = app;
