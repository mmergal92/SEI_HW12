//DEPENDENCIES
const express = require ('express');
const app = express ();
const PORT = 3000;
const mongoose = require('mongoose');
//DELETE + UPDATE
const methodOverride = require('method-override');

//CONFIGURATION
mongoose.connect('mongodb://localhost:27017/basiccrud', 
{useNewURLParser: true});
// mongoose.connection.once('open', () => {
//     console.log('conected to mongo');
// });

// Connection Error/Success
const db = mongoose.connection;
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

db.on( 'open' , ()=>{
  console.log('Connection made!');
});

const logsData = require('./models/logs.js');

//MIDDLEWARE
app.use(express.urlencoded({extended:true}));
app.use((req,res,next) =>{
    console.log("running middleware")
    next();
})
//for DELETE + UPDATE
app.use(methodOverride('_method'))

//For styling
app.use('/public', express.static('public'));

//ROUTES
//Index route
// app.get('/logs', (req, res) =>{
//     res.render('index.ejs')
// })

//Index Route for mongodb
app.get('/logs', (req, res) => {
  // console.log("index works")
  logsData.find({}, (err, allLogs) => {
      res.render('index.ejs', {
        Data: allLogs,
      });
  });
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


//Show Route
app.get('/logs/:id', (req,res)=>{
  logsData.findById(req.params.id, (err, oneLogFound) =>{
    res.render('show.ejs',{
      logShow: oneLogFound,
  })
});
// console.log('show route works')
});

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

//UPDATE LAB - EDIT
app.get('/logs/:id/edit', async(req, res)=>{
  logsData.findById(req.params.id, (err, oneLogs)=>{
    console.log(oneLogs)
    res.render('edit.ejs',{
      logShow: oneLogs,
    })
    console.log('edit route shows')
  })
})

//UPDATE LAB 
app.put('/logs/:id', (req, res) => { 
	if(req.body.shipIsBroken === 'on'){ 
		req.body.shipIsBroken = true
	} else { 
		req.body.shipIsBroken = false
	}
	logsData.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updateLog) =>{
    if (err){
      res.send(err)
    }else{
      res.redirect('/logs/' + req.params.id); 
    }
  })
});

//DELETE
app.delete('/logs/:id', (req,res) =>{
  // need to find the mongoID to find and remove
  logsData.deleteOne({_id:req.params.id}, (err, deletedLog)=>{
    if (err){
      res.send(err)
    }else{
    // console.log(logsData);
    res.redirect('/logs/');
  }
  });
})

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