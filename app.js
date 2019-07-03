const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const multer = require('multer');
//const pug = require('pug');
const upload = multer({ dest: '/tmp'});//应该放到内存，然后在具体的操作中转移
const fs = require("fs");
const path=require("path");//路径处理，比如join等

const mkdirp = require('mkdirp');//创建多级目录

//定义项目根目录
const ROOT_PATH = __dirname;
//定义本地数据文件地址
const DATA_FILE_PAHT = path.join(ROOT_PATH,'data');
//定义本地上传文件目录
const UPLOAD_PATH = path.join(DATA_FILE_PAHT,'upload');
//定义本地日志文件目录
const LOG_PATH = path.join(DATA_FILE_PAHT,'log');
//初始化开始
// 设置模板类型
app.set('view engine', 'pug');
// 设置模板文件路径
app.set('views', path.join(ROOT_PATH,'src','views'));
//定义静态文件目录
app.use('/public', express.static(path.join(ROOT_PATH,'public')));

//var multer  = require('multer');
 
//引入中间件解析post请求，这样才能直接使用req.body.表单名获取post信息，否则将返回undefiend，body为未定义
app.use(bodyParser.urlencoded({ extended: false }));


//gongong 函数
/*
name：存储错误日志
param：存储内容string，存储文件路径
auth：亚强
date：19.7.3
update:待改进，如果内容不是字符串，那么转换子串
cat：日志类型 
*/
function saveLogError(data,logPath){
  var myDate = new Date();
  if(!logPath){
    
    //获取年月日分层目录
    var logPath = path.join(LOG_PATH,'error-' + myDate.getFullYear() + (myDate.getMonth()+1) + myDate.getDate() + '.log');
  }
  data = "" + myDate.getFullYear() + '-' + (myDate.getMonth()+1) + '-' +  myDate.getDate() + " " + myDate.getHours()  + ':' + myDate.getMinutes() + ':' +myDate.getSeconds()  + " " + data  + "\r\n";
  //fs.appendFile 追加文件内容
  fs.appendFile(logPath,data, (error)  => {
    if (error) {
       console.log("追加文件失败" + error.message);
       return true;
    }
    console.log("追加成功");
    return false;
  });
}
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
app.get('/web/user/getUserOthers', function (req, res) {
  var data = {auth:'王晓晓'};
  // Make a request for a user with a given ID
  //axios.get('http://www.qiangshangkeji.com/user/api/getuserothers?id=203')；这里可以对应第三方交互地址，如果是内部业务，那么该地址应该配置localhost在内网访问提高速度，可增快40-70ms左右。
  axios.get('http://localhost:8081/web/user/getUserOthersapi?id=203')
  .then(function (response) {
    // handle success
    console.log(response);
    res.render('web/user/getUserOthers',response.data.data);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
    console.log('executed ok');
  });

  
    /*
    http://www.qiangshangkeji.com/user/api/getuserothers?id=203 端php代码案例：
    public function getUserOthers()
    {     
        $id = $this->request->param("id");
        if (empty($id)) {
            $response['code'] = '400';
            $response['data'] = array();
            $response['mes'] = 'id not exist';
        }else{
            $data = array('name'=>'tp框架小米粒' . $id);
            $response['code'] = '200';
            $response['data'] = $data;
            $response['mes'] = 'success';
        }

        echo json_encode($response);
        exit();
      }


    */
})
//案例五：get请求接口案例 http://localhost:8081/web/user/getUserOthersapi?id=203
app.get('/web/user/getUserOthersapi', function (req, res) {
  var data={};
  data.data ={name:'王晓晓' + req.query.id};
  data.code = '200';
  res.send(JSON.stringify(data));

})
//案例六：get请求一个表单页面
app.get('/web/user/submitpost', function (req, res) {
  var data={};
  res.render('web/user/submitpost',data);

})
//案例七：post表单提交后的接受页面
app.post('/web/user/submitpost', function (req, res) {
  var data={};
  data.name = req.body.name;//前面需要引入中间件解析post格式的请求
  data.url = req.body.url;
  res.render('web/user/submitpost',data);
})
/*
name：获取分层目录
param：存储根目录，存储文件名
auth：亚强
date：19.7.3
*/
function uploadFile(uploadPath,filename){
  var myDate = new Date();
  //获取年月日分层目录
  var savePathDir = path.join(UPLOAD_PATH,myDate.getFullYear().toString(),(myDate.getMonth()+1).toString(),myDate.getDate().toString());
  var savePath = path.join(savePathDir,filename);

  fs.readFile(uploadPath, function (err, data) {
    try {
      fs.accessSync(savePathDir, fs.constants.R_OK | fs.constants.W_OK);
      console.log('可以读写');
    } catch (err) {
      console.error('无权访问');
      mkdirp.sync(savePathDir,function(err){
      })
    }
    fs.writeFile(savePath, data, function (err) {
      if( err ){
        return false;
      }else{
        return {'path':savePath};
      }
     });
  });
}
 
 
//案例八：上传文件到本地的案例
app.get('/web/user/file_upload', function (req, res) {
  var data = {};
  res.render('web/user/file_upload',data);
});
app.post('/web/user/file_upload', upload.fields([{ name: 'weblogo', maxCount: 8 },{ name: 'usertitle', maxCount: 8 }]),function (req, res) {
  //正常开发可以使用for(var a in req.files) console.log(a);循环files，根据各个元素不同的name值a[0],a[1]或再次循环，进行不同的业务处理。当然前面使用upload.array,upload.single,upload.any代替upload.fields也可以。返回files结构不同。
  console.log(req.files);
  var filePath1 = uploadFile(req.files.weblogo[0].path,req.files.weblogo[0].originalname);//注意这里采用的是上传者电脑中的文件名命名，实际为了避免重复，一般重命名为一个唯一字符串名字+原来的扩展名的格式
  var filePath2 = uploadFile(req.files.usertitle[0].path,req.files.usertitle[0].originalname);
  //app.render('web/user/file_upload',{message:'上传成功啦！'});
 
  // if(filePath1 && filePath2){
  //   //这里进行业务加工，比如路径存储到数据库或者直接调用接口存储到数据库
  //   app.render('web/user/file_upload',{message:'上传成功啦！'});
  // }else{
  //   app.render('web/user/file_upload',{message:'上传失败，请稍后重试！'});
  // }
  saveLogError('test code');
  console.log(filePath1);
  console.log(filePath2);
  console.log('here');
  var data ={message:'上传成功啦！'};
  res.render('web/user/file_upload',data);
 
})





//案例八：上传文件到七牛云的案例，浏览器上传，本地接受传递成功后的地址。


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