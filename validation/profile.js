const Validator=require('validator');
const isEmpty=require('./is-empty'); //验证输入的值是否为空
module.exports=function validateProfileInput(data){
    let errors={};
    let {handle,status,skills}=data;

    handle=!isEmpty(handle)?handle:'';
    status=!isEmpty(status)?status:'';
    skills=!isEmpty(skills)?skills:'';

    if(!Validator.isLength(handle,{min:2,max:40})){
        errors.handle='handle长度不能小于2位且超过40位'
    }
    if(Validator.isEmpty(handle)){
        errors.handle='handle不能为空'
    }

    if(Validator.isEmpty(status)){
        errors.status='职位不能为空'
    }
    if(Validator.isEmpty(skills)){
        errors.skills='技能不能为空'
    }

    return{
        errors,
        isValid:isEmpty(errors)
    }
}