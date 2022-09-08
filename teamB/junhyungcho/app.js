<<<<<<< HEAD
require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('./routes');
=======
require("dotenv").config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const route = require("./routers");

>>>>>>> feature/auth
const app = express();

<<<<<<< HEAD
const { DataSource } = require('typeorm');

const database = new DataSource({
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE
});

database.initialize()
    .then(() => console.log("Data Source has been initialized!"))
    .catch((err) => {
        console.error(err);
        database.destroy();
    });
;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(routes);

app.get('/ping', cors(), (req, res, next) => res.status(200).json({ message : "pong" }));


app.post('/users', async (req, res, next) => {
    const { first_name, last_name, age } = req.body;
=======
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(route);
>>>>>>> feature/auth

app.get("/ping", cors(), (req, res, next) => {
  res.status(200).json({ message: "pong" });
});

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    server.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
  } catch (err) {
    consloe.log(err);
  } finally {
    console.log("===========================================");
  }
};

start();
