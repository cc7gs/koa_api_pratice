const Router = require('koa-router');
const router = new Router();
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const passport = require('koa-passport');
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');


/**
 * @route api/profile/test
 * @desc 测试接口
 * @access 公用接口
 */
router.get('/test', async ctx => {
    ctx.body = 'profile work ...'
});
/**
 * @route GET api/profile
 * @desc 获取用户个人信息接口
 * @access 私有
 */
router.get('/', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    // console.log(ctx.state.user.id);
    const {
        id
    } = ctx.state.user;
    const profile = await Profile.find({
        user: id
    }).populate('user', ['name', 'avatar'])
    if (profile.length > 0) {
        ctx.status = 200;
        ctx.body = profile;
    } else {
        ctx.status = 404;
        ctx.body = {
            message: '该用户还没有个人信息'
        };
        return;
    }
})
/**
 * @route POST api/profile
 * @desc 更新保存用户信息
 * @access 私有
 */
router.post('/', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    // console.log(ctx.state.user.id);
    // const {user,handle,website,location,status,skills,bio,githubusername,social}=ctx.request.body;
    const requestInfo = ctx.request.body; //保存客户端发送过来的数据
    const {
        errors,
        isValid
    } = validateProfileInput(requestInfo);
    //信息有误
    if (!isValid) {
        ctx.status = 400;
        ctx.body = errors;
        return;
    }
    const profileFields = {}; //用于保存要更新和添加的数据
    profileFields.social = {};
    profileFields.user = ctx.state.user.id;
    for (key in requestInfo) {
        if (key === 'wechat' || key === 'qq') {
            profileFields.social[key] = requestInfo[key];
            break;
        }
        if (key === 'skills') {
            console.log(requestInfo[key]);
            profileFields[key] = requestInfo[key].split(',');
            break;
        }
        profileFields[key] = requestInfo[key];
    }
    const profile = await Profile.find({
        user: profileFields.user
    })
    if (profile.length > 0) {
        //更新数据
        const profileUpdate = await Profile.findOneAndUpdate({
            user: profileFields.user
        }, {
            $set: profileFields
        }, {
            new: true
        })
        ctx.body = profileUpdate;
        console.log(profileUpdate);
    } else {
        //添加数据
        await new Profile(profileFields).save()
            .then(profile => {
                ctx.status = 200;
                ctx.body = profile
            })
            .catch(error => {
                ctx.status = 500;
                ctx.body = '用户存储失败'
                console.log(error);
            })
    }
})

/**
 * @route GET /api/profile/all
 * @desc 获取所有用户信息
 * @access 公开
 */
router.get('/all', async ctx => {
    const profiles = await Profile.find({}).populate('user', ['name', 'avatar']);
    if (profiles.length > 0) {
        ctx.status = 200;
        ctx.body = profiles;
    } else {
        ctx.status = 404;
        ctx.body = {
            message: '目前还没有用户信息'
        };
    }
});

/**
 * @route POST /api/profile/experience
 * @desc 工作经验接口地址
 * @access 接口是私有的
 */
router.post('/experience', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    const {
        errors,
        isValid
    } = validateExperienceInput(ctx.request.body);
    //信息有误
    if (!isValid) {
        ctx.status = 400;
        ctx.body = errors;
        return;
    }
    //查找该用户信息
    const profile = await Profile.find({
        user: ctx.state.user.id
    })
    if (!profile.length) {
        ctx.status = 404;
        ctx.body = {
            message: '没有匹配的用户'
        };
        return;
    }
    //获取传递的参数
    const requestInfo = ctx.request.body;
    const profileFields = {};
    profileFields.experience = [];
    const newExp = {};
    for (key in requestInfo) {
        newExp[key] = requestInfo[key];
    }
    profileFields.experience.unshift(newExp);
    //添加教育经历
    const profileUpdate = await Profile.update({
        user: ctx.state.user.id
    }, {
        $push: {
            experience: profileFields.experience
        }
    }, {
        $sort: 1
    });

    if (profileUpdate.ok === 1) {
        //更新成功
        const profile = await Profile.find({
            user: ctx.state.user.id
        }).populate('user', ['name', 'avatar']);
        if (profile.length > 0) {
            ctx.status = 200;
            ctx.body = profile;
        }
    } else {
        ctx.status = 400;
        ctx.body = {
            message: '更新数据失败'
        };
    }
});

