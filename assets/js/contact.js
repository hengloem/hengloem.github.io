// ==================== CONTACT FORM HANDLING ====================
document.addEventListener('DOMContentLoaded', function () {
    initializeContactForm();
});

function initializeContactForm() {
    const contactForm = document.querySelector('.contact__form');

    if (!contactForm) return;

    // Form elements
    const formFields = {
        name: contactForm.querySelector('#name'),
        email: contactForm.querySelector('#email'),
        subject: contactForm.querySelector('#subject'),
        message: contactForm.querySelector('#message')
    };

    // Submit button
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;

    // Initialize form validation
    initializeFormValidation(contactForm, formFields);

    // Handle form submission
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!validateForm(formFields)) {
            return;
        }

        await handleFormSubmission(contactForm, formFields, submitButton, originalButtonText);
    });

    // Real-time validation
    Object.values(formFields).forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => clearFieldError(field));
    });
}

function initializeFormValidation(form, fields) {
    // Add required attribute to all fields
    Object.values(fields).forEach(field => {
        field.setAttribute('required', 'true');
    });

    // Add email validation pattern
    if (fields.email) {
        fields.email.setAttribute('pattern', '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$');
    }
}

function validateForm(fields) {
    let isValid = true;

    // Validate each field
    Object.values(fields).forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name') || field.getAttribute('id');

    // Clear previous errors
    clearFieldError(field);

    // Check required fields
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, `${getFieldLabel(fieldName)} is required`);
        return false;
    }

    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }

    // Minimum length validation
    if (fieldName === 'name' && value.length < 2) {
        showFieldError(field, 'Name must be at least 2 characters long');
        return false;
    }

    if (fieldName === 'message' && value.length < 10) {
        showFieldError(field, 'Message must be at least 10 characters long');
        return false;
    }

    // Maximum length validation
    if (value.length > 500) {
        showFieldError(field, `${getFieldLabel(fieldName)} must be less than 500 characters`);
        return false;
    }

    return true;
}

