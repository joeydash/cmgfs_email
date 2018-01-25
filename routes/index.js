var express = require('express');
var router = express.Router();
var fs = require('fs');
var pdf = require('html-pdf');
var ejs = require('ejs');
/* GET home page. */
router.get('/', function(req, res, next) {
    // var options = { format: 'A4' };
    // var str = fs.readFileSync('views/email_template.ejs', 'utf8');
    // var template = ejs.render(str,{ name : "joeydash",url : "joeydash"});
    // pdf.create(template, options).toFile('./businesscard.pdf', function(error_1, result_1) {
    //     if (error_1) return console.log(error_1);
    //     console.log(result_1); // { filename: '/app/businesscard.pdf' }
    // });
    // console.log(str);
    // res.send(template)
    res.render('index',{ name : "joeydash", url : "joeydash"});
});

module.exports = router;
