const bcrypt=require('bcryptjs')  //密码加密
const tools={
    encrypt:function(password){
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        return hash;
    }
}
module.exports=tools;