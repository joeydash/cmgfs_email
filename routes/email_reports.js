var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pdf = require('html-pdf');
var ejs = require('ejs');
var helper = require('sendgrid').mail;
var sg = require('sendgrid')("**SG API key**");
var fs = require('fs');
var json2xls = require('json2xls');




router.get('/:id', function(req, res, next) {
    var dir = './public/data/'+req.params.id+"/";
    var date = new Date();
    var filename = req.params.id+date.getTime()+".xlsx";

    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'joeydash',
        database : 'cmgfs_app_db'
    });
    connection.connect();
    connection.query('SELECT * FROM '+req.params.id, function (error_1, results_1, fields_1) {
        if (error_1) res.send(error_1);
        else {
            res.json({code : "XLSX_CREATION_SUCCESS"});
            var xls = json2xls(results_1);
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
                fs.writeFileSync(dir+filename, xls, 'binary');
                sendMail(dir+filename,connection);
            }else {
                fs.writeFileSync(dir+filename, xls, 'binary');
                sendMail(dir+filename,connection);
            }

        }
    });
});
function sendMail(url,connection) {

    connection.query('SELECT * FROM email_to_send_reports_db', function (error_2, results_2, fields_2) {
        if (error_2) throw error_2;
        else {
            // for (var i =0; i < results_2.length; i++) {
            //     var template = ejs.render('email_template',{ name : results_2[i].name,email : url});
            //     var fromEmail = new helper.Email('joydassudipta@gmail.com');
            //     var toEmail = new helper.Email(results_2[i].email_id);
            //     var subject = 'CMGFS data';
            //     var content = new helper.Content('text/html', url);
            //     var mail = new helper.Mail(fromEmail, subject, toEmail, content);
            //     var request = sg.emptyRequest({
            //         method: 'POST',
            //         path: '/v3/mail/send',
            //         body: mail.toJSON()
            //     });
            //     sg.API(request, function (error, response) {
            //         if (error) throw error;
            //         console.log("Sent");
            //     });
            // }
        }
    });
}
module.exports = router;


