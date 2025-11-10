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

    // --- Custom Message Box Function ---
    const tempMessage = document.getElementById('temp-message');

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
    

    /* ---------------------------------------------- */
    /* UPDATED: Lightbox Functions */
    /* ---------------------------------------------- */

    let activeGallery = []; // This will hold the gallery that is currently open
    let currentIndex = 0;   // The index of the image within the activeGallery
    
    const modal = document.getElementById('lightbox-modal');
    const modalImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    // NEW: openLightbox now takes a specific gallery and a starting index
    function openLightbox(gallery, startIndex) {
        if (!gallery || gallery.length === 0) return;
        
        activeGallery = gallery; // Set the active gallery
        currentIndex = startIndex; // Set the starting image index
        
        updateModalImage();
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; 
    }

    function closeLightbox() {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        activeGallery = []; // Clear the active gallery
    }

    // UPDATED: updateModalImage now uses activeGallery
    function updateModalImage() {
        if (activeGallery[currentIndex]) {
            modalImage.src = activeGallery[currentIndex];
        }
    }

    // UPDATED: Navigation functions now use activeGallery.length
    function showPrevImage() {
        currentIndex = (currentIndex - 1 + activeGallery.length) % activeGallery.length;
        updateModalImage();
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % activeGallery.length;
        updateModalImage();
    }

    // NEW: initializeGallery logic is completely different
    function initializeGallery() {
        // 1. Define our three separate galleries
        // NOTE: The image paths must be correct!
        const mainSuiteGallery = ['images/Image 3.jpg', 'images/Image 4.jpg'];
        const twinRoomGallery = ['images/Image 10.jpg', 'images/Image 11.jpg'];
        const mainGallery = [];

        // 2. Attach listener for the Main Suite image
        const mainSuiteImg = document.getElementById('main-suite-img');
        if (mainSuiteImg) {
            // It opens mainSuiteGallery starting at index 1 (which is Image 4.jpg)
            mainSuiteImg.addEventListener('click', () => openLightbox(mainSuiteGallery, 1));
        }

        // 3. Attach listener for the Twin Room image
        const twinRoomImg = document.getElementById('twin-room-img');
        if (twinRoomImg) {
            // It opens twinRoomGallery starting at index 1 (which is Image 11.jpg)
            twinRoomImg.addEventListener('click', () => openLightbox(twinRoomGallery, 1));
        }

        // 4. Populate and attach listeners for the Main Gallery
        const mainGalleryItems = document.querySelectorAll('#gallery .gallery-item img');
        mainGalleryItems.forEach((img, index) => {
            mainGallery.push(img.src);
            if(img.parentNode) {
                // It opens mainGallery starting at the clicked image's index
                img.parentNode.addEventListener('click', () => openLightbox(mainGallery, index));
            }
        });

        // 5. Attach listeners to modal buttons (this logic is unchanged)
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
    // ALL JAVASCRIPT FOR BOOKING AND CONTACT FORMS HAS BEEN REMOVED
    // Netlify will now handle the form submissions automatically.


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
    /* Page Animations & Effects */
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