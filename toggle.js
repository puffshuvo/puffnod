// UI & state variables
let isDragging = false; // True while the comparison slider is being dragged
const slider = document.getElementById('slider'); // The draggable slider handle element
const after = document.getElementById('after'); // The right/after image element (clip mask)
const container = document.querySelector('.comparison-container'); // Comparison wrapper
const averageLabel = document.querySelector('.label.average'); // left label
const advancedLabel = document.querySelector('.label.advanced'); // right label
const section = document.querySelector(".fashion-section"); // main section containing the UI
const btnHamburger = section.querySelector('#btnHamburger'); // hamburger (left drawer) button
const btnCart = section.querySelector('#btnCart'); // cart (right drawer) button
const leftDrawer = section.querySelector('#leftDrawer'); // left side drawer element
const rightDrawer = section.querySelector('#rightDrawer'); // right side drawer element
const backdrop = section.querySelector('#backdrop'); // backdrop shown behind drawers/modals
const tilt = section.querySelector('#tilt'); // tilt interaction area for t-shirt
const tshirts = section.querySelectorAll('.tshirt'); // list of t-shirt items/elements
const dots = section.querySelectorAll('.dot'); // carousel indicator dots
const tshirtDetails = section.querySelector('.tshirt-details'); // floating details box for tshirt
const nameElem = section.querySelector('.name'); // displayed name in details
const priceElem = document.querySelector('.price'); // displayed price element
const materialElem = document.querySelector('.material'); // displayed material element
const pointerLine = section.querySelector('.pointer-line'); // line pointing from center to details
const cartCount = document.querySelector('#cartCount'); // small cart count UI
const cartItems = document.querySelector('#cartItems'); // cart items list area
const selectButton = section.querySelector('.select-button'); // primary select/add button
const confirmationMessage = document.querySelector('#confirmationMessage'); // small toast message
const sliderKnob = document.querySelector('.slider-knob'); // visual knob inside slider
const aboutLogoContainer = document.querySelector('.about-logo'); // target container in about section for animated logo
const scrollDown = document.querySelector('.scroll-down'); // scroll hint element

// Carousel/animation state
let currentIndex = 0;
let autoSlideInterval;
let cartItemCount = 3;
let cartItemsList = [];
let isAnimating = false; // flag for logo animation in progress
let clone = null; // clone of knob used for animation
let logoImg = null; // final logo element placed in about section
let startTop, startLeft, startWidth, startHeight; // start rect values for logo animation
let animationFrame; // requestAnimationFrame id
let aboutLogoPlaced = false; // true after the animated logo finishes and is placed
let resizeTimeout; // timeout for debounced resize events

// Data for t-shirts shown in the carousel
const tshirtData = [
    { name: "Stylish Tee", price: "$29.99", material: "100% Cotton" },
    { name: "Cool Shirt", price: "$34.99", material: "Polyester Blend" },
    { name: "Fashion Top", price: "$39.99", material: "Organic Cotton" }
];

// Toggle visibility of labels based on slider percentage
function updateLabelVisibility(percentage) {
    if (percentage <= 0) {
        averageLabel.classList.remove('hidden');
        advancedLabel.classList.add('hidden');
    } else if (percentage >= 100) {
        averageLabel.classList.add('hidden');
        advancedLabel.classList.remove('hidden');
    } else {
        averageLabel.classList.remove('hidden');
        advancedLabel.classList.remove('hidden');
    }
}

// Show specific t-shirt in the carousel based on index
function showTshirt(index) {
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    tshirts.forEach((tshirt, i) => {
        tshirt.classList.toggle('visible', i === index);
        tshirt.classList.toggle('hidden', i !== index);
    });
    // Update details area text
    nameElem.textContent = tshirtData[index].name;
    priceElem.textContent = `Price: ${tshirtData[index].price}`;
    materialElem.textContent = `Material: ${tshirtData[index].material}`;
    currentIndex = index;
}

// Add current t-shirt to simulated cart and show confirmation toast
function addToCart() {
    cartItemCount++;
    cartItemsList.push(tshirtData[currentIndex].name);
    cartCount.textContent = cartItemCount;
    cartItems.textContent = `${cartItemCount} items in your cart: ${cartItemsList.join(', ')}`;
    
    // simple show/hide toast
    confirmationMessage.classList.add('show');
    setTimeout(() => {
        confirmationMessage.classList.remove('show');
    }, 1500);
}

