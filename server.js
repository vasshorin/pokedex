// ------------
// -- CONSTS --
// ------------
const express = require('express');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { CLIENT_RENEG_WINDOW } = require('tls');
const app = express();

const UserModel = require('./models/User');
const mongoURI = "mongodb+srv://testUser:testUser@cluster0.etygx.mongodb.net/pokedex?retryWrites=true&w=majority";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connected to database!");
});

const store = new MongoDBSession({
    uri: mongoURI,
    collection: 'mySessions'
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true}));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: store
    }));


// ----------------
// -- MIDDLEWARE --
// ----------------
const isAuth = (req, res, next) => {
    if(req.session.isAuth) {
        next();
    } else {
        res.redirect('/login');
    }
};

// ------------
// -- ROUTES --
// ------------

app.get("/", (req, res) => {
    res.render("landing");
});

// ------------
// --  LOGIN --
// ------------
app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
        res.redirect("/login");
    } 
    
    const isMatch = await bcrypt.compare(password, user.password);
    

    if(!isMatch) {
        res.redirect("/login");
    } else {
        req.session.isAuth = true;
        req.session.userId = user._id;
        req.session.username = user.username;
        req.session.email = user.email;
        req.session.password = user.password;
        res.redirect(`/userProfile`);
    }
});



// ------------
// -- SIGNUP --
// ------------

app.get("/register", (req, res) => {
    res.render("register");
});


app.post("/register", async (req, res) => {
    const { username, password, email } = req.body;

    let user = await UserModel.findOne({ email: email });

    if (user) {
        return res.redirect("/register");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user = new UserModel({
        username: username,
        password: hashedPassword,
        email: email
    });

    await user.save();

    res.redirect("/login");

});


app.get("/userProfile", isAuth, (req, res) => {
    const user = UserModel.findOne({ email: req.session.id });
    res.render("userProfile.ejs", {
        "username": req.session.username,
        "email": req.session.email,
        "isAuth": req.session.isAuth,
        "id": req.session.userId,
        "password": req.session.password
        });
});


app.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});