/**
 * Aintly Website - Main JavaScript
 * Features: Mobile menu, form validation, scroll effects, and interactive elements
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  
  // ============================================
  // Mobile Menu Toggle
  // ============================================
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
      
      // Toggle menu visibility
      mobileMenu.classList.toggle('hidden');
      
      // Update ARIA attribute for accessibility
      mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
      
      // Update icon (optional - could switch between hamburger and X)
      const icon = mobileMenuButton.querySelector('svg');
      if (icon) {
        if (isExpanded) {
          // Show hamburger icon
          icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
        } else {
          // Show close icon
          icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
        }
      }
    });
    
    // Close mobile menu when clicking on a link
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.add('hidden');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
        
        // Reset icon to hamburger
        const icon = mobileMenuButton.querySelector('svg');
        if (icon) {
          icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
        }
      });
    });
  }

  // ============================================
  // Navbar Scroll Effect
  // ============================================
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;
  
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    // Add shadow when scrolled
    if (currentScroll > 50) {
      navbar.classList.add('shadow-md');
    } else {
      navbar.classList.remove('shadow-md');
    }
    
    lastScroll = currentScroll;
  });

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if href is just "#"
      if (href === '#' || href === '') return;
      
      e.preventDefault();
      
      const target = document.querySelector(href);
      if (target) {
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = target.offsetTop - navbarHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // Contact Form Validation & Submission
  // ============================================
  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');
  const submitText = document.getElementById('submit-text');
  const submitLoader = document.getElementById('submit-loader');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Get form values
      const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        company: document.getElementById('company').value.trim(),
        service: document.getElementById('service').value,
        message: document.getElementById('message').value.trim()
      };
      
      // Validate form
      if (!validateForm(formData)) {
        return;
      }
      
      // Show loading state
      showLoadingState();
      
      // Simulate form submission (replace with actual API call)
      try {
        await submitForm(formData);
        showSuccess('Thank you for your message! We\'ll get back to you within 24 hours.');
        contactForm.reset();
      } catch (error) {
        showError('Oops! Something went wrong. Please try again or contact us directly at info@aintly.com');
      } finally {
        hideLoadingState();
      }
    });
  }
  
  /**
   * Validate form data
   * @param {Object} data - Form data to validate
   * @returns {boolean} - Whether form is valid
   */
  function validateForm(data) {
    // Clear previous errors
    clearFormErrors();
    
    let isValid = true;
    
    // Name validation
    if (!data.name || data.name.length < 2) {
      showFieldError('name', 'Please enter your full name');
      isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      showFieldError('email', 'Please enter a valid email address');
      isValid = false;
    }
    
    // Service validation
    if (!data.service) {
      showFieldError('service', 'Please select a service');
      isValid = false;
    }
    
    // Message validation
    if (!data.message || data.message.length < 10) {
      showFieldError('message', 'Please provide more details about your project (minimum 10 characters)');
      isValid = false;
    }
    
    return isValid;
  }
  
  /**
   * Show field error
   * @param {string} fieldId - ID of the field
   * @param {string} message - Error message
   */
  function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
      field.classList.add('border-red-500');
      field.classList.remove('border-gray-300');
      
      // Create error message element if it doesn't exist
      let errorElement = document.getElementById(`${fieldId}-error`);
      if (!errorElement) {
        errorElement = document.createElement('p');
        errorElement.id = `${fieldId}-error`;
        errorElement.className = 'text-red-500 text-sm mt-1';
        errorElement.setAttribute('role', 'alert');
        field.parentNode.appendChild(errorElement);
      }
      errorElement.textContent = message;
    }
  }
  
  /**
   * Clear all form errors
   */
  function clearFormErrors() {
    const fields = ['name', 'email', 'service', 'message'];
    fields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        field.classList.remove('border-red-500');
        field.classList.add('border-gray-300');
        
        const errorElement = document.getElementById(`${fieldId}-error`);
        if (errorElement) {
          errorElement.remove();
        }
      }
    });
    
    // Hide form message
    if (formMessage) {
      formMessage.classList.add('hidden');
    }
  }
  
  /**
   * Show loading state on submit button
   */
  function showLoadingState() {
    if (submitText) submitText.classList.add('hidden');
    if (submitLoader) submitLoader.classList.remove('hidden');
    
    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.classList.add('opacity-75', 'cursor-not-allowed');
    }
  }
  
  /**
   * Hide loading state on submit button
   */
  function hideLoadingState() {
    if (submitText) submitText.classList.remove('hidden');
    if (submitLoader) submitLoader.classList.add('hidden');
    
    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.classList.remove('opacity-75', 'cursor-not-allowed');
    }
  }
  
  /**
   * Show success message
   * @param {string} message - Success message
   */
  function showSuccess(message) {
    if (formMessage) {
      formMessage.textContent = message;
      formMessage.className = 'p-4 rounded-lg bg-secondary-50 text-secondary-700 border border-secondary-200';
      formMessage.classList.remove('hidden');
      
      // Scroll to message
      formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
  
  /**
   * Show error message
   * @param {string} message - Error message
   */
  function showError(message) {
    if (formMessage) {
      formMessage.textContent = message;
      formMessage.className = 'p-4 rounded-lg bg-red-50 text-red-700 border border-red-200';
      formMessage.classList.remove('hidden');
      
      // Scroll to message
      formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
  
  /**
   * Submit form to backend API
   * @param {Object} data - Form data
   * @returns {Promise} - Promise that resolves with response
   */
  async function submitForm(data) {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Submission failed');
      }
      
      return result;
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    }
  }

  // ============================================
  // Scroll to Top Button
  // ============================================
  const scrollToTopButton = document.getElementById('scroll-to-top');
  
  if (scrollToTopButton) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        scrollToTopButton.classList.remove('opacity-0', 'pointer-events-none');
        scrollToTopButton.classList.add('opacity-100');
      } else {
        scrollToTopButton.classList.add('opacity-0', 'pointer-events-none');
        scrollToTopButton.classList.remove('opacity-100');
      }
    });
    
    // Scroll to top when clicked
    scrollToTopButton.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ============================================
  // Animate Elements on Scroll (Optional)
  // ============================================
  // Simple fade-in animation for cards when they come into view
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all cards and sections
  const animatedElements = document.querySelectorAll('.card, section');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
  
  // Add animation class
  const style = document.createElement('style');
  style.textContent = `
    .animate-fade-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  // ============================================
  // Console welcome message
  // ============================================
  console.log('%c👋 Welcome to Aintly!', 'font-size: 20px; font-weight: bold; color: #3FA9F5;');
  console.log('%cInterested in joining our team? Check out careers at aintly.com', 'font-size: 14px; color: #4ADE80;');

});

// ============================================
// Performance Optimization: Lazy load images (if needed)
// ============================================
if ('loading' in HTMLImageElement.prototype) {
  // Browser supports native lazy loading
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    img.src = img.dataset.src;
  });
} else {
  // Fallback for older browsers
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
  document.body.appendChild(script);
}
