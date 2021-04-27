//DEPENDENCIES
const express = require ('express');
const app = express ();
const PORT = 3000;
const mongoose = require('mongoose');

//CONFIGURATION
mongoose.connect('mongodb://localhost:27017/basiccrud', 
{useNewURLParser: true});
// mongoose.connection.once('open', () => {
//     console.log('conected to mongo');
// });
const db = mongoose.connection;

// Connection Error/Success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

db.on( 'open' , ()=>{
  console.log('Connection made!');
});

const logsData = require('./models/logs.js');

//MIDDLEWARE
app.use(express.urlencoded({extended:true}));
// app.use((req,res,next) =>{
//     console.log("running middleware")
//     next();
// })

//ROUTES
//Index route
// app.get('/logs', (req, res) =>{
//     res.render('index.ejs')
// })

//Index Route for mongodb
app.get('/logs', (req, res) => {
  console.log("index works")
  logsData.find({}, (err, logsDatas) => {
      res.render('index.ejs', {
        Data: logsDatas,
      });
  });
});

//Show Route
app.get('/logs/:id', (req,res)=>{
    logsData.find({}, (err, logsDatas) =>{
      res.render('show.ejs',{
        logShow: logsDatas[req.params.id]
    })
  });
  console.log('show route works')
});

// Create route
// app.post('/logs', (req, res) =>{
//     console.log('create route accessed');
//     if(req.body.shipIsBroken === 'on'){
//         req.body.shipIsBroken = true
//     } else { 
//         req.body.shipIsBroken = false
//     }
//     res.send(req.body)
// //     // data.push(req.body)
// //     // res.redirect('/logs/' + (data.length-1))
// })

// New route
app.get('/logs/new', (req, res)=>{
  console.log('new form loads')
  res.render('new.ejs')
})

//Create route updated for MongoDB POST
app.post('/logs', (req, res) =>{
    console.log('create route accessed');
    if(req.body.shipIsBroken === 'on'){
      req.body.shipIsBroken = true
  } else { 
      req.body.shipIsBroken = false
  }
    logsData.create(req.body, (err, createdData) =>{
    // data.push(req.body)
    res.redirect('/logs/');
    });
});

//Adding Intial Data to MongoDB

// app.get('/logs/', (req,res) => {
//     console.log(req.body)
//     console.log(res.body)
//     logsData.create([{
//         title: "Test 1",
//         entry: "This is test 1 text",
//         shipIsBroken: true
//     },
//     {
//         title: "Test 2",
//         entry: "This is test 2 text",
//         shipIsBroken: false
//     },
//     {
//         title: "Test 3",
//         entry: "This is test 3 text",
//     }
//     ], (err, data) =>{
//         console.log(err)
//         console.log(data)
//         res.render('index.ejs')
//     });
// })


//LISTENER
app.listen(PORT, ()=> {
    console.log('listening on port ', PORT)
})