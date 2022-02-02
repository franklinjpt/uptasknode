const nodemailer = require('nodemailer');
const emailConfig = require('../config/email');

var transport = nodemailer.createTransport(emailConfig);

var mailOptions = {
  from: '"Example Team" <from@example.com>',
  to: 'user1@example.com, user2@example.com',
  subject: 'Nice Nodemailer test',
  text: 'Hey there, it’s our first message sent with Nodemailer ',
  html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br /><img src="cid:uniq-mailtrap.png" alt="mailtrap" />',
};

transport.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log('Message sent: %s', info.messageId);
});