function showFieldError(field, message) {
    // Remove existing error
    clearFieldError(field);

    // Add error class to field
    field.classList.add('error');

    // Create error message element
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: block;
    `;

    // Insert error message after field
    field.parentNode.appendChild(errorElement);

    // Focus on field with error
    field.focus();
}

function clearFieldError(field) {
    field.classList.remove('error');

    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function getFieldLabel(fieldName) {
    const labels = {
        'name': 'Name',
        'email': 'Email',
        'subject': 'Subject',
        'message': 'Message'
    };

    return labels[fieldName] || fieldName;
}

async function handleFormSubmission(form, fields, submitButton, originalButtonText) {
    // Show loading state
    setButtonLoading(submitButton, true);

    try {
        // Get form data
        const formData = {
            name: fields.name.value.trim(),
            email: fields.email.value.trim(),
            subject: fields.subject.value.trim(),
            message: fields.message.value.trim(),
            timestamp: new Date().toISOString(),
            source: 'portfolio_website'
        };

        // Simulate API call (replace with actual endpoint)
        const response = await submitFormData(formData);

        if (response.success) {
            // Show success message
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');

            // Reset form
            form.reset();

            // Track conversion (if analytics is set up)
            trackFormConversion();
        } else {
            throw new Error(response.message || 'Failed to send message');
        }

    } catch (error) {
        console.error('Form submission error:', error);
        showNotification('Sorry, there was an error sending your message. Please try again or contact me directly at hengloem.pnc@gmail.com', 'error');
    } finally {
        // Restore button state
        setButtonLoading(submitButton, false, originalButtonText);
    }
}

function setButtonLoading(button, isLoading, originalText = '') {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = `
            <span class="loading-spinner"></span>
            Sending...
        `;

        // Add spinner styles if not already added
        if (!document.querySelector('#spinner-styles')) {
            const styles = document.createElement('style');
            styles.id = 'spinner-styles';
            styles.textContent = `
                .loading-spinner {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 2px solid transparent;
                    border-top: 2px solid currentColor;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-right: 8px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
            `;
            document.head.appendChild(styles);
        }
    } else {
        button.disabled = false;
        button.innerHTML = originalText;
    }
}

// Simulated form submission (replace with actual API call)
async function submitFormData(formData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate successful submission 90% of the time
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
        // Log the form data (in real implementation, send to server)
        console.log('Form submitted:', formData);

        // Here you would typically send data to your backend
        // Example using fetch:
        /*
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        return await response.json();
        */

        return {
            success: true,
            message: 'Message sent successfully'
        };
    } else {
        // Simulate server error
        throw new Error('Server unavailable. Please try again later.');
    }
}

function trackFormConversion() {
    // Track form submission in analytics (if available)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'contact_form_submission', {
            'event_category': 'engagement',
            'event_label': 'Contact Form'
        });
    }

    // You can also use other analytics services
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Contact');
    }
}

// ==================== ENHANCED NOTIFICATION SYSTEM ====================
function showNotification(message, type = 'info', duration = 5000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;

    const icons = {
        success: 'uil uil-check-circle',
        error: 'uil uil-exclamation-triangle',
        info: 'uil uil-info-circle',
        warning: 'uil uil-exclamation-octagon'
    };

    notification.innerHTML = `
        <div class="notification__content">
            <i class="${icons[type] || icons.info}"></i>
            <span class="notification__message">${message}</span>
        </div>
        <button class="notification__close">
            <i class="uil uil-times"></i>
        </button>
    `;

    // Add notification styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--card-bg);
                color: var(--text-color);
                padding: 1rem 1.5rem;
                border-radius: var(--border-radius);
                box-shadow: var(--card-shadow);
                border: 1px solid var(--card-border);
                z-index: var(--z-modal);
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                max-width: 400px;
                transform: translateX(120%);
                transition: transform 0.3s ease;
                backdrop-filter: blur(10px);
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification__content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                flex: 1;
            }
            .notification--success {
                border-left: 4px solid var(--secondary-color);
            }
            .notification--error {
                border-left: 4px solid #ef4444;
            }
            .notification--info {
                border-left: 4px solid var(--primary-color);
            }
            .notification--warning {
                border-left: 4px solid #f59e0b;
            }
            .notification__close {
                background: none;
                border: none;
                font-size: 1.25rem;
                cursor: pointer;
                color: var(--text-light);
                display: flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                transition: var(--transition);
            }
            .notification__close:hover {
                background: var(--bg-dark);
                color: var(--text-color);
            }
            @media (max-width: 768px) {
                .notification {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto remove after duration
    const autoRemove = setTimeout(() => {
        hideNotification(notification);
    }, duration);

    // Close button
    notification.querySelector('.notification__close').addEventListener('click', () => {
        clearTimeout(autoRemove);
        hideNotification(notification);
    });

    return notification;
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// ==================== FORM FIELD ENHANCEMENTS ====================
function enhanceFormFields() {
    const formInputs = document.querySelectorAll('.form__input');

    formInputs.forEach(input => {
        // Add focus effects
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function () {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });

        // Add character counter for textarea
        if (input.tagName === 'TEXTAREA') {
            const counter = document.createElement('div');
            counter.className = 'char-counter';
            counter.style.cssText = `
                font-size: 0.75rem;
                color: var(--text-lighter);
                text-align: right;
                margin-top: 0.25rem;
            `;

            input.parentNode.appendChild(counter);

            input.addEventListener('input', function () {
                const count = this.value.length;
                counter.textContent = `${count}/500`;

                if (count > 450) {
                    counter.style.color = '#ef4444';
                } else if (count > 400) {
                    counter.style.color = '#f59e0b';
                } else {
                    counter.style.color = 'var(--text-lighter)';
                }
            });

            // Trigger initial count
            input.dispatchEvent(new Event('input'));
        }
    });
}

// Initialize form enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    enhanceFormFields();
});

// ==================== CONTACT FORM ANALYTICS ====================
function trackFormInteractions() {
    const contactForm = document.querySelector('.contact__form');

    if (!contactForm) return;

    const formFields = contactForm.querySelectorAll('.form__input');

    formFields.forEach(field => {
        field.addEventListener('focus', function () {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_field_focus', {
                    'event_category': 'engagement',
                    'event_label': this.name || this.id
                });
            }
        });

        field.addEventListener('blur', function () {
            if (this.value.trim() && typeof gtag !== 'undefined') {
                gtag('event', 'form_field_completion', {
                    'event_category': 'engagement',
                    'event_label': this.name || this.id
                });
            }
        });
    });
}

// Initialize form analytics
document.addEventListener('DOMContentLoaded', function () {
    trackFormInteractions();
});

// ==================== EXPORT FUNCTIONS FOR GLOBAL USE ====================
// Make functions available globally if needed
window.ContactForm = {
    initialize: initializeContactForm,
    showNotification: showNotification,
    validateForm: validateForm
};

// Add CSS for form validation
const formValidationStyles = `
    .form__input.error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .form__field.focused .form__label {
        color: var(--primary-color);
        transform: translateY(0);
    }
    
    @media (max-width: 768px) {
        .notification {
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }
`;

// Inject styles
if (!document.querySelector('#form-validation-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'form-validation-styles';
    styleSheet.textContent = formValidationStyles;
    document.head.appendChild(styleSheet);
}