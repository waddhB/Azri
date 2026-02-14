// =========================================
// AZRI PROFESSIONAL FORM HANDLER
// شامل: التحقق، الإرسال، الإشعارات، معالجة الأخطاء
// =========================================

class AZRIQuoteForm {
    constructor() {
        this.form = document.getElementById('quoteForm');
        this.notificationContainer = document.getElementById('notification-container') || this.createNotificationContainer();
        
        // تهيئة EmailJS بمفتاحك العام
        emailjs.init("yKvBPsr38ABI_492D"); // ✅ Public Key الخاص بك
        
        this.initializeEventListeners();
    }

    // إنشاء حاوية الإشعارات إذا لم تكن موجودة
    createNotificationContainer() {
        const container = document.createElement('div');
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
        return container;
    }

    initializeEventListeners() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            
            // تحقق فوري من الحقول عند التركيز
            const inputs = this.form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
                input.addEventListener('focus', () => this.onFieldFocus(input));
            });
        } else {
            console.error('❌ Form not found!');
        }
    }

    // تأثير عند التركيز على الحقل
    onFieldFocus(field) {
        field.style.borderColor = '#1E90C0';
        field.style.boxShadow = '0 0 0 4px rgba(30,144,192,0.1)';
    }

    // التحقق من صحة الحقول
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // إزالة تأثير التركيز
        field.style.borderColor = '#E5E7EB';
        field.style.boxShadow = 'none';

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
        field.style.borderColor = '#EF4444';
        
        let errorDiv = field.nextElementSibling;
        if (!errorDiv || !errorDiv.classList.contains('invalid-feedback')) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            errorDiv.style.cssText = `
                color: #EF4444;
                font-size: 13px;
                margin-top: 5px;
                font-weight: 500;
            `;
            field.parentNode.insertBefore(errorDiv, field.nextSibling);
        }
        errorDiv.textContent = message;
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid');
        field.style.borderColor = '#E5E7EB';
        
        const errorDiv = field.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('invalid-feedback')) {
            errorDiv.remove();
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        // التحقق من جميع الحقول
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

        // جمع البيانات
        const parms = {
            companyName: document.getElementById('companyName').value.trim(),
            contactPerson: document.getElementById('contactPerson').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            serviceCategory: document.getElementById('serviceCategory').value,
            message: document.getElementById('message').value.trim() || 'No message provided',
            timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' }),
            language: document.documentElement.lang || 'en',
            pageUrl: window.location.href
        };

        // تغيير حالة الزر
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span> Sending...';

        try {
            // إرسال عبر EmailJS
            const response = await emailjs.send(
                "service_vn53fgq",      // ✅ Service ID الخاص بك
                "template_9y1a898",     // ✅ Template ID الخاص بك
                parms
            );

            console.log('✅ Email sent successfully:', response);
            
            // رسالة نجاح
            this.showNotification(
                'Quote request sent successfully! We will contact you within 24 hours.',
                'success'
            );
            
            // تفريغ النموذج
            this.form.reset();
            
            // تتبع التحويل (Google Analytics)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'generate_lead', {
                    'event_category': 'quote_request',
                    'event_label': parms.serviceCategory
                });
            }

        } catch (error) {
            console.error('❌ Error sending email:', error);
            
            // رسالة خطأ
            this.showNotification(
                'There was an error sending your request. Please try again or contact us directly.',
                'error'
            );

        } finally {
            // إعادة الزر لحالته الطبيعية
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // تحديد الأيقونة واللون
        const config = {
            success: { icon: '✓', color: '#10B981' },
            error: { icon: '✗', color: '#EF4444' },
            warning: { icon: '⚠', color: '#F59E0B' }
        };

        const { icon, color } = config[type] || config.success;

        notification.style.cssText = `
            background: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 300px;
            max-width: 450px;
            border-right: 4px solid ${color};
            animation: slideIn 0.3s ease;
        `;

        notification.innerHTML = `
            <div style="width: 30px; height: 30px; background: ${color}20; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: ${color}; font-weight: bold; font-size: 18px;">
                ${icon}
            </div>
            <p style="margin: 0; flex: 1; color: #1F2937; font-size: 14px; line-height: 1.5;">${message}</p>
            <button class="notification-close" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #9CA3AF; padding: 0 5px;">&times;</button>
        `;

        this.notificationContainer.appendChild(notification);

        // إضافة حركة الظهور
        notification.animate([
            { transform: 'translateX(100px)', opacity: 0 },
            { transform: 'translateX(0)', opacity: 1 }
        ], {
            duration: 300,
            easing: 'ease-out'
        });

        // إخفاء بعد 5 ثوان
        const timeout = setTimeout(() => this.removeNotification(notification), 5000);

        // زر الإغلاق
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(timeout);
            this.removeNotification(notification);
        });
    }

    removeNotification(notification) {
        notification.animate([
            { transform: 'translateX(0)', opacity: 1 },
            { transform: 'translateX(100px)', opacity: 0 }
        ], {
            duration: 300,
            easing: 'ease-in'
        }).onfinish = () => notification.remove();
    }
}

// تهيئة النموذج عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    if (typeof emailjs !== 'undefined') {
        new AZRIQuoteForm();
        console.log('✅ AZRI Form Handler initialized');
    } else {
        console.error('❌ EmailJS library not loaded. Please check your script tags.');
    }
});