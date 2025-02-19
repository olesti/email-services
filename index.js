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
const basicAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return res.status(401).json({ error: "Yetkilendirme başarısız!" });
    }
  
    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
    const [username, password] = credentials.split(":");
  
    if (username !== process.env.AUTH_USER || password !== process.env.AUTH_PASS) {
      return res.status(403).json({ error: "Geçersiz kimlik bilgileri!" });
    }
  
    next(); // Doğru bilgiler girildi, devam et
  };
// 📩 E-Posta Gönderme Endpoint'i
app.use(basicAuth);
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
