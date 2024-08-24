const nodemailer = require("nodemailer");

async function main(formData) {
  console.log(formData);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.MAIL_PASS,
    },
  });

  let info = await transporter.sendMail({
    from: `${formData.email}`,
    to: `${formData.reciever}`,
    subject: `${formData.subject}`,
    text: `${formData.text}`,
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = main;
