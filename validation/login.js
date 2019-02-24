const Validator=require('validator');
const isEmpty=require('./is-empty'); //验证输入的值是否为空
module.exports=data=>{
    let errors={};
    let {email,password,}=data;

    email=!isEmpty(email)?email:'';
    password=!isEmpty(password)?password:'';

    if(!Validator.isEmail(email)){
        errors.email='邮箱不合法'
    }
    if(Validator.isEmpty(email)){
        errors.email='邮箱不能为空'
    }
  
    if(!Validator.isLength(password,{min:6,max:15})){
        errors.password='密码长度不能小于6位且超过15位'
    }
    if(Validator.isEmpty(password)){
        errors.password='密码不能为空'
    }
  

    return{
        errors,
        isValid:isEmpty(errors)
    }
}