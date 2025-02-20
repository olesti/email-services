
# 🚀 Enhanced Nodemailer Email API

![GitHub Repo stars](https://img.shields.io/github/stars/olesti/email-services?style=social)
![GitHub forks](https://img.shields.io/github/forks/olesti/email-services?style=social)
![GitHub license](https://img.shields.io/github/license/olesti/email-services)
![GitHub issues](https://img.shields.io/github/issues/olesti/email-services)


A simple and powerful Node.js email sending service using **Nodemailer**, with support for **attachments, CC, BCC, reply-to, and priority settings**. Designed to work seamlessly on serverless platforms like **Render, Vercel, and Railway** by utilizing **memory storage for attachments**.

---

## ✨ Features

- ✅ **Send emails with text & HTML content**  
- ✅ **Supports file attachments** (without storing them permanently)  
- ✅ **CC, BCC, and Reply-To options**  
- ✅ **Email priority settings** (`high`, `normal`, `low`)  
- ✅ **Basic Authentication for security**  
- ✅ **Compatible with serverless platforms**  

---

## 📦 Installation

1. **Clone the repository**

   ```sh
   git clone https://github.com/olesti/email-services.git
   cd email-services
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Create a `.env` file and configure environment variables**

   ```sh
   cp .env.example .env
   ```

   Then edit `.env` file:

   ```
   PORT=5000
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-password
   AUTH_USER=your-username
   AUTH_PASS=your-password
   ```

> **Note:** If you're using Gmail, you may need to enable **less secure apps** or generate an **App Password**.

---

## 🚀 Usage

### **Start the Server**

```sh
npm start
```

### **Send an Email (via API request)**

Send a `POST` request to:

```
http://localhost:5000/send-email
```

#### **Request Body (JSON)**

```json
{
  "to": "recipient@example.com",
  "subject": "Hello from Nodemailer!",
  "text": "This is a plain text email",
  "html": "<b>This is an HTML email</b>",
  "cc": "cc@example.com",
  "bcc": "bcc@example.com",
  "replyTo": "reply@example.com",
  "priority": "high"
}
```

#### **Sending Attachments**

Use **multipart/form-data** when sending attachments:

```sh
curl -X POST http://localhost:5000/send-email \
  -H "Authorization: Basic your-username:your-password" \
  -F "to=recipient@example.com" \
  -F "subject=Test Email" \
  -F "text=Hello, this is a test email" \
  -F "attachments=@path/to/file.pdf"
```

---

## 🛡 Authentication

This API uses **Basic Authentication** for security.  
Include the following in the request headers:

```
Authorization: Basic base64(username:password)
```

To generate a **Base64 encoded string**:

```sh
echo -n "your-username:your-password" | base64
```

---

## 🌍 Deploying to Render

1. Push your code to **GitHub**
2. Go to [Render](https://render.com/) and create a **new Web Service**
3. Set up the environment variables in Render’s settings
4. Deploy! 🎉

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check [issues page](https://github.com/olesti/email-services/issues).

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## ⭐ Show Your Support

Give a ⭐ if you like this project and want to see more like this!

[![GitHub stars](https://img.shields.io/github/stars/olesti/email-services?style=social)](https://github.com/olesti/email-services/stargazers)

