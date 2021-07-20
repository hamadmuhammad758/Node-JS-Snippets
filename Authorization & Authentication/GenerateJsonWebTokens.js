

// In this file we will look at how to generate new JSON Web tokens 

const jwt=require("jsonwebtoken");

const jwtPrivateKey="123456";

console.log(jwt.sign({name:"hamad",admin:true},jwtPrivateKey));


