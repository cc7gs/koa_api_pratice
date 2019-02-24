const config=require('./default');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;
// const User=require('../models/User');
const mongoose=require('mongoose');
const User=mongoose.model('users');
module.exports=passport=>{
    passport.use(new JwtStrategy(opts,async (jwt_payload,done)=>{
        const user=await User.findOne(jwt_payload.id);
        if(user){
            done(null,user);
        }else{
            done(null,false);
        }
    }))
}