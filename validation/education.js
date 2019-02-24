const Validator=require('validator');
const isEmpty=require('./is-empty'); //验证输入的值是否为空
module.exports=function validateExperienceInput(data){
    let errors={};
    let {school,degree,from}=data;

    school=!isEmpty(school)?school:'';
    degree=!isEmpty(degree)?degree:'';
    from=!isEmpty(from)?from:'';

    if(!Validator.isLength(school,{min:2,max:40})){
        errors.school='学校长度不能小于2位且超过40位'
    }
    if(Validator.isEmpty(school)){
        errors.school='学校不能为空'
    }

    if(Validator.isEmpty(degree)){
        errors.degree='学位不能为空'
    }
    if(Validator.isEmpty(from)){
        errors.from='起止日期不能为空'
    }

    return{
        errors,
        isValid:isEmpty(errors)
    }
}