
const bcrypt=require('bcrypt');

const userJSON={name:"hamad",email:"mhamad756@gmail.com",password:"123456789"};

async function hashingPassword(InputJson) {
    console.log("JSON Before hashing Paasword: "+JSON.stringify(InputJson));
    const salt = await bcrypt.genSalt(10); // to save from rainbow table attack
    InputJson.password =await bcrypt.hash(InputJson.password,salt);   
    console.log("JSON After hashing Paasword"+JSON.stringify(InputJson));
}

hashingPassword(userJSON);


// Output 
// Before{"name":"hamad","email":"mhamad756@gmail.com","password":"123456789"}
// After{"name":"hamad","email":"mhamad756@gmail.com","password":"$2b$10$z.6TAFPmsYjlQWzfv2thDuRJYhYkmHE479MvIBHj49/f8F6MIfzQC"}
