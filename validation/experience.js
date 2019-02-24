const Validator=require('validator');
const isEmpty=require('./is-empty'); //验证输入的值是否为空
module.exports=function validateExperienceInput(data){
    let errors={};
    let {title,location,from}=data;

    title=!isEmpty(title)?title:'';
    location=!isEmpty(location)?location:'';
    from=!isEmpty(from)?from:'';

    if(!Validator.isLength(title,{min:2,max:40})){
        errors.title='标题长度不能小于2位且超过40位'
    }
    if(Validator.isEmpty(title)){
        errors.title='标题不能为空'
    }

    if(Validator.isEmpty(location)){
        errors.location='住址不能为空'
    }
    if(Validator.isEmpty(from)){
        errors.from='起止日期不能为空'
    }

    return{
        errors,
        isValid:isEmpty(errors)
    }
}