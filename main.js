// Countdown Logic
const eventDate = new Date('August 28, 2026 09:00:00').getTime();

const updateTimer = () => {
    const now = new Date().getTime();
    const distance = eventDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = days.toString().padStart(2, '0');
    document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');

    if (distance < 0) {
        clearInterval(timerInterval);
        document.getElementById('timer').innerHTML = "¡EL EVENTO HA COMENZADO!";
    }
};

const timerInterval = setInterval(updateTimer, 1000);
updateTimer();

// Scroll Animations (simple reveal + counters)
const observerOptions = {
    threshold: 0.1
};

const animateValue = (obj, start, end, duration, decimals = 0) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentVal = progress * (end - start) + start;
        
        let displayValue;
        if (decimals > 0) {
            displayValue = currentVal.toFixed(decimals).replace('.', ',');
        } else {
            displayValue = Math.floor(currentVal).toLocaleString('de-DE');
        }
        
        obj.innerHTML = displayValue;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
            
            // Check for counters inside the section
            const counters = entry.target.querySelectorAll('.counter');
            counters.forEach(counter => {
                if (!counter.classList.contains('animated')) {
                    const target = parseFloat(counter.getAttribute('data-target'));
                    const decimals = parseInt(counter.getAttribute('data-decimals')) || 0;
                    animateValue(counter, 0, target, 2000, decimals);
                    counter.classList.add('animated');
                }
            });
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.classList.add('reveal');
    observer.observe(section);
});

// FAQ Accordion
document.querySelectorAll('.faq-header').forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        const content = item.querySelector('.faq-content');
        const icon = header.querySelector('.faq-icon');
        const isActive = item.classList.contains('active');

        // Close all other open FAQs (optional, but good UX)
        document.querySelectorAll('.faq-item.active').forEach(openItem => {
            if (openItem !== item) {
                openItem.classList.remove('active');
                openItem.querySelector('.faq-content').style.maxHeight = '0';
                openItem.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
                openItem.querySelector('.faq-header').style.color = 'white';
            }
        });

        // Toggle current FAQ
        if (isActive) {
            item.classList.remove('active');
            content.style.maxHeight = '0';
            icon.style.transform = 'rotate(0deg)';
            header.style.color = 'white';
        } else {
            item.classList.add('active');
            content.style.maxHeight = content.scrollHeight + 'px';
            icon.style.transform = 'rotate(180deg)';
            header.style.color = 'var(--color-orange)';
        }
    });
});

