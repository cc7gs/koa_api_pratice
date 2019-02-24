const Koa = require('koa');
const json = require('koa-json');
const koaRouter = require('koa-router');
const bodyParse=require('koa-bodyparser')
const render = require('koa-ejs');
const path = require('path');
const app = new Koa();
const router = new koaRouter();


const things = [{
        name: 'wcc'
    },
    {
        name: 'wgs'
    },
    {
        name: 'wjy'
    }
];
//json pretty
app.use(json())
app.use(bodyParse())
//配置模板引擎
render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'layout',
    viewExt: 'html',
    cache: false,
    debug: false
});

//路由跳转
router.get('/', index);
router.get('/add',add);
router.post('/add',getData)
//index
async function index(ctx) {
    await ctx.render('index', {
        title: 'koa2 learning',
        things
    });
}
async function add(ctx){
    await ctx.render('add')
}
async function getData(ctx){
    const result= ctx.request.body;
    console.log(result);
    await things.push(result)
    ctx.redirect('/')
}

// app.use(async ctx=>{
//     ctx.body={name:'cc'};
// })

//配置路由模块
app.use(router.routes()).use(router.allowedMethods());
app.listen(3000, () => {
    console.log('listen at 3000');
})