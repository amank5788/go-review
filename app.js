const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const product = require('./models/product');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const reviewRoutes = require('./routes/reviews'); 

const mongodbURL = process.env.MONGODB_URL || 'mongodb://localhost:27017/productdb'
mongoose.connect('mongodbURL', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();
let port = process.env.PORT || 3000;

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    console.log(req.session)   
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/products/apple', (req, res) => {
    res.render('apple');
   });
   app.get('/products/dell', (req, res) => {
    res.render('dell');
   });
   app.get('/products/asus', (req, res) => {
    res.render('asus');
   });
   app.get('/products/HP', (req, res) => {
    res.render('HP');
   });
   app.get('/products/iphone', (req, res) => {
    res.render('iphone');
   });
   app.get('/products/samsung', (req, res) => {
    res.render('samsung');
   });
   app.get('/products/xiomi', (req, res) => {
    res.render('xiomi');
   });
   app.get('/products/iwatch', (req, res) => {
    res.render('iwatch');
   });
   app.get('/products/swatch', (req, res) => {
    res.render('swatch');
   });
   app.get('/products/xwatch', (req, res) => {
    res.render('xwatch');
   });
app.use('/', userRoutes);
app.use('/products', productRoutes)
app.use('/products/:id/reviews', reviewRoutes)

app.get('/', (req, res) => {
    res.render('home')
});


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(port, () => {
    console.log('SERVING ON http://localhost:',{port});
});


 