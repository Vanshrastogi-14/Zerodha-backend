require("dotenv").config();
const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const cors = require('cors');
const bodyParser = require("body-parser");
const mongoUrl = process.env.MONGO_URL;
const {Holding} = require("./models/holdingsModel");
const {Position} = require("./models/positionsModel");
const {Order} = require("./models/ordersModels");
const {User} = require('./models/userModel');
const bcrypt = require("bcryptjs");
const {createSecretToken} = require('./utils/secretToken');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true
// }));
app.use(cors({
    origin: ["http://localhost:3000","http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(port, () => {
  console.log("listening to port 8080...");
  mongoose.connect(mongoUrl);
  console.log("connection established");
});

// app.get("/addPositions", (req, res) => {
//   let tempPosition = [
//     {
//       product: "CNC",
//       name: "EVEREADY",
//       qty: 2,
//       avg: 316.27,
//       price: 312.35,
//       net: "+0.58%",
//       day: "-1.24%",
//     },
//     {
//       product: "CNC",
//       name: "JUBLFOOD",
//       qty: 1,
//       avg: 3124.75,
//       price: 3082.65,
//       net: "+10.04%",
//       day: "-1.35%",
//     },
//   ];

//   tempPosition.forEach((item) => {
//     let holding = new Position({
//       product: item.product,
//       name: item.name,
//       qty: item.qty,
//       avg: item.avg,
//       price: item.price,
//       net: item.net,
//       day: item.day,
//     });
//     holding.save();
//   });
//   res.send("done");
// });


app.get("/allHoldings", async(req,res)=>{
  let allHoldings = await Holding.find({});
  res.json(allHoldings);
});

app.get("/allPositions", async(req,res)=>{
  let allPositions = await Position.find({});
  res.json(allPositions);
});

app.post("/newOrder",async(req,res)=>{
  let newOrder = new Order({
    name: req.body.name,
    qty: req.body.qty,
    price:req.body.price,
    mode:req.body.mode,
  });
  console.log(req.body.name)
  await newOrder.save();
  res.send("order added")
});

app.get("/allOrders",async(req,res)=>{
  let allOrders = await Order.find({});
  res.json(allOrders);
});

app.post("/signup",async(req,res)=>{
  const existingUser = await User.findOne({ email:req.body.email });
  if (existingUser) {
      console.log("exists");
      return res.json({ message: "User already exists" });
    }
  let pass = req.body.password;
  pass = await bcrypt.hash(pass,12);
  let newUser = new User({
    email:req.body.email,
    username:req.body.username,
    password:pass,
  });
  await newUser.save();
  console.log(newUser.email);
  const token = createSecretToken(newUser.email);
  console.log("signup:",token);
  res.cookie("token", token,{
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true, newUser });
});

app.post("/login",async(req,res)=>{
  let {email,password} = req.body;
  if(!email || !password ){
      return res.json({message:'All fields are required'})
    }
    // verify credentials
  const user = await User.findOne({ email });
    if(!user){
      return res.json({message:'Incorrect password or email' }) 
    }
  const auth = await bcrypt.compare(password,user.password);
  if (!auth) {
      return res.json({message:'Incorrect password or email' }) 
    }
  const token = createSecretToken(user.email);
  console.log("login:",token);
     res.cookie("token", token, {
       withCredentials: true,
       httpOnly: false,
     });
     res.status(201).json({ message: "User logged in successfully", success: true });      
});

app.get("/logout",(req,res)=>{
  res.cookie("token","",{
       withCredentials: true,
       httpOnly: false,
     });
  res.send("done");  
});

