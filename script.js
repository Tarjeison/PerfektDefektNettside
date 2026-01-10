// Enhanced scroll snap support
document.addEventListener('DOMContentLoaded', function() {
    const sections = Array.from(document.querySelectorAll('.section'));
    let isScrolling = false;
    let scrollDirection = 0;

    // Function to find which section is currently most visible
    function getCurrentSection() {
        const scrollPosition = window.scrollY || window.pageYOffset;
        const windowHeight = window.innerHeight;
        const viewportMiddle = scrollPosition + (windowHeight / 2);
        
        let currentSection = null;
        let maxVisible = 0;
        
        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const sectionTop = scrollPosition + rect.top;
            const sectionBottom = sectionTop + rect.height;
            
            // Calculate how much of the section is visible in viewport
            const visibleTop = Math.max(0, -rect.top);
            const visibleBottom = Math.min(rect.height, windowHeight - rect.top);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            
            if (visibleHeight > maxVisible) {
                maxVisible = visibleHeight;
                currentSection = section;
            }
        });
        
        return currentSection;
    }

    // Function to snap to the appropriate section
    function snapToSection() {
        if (isScrolling) return;
        
        const scrollPosition = window.scrollY || window.pageYOffset;
        const currentSection = getCurrentSection();
        
        if (!currentSection) return;
        
        const rect = currentSection.getBoundingClientRect();
        const sectionTop = scrollPosition + rect.top;
        const distanceFromTop = Math.abs(scrollPosition - sectionTop);
        
        // Only snap if we're not already at the top of a section (within 20px)
        if (distanceFromTop > 20) {
            isScrolling = true;
            
            currentSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
            setTimeout(() => {
                isScrolling = false;
            }, 800);
        }
    }

    // Track scroll direction
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', function() {
        if (isScrolling) return;
        
        const currentScrollY = window.scrollY;
        scrollDirection = currentScrollY > lastScrollY ? 1 : -1;
        lastScrollY = currentScrollY;
    }, { passive: true });

    // Handle scroll end - snap after user stops scrolling
    let scrollEndTimeout;
    window.addEventListener('scroll', function() {
        if (isScrolling) return;
        
        clearTimeout(scrollEndTimeout);
        scrollEndTimeout = setTimeout(() => {
            snapToSection();
        }, 150);
    }, { passive: true });

    // Lightbox functionality
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxOverlay = document.querySelector('.lightbox-overlay');
    const galleryItems = document.querySelectorAll('.gallery-item img');

    function openLightbox(imgSrc) {
        lightboxImage.src = imgSrc;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Open lightbox when clicking on gallery images
    galleryItems.forEach(img => {
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            openLightbox(this.src);
        });
    });

    // Close lightbox when clicking on overlay (outside the image) or on the image itself
    lightboxOverlay.addEventListener('click', function(e) {
        if (e.target === lightboxOverlay) {
            closeLightbox();
        }
    });

    // Close lightbox when clicking on the enlarged image
    lightboxImage.addEventListener('click', function(e) {
        e.stopPropagation();
        closeLightbox();
    });

    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
            closeLightbox();
        }
    });
});
