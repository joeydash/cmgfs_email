var mysql = require('mysql');
var json2xls = require('json2xls');
var fs = require('fs');
var helper = require('sendgrid').mail;
var sg = require('sendgrid')("**SG API key**");
var ejs = require('ejs');



var days=1;
var hours = 1;
var tables  = ["customer", "eateryeval","noneateryeval"];
var headings = [
    {
        "id": "id",
        "member": "member",
        "phone": "phone",
        "Date": "date",
        "shop": "shop",
        "1col": "Quality of the Products/Service",
        "1comment": "Comments:",
        "2col": "Quantity for the price( if applicable)",
        "2comment": "Comments:",
        "3col": "Quality of service by the shop staff",
        "3comment": "Comments:",
        "4col": "Speed of service",
        "4comment": "Comments:",
        "5col": "Staff /Shop/Utensil Hygiene",
        "5comment": "Comments:",
        "6col": "Did the staff neglect you when you approached",
        "7col": "Did the staff shout or respond in an unpleasant manner:",
        "8col": "Did the item match with your requirement: ",
        "9col": "Any specific remark/complaint on products/ service purchased by you",
        "10col": "Any product or service which is a necessity to be provided by shop:",
        "11col": "Any other feed back",
        "13col": "Customer name and contact with roll number",
        "12col": "Overall remarks by CMGFS MEMBER"
    },
    {
        "id": "id",
        "member": "Member",
        "phone": "Phone",
        "date": "Date",
        "shop": "Shop",
        "1col": "Hygiene of the serving place and dining place",
        "1comment": "Comments:",
        "2col": "Hygiene of the cooking area",
        "2comment": "Comments:",
        "3col": "Quality & Quantity",
        "3comment": "Comments:",
        "4col": "Rating for price of Items",
        "4comment": "Comments:",
        "5col": "Hospitality of the staff",
        "5comment": "Comments:",
        "6col": "Speed of service",
        "6comment": "Comments:",
        "7col": "Shop/Utensil Hygiene",
        "7comment": "Comments:",
        "8col": "Staff Hygiene (like gloves and caps)",
        "8comment": "Comments:",
        "9col": "Availability of items",
        "9comment": "Comments:",
        "10col": "Adherence operational timings",
        "10comment": "Comments:",
        "11col": "Observations by CMGFS team"
    },
    {
        "id": "id",
        "member": "member",
        "phone": "phone",
        "Date": "date",
        "shop": "shop",
        "1col": "Availability of price list",
        "1comment": "Comments:",
        "2col": "Availability of Items",
        "2comment": "Comments:",
        "3col": "Speed of service",
        "3comment": "Comments:",
        "4col": "Rating for price of Products\\Services",
        "4comment": "Comments:",
        "5col": "Hospitality of the staff",
        "5comment": "Comments:",
        "6col": "Quality of Products\\Services",
        "6comment": "Comments:",
        "7col": "Shop’s Ambience",
        "7comment": "Comments:",
        "8col": "Adherence operational timings",
        "8comment": "Comments:",
        "9col": "Observations by CMGFS team"
    }

];
var date = new Date();

function saveXLS(data,filename) {
    // console.log(Objels
    // ct.keys(data[0]));
    var xls = json2xls(data);
    fs.writeFileSync("./data/"+filename+"-"+date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear()+".xls", xls, 'binary');
}
function saveData(connection) {
    connection.query('SELECT * FROM '+tables[0], function (error_1, results_1, fields_1) {
        if (error_1) throw error_1;
        results_1.unshift(headings[0]);
        saveXLS(results_1,fields_1[0].table);
    });
    connection.query('SELECT * FROM '+tables[1], function (error_1, results_1, fields_1) {
        if (error_1) throw error_1;
        results_1.unshift(headings[1]);
        saveXLS(results_1,fields_1[0].table);
    });
    connection.query('SELECT * FROM '+tables[2], function (error_1, results_1, fields_1) {
        if (error_1) throw error_1;
        results_1.unshift(headings[2]);
        saveXLS(results_1,fields_1[0].table);
    });
}

function sendMail(connection) {
    connection.query('SELECT * FROM email_to_send_reports_db', function (error_2, results_2, fields_2) {
        if (error_2) throw error_2;
        else {
            for (var i =0; i < results_2.length; i++) {
                var template_file_name = "email_template.ejs";
                var html = ejs.render(fs.readFileSync(template_file_name, 'utf8'),{ name : results_2[i].name, tables : tables,date: date});
                var fromEmail = new helper.Email('joydassudipta@gmail.com');
                var toEmail = new helper.Email(results_2[i].email_id);
                var subject = 'CMGFS data';
                var content = new helper.Content('text/html', html);
                var mail = new helper.Mail(fromEmail, subject, toEmail, content);
                var request = sg.emptyRequest({
                    method: 'POST',
                    path: '/v3/mail/send',
                    body: mail.toJSON()
                });
                sg.API(request, function (error, response) {
                    if (error) throw error;
                });
                console.log("Sent to "+results_2[i].email_id+" on "+date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear());
            }
        }
    });
}

function main() {
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'joeydash',
        database : 'cmgfs_app_db'
    });
    connection.connect();


    saveData(connection);

    sendMail(connection);
    connection.end();
}
main();
var timer = setInterval(main,1000*3600*hours*days);