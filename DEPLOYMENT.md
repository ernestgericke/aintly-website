# Aintly Website - Deployment Guide for Coolify

This guide covers deploying the Aintly website to a VPS using Coolify.

## 📋 Prerequisites

- VPS with Coolify installed and configured
- Domain name pointed to your VPS (e.g., aintly.com)
- SMTP credentials (Gmail, SendGrid, or similar)
- Git repository (GitHub, GitLab, or Bitbucket)

## 🚀 Deployment Steps

### 1. Prepare Your Repository

Push your code to a Git repository (GitHub recommended):

```bash
git init
git add .
git commit -m "Initial commit: Aintly website"
git branch -M main
git remote add origin https://github.com/yourusername/aintly-website.git
git push -u origin main
```

### 2. Set Up SMTP Email Service

**Option A: Gmail (Development/Testing)**

1. Enable 2-Factor Authentication on your Google Account
2. Generate an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Copy the 16-character password
3. Use these settings:
   - SMTP_HOST: `smtp.gmail.com`
   - SMTP_PORT: `587`
   - SMTP_SECURE: `false`
   - SMTP_USER: `your-email@gmail.com`
   - SMTP_PASS: `your-16-char-app-password`

**Option B: SendGrid (Production)**

1. Sign up at https://sendgrid.com
2. Create an API key
3. Use these settings:
   - SMTP_HOST: `smtp.sendgrid.net`
   - SMTP_PORT: `587`
   - SMTP_SECURE: `false`
   - SMTP_USER: `apikey`
   - SMTP_PASS: `your-sendgrid-api-key`

**Option C: Mailgun, AWS SES, etc.**

Check your provider's SMTP settings and update accordingly.

### 3. Deploy on Coolify

#### Step 1: Create New Project

1. Log in to your Coolify dashboard
2. Click **"+ New Project"**
3. Name it: `aintly-website`

#### Step 2: Add Application

1. Click **"+ New Resource"** → **"Application"**
2. Select **"Public Repository"**
3. Enter your repository URL:
   ```
   https://github.com/yourusername/aintly-website.git
   ```
4. Branch: `main`
5. Click **"Continue"**

#### Step 3: Configure Build Settings

1. **Build Pack:** Select `Docker`
2. **Dockerfile Location:** `/Dockerfile` (default)
3. **Port:** `3000`
4. Click **"Save"**

#### Step 4: Set Environment Variables

Click on **"Environment Variables"** and add the following:

```bash
# Required
NODE_ENV=production
PORT=3000
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@sendgrid.net
SMTP_PASS=your-app-password
CONTACT_EMAIL=info@aintly.com

# Optional
ALLOWED_ORIGINS=https://aintly.com,https://www.aintly.com
```

**Important:** Replace the SMTP values with your actual credentials!

#### Step 5: Configure Domain

