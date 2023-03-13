const express = require('express');
const partials = require('express-partials');
const path = require('path');
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./db.sqlite");
const app = express();
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
// Require validator
const validator = require('validator');
const PORT = 4001;

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(partials());

app.use(cookieParser());

app.set('trust proxy', 1) 

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, "/public")));

const csrfMiddleware = csurf({
  cookie: {
    maxAge: 300000000,
    secure: true,
    sameSite: 'none'
  }
});
  
app.use(csrfMiddleware);

const errorMessage = (err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN'){
    res.render('csrfError');
  } else {
    next();
  }
}
app.use(errorMessage) 

app.get('/', (req, res) => {
  res.render('order', {csrfToken: req.csrfToken()})
})


app.get('/contact', (req, res) => {
  res.render('contact', {csrfToken: req.csrfToken()})
})


app.get('/customer', (req, res) => {
  res.render('customer', {csrfToken: req.csrfToken()})
})

app.post('/submit', (req, res) => {
  res.send(`<p>Post successful!</p> <p>CSRF token used: ${req.body._csrf}</p>`);
});

app.post('/track', (req, res) => {
   // Validate form submission is an integer
    if (validator.isInt(req.body.customerId)) {
   // Change the query to a prepared statement
    db.all(
      `SELECT * FROM Employee WHERE EmployeeId = $customerId`, {$customerId: req.body.customerId}, (err, rows) => {
        if (rows) {
          res.status(200);
          res.json(rows);
        } else {
          res.status(200);
          res.json({ message: "No employees" });
        }
      }
    ); 
} else {
  res.json({message: "Invalid customer ID."});
  }
}
)

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`) );