// Auto-advance carousel every 3 seconds
function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % tshirts.length;
        showTshirt(currentIndex);
    }, 3000);
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// --- Slider drag handling (mouse + touch) ---

slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault();
    stopAutoSlide();
}, { passive: false });

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    // Calculate percentage position of the slider within the container
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    
    // Move slider and update the clipped 'after' image
    slider.style.left = clampedPercentage + '%';
    after.style.clipPath = `inset(0 ${100 - clampedPercentage}% 0 0)`;

    updateLabelVisibility(clampedPercentage);
}, { passive: true });

document.addEventListener('mouseup', () => {
    isDragging = false;
    startAutoSlide();
}, { passive: true });

// Touch equivalents for mobile
slider.addEventListener('touchstart', (e) => {
    isDragging = true;
    e.preventDefault();
    stopAutoSlide();
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    
    const rect = container.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    
    slider.style.left = clampedPercentage + '%';
    after.style.clipPath = `inset(0 ${100 - clampedPercentage}% 0 0)`;

    updateLabelVisibility(clampedPercentage);
}, { passive: true });

document.addEventListener('touchend', () => {
    isDragging = false;
    startAutoSlide();
}, { passive: true });

// --- Drawer (hamburger/cart) logic ---

btnHamburger.addEventListener('click', () => {
    leftDrawer.classList.toggle('show');
    backdrop.classList.toggle('show');
    btnHamburger.classList.toggle('open');
    scrollDown.classList.toggle('hidden');
});

btnCart.addEventListener('click', () => {
    rightDrawer.classList.toggle('show');
    backdrop.classList.toggle('show');
    scrollDown.classList.toggle('hidden');
});

// Clicking backdrop closes drawers
backdrop.addEventListener('click', () => {
    leftDrawer.classList.remove('show');
    rightDrawer.classList.remove('show');
    backdrop.classList.remove('show');
    btnHamburger.classList.remove('open');
    scrollDown.classList.remove('hidden');
});

// Dots (carousel indicators) click to jump to a slide
dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        stopAutoSlide();
        showTshirt(i);
        startAutoSlide();
    });
});

// --- Tilt interaction for T-shirt preview ---
// Mousemove on 'tilt' area rotates the element and positions details box
let tiltRaf = null;
let tiltData = null;

tilt.addEventListener('mousemove', (e) => {
    tiltData = e;
    if (tiltRaf) return;
    tiltRaf = requestAnimationFrame(() => {
        if (!tiltData) return;
        const rect = tilt.getBoundingClientRect();
        const x = tiltData.clientX - rect.left;
        const y = tiltData.clientY - rect.top;
        const rotateY = (x / rect.width - 0.5) * 30;
        const rotateX = -(y / rect.height - 0.5) * 20;
        tilt.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        // Compute floating details position near cursor with bounds checking
        const detailsWidth = tshirtDetails.offsetWidth;
        const detailsHeight = tshirtDetails.offsetHeight;
        const offsetX = 60;
        const offsetY = 30;
        let detailsX = tiltData.clientX + offsetX;
        let detailsY = tiltData.clientY + offsetY;

        const containerRect = section.getBoundingClientRect();
        detailsX = Math.max(containerRect.left + 10, Math.min(detailsX, containerRect.right - detailsWidth - 10));
        detailsY = Math.max(containerRect.top + 10, Math.min(detailsY, containerRect.bottom - detailsHeight - 10));

        tshirtDetails.style.left = `${detailsX}px`;
        tshirtDetails.style.top = `${detailsY}px`;
        tshirtDetails.classList.add('show');

        // Draw a pointer line from tilt center to the details box
        const tiltCenterX = rect.left + rect.width / 2;
        const tiltCenterY = rect.top + rect.height / 2;
        const lineLength = Math.sqrt(Math.pow(detailsX - tiltCenterX, 2) + Math.pow(detailsY - tiltCenterY, 2));
        const angle = Math.atan2(detailsY - tiltCenterY, detailsX - tiltCenterX) * 180 / Math.PI;

        pointerLine.style.width = `${lineLength}px`;
        pointerLine.style.left = `${tiltCenterX}px`;
        pointerLine.style.top = `${tiltCenterY}px`;
        pointerLine.style.transform = `rotate(${angle}deg)`;
        pointerLine.classList.add('show');
        
        tiltRaf = null;
    });
}, { passive: true });

