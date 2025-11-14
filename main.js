// Wait for the HTML document to be fully loaded before running any scripts
document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        mobileMenu.addEventListener('click', (e) => {
            const target = e.target.closest('a, button');
            if (target) {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    const headerEl = document.querySelector('header');
    const hashLinks = document.querySelectorAll('header a[href^="#"], #mobile-menu a[href^="#"]');
    hashLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = link.getAttribute('href').slice(1);
            const target = document.getElementById(id);
            if (!target) return;
            const headerHeight = headerEl ? headerEl.offsetHeight : 0;
            const y = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 8;
            window.scrollTo({ top: y, behavior: 'smooth' });
            if (mobileMenu) mobileMenu.classList.add('hidden');
        });
    });

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
            const onDesktop = window.matchMedia('(min-width: 768px)').matches;
            if (!onDesktop && e.target === modal) closeLightbox();
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

    let touchStartX = 0;
    let touchStartY = 0;
    const swipeThreshold = 50;
    if (modalImage) {
        modalImage.addEventListener('touchstart', (e) => {
            const t = e.changedTouches[0];
            touchStartX = t.clientX;
            touchStartY = t.clientY;
        }, { passive: true });
        modalImage.addEventListener('touchend', (e) => {
            const t = e.changedTouches[0];
            const dx = t.clientX - touchStartX;
            const dy = Math.abs(t.clientY - touchStartY);
            if (Math.abs(dx) > swipeThreshold && dy < 80) {
                if (dx < 0) {
                    showNextImage();
                } else {
                    showPrevImage();
                }
            }
        }, { passive: true });
    }

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (event) => {
        if (modal.classList.contains('hidden')) return;
        const onDesktop = window.matchMedia('(min-width: 768px)').matches;
        if (!onDesktop && event.key === 'Escape') closeLightbox();
        if (event.key === 'ArrowLeft') showPrevImage();
        if (event.key === 'ArrowRight') showNextImage();
    });


    // --- Web3Forms Integration ---
    function handleWeb3Form(formId, messageId, subject) {
        const form = document.getElementById(formId);
        const messageEl = document.getElementById(messageId);
        if (!form || !messageEl) return;

        const submitBtn = form.querySelector('button[type="submit"]');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            formData.append('access_key', '50c68771-8428-431f-8372-18697ca141ac');
            formData.append('subject', subject);
            formData.append('website', 'De Brakke Guesthouse');
            formData.append('site_url', window.location.origin);
            formData.append('form_id', formId);

            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            messageEl.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'border-red-200');
            messageEl.classList.add('bg-cyan-50', 'text-cyan-700', 'border', 'border-cyan-200');
            messageEl.textContent = 'Submitting to De Brakke Guesthouse...';

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                if (response.ok) {
                    messageEl.classList.remove('bg-cyan-50', 'text-cyan-700', 'border-cyan-200');
                    messageEl.classList.add('bg-green-100', 'text-green-700', 'border', 'border-green-200');
                    messageEl.textContent = 'Success! Your message has been sent to De Brakke Guesthouse.';
                    form.reset();
                } else {
                    messageEl.classList.remove('bg-cyan-50', 'text-cyan-700', 'border-cyan-200');
                    messageEl.classList.add('bg-red-100', 'text-red-700', 'border', 'border-red-200');
                    messageEl.textContent = 'Error: ' + (data.message || 'Unable to send message.');
                }
            } catch (error) {
                messageEl.classList.remove('bg-cyan-50', 'text-cyan-700', 'border-cyan-200');
                messageEl.classList.add('bg-red-100', 'text-red-700', 'border', 'border-red-200');
                messageEl.textContent = 'Something went wrong. Please try again.';
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    handleWeb3Form('booking-form', 'booking-message', 'New Booking Request');
    handleWeb3Form('general-contact-form', 'contact-message-status', 'New Contact Inquiry');

    // --- Scroll spy and active link highlighting ---
    const sections = document.querySelectorAll('main section');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length > 0 && navLinks.length > 0) {
        let sectionInfo = [];
        const computeOffsets = () => {
            sectionInfo = Array.from(sections).map(s => ({ id: s.getAttribute('id'), top: s.offsetTop }));
        };
        computeOffsets();
        window.addEventListener('resize', computeOffsets);

        let lastY = 0;
        let ticking = false;
        const updateActive = () => {
            ticking = false;
            const y = lastY + (headerEl ? headerEl.offsetHeight : 0) + 8;
            let current = '';
            for (let i = 0; i < sectionInfo.length; i++) {
                if (y >= sectionInfo[i].top) current = sectionInfo[i].id;
            }
            navLinks.forEach(link => {
                link.classList.remove('text-cyan-600', 'font-bold');
                link.classList.add('text-gray-700', 'font-medium');
                if (link.href && current && link.href.includes(current)) {
                    link.classList.add('text-cyan-600', 'font-bold');
                    link.classList.remove('text-gray-700', 'font-medium');
                }
            });
        };

        window.addEventListener('scroll', () => {
            lastY = window.scrollY;
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(updateActive);
            }
        }, { passive: true });
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