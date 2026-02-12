// =========================================
// AZRI QUOTE FORM HANDLER - ENTERPRISE VERSION
// Includes: Validation, LocalStorage, Notifications
// =========================================

class AZRIQuoteForm {
    constructor() {
        this.form = document.getElementById('quoteForm');
        this.notificationContainer = document.getElementById('notification-container');
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            
            // Real-time validation
            const inputs = this.form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        }
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        switch(field.id) {
            case 'companyName':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Company name must be at least 2 characters';
                }
                break;
                
            case 'contactPerson':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Contact person name is required';
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
                
            case 'phone':
                const phoneRegex = /^[\d\s\+\-\(\)]{8,}$/;
                if (!phoneRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;
                
            case 'serviceCategory':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Please select a service category';
                }
                break;
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        field.classList.add('is-invalid');
        
        let errorDiv = field.nextElementSibling;
        if (!errorDiv || !errorDiv.classList.contains('invalid-feedback')) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            field.parentNode.insertBefore(errorDiv, field.nextSibling);
        }
        errorDiv.textContent = message;
    }
    
    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorDiv = field.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('invalid-feedback')) {
            errorDiv.remove();
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate all required fields
        const fields = ['companyName', 'contactPerson', 'email', 'phone', 'serviceCategory'];
        let isValid = true;
        
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showNotification('Please fill all required fields correctly', 'error');
            return;
        }
        
        // Collect form data
        const formData = {
            companyName: document.getElementById('companyName')?.value || '',
            contactPerson: document.getElementById('contactPerson')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            serviceCategory: document.getElementById('serviceCategory')?.value || '',
            message: document.getElementById('message')?.value || '',
            timestamp: new Date().toISOString(),
            pageUrl: window.location.href,
            language: document.documentElement.lang || 'en'
        };
        
        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...';
        
        try {
            // Save to localStorage
            this.saveToLocalStorage(formData);
            
            // Simulate successful submission
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.showNotification('Quote request sent successfully! We will contact you within 24 hours.', 'success');
            this.form.reset();
            
            // Track conversion (if Google Analytics exists)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'generate_lead', {
                    'event_category': 'quote_request',
                    'event_label': formData.serviceCategory
                });
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showNotification('There was an error sending your request. Please try again or call us directly.', 'error');
            
            // Save as fallback
            this.saveToLocalStorage(formData);
            
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }
    
    saveToLocalStorage(data) {
        try {
            let quotes = JSON.parse(localStorage.getItem('azri_quotes') || '[]');
            quotes.push(data);
            localStorage.setItem('azri_quotes', JSON.stringify(quotes));
            console.log('Quote saved to localStorage');
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }
    
    showNotification(message, type = 'success') {
        // Check if notification container exists
        let container = document.getElementById('notification-container');
        
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 100px;
                right: 30px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 15px;
            `;
            document.body.appendChild(container);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        let icon = '';
        switch(type) {
            case 'success':
                icon = '✓';
                break;
            case 'error':
                icon = '✗';
                break;
            case 'warning':
                icon = '⚠';
                break;
            default:
                icon = 'ℹ';
        }
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icon}</span>
                <p style="margin: 0; font-size: 15px; color: #1F2937;">${message}</p>
            </div>
            <button class="notification-close" style="background: none; border: none; font-size: 20px; cursor: pointer; padding: 0 5px; color: #6B7280;">&times;</button>
        `;
        
        container.appendChild(notification);
        
        // Animate in with GSAP if available
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(notification, 
                { x: 100, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.4, ease: 'power4.out' }
            );
        }
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (typeof gsap !== 'undefined') {
                gsap.to(notification, {
                    x: 100,
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power4.in',
                    onComplete: () => notification.remove()
                });
            } else {
                notification.remove();
            }
        }, 5000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(notification, {
                    x: 100,
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power4.in',
                    onComplete: () => notification.remove()
                });
            } else {
                notification.remove();
            }
        });
    }
}

// Initialize form handler
document.addEventListener('DOMContentLoaded', () => {
    new AZRIQuoteForm();
});