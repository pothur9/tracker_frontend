const transporter = require("../config/mails");

// module.exports = ({ from, to, subject, text, html }) => {
//   var message = {
//     from: from,
//     to: to,
//     subject: subject,
//     text: text,
//     html: html,
//   };
//   transporter.sendMail(message);
// };

const sendMail = ({ from, to, subject, text, html }) => {
  var message = {
    from: from,
    to: to,
    subject: subject,
    text: text,
    html: html,
  };

  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.log("Error sending mail: ", error);
    } else {
      console.log("Mail sent: ", info.response);
    }
  });
};

module.exports = sendMail;
