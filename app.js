const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');



const app = express();

// Load Routes

const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Map global Promise to get rid of warning

mongoose.Promise = global.Promise;

// connect to mongoose 
mongoose.connect('mongodb://localhost/vidjot-dev', {
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(()=> console.log('MongoDB Connected...'))
.catch(err => console.log(err))


// handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// // how middleware works
// app.use(function(req, res, next){
//   // console.log(Date.now());
//   req.name = 'Tola Macaulay'
//   next();
// });

// body parser middleware

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Method Override Middleware
app.use(methodOverride('_method'));

// express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// connect flash middleware
app.use(flash());


// global variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// index route
app.get('/', (req, res)=> {
  const title = 'Welcome';
  console.log(req.name)
  res.render('index', {
    title: title
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('about')
});


app.use('/ideas', ideas);
app.use('/users', users);

const port = 5000;

app.listen(port, ()=> {
  console.log(`Server started on port ${port}`);
});