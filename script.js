tailwind.config = {
    theme: {
        extend: {
            colors: {
                'background': 'var(--color-background)',
                'text-primary': 'var(--color-text-primary)',
                'text-secondary': 'var(--color-text-secondary)',
                'secondary': 'var(--color-secondary)',
                'secondary-hover': 'var(--color-secondary-hover)',
                'border-color': 'var(--color-border-color)',
                'accent': 'var(--color-accent-solid)',
                'card': 'var(--color-card-bg)',
                'card-hover': 'var(--color-card-bg-hover)',
                'accent-gradient-text': 'var(--color-accent-gradient-text)',
            },
            backgroundImage: {
                'accent-gradient': 'var(--accent-gradient)',
            },
            transitionTimingFunction: {
                'sleek': 'ease-in-out',
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const featuresData = [
        { icon: '<span class="material-symbols-outlined text-3xl">share</span>', title: 'Nearby Share', description: 'Share files, pictures, videos, and websites from your Android device directly to your Mac.', span: 'card-col-span-2' },
        { icon: '<span class="material-symbols-outlined text-3xl">music_note</span>', title: 'Now Playing', description: 'Displays currently playing media in the notch.', span: '' },
        { icon: '<span class="material-symbols-outlined text-3xl">visibility</span>', title: 'Eye Break Reminders', description: 'A reminder to step out and touch some grass.', span: '' },
        { icon: '<span class="material-symbols-outlined text-3xl">cloud</span>', title: 'Persistent Weather', description: "Keep an eye on your local weather conditions.", span: '' },
        { icon: '<span class="material-symbols-outlined text-3xl">auto_awesome</span>', title: 'Gemini Live', description: 'Share your screen and discuss topics with Gemini.', span: '' },
        { icon: '<span class="material-symbols-outlined text-3xl">calendar_month</span>', title: 'Calendar Integration', description: 'See upcoming events at a glance.', span: 'card-col-span-2' }
    ];

    const upcomingFeaturesData = [
        { title: 'Custom HUD', description: 'Volume & brightness HUD.' },
        { title: 'Notifications in Notch', description: 'Requires Apple Developer Program.' },
        { title: 'Battery Management', description: 'Requires helper tool installation.' },
        { title: 'New App Icon', description: 'A modern new icon.' }
    ];

    const bentoContainer = document.getElementById('bento-grid-container');
    featuresData.forEach(feature => {
        const card = document.createElement('div');
        card.className = `bento-card scroll-animate ${feature.span}`;
        card.innerHTML = `<div class="flex items-center justify-center h-12 w-12 rounded-lg bg-[var(--color-accent-solid)]/20 text-[var(--color-accent-solid)] mb-4">${feature.icon}</div><h3 class="text-xl font-bold text-text-primary mb-2">${feature.title}</h3><p class="text-text-secondary">${feature.description}</p>`;
        bentoContainer.appendChild(card);
    });

    upcomingFeaturesData.forEach(feature => {
        const card = document.createElement('div');
        card.className = 'bento-card scroll-animate';
        card.innerHTML = `<div class="absolute top-3 right-3 text-xs bg-secondary text-text-secondary font-semibold py-1 px-2 rounded-full">Soon</div><h3 class="text-lg font-bold text-text-primary">${feature.title}</h3><p class="text-text-secondary mt-1 text-sm">${feature.description}</p>`;
        bentoContainer.appendChild(card);
    });

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.scroll-animate').forEach((el, index) => {
        el.style.transitionDelay = `${index * 75}ms`;
        scrollObserver.observe(el);
    });

    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    const themeRadios = document.querySelectorAll('.switch-radio');
    const darkGradient = document.getElementById('dark-mode-gradient');
    const sapphireIcon = document.getElementById('sapphire-icon');

    function applyTheme(theme) {
        document.documentElement.className = `theme-${theme}`;
        localStorage.setItem('sapphire-theme', theme);
        darkGradient.style.opacity = theme === 'dark' ? '1' : '0';
        sapphireIcon.src = theme === 'light' ? './group-29.png' : './group-27.png';
    }

    themeRadios.forEach(radio => radio.addEventListener('change', e => applyTheme(e.target.value)));

    const savedTheme = localStorage.getItem('sapphire-theme') || 'dark';
    document.querySelector(`.switch-radio[value="${savedTheme}"]`).checked = true;
    applyTheme(savedTheme);

    document.querySelector('footer .text-sm').innerHTML = `© ${new Date().getFullYear()} Shariq Charolia. All rights reserved.`;

    const switcherContainer = document.getElementById('theme-switcher');
    switcherContainer.addEventListener('mouseenter', () => cursor.classList.add('hidden-by-switcher'));
    switcherContainer.addEventListener('mouseleave', () => cursor.classList.remove('hidden-by-switcher'));

    const interactiveButtons = document.querySelectorAll('.interactive-glow-button');
    interactiveButtons.forEach(el => {
        el.addEventListener('mousemove', e => {
            const rect = el.getBoundingClientRect();
            el.style.setProperty('--x', `${e.clientX - rect.left}px`);
            el.style.setProperty('--y', `${e.clientY - rect.top}px`);
        });
    });

    const bentoCards = document.querySelectorAll('.bento-card');
    bentoCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);

            const maxTilt = 2;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -maxTilt;
            const rotateY = ((x - centerX) / centerX) * maxTilt;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
            card.style.transition = 'transform 0.1s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    const demoContainer = document.querySelector('.demo-container-shadow');
    demoContainer.addEventListener('mouseenter', () => cursor.classList.add('cursor-on-demo'));
    demoContainer.addEventListener('mouseleave', () => cursor.classList.remove('cursor-on-demo'));

    const lenis = new Lenis();
    const cursor = document.getElementById('custom-cursor');
    const dotContainer = document.getElementById('dot-container');
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let smoothed = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const smoothingFactor = 0.1;

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        cursor.style.opacity = '1';
    });

    function animate(time) {
        lenis.raf(time);

        smoothed.x += (mouse.x - smoothed.x) * smoothingFactor;
        smoothed.y += (mouse.y - smoothed.y) * smoothingFactor;

        cursor.style.transform = `translate(${smoothed.x}px, ${smoothed.y}px)`;

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const panX = (smoothed.x - centerX) * 0.02;
        const panY = (smoothed.y - centerY) * 0.02;
        dotContainer.style.transform = `translate(${panX}px, ${panY}px)`;

        const rect = dotContainer.getBoundingClientRect();
        const x = smoothed.x - rect.left;
        const y = smoothed.y - rect.top;
        document.documentElement.style.setProperty('--mouse-x', `${x}px`);
        document.documentElement.style.setProperty('--mouse-y', `${y}px`);

        requestAnimationFrame(animate);
    }
    animate();

    document.getElementById('scroll-down-btn').addEventListener('click', (e) => {
        e.preventDefault();
        lenis.scrollTo('#features-unified');
    });

    const animatedElements = [
        { el: document.getElementById('main-header'), delay: 100 },
        { el: document.getElementById('hero-h1'), delay: 200 },
        { el: document.getElementById('hero-p'), delay: 300 },
        { el: document.getElementById('hero-buttons'), delay: 400 },
        { el: document.getElementById('hero-video'), delay: 500 },
        { el: document.getElementById('scroll-down-btn'), delay: 600 }
    ];

    setTimeout(() => {
        animatedElements.forEach(item => {
            if (item.el) {
                item.el.style.transitionDelay = `${item.delay}ms`;
                item.el.classList.add('is-loaded');
            }
        });
    }, 100);
});
