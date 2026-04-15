const nodemailer = require("nodemailer");

const sendMail = async (subject, body, userMail) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: 'chiranjiv.shah783@gmail.com',
      pass: 'nygongczztwpvbrg'
    }
  });
  let info = await transporter.sendMail({
    from: 'MyCal.com <mycal@mail.com>',
    to: userMail,
    subject: subject,
    html: body,
  });
  console.log("Email Sent");
};

module.exports = { sendMail };
