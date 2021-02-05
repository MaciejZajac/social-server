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

const app = express();

let mongoURI;
if (process.env.NODE_ENV === "production") {
  mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_ATLAS_PW}@cluster0.plttm.mongodb.net/${process.env.MONGO_DB_PROD}?retryWrites=true&w=majority`;
} else {
  mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_ATLAS_PW}@cluster0.plttm.mongodb.net/${process.env.MONGO_DB_DEVELOPMENT}?retryWrites=true&w=majority`;
}

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (error) => {
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


app.use(userRouter);
app.use(companyProfileRouter);
app.use(offerRouter);


app.all("*", (req, res) => {
  throw new NotFoundError();
})

app.use(errorHandler)

module.exports = app;
