require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 📩 E-Posta Gönderme Endpoint'i
app.post("/send-email", async (req, res) => {
  const { to, subject, text, html } = req.body;

  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ error: "Lütfen tüm alanları doldurun." });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: text || undefined, // Eğer text yoksa göndermesin
    html: html || undefined, // Eğer html yoksa göndermesin
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "E-posta başarıyla gönderildi!" });
  } catch (error) {
    console.error("E-posta gönderme hatası:", error);
    res.status(500).json({ success: false, error: "E-posta gönderilemedi." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server ${PORT} portunda çalışıyor...`));
