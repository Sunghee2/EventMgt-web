var express = require('express');
var multer = require('multer');
var uploadSetting = multer({dest:"../uploads"});
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/test', function(req, res, next) {
  res.render('test');
});

// router.post('/upload', uploadSetting.single('upload').function(req, res){
//   var tmpPath = req.file.path;
//   var fileName = req.file.filename;
//   var newPath = "../public/images/" + fileName;
//
//   fs.rename(tmpPath, newPath, function(err){
//     if(err){
//       console.log(err);
//     }
//
//     var html;
//
//     html="";
//   })
// })

module.exports = router;
