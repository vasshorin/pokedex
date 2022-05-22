const express = require('express');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const { CLIENT_RENEG_WINDOW } = require('tls');
const app = express();

const mongoURI = "mongodb+srv://testUser:testUser@cluster0.etygx.mongodb.net/pokedex?retryWrites=true&w=majority";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connected to database!");
});

const store = new MongoDBSession({
    uri: mongoURI,
    collection: 'mySessions'
});

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: store
    }));

app.get("/", (req, res) => {
    req.session.isAuth = true;
    console.log(req.session);
    console.log(req.session.id);
    res.send("Hello World!");
});



app.listen(3000, () => {
    console.log("Server started on port 3000");
});