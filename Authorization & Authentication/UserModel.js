// An example of validation of register user using Joi and Mongo Validator

// 1. Import Mongoose and joi using 
//npm install mongoose 
//npm install joi

const mongoose=require("mongoose");
const Joi=require("joi");

// 2. Connect with mongo db database

mongoose.connect("mongodb://localhost/NodeMongoDb")
        .then(()=> console.log("Connected Succesfully with NodeMongodb"))
        .catch(()=>console.log("Unable to connect with NodeMongodb"));

// 3 Create a userSchema and apply restrictions

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

// 4. Compile user schema to user Model

const UserModel=mongoose.model('User',userSchema);

// 5. Create a sample JSON object that we want to validate and then add to mongo db

const userJSON={name:"hamad",email:"mhamad756@gmail.com",password:"123456789"};

// 6. Create a joi validater function , it needs a sample schema with which it'll mactch your provided data
// error variable would be undefiend if joi doesn't found any validation error, otherwise error variable contains validation error

function validateUser(user) {
    const schema=Joi.object({
        name:Joi.string().min(5).max(10).required(),
        email:Joi.string().min(10).max(255).required(),
        password:Joi.string().min(5).max(1024).required()
    });
    const { error } =schema.validate(user);
    console.log(`validation ${error}`)
    return error;
}

// 7. create USER function will first call validateUser function by passing received JSON object
//    if JSON is valid then create new user Model using this JSON and save in db
//    put const result= await user.save(); in try catch because mongoose validation is still pending
//    to see the mongoose validator in action run this file more than one time bcz then joi validator will mark 
//    this JSON as correct but due to non-unique email mongoose validator will supply error

async function createUser(userJSON) {
    if (!validateUser(userJSON)) {
        console.log("New User Data is Valid");
        const user= new UserModel(userJSON);
        try {
             const result= await user.save();
             console.log(result);
        } catch (error) {
            console.log("Validation error by mongoose: "+error.message);
        }
       
    }else{
        console.log("New User Data is Not Valid");
    }
}

// 8. call create User and supply the JSON object
createUser(userJSON);





