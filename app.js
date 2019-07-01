var express = require('express');
var app = express();
//const pug = require('pug');

//var fs = require("fs");



//初始化开始
// 设置模板类型
app.set('view engine', 'pug');
// 设置模板文件路径
app.set('views', './src/views');
//定义静态文件目录
app.use('/public', express.static('public'));





//定义路由，分三层 业务大类/控制器/方法
/*
view：也就是视图层，分三层，与路由对应。业务大类/控制器/方法
controler：控制器，也就是app.all()，app.get,app.post等的第二个参数，函数的方法体。
model:数据层，可以直接定义一个单独的自定义模块用于处理数据关系。本框架，model直接写入到control方法体内部，一般是直接请求ajax后端接口，也可以自己组织数据或者自己去加载mysql的模块取数据，待改进。
*/
/*
依赖：express，pug，axios

*/
/*
待处理：
访问日志记录。当然可以直接看nginx代理日志。
异常处理代码
开发模式与生产模式区分定义
安全等
将路由和配置文件应该单独拿出去，把路由全部放到一个文件中，应该按照应用名/控制器名命名文件，方法名放到文件内部去。这样寻址，也就是根据url分析要加载的控制器块，从而调用，不用每次启动加载全部的监听。待议。可能这种速度更省一些资源，但是速度好像慢了。待议吧。
*/
/*
tips：
1.之前只在全局-g安装了express，使用res.render报错Error: Cannot find module 'pug'     at Function.Module._resolveFilena...，即使本地和全局都安装了pug，我本地安装express后问题解决。*/

//案例一：获取一个静态css文件,直接访问http://127.0.0.1:8081/public/css/index.css
//案例二：请求页面地址，直接返回内容
app.get('/web/getInfo', function (req, res) {
   res.send("/web/getInfo message" );
})
//案例三：通过模板解析,路径我们的确定规则分三层，业务大类/控制器/方法
app.get('/web/user/getUserInfo', function (req, res) {
	var data = {auth:'王晓晓'};
	res.render('web/user/getUserInfo',data);
    /*
    //下面2行，效果与res.render一样，建议用res.render
    var html = pug.renderFile('src/Views/web/user/getUserInfo.pug',data);
    res.send(html);
    */
})

//案例四：通过模板解析 控制器中加入ai模块的ajax向php接口请求数据，并加载到模板中
app.get('/web/user/getUserInfo', function (req, res) {
	var data = {auth:'王晓晓'};
	res.render('web/user/getUserInfo',data);
    /*
    //下面2行，效果与res.render一样，建议用res.render
    var html = pug.renderFile('src/Views/web/user/getUserInfo.pug',data);
    res.send(html);
    */
})
//案例五：post请求解析


//案例六：上传文件到七牛云的案例，浏览器上传，本地接受传递成功后的地址。
//案例七：上传文件到本地的案例
//案例八：session本地处理案例
//案例九：session统一存放到redis的案例。
//案例十：cookie的处理案例
//案例十一：登录，退出账户案例。包括与php接口交互登录密码验证是否成功的接口判断。


//处理非法请求
app.get('/*', function (req, res) {
	res.send("error url " );
})

// //初始化post请求中间件以及文件上传中间件
// var bodyParser = require('body-parser');//处理application/x-www-form-urlencoded 的post请求中间件
// var multer  = require('multer');//文件上传中间件


// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(multer({ dest: '/tmp/'}).array('image'));
 

// app.post('/file_upload', function (req, res) {
 
//    console.log(req.files[0]);  // 上传的文件信息
 
//    var des_file = __dirname + "/" + req.files[0].originalname;
//    fs.readFile( req.files[0].path, function (err, data) {
//         fs.writeFile(des_file, data, function (err) {
//          if( err ){
//               console.log( err );
//          }else{
//                response = {
//                    message:'File uploaded successfully', 
//                    filename:req.files[0].originalname
//               };
//           }
//           console.log( response );
//           res.end( JSON.stringify( response ) );
//        });
//    });
// })
 
var server = app.listen(8081, function () {
 
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})








// const pug = require('pug');

// // 编译这份代码
// const compiledFunction = pug.compileFile('template.pug');

// // 渲染一组数据
// console.log(compiledFunction({
//   name: '李莉'
// }));
// // "<p>李莉的 Pug 代码！</p>"

// // 渲染另外一组数据
// console.log(compiledFunction({
//   name: '张伟'
// }));
// // "<p>张伟的 Pug 代码！</p>"

// // 编译并使用一组数据渲染 template.pug
// console.log(pug.renderFile('template.pug', {
//   name: 'Timothy'
// }));
// // "<p>Timothy 的 Pug 代码！</p>"