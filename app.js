// 开启http
let http = require('http');
// 生成路径
let path = require('path');
// 引入文件
let fs = require('fs');
// mime模块 第三方模块
let mime = require('mime');
// querystring模块
let querystring = require('querystring');
// 配置网站根目录
let rootPath=path.join(__dirname,'www');
// console.log(rootPath); e:\学习文件\node.js文件\apach路径生成\www

// 开启服务
http.createServer((req,res)=>{
    console.log('请求来了');
    // 生成绝对路径
    let filePath=path.join(rootPath,querystring.unescape(req.url))
    // console.log(filePath); e:\学习文件\node.js文件\apach路径生成\www\
    // 判断访问这个目录是否存在
    let isExist=fs.existsSync(filePath);
    if(isExist){
        // 如果目录存在,生成文件列表
        fs.readdir(filePath,(err,files)=>{
            if(err){
                // 如果是文件   读取文件,返回读取的文件
                fs.readFile(filePath,(err,data)=>{
                    // res.end(data);
                    if(err){

                    }else {
                         // 判断文件类型是什么 设置不同的mime类型返回给浏览器
                        res.writeHead(200, {
                            "content-type": mime.getType(filePath)
                          });
                    }
                })
            }else {
                // 如果是文件夹
                // 直接判断是否存在首页
                if(files.indexOf("index.html")!=-1){
                    // 有首页
                    // 直接读取首页
                    fs.readFile(path.join(filePath,"index.html"),(err,data)=>{
                        if(err){
                            console.log(err);
                        }else {
                            res.end(data);
                        }
                    })
                }else {
                    // 如果没有首页
                    let backdata="";
                    for (let i=0;i<files.length;i++){
                        backdata+=`<h2><a href="${req.url=='/'?'':req.url}/${files[i]}">${files[i]}</a></h2>`;
                    }
                    res.writeHead(200, {
                        "content-type": "text/html;charset=utf-8"
                      });
                      res.end(backdata);
                }

            }
        })
    }else{
        // 如果目录不存在,返回404
        res.writeHead(404, {
            "content-type": "text/html;charset=utf-8"
          });
        res.end(`
            <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
            <html><head>
            <title>404 Not Found</title>
            </head><body>
            <h1>Not Found</h1>
            <p>The requested URL /index.hththt was not found on this server.</p>
            </body></html>
        `);
    }
    // res.end('you come')
}).listen(88,'127.0.0.1',()=>{
    console.log('开始监听127.0.0.1:88');
})