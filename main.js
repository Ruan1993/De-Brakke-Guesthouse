// Wait for the HTML document to be fully loaded before running any scripts
document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- Custom Message Box Function and Map Link Handler ---
    const tempMessage = document.getElementById('temp-message');
    const mapLink = document.getElementById('map-link');

    function showTempMessage(message) {
        if (!tempMessage) return;
        
        tempMessage.textContent = message;
        tempMessage.classList.remove('hidden', 'opacity-0');
        tempMessage.classList.add('opacity-100');

        setTimeout(() => {
            tempMessage.classList.remove('opacity-100');
            tempMessage.classList.add('opacity-0');
            setTimeout(() => {
                tempMessage.classList.add('hidden');
            }, 300); 
        }, 4000);
    }

    if (mapLink) {
        mapLink.addEventListener('click', (event) => {
            event.preventDefault();
            showTempMessage('Google Maps integration will be added here once the URL is available!');
        });
    }

    // --- Lightbox Functions ---
    let galleryImages = [];
    let currentIndex = 0;
    
    const modal = document.getElementById('lightbox-modal');
    const modalImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    function openLightbox(index) {
        if (index < 0 || index >= galleryImages.length) return;
        currentIndex = index;
        updateModalImage();
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; 
    }

    function closeLightbox() {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    function updateModalImage() {
        if (galleryImages[currentIndex]) {
            modalImage.src = galleryImages[currentIndex];
        }
    }

    function showPrevImage() {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        updateModalImage();
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % galleryImages.length;
        updateModalImage();
    }

    function initializeGallery() {
        // 1. Manually add the two room images (if they exist)
        const mainSuiteImg = document.getElementById('main-suite-img');
        const twinRoomImg = document.getElementById('twin-room-img');

        if (mainSuiteImg) {
            galleryImages.push(mainSuiteImg.src);
            const mainSuiteIndex = galleryImages.length - 1;
            mainSuiteImg.addEventListener('click', () => openLightbox(mainSuiteIndex));
        }

        if (twinRoomImg) {
            galleryImages.push(twinRoomImg.src);
            const twinRoomIndex = galleryImages.length - 1;
            twinRoomImg.addEventListener('click', () => openLightbox(twinRoomIndex));
        }

        // 2. Add the main gallery images
        const mainGalleryItems = document.querySelectorAll('#gallery .gallery-item img');
        const startingIndex = galleryImages.length; 

        mainGalleryItems.forEach((img, index) => {
            galleryImages.push(img.src);
            const fullIndex = startingIndex + index;
            if(img.parentNode) {
                img.parentNode.addEventListener('click', () => openLightbox(fullIndex));
            }
        });

        // 3. Attach listeners to modal buttons
        if(modal) modal.addEventListener('click', (e) => {
             if (e.target === modal) closeLightbox();
        });
        if(lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if(lightboxPrev) lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation(); 
            showPrevImage();
        });
        if(lightboxNext) lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showNextImage();
        });
    }

    initializeGallery();

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (event) => {
        if (modal.classList.contains('hidden')) return;
        if (event.key === 'Escape') closeLightbox();
        if (event.key === 'ArrowLeft') showPrevImage();
        if (event.key === 'ArrowRight') showNextImage();
    });


    // --- Form Simulation ---
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const nameInput = document.getElementById('name');
            const checkIn = document.getElementById('check-in').value;
            const checkOut = document.getElementById('check-out').value;
            const messageBox = document.getElementById('booking-message');

            if (!checkIn || !checkOut || !nameInput.value) {
                messageBox.textContent = "Please fill in all required fields.";
                messageBox.className = "text-center p-4 rounded-lg text-lg font-semibold bg-red-100 text-red-700";
                messageBox.classList.remove('hidden');
                return;
            }

            messageBox.textContent = `Thank you, ${nameInput.value}! Your reservation request for ${checkIn} to ${checkOut} has been noted. We will contact you soon via email or phone to confirm availability and finalize the booking.`;
            messageBox.className = "text-center p-4 rounded-lg text-lg font-semibold bg-green-100 text-green-700";
            messageBox.classList.remove('hidden');
            event.target.reset();
        });
    }

    const contactForm = document.getElementById('general-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const contactName = document.getElementById('contact-name').value;
            const contactMessageStatus = document.getElementById('contact-message-status');

            contactMessageStatus.textContent = `Hello ${contactName}, thank you for your message! We will get back to you shortly.`;
            contactMessageStatus.className = "text-center p-3 rounded-lg text-sm bg-green-100 text-green-700";
            contactMessageStatus.classList.remove('hidden');
            event.target.reset();
        });
    }


    // --- Scroll spy and active link highlighting ---
    const sections = document.querySelectorAll('main section');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('text-cyan-600', 'font-bold');
                link.classList.add('text-gray-700', 'font-medium');
                if (link.href && link.href.includes(current)) {
                    link.classList.add('text-cyan-600', 'font-bold');
                    link.classList.remove('text-gray-700', 'font-medium');
                }
            });
        });
    }


    /* ---------------------------------------------- */
    /* NEW: Page Animations & Effects */
    /* ---------------------------------------------- */

    // --- 1. "Scroll to Top" Button Logic ---
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollToTopBtn.classList.remove('hidden');
            } else {
                scrollToTopBtn.classList.add('hidden');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth' 
            });
        });
    }


    // --- 2. "Reveal on Scroll" Logic (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal-up');

    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1 // Triggers when 10% of element is visible
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }

}); // End of DOMContentLoaded