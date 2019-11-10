//app.js
const fs=require('fs')
const express=require('express')
const http=require('http')
//文件上传中间件(指定上传的临时文件夹是/uploads)
const multer=require('multer')
let upload = multer({ dest: 'uploads/' })

let app=express();

const FILE_PATH="public/images/"

//HttpServer服务的中间件(public目录下的index.html为首页)
app.use(express.static('public'))


//文件上传的处理（avatar是上传时的filedName）
app.post('/upload', upload.single('avatar'), function (req, res, next) {
    //req.body是普通表单域
    //req.file是文件域
    console.log("file"+req.file);
    console.log("originalname"+req.file.originalname)
    console.log("path"+req.file.path)
    let msg={
        body:req.body, //req.file 是 `avatar` 文件
        file:req.file //req.body 对象中是表单中提交的文本字段(如果有)
    }
    // console.log(msg)
    //将临时文件上传到/public/images中
    let output=fs.createWriteStream(FILE_PATH+req.file.originalname)
    let input=fs.createReadStream(req.file.path)
    input.pipe(output)
    res.json(msg)
})


//接收前端的请求，返回上传图片的列表
app.get("/files",function (req,res) {
    fs.readdir('public/images',function (err,dir) {
        res.json(dir)
    })
})

//启动Express服务器
let server=http.createServer(app);
server.listen(8000,function () {
    console.log("start server at port 8000")
})