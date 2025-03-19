// Main JavaScript file for FitPro website

// Initialize animations on scroll
document.addEventListener('DOMContentLoaded', function() {
    // Animate elements when they come into view
    const animateElements = document.querySelectorAll('.animate-fade-up, .animate-fade-right');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.style.animationDelay = `${delay * 0.1}s`;
                    entry.target.style.animationPlayState = 'running';
                }, delay * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '-50px'
    });
    
    animateElements.forEach(element => {
        element.style.animationPlayState = 'paused';
        observer.observe(element);
    });
    
    // Handle form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formValues = Object.fromEntries(formData.entries());
            
            // In a real application, you would send this data to a server
            console.log('Form submitted:', formValues);
            
            // Show success message
            alert('Thanks for your message! We\'ll get back to you soon.');
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Scroll to section when hash changes (for plans page)
    if (window.location.hash) {
        setTimeout(() => {
            const id = window.location.hash.substring(1);
            const element = document.getElementById(id);
            if (element) {
                window.scrollTo({
                    top: element.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
});