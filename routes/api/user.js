const Router = require('koa-router');
const router = new Router();
const User = require('../../models/User')
const bcrypt = require('bcryptjs');
const tools = require('../../config/tools')
const gravatar = require('gravatar'); //全球公认头像的使用
const jwt = require('jsonwebtoken'); //token 认证
const config = require('../../config/default');
const passport = require('koa-passport');
//信息验证
const validateLoginInput = require('../../validation/login');
const validateRegisterInput = require('../../validation/register');
/**
 * @route GET api/users/test
 * @desc 用户测试接口'
 * @access 所以用户都可以访问
 */
router.get('/test', async ctx => {
    ctx.body = {
        msg: 'hello test'
    }
})
/**
 * @route POST api/users/register
 * @desc 用户注册接口
 * @access 可访问
 */
router.post('/register', async ctx => {

    //验证输入的信息
    const {
        errors,
        isValid
    } = validateRegisterInput(ctx.request.body);
    //信息有误
    if (!isValid) {
        ctx.status = 400;
        ctx.body = errors;
        return;
    }

    const {
        name,
        email,
        password
    } = ctx.request.body;

    const result = await User.find({
        email
    });
    //length>0 表示用户存在，否则表示不存在
    if (result.length > 0) {
        ctx.status = 500;
        ctx.body = '邮箱已存在!';
        return;
    }
    const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
    });
    const newUser = new User({
        name,
        password: tools.encrypt(password),
        email,
        avatar
    });
    //加密存在问题
    // await bcrypt.genSalt(10, function(err, salt) {
    //     bcrypt.hash(newUser.password, salt, function(err, hash) {
    //         // Store hash in your password DB.
    //         newUser.password=hash;
    //     });
    // });

    await newUser.save()
        .then(user => {
            ctx.status = 200;
            ctx.body = user
        })
        .catch(error => {
            ctx.status = 500;
            ctx.body = '用户存储失败'
            console.log(error);
        })

});
/**
 * @route POST api/users/login
 * @desc 用户登录接口
 * @access 都可访问
 */
router.post('/login', async ctx => {

    //验证输入的信息
    const {
        errors,
        isValid
    } = validateLoginInput(ctx.request.body);
    //信息有误
    if (!isValid) {
        ctx.status = 400;
        ctx.body = errors;
        return;
    }
    const {
        email,
        password
    } = ctx.request.body;

    const findResult = await User.find({
        email
    });
    const user = findResult[0];
    if (findResult.length === 0) {
        //表示不存在该用户
        ctx.status = 404;
        ctx.body = {
            message: '该用户不存在'
        };
        return;
    }
    //验证密码是否正确
    const verify = bcrypt.compareSync(password, user.password);
    if (verify) {
        //密码正确
        const payload = {
            name: user.name,
            email,
            avatar: user.avatar
        };
        //生成token
        const token = jwt.sign(payload, config.secretKey, {
            expiresIn: 3600
        });

        ctx.status = 200;
        ctx.body = {
            message: '验证成功',
            token: 'Bearer ' + token
        }
    } else {
        ctx.status = 500;
        ctx.body = {
            message: '密码错误'
        };
    }

})

/**
 * @route GET api/users/current
 * @desc 获取用户信息
 * @access 私密接口
 */
router.get('/current', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    const {
        password,
        ...userInfo
    } = ctx.state.user._doc;
    ctx.body = userInfo;
})
module.exports = router.routes();