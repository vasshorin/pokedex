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
const cartModel = require('./models/Cart');
const User = require('./models/User');
const { stringify } = require('querystring');
const { totalmem } = require('os');
const mongoURI = "mongodb+srv://testUser:testUser@cluster0.etygx.mongodb.net/new?retryWrites=true&w=majority";

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
        // res.redirect('/userProfile');
        next();
    } else {
        res.redirect('/login');
    }
};

const isAuth1 = (req, res, next) => {
    if(req.session.isAuth) {
        res.redirect('/userProfile');
        next();
    } else {
        next();
    }
};

// ------------
// -- ROUTES --
// ------------

app.get("/", isAuth, (req, res) => {
    res.render("landing");
});

// ------------
// --  LOGIN --
// ------------
app.get("/login", isAuth1, (req, res) => {
    res.render("login");
});


app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    
    if (password === '' || email === '') {
        res.render("login", {
            error: "Please fill in all fields"
        });
        return;
    }

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
        req.session.firstname = user.firstname;
        req.session.lastname = user.lastname;
        req.session.email = user.email;
        req.session.password = user.password;
        req.session.cart = user.cart;
        console.log(req.session);
        res.redirect(`/userProfile`);
    }
});



// ------------
// -- SIGNUP --
// ------------

app.get("/register", isAuth1, (req, res) => {
    res.render("register");
});


app.post("/register", async (req, res) => {
    const { firstname, lastname, email, password, admin, cart, history, createdAt  } = req.body;

    let user = await UserModel.findOne({ email: email });

    if (user) {
        return res.redirect("/register");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user = new UserModel({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hashedPassword,
        admin: false,
        cart: [],
        history: [],
        createdAt: new Date()
    });

    await user.save();

    res.redirect("/login");

});

// -------------
// -- PROFILE --
// -------------

app.get("/userProfile", isAuth, async (req, res) => {
    const user = await UserModel.findById(req.session.userId);
    // const history = JSON.stringify(user.history);
        await res.render("userProfile.ejs", {
            "username": req.session.username,
            "email": req.session.email, 
            "isAuth": req.session.isAuth,
            "id": req.session.userId,
            "password": req.session.password,
            "firstname": req.session.firstname,
            "lastname": req.session.lastname,
            "admin": req.session.createdAt,
            "updated": user.updatedAt,
            "created": user.createdAt,
            "history": user.history
        });
        // console.log("sadasdsad " + user.history[0].pokeid[0]);
});


// -------------
// --   CART  --
// -------------
app.get("/shoppingcart", isAuth, async function (req, res) {
    const user = await UserModel.findById(req.session.userId);
    const cart = user.cart;
    const total = cart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
// Show total price after taxes and limit to 2 decimal places
    const totalPrice = total * 1.0875;
    const totalPriceRounded = totalPrice.toFixed(2);
    if(cart.length != 0) {
        for (let i = 0; i < cart.length; i++) {
            console.log("inside for looP");
            res.render("shoppingcart", {
                "cart": cart,
                "pokeID": cart[i].pokeID,
                "quantity": cart[i].quantity,
                "price": cart[i].price,
                "subtotal": total,
                "total": totalPriceRounded,
                "totalPerItem": cart[i].price * cart[i].quantity,
                "status": cart[i].checkout
            })
        console.log(cart)
    }
} else {
    res.render("shoppingcart", {
        "cart": cart,
        "total": total,
        "subtotal": total,
        "total": totalPriceRounded
    })
}

});

// Clear cart
app.get("/clear", isAuth, async function (req, res) {
    const user = await UserModel.findById(req.session.userId);
    user.cart = [];
    await user.save();
    res.redirect("/shoppingcart");
});

app.post("/shoppingcart", isAuth, async function (req, res) {
    const { pokeID, quantity, price , checkout} = req.body;
    const user = await UserModel.findOne({ _id: req.session.userId });
    
    if (!user.cart) {
      user.cart = [];
    }

    const cartItem = {
        pokeID: pokeID,
        quantity: quantity,
        price: price,
        checkout: false,
        createdAt: new Date()
    };

    user.cart.push(cartItem);
    await user.save();
    // res.redirect("/userProfile");
    console.log(user.cart);
});


// ---------------
// -- CHECKOUT  --
// ---------------

  // Checkour current cart and add to history
  app.post("/checkout", isAuth, async function (req, res) {
    const { id, quantity, price , total, totalPerItem} = req.body;
    const user = await UserModel.findById(req.session.userId);
    const cart = user.cart;

    if (!user.history) {
      user.history = [];
    }

    const cartItem = {
        pokeid: id,
        quantity: quantity,
        price: price,
        total: total,
        totalPerItem: totalPerItem,
        createdAt: new Date()
    };

    console.log(id);
    user.history.push(cartItem);
    // empty user cart
    user.cart = [];
    await user.save();
    res.redirect("/userProfile");


});

// ----------------
// --   LOGOUT   --
// ----------------
app.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

app.get('/search', async (req, res) => {
    res.render('search');
});


// ----------------
// --   SEARCH   --
// ----------------

// Connect to search.ejs to search for pokemon by name,type, or id or height or weight from pokeapi.co



const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
    console.log(`Our app is running on port htpp://localhost:${ PORT }`);
});


app.use(express.static(__dirname + '/public'));
