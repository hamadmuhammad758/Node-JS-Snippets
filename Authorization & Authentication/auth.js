// This file helps you authenticate new uesrs
// First register the  new user using hashed password 
// Authenticate user by passing correct credential
// Authenticate user by passing incorrect password
// Authenticate user by passing incorrect email

// 1. Import Mongoose and joi using 
//npm install mongoose 
//npm install joi


const bcrypt=require('bcrypt');
const mongoose=require("mongoose");
const Joi=require("joi");
const _=require("lodash"); // will help us pick specife key/value pairs from JSON

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


function validateUserAtRegistration(user) {
    const schema=Joi.object({
        name:Joi.string().min(5).max(10).required(),
        email:Joi.string().min(10).max(255).required(),
        password:Joi.string().min(5).max(1024).required()
    });
    const { error } =schema.validate(user);
    console.log(`validation ${error}`)
    return error;
}
// Create Validator to verify data provided for authentication

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

async function authenticateUser(userJSON) {
    // First validate the data using Joi
    // pick function of lodash would provide us required key/value pairs from a JSON and return this new JSON

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
            }
            else {
                console.log("Password In-Valid");
            }
            
        } else {
            console.log("Invalid Email");
        }
    }
}

// async function createUser(userJSON) {
//     if (!validateUserAtRegistration(userJSON)) {
//         console.log("New User Data is Valid");
//         try {
//             const salt = await bcrypt.genSalt(10); // to save from rainbow table attack 
//             // by mistake i used double brackets in following line and i was continously getting error, data and salt required
//             //userJSON.password=await bcrypt.hash((userJSON.password,salt));
//             userJSON.password=await bcrypt.hash(userJSON.password,salt);
        
//         } catch (error) {
//             console.log("Validation error by mongoose: "+error.message);
//         }
        
//         const user= new UserModel(userJSON);
//         try {
//              const result= await user.save();
//              console.log(result);
//         } catch (error) {
//             console.log("Validation error by mongoose: "+error.message);
//         }
       
//     }else{
//         console.log("New User Data is Not Valid");
//     }
// }

// // 8. call create User and supply the JSON object
// createUser(userJSON);

// //authentic user JSON
// authenticateUser(userJSON);

// const wrongPasswordJSON={name:"hamad",email:"mhamad756@gmail.com",password:"671271"};
// //Non- Authetic user JSON ( WRONG PASSWORD)
// authenticateUser(wrongPasswordJSON);

const wrongEmailJSON={name:"hamad",email:"ali@gmail.com",password:"123456789"};
authenticateUser(wrongEmailJSON);






