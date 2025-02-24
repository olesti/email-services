require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(express.json());
app.use(cors());

// Use memory storage to avoid file system issues on serverless platforms
const upload = multer({ storage: multer.memoryStorage() });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const basicAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res.status(401).json({ error: "Authorization failed!" });
  }
  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
  const [username, password] = credentials.split(":");
  if (username !== process.env.AUTH_USER || password !== process.env.AUTH_PASS) {
    return res.status(403).json({ error: "Invalid credentials!" });
  }
  next();
};

app.use(basicAuth);

// Email sending with in-memory attachments
app.post("/send-email", upload.array("attachments"), async (req, res) => {
  try {
    const { to, subject, text, html, cc, bcc, replyTo, priority } = req.body;
    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({ error: "Please fill in all fields." });
    }

    // Process attachments from memory
    const attachments = req.files?.map(file => ({
        filename: file.originalname,
        content: file.buffer, // Use buffer to send file directly
      })) || [];
  

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: text || undefined,
      html: html || undefined,
      cc: cc || undefined,
      bcc: bcc || undefined,
      replyTo: replyTo || undefined,
      priority: priority || "normal", // "high", "normal", "low"
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully!", info });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ success: false, error: `Failed to send email. {To:${req.body.to}}` });
  }
});
app.post("/send-email-template", async (req, res) => {
  try {
    const { to, subject, text, html, cc, bcc, replyTo, priority,templateUrl,templateVariables} = req.body;
    if (!to || !subject ||!templateUrl||!templateVariables) {
      return res.status(400).json({ error: "Please fill in all fields." });
    }

  
      const response = await fetch(templateUrl, {
        headers: { 'Access-Control-Allow-Origin': '*' },
      })
      let mail_text = await response.text()

      // HTML içindeki {{name}} yer tutucusunu, prop olarak gelen name ile değiştiriyoruz
      Object.keys(templateVariables).forEach((key)=>{
        if(templateVariables[key]){
          mail_text = mail_text.replace(`{{${key}}}`, templateVariables[key])
        }
      })
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: text || undefined,
      html: mail_text || html,
      cc: cc || undefined,
      bcc: bcc || undefined,
      replyTo: replyTo || undefined,
      priority: priority || "normal", // "high", "normal", "low"
    };

    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully!", info });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ success: false, error: `Failed to send email. {To:${req.body.to}}` });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
