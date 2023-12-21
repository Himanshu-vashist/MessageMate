

 // Example Chat model definition (assuming you are using Mongoose)
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
   from: {
    type: String,
    required:true,
},
to:{
    type: String,
    required:true,
},
message:{
    type: String,
    
},
});
const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;



