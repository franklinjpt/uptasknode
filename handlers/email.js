const juice = require('juice');
const nodemailer = require('nodemailer');
const emailConfig = require('../config/email');
const pug = require('pug');
const htmlToText = require('html-to-text');
const util = require('util');

let transport = nodemailer.createTransport(emailConfig);

const generarHTML = (archivo, opciones) => {
  const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
  return juice(html);
}

exports.enviar = async (opciones) => {  
  const html = generarHTML(opciones.archivo, opciones);
  const text = htmlToText.fromString(html);

  let mailOptions = {
    from: 'Uptask <no-reply@uptask.com>',
    to: opciones.usuario.email,
    subject: opciones.subject,
    text,
    html
  };

  const enviarEmail = util.promisify(transport.sendMail, transport);
  return enviarEmail.call(transport, mailOptions);
  
}

// transport.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     return console.log(error);
//   }
//   console.log('Message sent: %s', info.messageId);
// });