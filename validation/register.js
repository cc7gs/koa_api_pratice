const Validator=require('validator');
const isEmpty=require('./is-empty'); //验证输入的值是否为空
module.exports=data=>{
    let errors={};
    let {name,email,password,password2}=data;

    name=!isEmpty(name)?name:'';
    email=!isEmpty(email)?email:'';
    password=!isEmpty(password)?password:'';
    password2=!isEmpty(password2)?password2:'';

    if(!Validator.isLength(name,{min:2,max:10})){
        errors.name='名字长度不能小于2位且超过10位'
    }
    if(Validator.isEmpty(name)){
        errors.name='名字不能为空'
    }
    if(!Validator.isEmail(email)){
        errors.email='邮箱不合法'
    }
    if(Validator.isEmpty(email)){
        errors.email='邮箱不能为空'
    }
    if(!Validator.equals(password,password2)){
        errors.password='两次输入密码不一致'
    }
    
    if(!Validator.isLength(password,{min:6,max:15})){
        errors.password='密码长度不能小于6位且超过15位'
    }
    if(Validator.isEmpty(password)&&Validator.isEmpty(password2)){
        errors.password='密码不能为空'
    }
  

    return{
        errors,
        isValid:isEmpty(errors)
    }
}