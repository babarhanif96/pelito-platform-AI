var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var handlebars = require('handlebars');
var fs = require('fs');
const path = require('path');
var base64Img = require('base64-img');

module.exports = {
    
    subscriberMail: async function(email){

        const reqObj = {
            // username:user.name,
            email:"support@pelito.net",
            subject:"Pelito Subscriber User",
        
        }
        const url = path.resolve(__dirname,'../email_templates/subscriber_email.html')
        await sendMail(reqObj,url)
    },
    inquiryrMail: async function(data){

        const reqObj = {
            username:data.name,
            email:"support@pelito.net",
            subject:"Pelito Inquiry User",
            data
        }
        const url = path.resolve(__dirname,'../email_templates/inquiry_email.html')
        await sendMail(reqObj,url)
    },
    verifyMail: async function(user,otp){
       console.log(user)
        const reqObj = {
            username:`${user.first_Name} ${user.last_Name}`,
            email:user.email,
            otp:otp,
            subject:"OTP Verification for Your Email Account",
        }
        const url = path.resolve(__dirname,'../email_templates/verify_email.html')
        await sendMail(reqObj,url)
    },
    forgotMail: async function(user,otp){
        console.log(user)
         const reqObj = {
             username:`${user.first_name} ${user.last_name}`,
             email:user.email,
             otp,
             subject:"Forgot Password for Your Email Account",
         }
         const url = path.resolve(__dirname,'../email_templates/forgot.html')
         await sendMail(reqObj,url)
     },
 
    customerEmail: async function(data){

        const reqObj = {
            username:data.customer_name,
            email:data.customer_email,
            // email:"bhavna.kumrawat@bacancy.com",
            data,
            subject:"Your Salon Service Booking Confirmation",
        }
        const url = path.resolve(__dirname,'../email_templates/customer_email.html')
        await sendMail(reqObj,url)
    },
    sellerEmail: async function(data){

        const reqObj = {
            username:data.salon_name,
            email:data.seller_email,
            // email:"bhavna.kumrawat@bacancy.com",
            data,
            subject:"Customer Booked Service For Member",
        }
        const url = path.resolve(__dirname,'../email_templates/seller_email.html')
        await sendMail(reqObj,url)
    },
    sellerMemberEmail: async function(data){

        const reqObj = {
            username:data.member_name,
            email:data.member_email,
            data,
            // email:"bhavna.kumrawat@bacancy.com",
            subject:"Customer Booked Service",
        }
        const url = path.resolve(__dirname,'../email_templates/member_email.html')
        console.log(url)
        await sendMail(reqObj,url)
    },
    customerEmailForCancel: async function(data){

        console.log(data)
        const reqObj = {
            username:data.customer_name,
            email:data.customer_email,
            // email:"bhavna.kumrawat@bacancy.com",
            data,
            subject:"Your Salon Canceled Booking Confirmation",
        }
        const url = path.resolve(__dirname,'../email_templates/customer_cancel_email.html')
        await sendMail(reqObj,url)
    },
    sellerEmailForCancel: async function(data){

        const reqObj = {
            username:data.salon_name,
            email:data.seller_email,
            // email:"bhavna.kumrawat@bacancy.com",
            data,
            subject:"Customer Canceled Service For Member",
        }
        const url = path.resolve(__dirname,'../email_templates/seller_cancel_email.html')
        await sendMail(reqObj,url)
    },
    sellerMemberEmailForCancel: async function(data){

        const reqObj = {
            username:data.member_name,
            email:data.member_email,
            data,
            // email:"bhavna.kumrawat@bacancy.com",
            subject:"Customer Canceled Service",
        }
        const url = path.resolve(__dirname,'../email_templates/member_cancel_email.html')
        console.log(url)
        await sendMail(reqObj,url)
    },
    sendRecurringMail: async function(data,status){
        
        const docPath = '../document-pdf/recurring_guidlines.pdf'; // Replace with the actual file path
        const pdfFilePath = path.join(__dirname, docPath);
       
        console.log(pdfFilePath)
        const pdfFile = fs.readFileSync(pdfFilePath);
        
        const reqObj = {
            username:data.customer_name,
            email:data.customer_email,
            recurring_status:`${status?'enable':'disable'}`,
            data,
            // email:"bhavna.kumrawat@bacancy.com",
            subject:`You ${status?'enable':'disable'} the service`,
        }
        const url = path.resolve(__dirname,'../email_templates/recurring_email.html')
        console.log(url)
        const file_name = 'recurring-guideline'
        await sendMail(reqObj,url,pdfFile,file_name)
    },
    customerProductEmail: async function(data){

        const reqObj = {
            username:data.customer_name,
            email:data.customer_email,
            // email:"bhavna.kumrawat@bacancy.com",
            data,
            subject:`Your Purchase Confirmation:${data.product_name}`,
        }
        const url = path.resolve(__dirname,'../email_templates/customer_product_email.html')
        await sendMail(reqObj,url)
    },
    sellerProductEmail: async function(data){

        const reqObj = {
            username:data.salon_name,
            email:data.seller_email,
            // email:"bhavna.kumrawat@bacancy.com",
            data,
            subject:`New Order Notification:${data.product_name}`,
        }
        const url = path.resolve(__dirname,'../email_templates/seller_product_email.html')
        await sendMail(reqObj,url)
    },
    sendInviteMail: async function(data){

        const reqObj = {
            email:data.email,
            body_msg:data.body_msg,
            subject:data.subject,
        }
        const url = path.resolve(__dirname,'../email_templates/invite_mail.html')
        await sendMail(reqObj,url)
    },

}
async function sendMail(reqObj,url,pdfFile,file_name){
    var readHTMLFile = function(path, callback) {
        fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
            if (err) {
               callback(err);  
               throw err;
                
            }
            else {
                callback(null, html);
            }
        });
    };
    console.log(reqObj)
    let smtptransport = nodemailer.createTransport(smtpTransport({
        host: 'smtp.gmail.com',
            port: 465,
            auth: {
                user:process.env.EMAIL ,
                pass: process.env.PASSWORD
            },
    }));

    readHTMLFile(url, function(err, html) {
        console.log(path.join(__dirname+ '/logo.png'))

    //    let imgSrc = base64Img.base64Sync('path.join(__dirname+ '/logo.png')   ')   

        var template = handlebars.compile(html);
        var replacements = {
            reqObj
        };
        var htmlToSend = template(replacements);
        // console.log(htmlToSend)
        var mailOptions = {
            from: process.env.EMAIL,
            to : reqObj.email,
            subject : reqObj.subject,
            html : htmlToSend,
            // img_src:imgSrc,
            // cid: 'logo',
            
         };
         file_name ? mailOptions.attachments = [
            {
              filename: file_name, // name of the attachment
              content: pdfFile // content of the attachment
            }
          ] :''
 
         smtptransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                return error
                // callback(error);
            }else{
                console.log(response)
                return response

                // callback(response)
            }
        });
    });
}


