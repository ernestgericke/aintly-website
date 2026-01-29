# Aintly Website

A modern, conversion-focused website for Aintly - a digital transformation company specializing in IT services, automation, AI solutions, web development, and cloud services.

## 🚀 Features

- **Modern Design**: Clean, professional interface with soft green & blue color palette
- **Responsive**: Mobile-first design that works on all devices
- **Accessible**: WCAG compliant with semantic HTML and ARIA labels
- **Performance Optimized**: Fast loading with optimized assets
- **Interactive**: Smooth animations and engaging user interactions
- **Conversion-Focused**: Strategic CTAs and contact form

## 🎨 Design System

### Colors
- **Primary Blue**: `#3FA9F5`
- **Secondary Green**: `#4ADE80`
- **Background**: `#F8FAFC`

### Typography
- **Font Family**: Inter (sans-serif)
- **Headings**: Bold, large with tight tracking
- **Body**: Clean, readable with proper line height

### Components
- Rounded cards with subtle shadows
- Gradient buttons with hover effects
- Smooth transitions and animations
- Minimalist, spacious layout

## 🛠️ Tech Stack

- **HTML5**: Semantic markup
- **Tailwind CSS**: Utility-first CSS framework
- **Vanilla JavaScript**: No dependencies, pure JS
- **Node.js**: For development tools

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build CSS** (Development)
   ```bash
   npm run dev
   ```
   This will watch for changes and rebuild automatically.

3. **Build CSS** (Production)
   ```bash
   npm run build
   ```
   This will create a minified production build.

4. **Open in Browser**
   Simply open `index.html` in your browser, or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js http-server (install globally first)
   npx http-server
   ```

## 📁 Project Structure

```
aintly.com/
├── dist/
│   └── output.css          # Compiled Tailwind CSS
├── src/
│   ├── input.css           # Tailwind source & custom styles
│   └── app.js              # JavaScript functionality
├── index.html              # Main landing page
├── tailwind.config.js      # Tailwind configuration
├── package.json            # Project dependencies
└── README.md              # This file
```

## 🎯 Services Offered

1. **IT Services**: Comprehensive infrastructure management and support
2. **Automation**: Process automation and workflow optimization
3. **AI Solutions**: Machine learning and predictive analytics
4. **Web Development**: Custom, responsive web applications
5. **Cloud Services**: Scalable cloud infrastructure solutions
6. **Digital Strategy**: Technology roadmap and consulting

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## ♿ Accessibility

This website follows WCAG 2.1 Level AA guidelines:
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Proper color contrast ratios
- Focus indicators
- Screen reader friendly

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Customization

### Updating Colors
Edit `tailwind.config.js` to change the color palette:

```javascript
colors: {
  primary: {
    DEFAULT: '#3FA9F5',
    // Add more shades...
  },
  secondary: {
    DEFAULT: '#4ADE80',
    // Add more shades...
  }
}
```

### Adding New Sections
1. Add HTML section to `index.html`
2. Follow existing pattern with semantic markup
3. Use Tailwind utility classes
4. Ensure accessibility (ARIA labels, semantic tags)

### Modifying JavaScript
Edit `src/app.js` to customize:
- Form validation rules
- Animation timing
- Scroll behavior
- Interactive elements

## 📝 Contact Form Integration

The contact form currently simulates submission. To integrate with a backend:

1. **Replace the `submitForm` function** in `src/app.js`
2. **Add your API endpoint**:
   ```javascript
   async function submitForm(data) {
     const response = await fetch('YOUR_API_ENDPOINT', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(data)
     });
     return response.json();
   }
   ```

## 🚢 Deployment

### Static Hosting (Netlify, Vercel, GitHub Pages)

1. Build production CSS:
   ```bash
   npm run build
   ```

2. Deploy the following files:
   - `index.html`
   - `dist/output.css`
   - `src/app.js`

### Traditional Web Hosting

1. Build production CSS
2. Upload all files via FTP/SFTP
3. Ensure proper file permissions

## 🔒 Security Best Practices

- Always validate form inputs on the server-side
- Use HTTPS in production
- Implement rate limiting on contact form
- Add CAPTCHA for spam prevention
- Sanitize user inputs before processing

## 📈 Performance Optimization

- Minified CSS in production build
- Lazy loading for images (if added)
- Optimized animations (CSS transforms)
- Minimal JavaScript dependencies
- Efficient event listeners

## 🤝 Contributing

This is a proprietary website for Aintly. For internal contributions:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit for review

## 📄 License

Copyright © 2026 Aintly. All rights reserved.

## 📞 Support

For questions or support:
- **Email**: info@aintly.com
- **Phone**: +1 (234) 567-890
- **Website**: [aintly.com](https://aintly.com)

---

Built with ❤️ by the Aintly team
