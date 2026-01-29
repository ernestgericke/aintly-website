/**
 * Aintly Contact Form Backend Server
 * Handles form submissions and sends emails via SMTP
 */

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// Security & Middleware
// ============================================

// Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline scripts for static files
}));

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST'],
  credentials: true,
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting - prevent spam
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many contact form submissions from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to contact endpoint
app.use('/api/contact', limiter);

// ============================================
// Serve Static Files
// ============================================

app.use(express.static('./', {
  index: 'index.html',
  extensions: ['html'],
}));

// ============================================
// Email Configuration
// ============================================

/**
 * Create email transporter based on environment variables
 * Supports SMTP configuration
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// ============================================
// Validation Helpers
// ============================================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize input to prevent XSS
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .substring(0, 5000); // Limit length
}

/**
 * Validate contact form data
 * @param {Object} data - Form data to validate
 * @returns {Object} - { valid: boolean, errors: Array }
 */
function validateFormData(data) {
  const errors = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Please provide a valid email address');
  }

  if (!data.service) {
    errors.push('Please select a service');
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================
// API Routes
// ============================================

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * Contact form submission endpoint
 */
app.post('/api/contact', async (req, res) => {
  try {
    // Extract and sanitize form data
    const formData = {
      name: sanitizeInput(req.body.name),
      email: sanitizeInput(req.body.email),
      company: sanitizeInput(req.body.company || ''),
      service: sanitizeInput(req.body.service),
      message: sanitizeInput(req.body.message),
    };

    // Validate form data
    const validation = validateFormData(formData);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors,
      });
    }

    // Create email transporter
    const transporter = createTransporter();

    // Email to Aintly (info@aintly.com)
    const mailOptions = {
      from: `"${formData.name}" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'info@aintly.com',
      replyTo: formData.email,
      subject: `New Contact Form Submission - ${formData.service}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3FA9F5, #4ADE80); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #166534; }
            .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; border-left: 3px solid #3FA9F5; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Contact Form Submission</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${formData.name}</div>
              </div>
              
              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${formData.email}">${formData.email}</a></div>
              </div>
              
              ${formData.company ? `
              <div class="field">
                <div class="label">Company:</div>
                <div class="value">${formData.company}</div>
              </div>
              ` : ''}
              
              <div class="field">
                <div class="label">Service Interested In:</div>
                <div class="value">${formData.service}</div>
              </div>
              
              <div class="field">
                <div class="label">Message:</div>
                <div class="value">${formData.message.replace(/\n/g, '<br>')}</div>
              </div>
              
              <div class="footer">
                <p>Submitted on: ${new Date().toLocaleString()}</p>
                <p>Reply to this email to respond directly to the customer.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
New Contact Form Submission

Name: ${formData.name}
Email: ${formData.email}
${formData.company ? `Company: ${formData.company}` : ''}
Service: ${formData.service}

Message:
${formData.message}

Submitted on: ${new Date().toLocaleString()}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send auto-reply to customer (optional)
    const autoReplyOptions = {
      from: `"Aintly" <${process.env.SMTP_USER}>`,
      to: formData.email,
      subject: 'Thank you for contacting Aintly',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3FA9F5, #4ADE80); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 24px; background: #3FA9F5; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You, ${formData.name}!</h1>
            </div>
            <div class="content">
              <p>We've received your message about <strong>${formData.service}</strong> and will get back to you within 24 hours.</p>
              
              <p>Our team is excited to discuss how we can help transform your business with our digital solutions.</p>
              
              <p>In the meantime, feel free to explore our website or reach out directly:</p>
              <ul>
                <li>Email: info@aintly.com</li>
                <li>Phone: +1 (234) 567-890</li>
              </ul>
              
              <p>Best regards,<br><strong>The Aintly Team</strong></p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await transporter.sendMail(autoReplyOptions);
    } catch (autoReplyError) {
      console.error('Auto-reply email failed (non-critical):', autoReplyError.message);
    }

    // Log successful submission (optional - consider using a proper logging service)
    console.log(`Contact form submitted by ${formData.email} at ${new Date().toISOString()}`);

    // Return success response
    res.json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you within 24 hours.',
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request. Please try again or contact us directly at info@aintly.com',
    });
  }
});

// ============================================
// Error Handling
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(__dirname + '/index.html');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

// ============================================
// Start Server
// ============================================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀  Aintly Website Server Running                      ║
║                                                           ║
║   Port:        ${PORT}                                   ║
║   Environment: ${process.env.NODE_ENV || 'development'}  ║
║   Email:       ${process.env.CONTACT_EMAIL || 'info@aintly.com'}              ║
║                                                           ║
║   Health:      http://localhost:${PORT}/api/health       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});
