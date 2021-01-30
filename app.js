const express = require('express');
const bodyParser = require('body-parser');
const morgan = require("morgan");
const mongoose = require('mongoose');
const userRouter = require('./api/routes/user');
const offerRouter = require('./api/routes/offer');
const companyProfileRouter = require('./api/routes/companyProfile');
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
mongoose.connect(`mongodb+srv://MaciejZajac2:${process.env.MONGO_ATLAS_PW}@cluster0.plttm.mongodb.net/oferty?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
console.log("dbConnected");
})


const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Express API for JSONPlaceholder',
      version: '1.0.0',
      description:
        'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
      license: {
        name: 'Licensed Under MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'JSONPlaceholder',
        url: 'https://jsonplaceholder.typicode.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server',
      },
    ],
  };
  
const options = {
    swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: ['./api/routes/*.js'],
  };
  
const swaggerSpec = swaggerJSDoc(options);
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


app.use("/api/user", userRouter);
app.use("/api/companyProfile", companyProfileRouter);
app.use("/api/offer", offerRouter);


app.use((req, res, next) => {
    const error = new Error("Not found");

    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    console.log("error", error);
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})


module.exports = app;