1. Go to **"Domains"** tab
2. Add your domain: `aintly.com`
3. Enable **"Generate SSL Certificate"** (Let's Encrypt)
4. Add www redirect if needed: `www.aintly.com` → `aintly.com`

#### Step 6: Deploy

1. Click **"Deploy"** button
2. Monitor the build logs
3. Wait for deployment to complete (3-5 minutes)

### 4. DNS Configuration

Point your domain to your VPS:

**A Records:**
```
Type    Name    Value
A       @       YOUR_VPS_IP
A       www     YOUR_VPS_IP
```

**Wait 5-60 minutes for DNS propagation.**

### 5. Verify Deployment

1. Visit `https://aintly.com`
2. Test the contact form
3. Check if email arrives at `info@aintly.com`
4. Verify SSL certificate is active

## 🔧 Post-Deployment Configuration

### Update Email Template (Optional)

To customize the email template, edit [`server.js`](server.js) lines 120-200.

### Enable Auto-Deploy

1. In Coolify, go to **"Settings"**
2. Enable **"Automatic Deployment"**
3. Set branch: `main`
4. Now, every push to main will auto-deploy!

### Set Up Monitoring

Add health check monitoring:
- Endpoint: `https://aintly.com/api/health`
- Expected response: `{"status":"ok"}`

## 🐛 Troubleshooting

### Build Fails

**Check Logs:**
```bash
# In Coolify, view build logs
# Common issues:
# - Missing dependencies: Ensure package.json is committed
# - Port conflict: Verify PORT=3000 in env vars
```

### Email Not Sending

**Test SMTP Connection:**

1. SSH into your VPS:
   ```bash
   ssh user@your-vps-ip
   ```

2. Access container logs:
   ```bash
   docker ps  # Find container ID
   docker logs <container-id>
   ```

3. Look for SMTP errors in logs

**Common Issues:**
- Wrong SMTP credentials → Update environment variables
- Gmail blocking: Enable "Less secure app access" or use App Password
- Port 587 blocked: Try port 465 with `SMTP_SECURE=true`

### SSL Certificate Issues

If SSL doesn't auto-generate:

1. Verify DNS is pointing correctly: `dig aintly.com`
2. Wait for DNS propagation (can take up to 48 hours)
3. In Coolify, manually trigger SSL generation
4. Check that ports 80 and 443 are open on VPS firewall

### Form Submissions Not Working

1. Check browser console for errors
2. Verify API endpoint: `https://aintly.com/api/health`
3. Check CORS settings if using different domain
4. Review server logs for errors

## 📊 Monitoring & Maintenance

### Check Server Health

```bash
# Health endpoint
curl https://aintly.com/api/health

# Expected response:
# {"status":"ok","timestamp":"2026-01-29T...","uptime":12345}
```

### View Application Logs

In Coolify:
1. Go to your application
2. Click **"Logs"** tab
3. View real-time logs

### Update Application

Simply push to your repository:

```bash
git add .
git commit -m "Update content"
git push origin main
```

Coolify will automatically redeploy (if auto-deploy is enabled).

### Backup Strategy

**Database:** This app doesn't use a database, but form submissions are emailed.

**Recommendation:** Set up email forwarding to multiple addresses for redundancy.

## 🔒 Security Best Practices

### 1. Secure Environment Variables

- Never commit `.env` file to Git
- Use Coolify's encrypted environment variables
- Rotate SMTP credentials regularly

### 2. Rate Limiting

The server includes rate limiting (5 requests per 15 min per IP).

To adjust, edit [`server.js`](server.js) lines 25-30.

### 3. HTTPS Only

Ensure SSL is enabled and HTTP redirects to HTTPS (Coolify handles this).

### 4. Regular Updates

Keep dependencies updated:

```bash
npm audit
npm update
```

### 5. Firewall Rules

On your VPS, only allow ports:
- `22` (SSH)
- `80` (HTTP - redirects to HTTPS)
- `443` (HTTPS)

## 📈 Performance Optimization

### Enable Caching (Optional)

Add Cloudflare in front of your site:

1. Sign up at cloudflare.com
2. Add aintly.com
3. Update nameservers at domain registrar
4. Enable CDN and caching

### Monitor Uptime

Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake

Set alerts for downtime.

## 🆘 Support

### Common Commands

```bash
# SSH into VPS
ssh user@your-vps-ip

# View running containers
docker ps

# View container logs
docker logs <container-id>

# Restart container
docker restart <container-id>

# View Coolify logs
journalctl -u coolify -f
```

### Getting Help

- **Coolify Docs:** https://coolify.io/docs
- **Coolify Discord:** https://discord.gg/coolify
- **Email Issues:** Check SMTP provider's documentation

## ✅ Deployment Checklist

Before going live:

- [ ] Code pushed to Git repository
- [ ] SMTP credentials configured and tested
- [ ] Environment variables set in Coolify
- [ ] Domain DNS pointing to VPS
- [ ] SSL certificate generated
- [ ] Contact form tested and working
- [ ] Email delivery confirmed
- [ ] Mobile responsiveness checked
- [ ] All links working
- [ ] Analytics/tracking added (if needed)
- [ ] Backup strategy in place
- [ ] Monitoring/alerts configured

## 🎉 You're Live!

Once deployed, your Aintly website will be accessible at:
- **Production:** https://aintly.com
- **Health Check:** https://aintly.com/api/health

Congratulations! 🚀

---

**Need Help?**

Email: info@aintly.com
