import nodemailer from ('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'serviciotecnicoagrofer@gmail.com',
    pass: '1003196927Fc',
  },
});

module.exports = { transporter };

  