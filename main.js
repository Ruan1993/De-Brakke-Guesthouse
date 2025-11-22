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
    
    // --- Lightbox Functions ---
    let activeGallery = []; 
    let currentIndex = 0;   
    let touchStartX = 0;
    let touchStartY = 0;
    
    const modal = document.getElementById('lightbox-modal');
    const modalImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    function openLightbox(gallery, startIndex) {
        if (!gallery || gallery.length === 0) return;
        activeGallery = gallery; 
        currentIndex = startIndex; 
        updateModalImage();
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; 
    }

    function closeLightbox() {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        activeGallery = []; 
    }

    function updateModalImage() {
        const item = activeGallery[currentIndex];
        if (item) {
            modalImage.src = item.src || item;
        }
    }

    function showPrevImage() {
        currentIndex = (currentIndex - 1 + activeGallery.length) % activeGallery.length;
        updateModalImage();
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % activeGallery.length;
        updateModalImage();
    }

    function handleTouchStart(e) {
        if (!e.touches || e.touches.length === 0) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }

    function handleTouchEnd(e) {
        if (!e.changedTouches || e.changedTouches.length === 0) return;
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const deltaX = endX - touchStartX;
        const deltaY = endY - touchStartY;
        if (Math.abs(deltaX) > 40 && Math.abs(deltaY) < 80) {
            if (deltaX > 0) {
                showPrevImage();
            } else {
                showNextImage();
            }
        }
    }

    function initializeGallery() {
        const mainSuiteGallery = [
            { src: 'images/Image 3.jpg', caption: 'Main Suite view' },
            { src: 'images/Image 4.jpg', caption: 'Main Suite bedroom' }
        ];
        const twinRoomGallery = [
            { src: 'images/Image 10.jpg', caption: 'Twin Room beds' },
            { src: 'images/Image 11.jpg', caption: 'Twin Room angle' }
        ];
        const mainGallery = [];

        const mainSuiteImg = document.getElementById('main-suite-img');
        if (mainSuiteImg) {
            mainSuiteImg.addEventListener('click', () => openLightbox(mainSuiteGallery, 1));
            const mainSuiteOverlay = mainSuiteImg.nextElementSibling;
            if (mainSuiteOverlay) {
                mainSuiteOverlay.addEventListener('click', () => openLightbox(mainSuiteGallery, 1));
            }
        }

        const twinRoomImg = document.getElementById('twin-room-img');
        if (twinRoomImg) {
            twinRoomImg.addEventListener('click', () => openLightbox(twinRoomGallery, 1));
            const twinRoomOverlay = twinRoomImg.nextElementSibling;
            if (twinRoomOverlay) {
                twinRoomOverlay.addEventListener('click', () => openLightbox(twinRoomGallery, 1));
            }
        }

        const mainGalleryItems = document.querySelectorAll('#gallery .gallery-item img');
        mainGalleryItems.forEach((img, index) => {
            mainGallery.push({ src: img.src, caption: img.alt || '' });
            if(img.parentNode) {
                img.parentNode.addEventListener('click', () => openLightbox(mainGallery, index));
            }
        });

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

        if (modal) {
            modal.addEventListener('touchstart', handleTouchStart, { passive: true });
            modal.addEventListener('touchend', handleTouchEnd, { passive: true });
        }
    }

    initializeGallery();

    document.addEventListener('keydown', (event) => {
        if (modal.classList.contains('hidden')) return;
        if (event.key === 'Escape') closeLightbox();
        if (event.key === 'ArrowLeft') showPrevImage();
        if (event.key === 'ArrowRight') showNextImage();
    });

    // --- Scroll spy and active link highlighting ---
    const sections = document.querySelectorAll('main section');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 150;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                // Remove old classes
                link.classList.remove('text-primary'); 
                link.classList.add('text-gray-600'); 
                
                if (link.href && link.href.includes(current)) {
                    // Add new active classes (Gold)
                    link.classList.add('text-primary');
                    link.classList.remove('text-gray-600');
                }
            });
        });
    }

    // --- Scroll to Top & Reveal ---
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
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const revealElements = document.querySelectorAll('.reveal-up');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }
    let checkInPicker;
    let checkOutPicker;

    function setupDatePickers(disabledDates = []) {
        const commonConfig = {
            dateFormat: 'Y-m-d',
            minDate: 'today',
            disable: disabledDates,
            disableMobile: true,
            allowInput: false,
            locale: { firstDayOfWeek: 1 },
            defaultDate: 'today'
        };
        checkOutPicker = flatpickr('#check-out', { ...commonConfig });
        checkInPicker = flatpickr('#check-in', {
            ...commonConfig,
            onReady: function(selectedDates, dateStr, instance) {
                setTimeout(() => instance.open(), 150);
            },
            onChange: function(selectedDates) {
                if (selectedDates && selectedDates.length > 0) {
                    const date = selectedDates[0];
                    const nextDay = new Date(date);
                    nextDay.setDate(date.getDate() + 1);
                    if (checkOutPicker) {
                        checkOutPicker.set('minDate', nextDay);
                        setTimeout(() => checkOutPicker.open(), 100);
                    }
                }
            }
        });
    }

    async function initBookingsFromFirebase() {
        const bookingsRef = window.collection(window.db, 'bookings');
        let snapshot;
        try {
            snapshot = await window.getDocs(bookingsRef);
        } catch (error) {
            return;
        }
        const disabledDates = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.checkIn && data.checkOut) {
                disabledDates.push({ from: data.checkIn, to: data.checkOut });
            }
        });
        if (checkInPicker) checkInPicker.set('disable', disabledDates);
        if (checkOutPicker) checkOutPicker.set('disable', disabledDates);
    }

    setupDatePickers([]);

    const waitForFirebase = setInterval(async () => {
        if (window.db) {
            clearInterval(waitForFirebase);
            initBookingsFromFirebase();
        }
    }, 100);

    const bookingForm = document.getElementById('booking-form');
    const msgDiv = document.getElementById('booking-message');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async e => {
            e.preventDefault();
            const btn = bookingForm.querySelector('button[type="submit"]');
            const originalText = btn ? btn.innerText : '';
            const formData = new FormData(bookingForm);
            const checkIn = formData.get('check-in');
            const checkOut = formData.get('check-out');
            const name = formData.get('name');
            const adults = formData.get('adults');
            const children = formData.get('children');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const message = formData.get('message');
            if (!checkIn || !checkOut) {
                alert('Please select a valid date range.');
                return;
            }
            if (btn) {
                btn.innerText = 'Reserving...';
                btn.disabled = true;
                btn.classList.add('opacity-50', 'cursor-not-allowed');
            }
            let firebaseOk = false;
            let web3Ok = false;
            try {
                if (window.db) {
                    await window.addDoc(window.collection(window.db, 'bookings'), {
                        checkIn,
                        checkOut,
                        name,
                        guests: adults,
                        children,
                        email,
                        phone,
                        message,
                        createdAt: new Date().toISOString()
                    });
                    firebaseOk = true;
                }
            } catch (_) {}
            try {
                const payload = {
                    access_key: '50c68771-8428-431f-8372-18697ca141ac',
                    subject: 'NEW BOOKING FOR DE BRAKKE GUESTHOUSE!',
                    from_name: 'De Brakke Guesthouse',
                    name,
                    email,
                    phone,
                    adults,
                    children,
                    check_in: checkIn,
                    check_out: checkOut,
                    message
                };
                const res = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (data && data.success) web3Ok = true;
            } catch (_) {}
            if (web3Ok) {
                if (msgDiv) {
                    msgDiv.className = 'block text-center mt-4 p-3 bg-green-100 text-green-800 rounded-md';
                    msgDiv.innerText = `Success! Booked for ${checkIn} to ${checkOut}. We will contact you shortly.`;
                }
                const newRange = { from: checkIn, to: checkOut };
                if (checkInPicker) {
                    checkInPicker.set('disable', [...checkInPicker.config.disable, newRange]);
                }
                if (checkOutPicker) {
                    checkOutPicker.set('disable', [...checkOutPicker.config.disable, newRange]);
                }
                if (btn) {
                    btn.innerText = 'Reservation Received';
                    btn.disabled = true;
                    btn.classList.add('opacity-50', 'cursor-not-allowed');
                }
            } else {
                if (msgDiv) {
                    msgDiv.className = 'block text-center mt-4 p-3 bg-red-100 text-red-800 rounded-md';
                    msgDiv.innerText = 'Something went wrong. Please try again.';
                }
                if (btn) {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    btn.classList.remove('opacity-50', 'cursor-not-allowed');
                }
            }
        });
    }

    
});
