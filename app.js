const koa = require('koa');
app = new koa();

app.use(async(ctx, next) => {
    try {
        await next();
    } catch (error) {
        console.log(error.statusCode);
        // 给用户显示信息
        ctx.status = error.statusCode || error.status || 500;
        // ctx.type = "json";
        ctx.type = 'text';
        if (error.expose) {
            ctx.body = error.message;
        } else {
            ctx.body = error.stack;
        }
    }
});

app.use(async(ctx, next) => {
    //请求操作
    await next();
    // 获取响应头，印证执行顺序
    const rt = ctx.response.get("X-Response-Time");
    console.log(`输出计时：${ctx.method} ${ctx.url} - ${rt}`);
});

// 响应时间统计中间件
app.use(async(ctx, next) => {
    const start = Date.now();
    console.log("开始计时");
    await next();
    const ms = Date.now() - start;
    ctx.set("X-Response-Time", `${ms}ms`);
    console.log("计时结束");
});

app.use(async(ctx, next) => {
    err = new Error('unknown error!');
    err.status = 401;
    err.expose = true;
    throw err;
});

app.use(async(ctx, next) => {
    // await next();
    ctx.type = 'html';
    ctx.body = '<h1>hello koa!</h1>'
        // console.log("1---> ", ctx);
        // console.log("2---> ", ctx.body);
        // ctx.body 代理了  ctx.response.body
        // console.log("3---> ", ctx.response.body);

});
// 监听全局错误事件
app.on("error", err => {
    // console.error(err);
});
app.listen(3000);