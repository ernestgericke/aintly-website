# Quick Start Guide

Get your Aintly website up and running in minutes!

## 🚀 Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file and edit with your settings:

```bash
cp .env.example .env
```

Edit `.env` with your SMTP credentials:
- Use Gmail for testing (see DEPLOYMENT.md for setup)
- Or use SendGrid, Mailgun, etc.

### 3. Build CSS

```bash
npm run build
```

### 4. Start Server

```bash
npm start
```

Visit: **http://localhost:3000**

## 🛠️ Development Mode

Run with auto-rebuild CSS and auto-restart server:

```bash
npm run dev
```

This will:
- Watch for CSS changes and rebuild automatically
- Restart server on changes
- Perfect for development!

## ✉️ Testing Email

1. Fill out the contact form at http://localhost:3000
2. Check your console logs for form submission
3. Check the configured email address for received message
4. You should also receive an auto-reply

## 🐳 Docker Testing

Build and run with Docker:

```bash
# Build image
docker build -t aintly-website .

# Run container
docker run -p 3000:3000 \
  -e SMTP_HOST=smtp.gmail.com \
  -e SMTP_PORT=587 \
  -e SMTP_USER=your-email@gmail.com \
  -e SMTP_PASS=your-app-password \
  -e CONTACT_EMAIL=info@aintly.com \
  aintly-website
```

Visit: **http://localhost:3000**

## 📦 Production Build

```bash
# Build optimized CSS
npm run build:css

# Run in production mode
npm run prod
```

## 🚢 Deploy to Coolify

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for complete deployment instructions.

Quick steps:
1. Push code to GitHub
2. Create new app in Coolify
3. Add environment variables
4. Deploy!

## 📁 Project Structure

```
aintly.com/
├── assets/              # Logo and static assets
│   ├── logo.svg
│   └── favicon.svg
├── dist/               # Compiled CSS (generated)
│   └── output.css
├── src/                # Source files
│   ├── input.css       # Tailwind source
│   └── app.js          # Frontend JavaScript
├── index.html          # Main page
├── server.js           # Backend server
├── Dockerfile          # Docker container config
├── .env.example        # Environment template
└── package.json        # Dependencies

```

## ⚙️ Configuration

### Update Email Template

Edit [`server.js`](server.js) around line 120 to customize email HTML.

### Change Colors

Edit [`tailwind.config.js`](tailwind.config.js) to update brand colors.

### Modify Form Fields

Edit [`index.html`](index.html) contact form section (around line 600).

## 🔍 API Endpoints

- **GET** `/` - Main website
- **GET** `/api/health` - Health check
- **POST** `/api/contact` - Contact form submission

## 💡 Tips

- Use Chrome DevTools to test responsive design
- Check browser console for JavaScript errors
- Monitor server logs for backend issues
- Test form with different email providers

## 🆘 Common Issues

### CSS not loading?
Run: `npm run build`

### Email not sending?
Check `.env` file has correct SMTP credentials

### Port 3000 in use?
Change `PORT` in `.env` file

## 📚 Documentation

- **[README.md](README.md)** - Project overview
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Full deployment guide
- **[.env.example](.env.example)** - Environment variables

---

🎉 **You're ready to go!** Visit http://localhost:3000