// Reset tilt when mouse leaves
tilt.addEventListener('mouseleave', () => {
    tilt.style.transform = 'rotateX(0) rotateY(0)';
    tshirtDetails.classList.remove('show');
    pointerLine.classList.remove('show');
    tiltData = null;
}, { passive: true });

// Clicking a t-shirt or pressing 'select' adds to cart
tshirts.forEach((tshirt) => {
    tshirt.addEventListener('click', () => {
        addToCart();
    });
});
selectButton.addEventListener('click', () => {
    addToCart();
});

// Small 3D motion for slider knob while hovering the comparison container
let knobRaf = null;
let knobData = null;

container.addEventListener('mousemove', (e) => {
    knobData = e;
    if (knobRaf) return;
    knobRaf = requestAnimationFrame(() => {
        if (!knobData) return;
        const rect = container.getBoundingClientRect();
        const x = knobData.clientX - rect.left;
        const y = knobData.clientY - rect.top;
        const rotateY = (x / rect.width - 0.5) * 10;
        const rotateX = -(y / rect.height - 0.5) * 10;
        sliderKnob.style.transform = `translate(-50%, -50%) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        knobRaf = null;
    });
}, { passive: true });

container.addEventListener('mouseleave', () => {
    sliderKnob.style.transform = 'translate(-50%, -50%) rotateX(0) rotateY(0)';
    knobData = null;
}, { passive: true });

// --- Animated logo transition when scrolling from comparison to about ---
// animateLogo() progressively moves a clone of the knob to the about logo container
function animateLogo() {
    // Safety guards: ensure key DOM elements exist
    if (!sliderKnob || !aboutLogoContainer) {
        isAnimating = false;
        return;
    }

    // Use viewport coordinates because clone is positioned fixed
    const startRect = sliderKnob.getBoundingClientRect();
    const targetRect = aboutLogoContainer.getBoundingClientRect();

    // Create the clone if not present
    if (!clone) {
        clone = sliderKnob.cloneNode(true);
        document.body.appendChild(clone);
        clone.style.position = 'fixed';
        clone.style.zIndex = '1000';
        clone.style.transition = 'none';
        clone.style.transformStyle = 'preserve-3d';
        clone.style.pointerEvents = 'none';
    }

    // Ensure the about logo element exists (hidden until animation ends)
    if (!logoImg) {
        logoImg = document.createElement('img');
        logoImg.src = 'puffnodep-01.png';
        logoImg.alt = 'ChooseFashion Logo';
        logoImg.style.width = '300px';
        logoImg.style.height = 'auto';
        aboutLogoContainer.appendChild(logoImg);
        logoImg.style.visibility = 'hidden';
    }

    // Compute sizes and positions (viewport-relative)
    const startTopV = startRect.top;
    const startLeftV = startRect.left;
    const startW = startRect.width;
    const startH = startRect.height;

    const targetW = 300;
    const targetH = targetW * (startH / Math.max(1, startW));
    const targetLeftV = targetRect.left + (targetRect.width - targetW) / 2;
    const targetTopV = targetRect.top + (targetRect.height - targetH) / 2;

    // Determine scroll range (absolute page values) for animation start/end
    const comparisonContainer = document.querySelector('.comparison-container');
    const compTopAbs = comparisonContainer ? comparisonContainer.offsetTop : 0;
    const aboutTopAbs = aboutLogoContainer ? (aboutLogoContainer.offsetTop) : document.body.scrollHeight;
    const startScrollAbs = compTopAbs;
    const endScrollAbs = Math.max(startScrollAbs + 50, aboutTopAbs - window.innerHeight / 2);

    const scrollAbs = window.scrollY || window.pageYOffset;

    // If we are outside animation range, clean up
    if (scrollAbs < startScrollAbs || scrollAbs > endScrollAbs + window.innerHeight) {
        if (clone) {
            clone.remove();
            clone = null;
        }
        isAnimating = false;
        cancelAnimationFrame(animationFrame);
        if (logoImg) logoImg.style.visibility = 'visible';
        return;
    }

    // Compute progress 0..1 based on absolute scroll positions
    const progress = Math.min(1, Math.max(0, (scrollAbs - startScrollAbs) / Math.max(1, (endScrollAbs - startScrollAbs))));
    const eased = progress * progress * (3 - 2 * progress);

    // Interpolate position & size (viewport coords)
    const curTop = startTopV + (targetTopV - startTopV) * eased;
    const curLeft = startLeftV + (targetLeftV - startLeftV) * eased;
    const curW = startW + (targetW - startW) * eased;
    const curH = startH + (targetH - startH) * eased;

    // Subtle floating and rotation
    const floatY = Math.sin(eased * Math.PI * 3) * (20 * (1 - eased));
    const rot = eased * 360;

    clone.style.top = `${curTop + floatY}px`;
    clone.style.left = `${curLeft}px`;
    clone.style.width = `${curW}px`;
    clone.style.height = `${curH}px`;
    clone.style.borderRadius = '50%';
    clone.style.boxShadow = `0 ${8 + eased * 12}px ${30 + eased * 30}px rgba(0,0,0,${0.4 + eased * 0.2})`;
    clone.style.transform = `rotateY(${rot}deg) scale(${1 + eased * 0.05})`;

    const innerImg = clone.querySelector('img');
    if (innerImg) {
        innerImg.style.width = '100%';
        innerImg.style.height = '100%';
        innerImg.style.objectFit = 'contain';
    }

    // When complete, reveal real logo and remove clone
    if (progress >= 1 && !aboutLogoPlaced) {
        logoImg.style.visibility = 'visible';
        if (clone) { clone.remove(); clone = null; }
        aboutLogoPlaced = true;
        isAnimating = false;
        cancelAnimationFrame(animationFrame);
        return;
    }

    // Continue next frame
    animationFrame = requestAnimationFrame(animateLogo);
}

// Trigger the logo animation when scrolling into the comparison container
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const comparisonContainer = document.querySelector('.comparison-container');
    const aboutSection = document.querySelector('.about-section');
    const comparisonRect = comparisonContainer.getBoundingClientRect();
    const startScroll = comparisonRect.top + window.scrollY;
    if (scrollY >= startScroll && !isAnimating) {
        // reset state and start animating
        aboutLogoContainer.innerHTML = '';
        logoImg = null;
        aboutLogoPlaced = false;
        isAnimating = true;
        animateLogo();
    } else if (scrollY > startScroll && aboutLogoPlaced && logoImg) {
        // If animation finished, ensure the about logo stays visible
        logoImg.style.visibility = 'visible';
    }

    // Hide scroll hint at near-bottom of page
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    if (scrollY + windowHeight >= documentHeight - 50) {
        scrollDown.classList.add('hidden');
    } else {
        scrollDown.classList.remove('hidden');
    }
}, { passive: true });

// Initialize UI
updateLabelVisibility(50);
showTshirt(0);
startAutoSlide();


      const menuBtn = document.getElementById('menuBtn');
        const navMenu = document.getElementById('navMenu');
        const overlay = document.getElementById('overlay');
        const navLinks = document.querySelectorAll('.nav-menu a');

        // Toggle menu
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            overlay.classList.toggle('active');
        });

        // Close menu on overlay click
        overlay.addEventListener('click', () => {
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                overlay.classList.remove('active');
            });
        });

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Parallax effect for orbs (throttled with RAF)
        let orbRaf = null;
        let orbData = null;
        const orbElements = document.querySelectorAll('.gradient-orb');
        
        document.addEventListener('mousemove', (e) => {
            orbData = e;
            if (orbRaf) return;
            orbRaf = requestAnimationFrame(() => {
                if (!orbData || orbElements.length === 0) return;
                const x = orbData.clientX / window.innerWidth;
                const y = orbData.clientY / window.innerHeight;
                
                orbElements.forEach((orb, index) => {
                    const speed = (index + 1) * 20;
                    orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
                });
                orbRaf = null;
            });
        }, { passive: true });



          // Logo loading animation controller
        const logoLoader = document.getElementById('logoLoader');
        const mainContent = document.getElementById('mainContent');
        
        // Wait for all animations to complete (2.4s total)
        const loaderTimeout = setTimeout(() => {
            // Hide loader
            logoLoader.classList.add('hidden');
            
            // Show main content
            mainContent.classList.add('visible');
        }, 2800); // Total animation time + small buffer

        // Optional: Add particle effects during loading
        function createParticles() {
            const container = document.getElementById('logoContainer');
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    const particle = document.createElement('div');
                    particle.style.position = 'absolute';
                    particle.style.width = '3px';
                    particle.style.height = '3px';
                    particle.style.background = '#ffffffff';
                    particle.style.borderRadius = '50%';
                    particle.style.left = '50%';
                    particle.style.top = '50%';
                    particle.style.pointerEvents = 'none';
                    
                    const angle = (Math.PI * 2 * i) / 10;
                    const distance = 30;
                    const tx = Math.cos(angle) * distance;
                    const ty = Math.sin(angle) * distance;
                    
                    particle.animate([
                        { transform: 'translate(-50%, -50%)', opacity: 1 },
                        { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`, opacity: 0 }
                    ], {
                        duration: 1000,
                        easing: 'ease-out'
                    });
                    
                    container.appendChild(particle);
                    setTimeout(() => particle.remove(), 1000);
                }, 1200 + i * 30);
            }
        }

        // Trigger particle effect after logo assembles
        setTimeout(createParticles, 1200);

        // Parallax effect for orbs
        document.addEventListener('mousemove', (e) => {
            const orbs = document.querySelectorAll('.gradient-orb');
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 20;
                orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });






        const canvas = document.getElementById('hexCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let mouseX = width / 2;
let mouseY = height / 2;

const hexRadius = 40;
const hexHeight = Math.sqrt(3) * hexRadius;
const hexWidth = 2 * hexRadius;

let hexagons = [];

class Hexagon {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.baseAlpha = 0.05;
        this.targetAlpha = this.baseAlpha;
        this.currentAlpha = this.baseAlpha;
        this.glowIntensity = 0;
    }
    
    draw() {
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const distSq = dx * dx + dy * dy;
        
        const maxDistSq = 4000;
        const proximity = Math.max(0, 1 - distSq / maxDistSq);
        
        this.targetAlpha = this.baseAlpha + proximity * 0.4;
        this.glowIntensity = proximity;
        
        this.currentAlpha += (this.targetAlpha - this.currentAlpha) * 0.1;
        
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = this.x + this.radius * Math.cos(angle);
            const y = this.y + this.radius * Math.sin(angle);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        
        if (this.glowIntensity > 0.1) {
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.radius
            );
            gradient.addColorStop(0, `rgba(35, 35, 35, ${this.currentAlpha * 0.5})`);
gradient.addColorStop(1, `rgba(0, 0, 0, ${this.currentAlpha * 2})`);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
        
        ctx.strokeStyle = `rgba(94, 94, 94, ${this.currentAlpha})`;
        ctx.lineWidth = 1 + this.glowIntensity * 2;
        ctx.stroke();
        
        if (this.glowIntensity > 0.3) {
            ctx.shadowBlur = 20 * this.glowIntensity;
            ctx.shadowColor = ` ${this.glowIntensity})`;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    }
}

function createHexGrid() {
    hexagons = [];
    
    const horizontalSpacing = hexWidth * 0.75;
    const verticalSpacing = hexHeight;
    
    const cols = Math.ceil(width / horizontalSpacing) + 2;
    const rows = Math.ceil(height / verticalSpacing) + 2;
    
    for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
            const x = col * horizontalSpacing;
            const y = row * verticalSpacing + (col % 2 === 0 ? 0 : verticalSpacing / 2);
            
            hexagons.push(new Hexagon(x, y, hexRadius));
        }
    }
}

