const Koa=require('koa');
const KoaRouter=require('koa-router');
const bodyParser=require('koa-bodyparser');
const mongoose=require('mongoose');
const config=require('./config/default')
const passport = require('koa-passport');

const router=new KoaRouter();
const app=new Koa();

app.use(bodyParser());



//连接数据库
mongoose.connect(config.mogoUrl,{
    useNewUrlParser:true
}).then(res=>{
    console.log('mongoose connectd...');
})
.catch(error=>{
    console.log(error)
})

//引入 user.js
const user=require('./routes/api/user');
//引入 profile.js
const profile=require('./routes/api/profile');

//初始化 passport
app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport);

//配置路由地址
router.use('/api/users',user);
router.use('/api/profile',profile);
//配置路由
app.use(router.routes()).use(router.allowedMethods());
const port=process.env.PORT||5000;
//监听端口
app.listen(port,()=>{
    console.log(`listing at ${port}`)
})