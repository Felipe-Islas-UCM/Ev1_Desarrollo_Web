document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.cafe-cards');
    const cards = document.querySelectorAll('.cafe-card');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentIndex = 0;


    // Header scroll
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });


    // Función para obtener el número de tarjetas visibles según el ancho de la ventana
    function getVisibleCards() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1200) return 2;
        return 3;
    }

    // Función para obtener el máximo índice permitido
    function getMaxIndex() {
        return Math.max(0, cards.length - getVisibleCards());
    }

    function updateSlider() {
        const cardWidth = cards[0].offsetWidth;
        const gap = parseInt(getComputedStyle(slider).gap || '0');
        const offset = -currentIndex * (cardWidth + gap);
        
        slider.style.transform = `translateX(${offset}px)`;

        // Habilitar/deshabilitar botones
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
        
        const maxIndex = getMaxIndex();
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
        nextBtn.style.pointerEvents = currentIndex >= maxIndex ? 'none' : 'auto';
    }

    // Event Listeners
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    nextBtn.addEventListener('click', () => {
        const maxIndex = getMaxIndex();
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
        }
    });

    // Responsive handling
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentIndex < getMaxIndex()) {
                // Swipe izquierda
                currentIndex++;
                updateSlider();
            } else if (diff < 0 && currentIndex > 0) {
                // Swipe derecha
                currentIndex--;
                updateSlider();
            }
        }
    }

    // Actualizar slider cuando cambie el tamaño de la ventana
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            currentIndex = Math.min(currentIndex, getMaxIndex());
            updateSlider();
        }, 100);
    });

    // Configuración inicial
    updateSlider();
}); 