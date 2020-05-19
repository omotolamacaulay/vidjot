const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');



const app = express();

// Map global Promise to get rid of warning

mongoose.Promise = global.Promise;

// connect to mongoose 
mongoose.connect('mongodb://localhost/vidjot-dev', {
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(()=> console.log('MongoDB Connected...'))
.catch(err => console.log(err))

// Load Idea Model

require('./models/Idea');
const Idea = mongoose.model('ideas');
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

// Method Override Middleware
app.use(methodOverride('_method'));

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

// Idea Index Page
app.get('/ideas', (req, res) => {
  Idea.find({})
  .sort({date: 'desc'})
  .lean()
  .then( ideas => {
    res.render('ideas/index', {
      ideas:ideas
    });
  });
 });

// Add Idea Form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add')  
});

// Edit Idea Form
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .lean()
  .then(
    idea => {
      res.render('ideas/edit', {
        idea:idea
      });
   }
  );
    
});


// process Form
app.post('/ideas', (req, res) => {
  let errors = [];
  if(!req.body.title){
    errors.push({text: 'Please add a title'})
  };
  if(!req.body.details){
    errors.push({text: 'Please add some details'})
  };
  if(errors.length > 0){
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
    
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    }
    new Idea(newUser)
      .save()
      .then(idea => res.redirect('/ideas'))
  }
});

// Edit Form
app.put('/ideas/:id', (req, res) => {
 Idea.findOne({
   _id: req.params.id
})
.then(idea  => {
// new values
idea.title = req.body.title;
idea.details = req.body.details;

idea.save()
  .then(
    idea => {
     res.redirect('/ideas');
    }
  )

})
});

const port = 5000;

app.listen(port, ()=> {
  console.log(`Server started on port ${port}`);
});