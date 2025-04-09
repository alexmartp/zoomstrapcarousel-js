/**
 * ZoomGallery - A lightweight vanilla JavaScript library for an elegant responsive zoom gallery within a Bootstrap Caroussel
 * @version 1.0.0
 * @license MIT
 */
class ZoomStrapCarousel {
    constructor(options = {}) {
        this.config = {
            zoomFactor: 1.5,
            animationDuration: 300,
            mobileIconSize: 24,
            carouselSelector: '#product-carousel'
        };
        
        Object.assign(this.config, options);
        
        this.state = {
            active: {
                item: null,
                zoomMode: false
            },
            position: {
                x: 50,
                y: 50
            },
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            initialized: false
        };
        
        this.carousel = null;
        
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            this.init();
        } else {
            document.addEventListener('DOMContentLoaded', () => this.init());
        }
    }
    
    init() {
        if (this.state.initialized) return;
        
        this.carousel = document.querySelector(this.config.carouselSelector);
        if (!this.carousel) {
            console.warn(`ZoomGallery: Could not find carousel with selector "${this.config.carouselSelector}"`);
            return;
        }
        
        if (this.carousel.dataset.zoomFactor) {
            this.config.zoomFactor = parseFloat(this.carousel.dataset.zoomFactor);
        }
        
        if (this.carousel.dataset.animationDuration) {
            this.config.animationDuration = parseInt(this.carousel.dataset.animationDuration);
        }
        
        this.addZoomStyles();
        
        if (this.state.isMobile) {
            this.addMobileZoomIcons();
        } else {
            document.addEventListener('click', (e) => this.handleZoomToggle(e));
            this.carousel.addEventListener('mousemove', (e) => this.updateZoomPosition(e));
        }
        
        this.carousel.addEventListener('slide.bs.carousel', (e) => this.handleCarouselSlide(e));
        window.addEventListener('resize', () => this.exitZoomMode());
        
        this.setupDoubleTapDetection();
        this.modifyCarouselBehavior();
        
        this.state.initialized = true;
    }
    
    addZoomStyles() {
        if (document.getElementById('zoom-gallery-styles')) return;
        
        const carouselClass = this.config.carouselSelector.replace(/^[.#]/, '');
        
        const styles = `
        .zoom-mode { 
            position: relative; 
            overflow: hidden; 
            cursor: zoom-out; 
        }
        
        ${this.config.carouselSelector}:not(.zoom-mode) .carousel-item img { 
            cursor: zoom-in; 
        }
        
        .zoom-active { 
            position: relative; 
            z-index: 5; 
        }
        
        .carousel-item img {
            transition: transform ${this.config.animationDuration}ms ease-out;
            width: 100%;
            height: auto;
        }
        
        .zoom-mode * { 
            user-select: none; 
            -webkit-user-select: none; 
        }
        
        .mobile-zoom-icon {
            position: absolute;
            bottom: 10px;
            right: 10px;
            background-color: rgba(255, 255, 255, 0.7);
            border-radius: 50%;
            padding: 8px;
            cursor: pointer;
            z-index: 10;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            transition: transform 0.2s ease;
        }
        
        .mobile-zoom-icon:hover {
            transform: scale(1.1);
        }
        
        .mobile-zoom-icon svg {
            display: block;
        }
        
        .mobile-gallery-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .mobile-gallery-container {
            position: relative;
            width: 100%;
            height: 80%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
        }
        
        .mobile-gallery-img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            user-select: none;
            -webkit-user-select: none;
        }
        
        .mobile-gallery-close {
            position: fixed;
            top: 15px;
            right: 15px;
            color: white;
            font-size: 30px;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 50%;
            cursor: pointer;
            z-index: 10000;
        }
        
        .mobile-gallery-reset {
            position: fixed;
            bottom: 15px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            background-color: rgba(0, 0, 0, 0.5);
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            z-index: 10000;
            font-size: 14px;
        }
        
        @media (max-width: 768px) {
            body:has(.mobile-gallery-overlay) .carousel-control-prev,
            body:has(.mobile-gallery-overlay) .carousel-control-next {
                display: none;
            }
            
            .mobile-zoom-icon {
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
        `;
        
        const styleEl = document.createElement('style');
        styleEl.id = 'zoom-gallery-styles';
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);
    }
    
    addMobileZoomIcons() {
        const iconTemplate = this.createZoomIconTemplate();
        const items = this.carousel.querySelectorAll('.carousel-item');
        
        items.forEach(item => {
            if (getComputedStyle(item).position === 'static') {
                item.style.position = 'relative';
            }
            
            const icon = iconTemplate.cloneNode(true);
            
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openMobileGalleryView(item);
            });
            
            item.appendChild(icon);
        });
    }
    
    createZoomIconTemplate() {
        const icon = document.createElement('div');
        icon.className = 'mobile-zoom-icon';
        icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.config.mobileIconSize}" height="${this.config.mobileIconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`;
        return icon;
    }
    
    openMobileGalleryView(item) {
        const img = item.querySelector('img');
        if (!img) return;
        
        const scrollY = window.scrollY;
        
        const overlay = document.createElement('div');
        overlay.className = 'mobile-gallery-overlay';
        
        const container = document.createElement('div');
        container.className = 'mobile-gallery-container';
        
        const galleryImg = document.createElement('img');
        galleryImg.className = 'mobile-gallery-img';
        galleryImg.src = img.src;
        galleryImg.alt = img.alt || 'Product image';
        
        const closeBtn = document.createElement('div');
        closeBtn.className = 'mobile-gallery-close';
        closeBtn.innerHTML = '×';
        
        document.documentElement.style.position = 'fixed';
        document.documentElement.style.overflow = 'hidden';
        document.documentElement.style.width = '100%';
        document.documentElement.style.top = `-${scrollY}px`;
        
        closeBtn.addEventListener('click', () => {
            document.documentElement.style.position = '';
            document.documentElement.style.overflow = '';
            document.documentElement.style.width = '';
            document.documentElement.style.top = '';
            
            window.scrollTo(0, scrollY);
            
            document.body.removeChild(overlay);
        });
        
        container.appendChild(galleryImg);
        overlay.appendChild(container);
        overlay.appendChild(closeBtn);
        document.body.appendChild(overlay);
        
        const preventScroll = function(e) {
            if (e.target === galleryImg) {
                return true;
            }
            e.preventDefault();
        };
        
        document.addEventListener('touchmove', preventScroll, { passive: false });
        
        closeBtn.addEventListener('click', () => {
            document.removeEventListener('touchmove', preventScroll);
        }, { once: true });
    }
    
    setupDoubleTapDetection() {
        let lastTapTime = 0;
        const doubleTapDelay = 300;
        
        this.carousel.addEventListener('dblclick', (e) => {
            if (this.state.active.zoomMode) {
                this.exitZoomMode();
            }
        });
        
        this.carousel.addEventListener('touchend', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTapTime;
            
            if (tapLength < doubleTapDelay && tapLength > 0) {
                if (this.state.active.zoomMode) {
                    this.exitZoomMode();
                }
                e.preventDefault();
            }
            
            lastTapTime = currentTime;
        });
    }
    
    handleCarouselSlide(event) {
        if (this.state.active.zoomMode) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
        
        this.exitZoomMode();
    }
    
    modifyCarouselBehavior() {
        if (typeof bootstrap === 'undefined' || !bootstrap.Carousel) return;
        
        try {
            const carouselInstance = bootstrap.Carousel.getInstance(this.carousel);
            if (!carouselInstance) return;
            
            const originalCycle = carouselInstance.cycle;
            const originalPause = carouselInstance.pause;
            
            carouselInstance.cycle = () => {
                if (this.state.active.zoomMode) return;
                originalCycle.call(carouselInstance);
            };
            
            carouselInstance.pause = () => {
                originalPause.call(carouselInstance);
            };
        } catch (e) {
            console.warn("Bootstrap carousel modification failed:", e);
        }
    }
    
    handleZoomToggle(event) {
        if (this.state.isMobile || event.target.closest('.carousel-control-prev, .carousel-control-next')) {
            return;
        }
        
        if (this.state.active.zoomMode) {
            this.exitZoomMode();
        } else {
            const activeItem = this.carousel.querySelector('.carousel-item.active');
            if (!activeItem) return;
            
            if (this.carousel.contains(event.target)) {
                this.enterZoomMode(activeItem, event);
            }
        }
    }
    
    updateZoomPosition(event) {
        if (!this.state.active.zoomMode || this.state.isMobile) return;
        
        const img = this.state.active.item.querySelector('img');
        if (!img) return;
        
        const rect = this.state.active.item.getBoundingClientRect();
        
        this.state.position.x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
        this.state.position.y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
        
        img.style.transformOrigin = `${this.state.position.x}% ${this.state.position.y}%`;
    }
    
    enterZoomMode(item, event) {
        if (this.state.isMobile) return;
        
        const img = item.querySelector('img');
        if (!img) return;
        
        this.state.active.item = item;
        this.state.active.zoomMode = true;
        
        const rect = item.getBoundingClientRect();
        this.state.position.x = ((event.clientX - rect.left) / rect.width) * 100;
        this.state.position.y = ((event.clientY - rect.top) / rect.height) * 100;
        
        this.carousel.classList.add('zoom-mode');
        item.classList.add('zoom-active');
        img.style.transformOrigin = `${this.state.position.x}% ${this.state.position.y}%`;
        img.style.transform = `scale(${this.config.zoomFactor})`;
        
        // Disable carousel controls
        this.toggleCarouselControls(false);
        
        if (typeof bootstrap !== 'undefined' && bootstrap.Carousel) {
            try {
                const carouselInstance = bootstrap.Carousel.getInstance(this.carousel);
                if (carouselInstance) {
                    // Store original data-bs-ride value if exists
                    if (this.carousel.hasAttribute('data-bs-ride')) {
                        this.carousel.dataset.bsRide = this.carousel.getAttribute('data-bs-ride');
                    }
                    carouselInstance.pause();
                    this.carousel.dataset.manuallyPaused = 'true';
                    this.carousel.removeAttribute('data-bs-ride');
                }
            } catch (e) {
                console.warn("Bootstrap carousel instance not available:", e);
            }
        }
    }
    
    exitZoomMode() {
        if (!this.state.active.zoomMode || !this.state.active.item) return;
        
        const img = this.state.active.item.querySelector('img');
        if (img) {
            img.style.transformOrigin = `${this.state.position.x}% ${this.state.position.y}%`;
            img.style.transform = 'scale(1)';
        }
        
        this.carousel.classList.remove('zoom-mode');
        this.state.active.item.classList.remove('zoom-active');
        
        // Re-enable carousel controls
        this.toggleCarouselControls(true);
        
        // Resume carousel functionality
        this.resumeCarousel();
        
        this.state.active.item = null;
        this.state.active.zoomMode = false;
    }
    
    resumeCarousel() {
        if (typeof bootstrap !== 'undefined' && bootstrap.Carousel) {
            try {
                const carouselInstance = bootstrap.Carousel.getInstance(this.carousel);
                if (carouselInstance && this.carousel.dataset.manuallyPaused === 'true') {
                    if (this.carousel.dataset.bsRide) {
                        this.carousel.setAttribute('data-bs-ride', this.carousel.dataset.bsRide);
                    } else {
                        this.carousel.setAttribute('data-bs-ride', 'carousel');
                    }
                    delete this.carousel.dataset.manuallyPaused;
                    carouselInstance.cycle();
                }
            } catch (e) {
                console.warn("Bootstrap carousel resume failed:", e);
            }
        }
    }
    
    toggleCarouselControls(show) {
        const prevControl = this.carousel.querySelector('.carousel-control-prev');
        const nextControl = this.carousel.querySelector('.carousel-control-next');
        const indicators = this.carousel.querySelector('.carousel-indicators');
        
        if (prevControl) {
            prevControl.style.display = show ? '' : 'none';
        }
        
        if (nextControl) {
            nextControl.style.display = show ? '' : 'none';
        }
        
        if (indicators) {
            indicators.style.display = show ? '' : 'none';
        }
    }
}

// Create a global reference
window.ZoomStrapCarousel = ZoomStrapCarousel;