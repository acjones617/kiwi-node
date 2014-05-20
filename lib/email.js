var nodemailer = require("nodemailer");

// create reusable transport method (opens pool of SMTP connections)
var smtp = {
    init: function() {
        this.transport = nodemailer.createTransport("SMTP",{
            service: "Gmail",
            auth: {
                user: "andrewk0291@gmail.com",
                pass: process.env.secret
            }
        });
    },

    sendMail: function(options) {
        console.log('sending mail');
        this.transport.sendMail(options, function(error, response){
            debugger;
            console.log('res: ', response);
            if(error){
                console.log('error ', error);
            }else{
                console.log("Message sent: " + response.message);
            }

            // if you don't want to use this transport object anymore, uncomment following line
            //smtpTransport.close(); // shut down the connection pool, no more messages
        });
    }

}

module.exports = smtp;
