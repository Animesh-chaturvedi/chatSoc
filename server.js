var express = require ('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
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
  res.render("./landingPage");
});

app.post("/", function(req, res) {
    var name = req.body.name;
    var text = req.body.text;
    var newmessage = { name: name, text: text };
    Message.create(newmessage, function() {
      res.redirect("/");
  });
});


app.listen(port, ip, function () {
  console.log("Serve is runnig");
});