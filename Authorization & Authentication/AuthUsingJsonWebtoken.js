// Authenticate the user using JSON Web Tokens
// Install API client like Postman or Insomnia (Preffered) for testing
// User will provide credentials and we will return JSON WEb token if authenticated

//Import express framework and create a router to handle incoming requests

const express = require('express');
const app = express();
const bcrypt=require('bcrypt');
const mongoose=require("mongoose");
const Joi=require("joi");
const _=require("lodash"); // will help us pick specife key/value pairs from JSON
const jwt=require("jsonwebtoken");

// Never Hard Code your secrets inside code file use enviroment variables for this
const jwtPrivateKey="123456";

// To read body property as JSON Object use the following middleware component
app.use(express.json()); 


// Connect with mongo db database

mongoose.connect("mongodb://localhost/NodeMongoDb")
        .then(()=> console.log("Connected Succesfully with NodeMongodb"))
        .catch(()=>console.log("Unable to connect with NodeMongodb"));

//Create a userSchema and apply restrictions

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required: true,
        minlength:5,
        maxlength:10
    },
    email:{
        type:String,
        required: true,
        unique: true,
        minlength:10,
        maxlength:255
    },
    password:{
        type:String,
        required: true,
        minlength:5,
        maxlength:1024
    }

});

//Compile user schema to user Model
const UserModel=mongoose.model('User',userSchema);

function validateAutheticationData(user) {
    // While logging we only would validate email and password
    const schema=Joi.object({
        email:Joi.string().min(10).max(255).required(),
        password:Joi.string().min(5).max(1024).required()
    });

    const { error } =schema.validate(user);
    console.log(`validation ${error}`)
    return error;
}

// Create a route handler to process incoming request
app.get('/',async  (req, res) => {
    userJSON=req.body;
    // First Validate the user using Joi 
    requiredUserData=_.pick(userJSON,['email'],['password']);
    // Ask JOI to check the input data
    if(!validateAutheticationData(requiredUserData)){
        console.log("\n\nAuth data valid");
        // Check db if user of provided email exists
        const user=await UserModel.findOne({email:requiredUserData.email});
        if (user) {
            console.log("Email Valid");
            // If user exists then use bcrypt.compare to match input password with hashed password
            const isPasswordCorrect=await bcrypt.compare(requiredUserData.password,user.password);
            if(isPasswordCorrect){
                console.log("Password Valid");
                // Genertae jwt webstoken and embedd additional required information
                const token=jwt.sign({name:"hamad",admin:true},jwtPrivateKey)     
                // set the response header with the json web token    
                res.header("x-auth-token",token).status(200).send("Valid User");       
            }
            else {
                console.log("Password In-Valid");
            }
            
        } else {
            console.log("Invalid Email");
        }
    }
    res.send('Welcome'+JSON.stringify(req.body));
});

// Create a server on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

