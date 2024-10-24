const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
require("dotenv").config();
const port = process.env.PORT;

app.use(express.json());

app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: "Name, email, and message are required." });
  }

  try {
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions = {
      to: process.env.EMAIL_REC,
      subject: `New Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    let info = await transporter.sendMail(mailOptions);

    const previewUrl = nodemailer.getTestMessageUrl(info);
    // console.log("Preview URL: %s", previewUrl);

    res.status(200).json({
      success: "Email sent successfully.",
      previewUrl: previewUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error sending email." });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