/**
 * @route POST /api/profile/education
 * @desc 工作经验接口地址
 * @access 接口是私有的
 */
router.post('/education', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    const {
        errors,
        isValid
    } = validateEducationInput(ctx.request.body);
    //信息有误
    if (!isValid) {
        ctx.status = 400;
        ctx.body = errors;
        return;
    }
    //查找该用户信息
    const profile = await Profile.find({
        user: ctx.state.user.id
    })
    if (!profile.length) {
        ctx.status = 404;
        ctx.body = {
            message: '没有匹配的用户'
        };
        return;
    }
    //获取传递的参数
    const requestInfo = ctx.request.body;
    const profileFields = {};
    profileFields.education = [];
    const newExp = {};
    for (key in requestInfo) {
        newExp[key] = requestInfo[key];
    }
    profileFields.education.unshift(newExp);
    //添加教育经历
    const profileUpdate = await Profile.update({
        user: ctx.state.user.id
    }, {
        $push: {
            education: profileFields.education
        }
    }, {
        $sort: 1
    });

    if (profileUpdate.ok === 1) {
        //更新成功
        const profile = await Profile.find({
            user: ctx.state.user.id
        }).populate('user', ['name', 'avatar']);
        if (profile.length > 0) {
            ctx.status = 200;
            ctx.body = profile;
        }
    } else {
        ctx.status = 400;
        ctx.body = {
            message: '更新数据失败'
        };
    }

});
/**
 * @toute DELETE /api/profile/experience?exp_id=XXX
 * @desc 删除工作经历
 * @access 私有接口
 */
router.delete('/experience', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    const {
        exp_id
    } = ctx.query;
    //查询
    const profile = await Profile.find({
        user: ctx.state.user.id
    });
    if (profile[0].experience.length === 0) {
        ctx.status = 404;
        ctx.body = {
            message: '还没有填写工作经历'
        }
        return;
    }
    const removeIndex = profile[0].experience.map(item => item.id)
        .indexOf(exp_id);
    //删除
    profile[0].experience.splice(removeIndex, 1);
    const profileUpdate = await Profile.findOneAndUpdate({
        user: ctx.state.user.id
    }, {
        $set: profile[0]
    }, {
        new: true
    });
    ctx.body = profileUpdate;
})

/**
 * @toute DELETE /api/profile/education?edu_id=XXX
 * @desc 删除教育经历
 * @access 私有接口
 */
router.delete('/education', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    const {
        edu_id
    } = ctx.query;
    //查询
    const profile = await Profile.find({
        user: ctx.state.user.id
    });
    if (profile[0].education.length === 0) {
        ctx.status = 404;
        ctx.body = {
            message: '还没有填写教育经历'
        }
        return;
    }
    const removeIndex = profile[0].education.map(item => item.id)
        .indexOf(edu_id);
    //删除
    profile[0].education.splice(removeIndex, 1);
    const profileUpdate = await Profile.findOneAndUpdate({
        user: ctx.state.user.id
    }, {
        $set: profile[0]
    }, {
        new: true
    });
    ctx.body = profileUpdate;
});
/**
 * @toute DELETE /api/profile/
 * @desc 删除用户
 * @access 私有接口
 */
router.delete('/', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    const uId = ctx.state.user.id;
    const profile = await Profile.deleteOne({
        user: uId
    });
    if (profile.ok === 1) {
        //将profile表中的用户删除
        const user = await User.deleteOne({
            _id: uId
        });
        if (user.ok !== 1) {
            ctx.state = 500;
            ctx.body = {
                message: '查找用户表异常'
            }
            return;
        }
        ctx.state = 200;
        ctx.body = {
            message: '用户删除成功'
        };
    } else {
        ctx.body = {
            message: '用户删除失败'
        }
    }

});
module.exports = router.routes();