var express = require ('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs')
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ip = "localhost";
const port = 3000;

mongoose.connect("mongodb://localhost/chatSoc", { useNewUrlParser: true },function(err, db){
  if(err){
    console.log(err);
  }else{
    console.log("connected db")
    //console.log(db);
  }
});



//User Schema

var userSchema = new mongoose.Schema({
  name: String,
  password: String,
  is_active: {type : Boolean , default:false},
});

var User = mongoose.model("User",userSchema);

//Message Schema

var messageSchema = new mongoose.Schema({
  name: String,
  text: String,
});

var Message = mongoose.model("Message",messageSchema);

app.use(express.static("./"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine","ejs");

//Routes

app.get("/", function(req, res) {
  Message.find({}, function(err, allMessages) {
    if (err) {
      console.log(err);
    } else {
      res.render("landingPage.ejs");
    }
  });
});

app.post("/", function(req, res) {
  var message = new Message(req.body);
  message.save((err) =>{
    if(err)
      sendStatus(500);
    io.emit('message', req.body);
    res.redirect("/");
  })
});


io.on('connection', () =>{
  console.log('a user is connected')
})


app.listen(port, ip, function () {
  console.log("Serve is runnig");
});