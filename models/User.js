const {model,Schema} = require('mongoose')
const UserSchema = new Schema({
    name: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    password:{
        type:String,
        required:true
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },

})
module.exports=User=model('users',UserSchema);