function animateHexBackground() {
    ctx.clearRect(0, 0, width, height);
    
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#0a0a0a');
    bgGradient.addColorStop(1, '#191819ff');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
    
    hexagons.forEach(hex => hex.draw());
    
    requestAnimationFrame(animateHexBackground);
}

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
}, { passive: true });

window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        createHexGrid();
    }, 150);
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    mouseX = e.touches[0].clientX;
    mouseY = e.touches[0].clientY;
}, { passive: true });

createHexGrid();
animateHexBackground();






     const projectsSection = document.getElementById('projectsSection');
        const projectItems = document.querySelectorAll('.project-item');
        
        // Define color stops as plain color pairs for interpolation
        const colorStops = [
            { from: '#f5f7fa', to: '#e2cbc3ff', textColor: '#333' },
            { from: '#ea6666ff', to: '#764ba2', textColor: 'white' },
            { from: '#000000', to: '#434343', textColor: 'white' },
            { from: '#FA8BFF', to: '#2BD2FF', textColor: '#1a1a1a' },
            { from: '#ffecd2', to: '#fcb69f', textColor: '#333' }
        ];

        // Helper: convert hex -> {r,g,b}
        function hexToRgb(hex) {
                    if (!hex || typeof hex !== 'string') return { r: 0, g: 0, b: 0 };
                    const h = hex.replace('#', '');
                    // Expand short notation (#abc -> #aabbcc)
                    let normalized = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
                    // If 8-char hex provided (RRGGBBAA), drop the alpha byte
                    if (normalized.length === 8) {
                        normalized = normalized.slice(0, 6);
                    }
                    // Fallback: ensure we have 6 chars
                    if (normalized.length !== 6) {
                        // try to pad or return black
                        const padded = (normalized + '000000').slice(0, 6);
                        normalized = padded;
                    }
                    const bigint = parseInt(normalized, 16);
                    if (Number.isNaN(bigint)) return { r: 0, g: 0, b: 0 };
                    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
        }

        // Helper: convert {r,g,b} -> hex
        function rgbToHex(r, g, b) {
            const toHex = (n) => ('0' + Math.round(n).toString(16)).slice(-2);
            return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
        }

        // Linear interpolation between two numbers
        function lerp(a, b, t) {
            return a + (b - a) * t;
        }

        // Interpolate between two hex colors by t [0..1]
        function interpHex(aHex, bHex, t) {
            const a = hexToRgb(aHex);
            const b = hexToRgb(bHex);
            return rgbToHex(lerp(a.r, b.r, t), lerp(a.g, b.g, t), lerp(a.b, b.b, t));
        }

        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        projectItems.forEach(item => observer.observe(item));

        let lastIndex = 0;

        // Store initial computed body background-color so we can restore it
        const _initialBodyBgColor = getComputedStyle(document.body).backgroundColor;

        // Smooth background color transition on scroll
        function updateBackgroundColor() {
            if (!projectsSection) return;
            const sectionRect = projectsSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // If section not in viewport, restore initial body backgroundColor and return
            if (sectionRect.top >= windowHeight || sectionRect.bottom <= 0) {
                if (document.body.style.backgroundColor !== _initialBodyBgColor) {
                    document.body.style.backgroundColor = _initialBodyBgColor;
                }
                return;
            }

            // Calculate scroll progress through the section (0 to 1)
            const sectionHeight = Math.max(1, sectionRect.height);
            const scrollProgress = Math.max(0, Math.min(1,
                (windowHeight - sectionRect.top) / (sectionHeight + windowHeight)
            ));

            // Compute continuous position across color stops for the section gradient
            const totalStops = Math.max(1, colorStops.length - 1);
            const position = scrollProgress * totalStops;
            const idx = Math.floor(position);
            const t = Math.min(1, Math.max(0, position - idx));

            const fromStop = colorStops[Math.min(idx, colorStops.length - 1)];
            const toStop = colorStops[Math.min(idx + 1, colorStops.length - 1)];

            // Interpolate colors for the section gradient
            const leftColor = interpHex(fromStop.from, toStop.from, t);
            const rightColor = interpHex(fromStop.to, toStop.to, t);
            projectsSection.style.background = `linear-gradient(135deg, ${leftColor} 0%, ${rightColor} 100%)`;

            // For page-level feeling (white -> dark) compute a single body color
            const startColor = colorStops[0].from;
            const endColor = colorStops[Math.min(2, colorStops.length - 1)].from;
            const bodyColor = interpHex(startColor, endColor, scrollProgress);
            document.body.style.backgroundColor = bodyColor;

            // Text color for the section: choose nearer stop's textColor
            projectsSection.style.color = t < 0.5 ? fromStop.textColor : toStop.textColor;
            lastIndex = position;
        }

        // Use requestAnimationFrame for smooth updates
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateBackgroundColor();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        // Also update on resize and initial load
        window.addEventListener('resize', () => updateBackgroundColor(), { passive: true });
        updateBackgroundColor();