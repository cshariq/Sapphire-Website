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
    // --- Common Elements & Initializations ---
    const header = document.getElementById('main-header');
    const themeRadios = document.querySelectorAll('.switch-radio');
    const darkGradient = document.getElementById('dark-mode-gradient');
    const sapphireIcon = document.getElementById('sapphire-icon');
    const footerLogo = document.getElementById('footer-logo');
    const cursor = document.getElementById('custom-cursor');
    const dotContainer = document.getElementById('dot-container');

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let smoothed = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const smoothingFactor = 0.1;
    const CURSOR_TOGGLE_THRESHOLD = 5;
    let backgroundClickCount = 0;
    let backgroundClickTimer = null;
    let isCursorActive = localStorage.getItem('sapphire-custom-cursor') === 'true';

    // --- Common Functions ---
    function applyTheme(theme) {
        document.documentElement.className = `theme-${theme}`;
        localStorage.setItem('sapphire-theme', theme);
        darkGradient.style.opacity = theme === 'dark' ? '1' : '0';
        const newIconSrc = theme === 'light' ? './group-29.png' : './group-27.png';
        if (sapphireIcon) sapphireIcon.src = newIconSrc;
        if (footerLogo) footerLogo.src = newIconSrc;
    }

    // --- Apply Common Functionality ---
    const savedTheme = localStorage.getItem('sapphire-theme') || 'dark';
    document.querySelector(`.switch-radio[value="${savedTheme}"]`).checked = true;
    applyTheme(savedTheme);
    
    themeRadios.forEach(radio => radio.addEventListener('change', e => applyTheme(e.target.value)));
    
    const footerYearElement = document.querySelector('footer .text-sm');
    if (footerYearElement) {
        footerYearElement.innerHTML = `© ${new Date().getFullYear()} Shariq Charolia. All rights reserved.`;
    }

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        if (isCursorActive) cursor.style.opacity = '1';
    });
    
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('a, button, details, .bento-card, #theme-switcher')) return;

        backgroundClickCount++;
        clearTimeout(backgroundClickTimer);

        if (backgroundClickCount >= CURSOR_TOGGLE_THRESHOLD) {
            isCursorActive = !isCursorActive;
            document.body.classList.toggle('custom-cursor-active', isCursorActive);
            cursor.style.opacity = isCursorActive ? '1' : '0';
            localStorage.setItem('sapphire-custom-cursor', isCursorActive);
            backgroundClickCount = 0;
        } else {
            backgroundClickTimer = setTimeout(() => { backgroundClickCount = 0; }, 400); 
        }
    });

    if (isCursorActive) {
        document.body.classList.add('custom-cursor-active');
        cursor.style.opacity = '1';
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    }, { passive: true });

    const lenis = new Lenis();

    function globalAnimate(time) {
        lenis.raf(time);
        smoothed.x += (mouse.x - smoothed.x) * smoothingFactor;
        smoothed.y += (mouse.y - smoothed.y) * smoothingFactor;
        
        if (isCursorActive) {
            cursor.style.transform = `translate(${smoothed.x}px, ${smoothed.y}px)`;
        }

        const panX = (smoothed.x - window.innerWidth / 2) * 0.02;
        const panY = (smoothed.y - window.innerHeight / 2) * 0.02;
        dotContainer.style.transform = `translate(${panX}px, ${panY}px)`;
        
        const rect = dotContainer.getBoundingClientRect();
        const x = mouse.x - rect.left;
        const y = mouse.y - rect.top;
        document.documentElement.style.setProperty('--mouse-x', `${x}px`);
        document.documentElement.style.setProperty('--mouse-y', `${y}px`);

        requestAnimationFrame(globalAnimate);
    }

    requestAnimationFrame(globalAnimate);

    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            document.body.classList.toggle('dots-hidden', entry.isIntersecting);
        });
    }, { threshold: 0.1 });

    const mainFooter = document.querySelector('.main-footer');
    if (mainFooter) footerObserver.observe(mainFooter);

    // --- Page-Specific Logic ---
    const isHomepage = document.getElementById('hero-section');
    const isIssuesPage = document.getElementById('issues-list');
    const isChangelogPage = document.getElementById('changelog-container');

    if (isHomepage) {
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
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        document.querySelectorAll('.scroll-animate').forEach((el, index) => {
            el.style.transitionDelay = `${index * 75}ms`;
            scrollObserver.observe(el);
        });

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

        const scrubWrapper = document.getElementById('video-scrub-wrapper');
        const video = document.getElementById('scrub-video');
        const videoBuffer = document.getElementById('scrub-video-buffer');
        const featureTextContainer = document.getElementById('feature-text-container');
        
        let activeVideo = video;
        let bufferVideo = videoBuffer;

        let currentFeatureIndex = -1;
        let videoIsVisible = false;
        let currentLoop = null;
        let isFading = false;
        const FADE_DURATION = 0.4;

        const scrubFeaturesData = [
            { title: "Dynamic Music Controls", description: "See what's playing, get live lyrics, and manage your queue, all from the notch.", startTime: 4.5, endTime: 23.0 },
            { title: "Integrated Weather", description: "Stay updated with real-time weather conditions and hourly forecasts for your location.", startTime: 31.5, endTime: 35.5 },
            { title: "Seamless Calendar", description: "Effortlessly check your daily schedule and upcoming events at a glance.", startTime: 37.5, endTime: 40.0 },
            { title: "Quick File Access", description: "Instantly access recent downloads and important files right from the notch.", startTime: 41.5, endTime: 44.5 },
            { title: "Powerful Timers", description: "Run multiple timers and stopwatches simultaneously, perfect for productivity.", startTime: 48.5, endTime: 108.0 },
            { title: "Battery Insights", description: "Monitor your battery status, charging time, and health to stay powered up.", startTime: 117.5, endTime: 121.5 }
        ];
        
        scrubWrapper.style.height = `${scrubFeaturesData.length * 120}vh`;

        scrubFeaturesData.forEach(feature => {
            const textEl = document.createElement('div');
            textEl.className = 'feature-text-item';
            textEl.innerHTML = `<h3>${feature.title}</h3><p>${feature.description}</p>`;
            featureTextContainer.appendChild(textEl);
        });

        const featureTextItems = document.querySelectorAll('.feature-text-item');
        const startColor = [0, 0, 0]; 
        const endColor = [49, 46, 129]; 
        const lerp = (start, end, t) => start * (1 - t) + end * t;

        function handleCrossfadeLoop() {
            if (!videoIsVisible || !currentLoop || isFading) return;
            const timeUntilEnd = currentLoop.end - activeVideo.currentTime;
            if (timeUntilEnd <= FADE_DURATION) {
                isFading = true;
                bufferVideo.currentTime = currentLoop.start;
                bufferVideo.play();
                activeVideo.style.opacity = '0';
                bufferVideo.style.opacity = '1';
                setTimeout(() => {
                    let temp = activeVideo;
                    activeVideo = bufferVideo;
                    bufferVideo = temp;
                    isFading = false;
                }, FADE_DURATION * 1000);
            }
        }
        
        function homepageVideoInit() {
            scrubWrapper.style.display = 'block';
            lenis.on('scroll', () => {
                handleCrossfadeLoop();
                const rect = scrubWrapper.getBoundingClientRect();
                const scrollableHeight = rect.height - window.innerHeight;
                videoIsVisible = rect.top <= 0 && rect.bottom >= window.innerHeight;
                
                if (videoIsVisible) {
                    document.body.style.transition = 'none';
                    [video, videoBuffer].forEach(v => v.classList.add('is-video-active'));
                    const progress = Math.max(0, Math.min(1, -rect.top / scrollableHeight));
                    const featureIndex = Math.min(Math.floor(progress * scrubFeaturesData.length), scrubFeaturesData.length - 1);
                    
                    if (featureIndex !== currentFeatureIndex) {
                        if (currentFeatureIndex !== -1) featureTextItems[currentFeatureIndex].classList.remove('is-active-feature');
                        featureTextItems[featureIndex].classList.add('is-active-feature');
                        currentFeatureIndex = featureIndex;
                        const activeFeature = scrubFeaturesData[currentFeatureIndex];
                        currentLoop = { start: activeFeature.startTime, end: activeFeature.endTime };
                        activeVideo.currentTime = currentLoop.start;
                        activeVideo.style.opacity = 1;
                        bufferVideo.style.opacity = 0;
                        activeVideo.play();
                    }
                    const r = Math.round(lerp(startColor[0], endColor[0], progress));
                    const g = Math.round(lerp(startColor[1], endColor[1], progress));
                    const b = Math.round(lerp(startColor[2], endColor[2], progress));
                    document.body.style.background = `rgb(${r}, ${g}, ${b})`;
                } else {
                    document.body.style.removeProperty('background');
                    document.body.style.removeProperty('transition');
                    [video, videoBuffer].forEach(v => {
                        v.classList.remove('is-video-active');
                        v.pause();
                    });
                    if(currentFeatureIndex !== -1) {
                        featureTextItems[currentFeatureIndex].classList.remove('is-active-feature');
                        currentFeatureIndex = -1;
                        currentLoop = null;
                    }
                }
            });
        }

        let loadedVideos = 0;
        [video, videoBuffer].forEach(v => {
            v.addEventListener('canplay', () => {
                loadedVideos++;
                if (loadedVideos === 2) {
                    homepageVideoInit();
                }
            });
        });
    } else if (isIssuesPage) {
        const issuesList = document.getElementById('issues-list');
        const issueForm = document.getElementById('issue-form');
        const feedbackDiv = document.getElementById('form-feedback');
        const submitBtn = document.getElementById('submit-issue-btn');
        const openModalBtn = document.getElementById('open-issue-modal-btn');
        const closeModalBtn = document.getElementById('close-issue-modal-btn');
        const modalOverlay = document.getElementById('issue-modal-overlay');
        const modalContent = document.getElementById('issue-modal-content');

        const REPO_URL = 'https://api.github.com/repos/cshariq/Sapphire';

        async function fetchIssues() {
            try {
                const response = await fetch(`${REPO_URL}/issues?state=open`);
                if (!response.ok) throw new Error('Network response was not ok');
                const issues = await response.json();
                issuesList.innerHTML = ''; 
                if (issues.length === 0) {
                    issuesList.innerHTML = '<p class="text-center text-text-secondary">No open issues found. Everything looks great!</p>';
                    return;
                }
                issues.forEach(issue => {
                    const issueCard = document.createElement('a');
                    issueCard.href = issue.html_url;
                    issueCard.target = '_blank';
                    issueCard.rel = 'noopener noreferrer';
                    issueCard.className = 'issue-card block';
                    
                    const labels = issue.labels.map(label => 
                        `<span class="label-badge" style="background-color: #${label.color}40; color: #${label.color};">${label.name}</span>`
                    ).join('');

                    issueCard.innerHTML = `
                        <div class="flex justify-between items-center">
                            <h3 class="issue-title">${issue.title}</h3>
                            <span class="text-sm text-text-secondary">#${issue.number}</span>
                        </div>
                        <div class="flex gap-2 mt-2 flex-wrap">${labels}</div>
                    `;
                    issuesList.appendChild(issueCard);
                });
            } catch (error) {
                issuesList.innerHTML = '<p class="text-center text-red-400">Failed to load issues from GitHub. Please try again later.</p>';
            }
        }
        
        async function fetchRepoStats() {
            try {
                const response = await fetch(REPO_URL);
                if (!response.ok) throw new Error('Network response was not ok');
                const repo = await response.json();
                
                [document.getElementById('stats-stars'), document.getElementById('stats-stars-mobile')].forEach(el => el.textContent = repo.stargazers_count);
                [document.getElementById('stats-forks'), document.getElementById('stats-forks-mobile')].forEach(el => el.textContent = repo.forks_count);
                [document.getElementById('stats-issues'), document.getElementById('stats-issues-mobile')].forEach(el => el.textContent = repo.open_issues_count);

                const releaseResponse = await fetch(`${REPO_URL}/releases/latest`);
                if (!releaseResponse.ok) throw new Error('Could not fetch latest release');
                const latestRelease = await releaseResponse.json();
                
                [document.getElementById('stats-latest-release'), document.getElementById('stats-latest-release-mobile')].forEach(el => {
                    el.textContent = latestRelease.tag_name;
                    el.href = latestRelease.html_url;
                });

            } catch (error) {
                console.error("Failed to fetch repo stats:", error);
                ['stats-stars', 'stats-forks', 'stats-issues', 'stats-latest-release', 'stats-stars-mobile', 'stats-forks-mobile', 'stats-issues-mobile', 'stats-latest-release-mobile'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.textContent = 'N/A';
                });
            }
        }

        issueForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            feedbackDiv.textContent = '';

            const title = document.getElementById('issue-title').value;
            const body = document.getElementById('issue-body').value;
            const SERVERLESS_ENDPOINT = 'YOUR_SERVERLESS_FUNCTION_URL'; // IMPORTANT: Replace this

            try {
                const response = await fetch(SERVERLESS_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, body }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to submit issue.');
                }

                feedbackDiv.textContent = 'Successfully submitted issue! Thank you for your feedback.';
                feedbackDiv.style.color = 'var(--color-accent-solid)';
                setTimeout(() => {
                    closeModal();
                    issueForm.reset();
                    fetchIssues();
                    fetchRepoStats();
                }, 2000);
            } catch (error) {
                feedbackDiv.textContent = `Error: This is a demo. To enable this feature, set up a serverless function proxy.`;
                feedbackDiv.style.color = '#f87171';
            } finally {
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Submit Issue';
                }, 2000);
            }
        });

        function openModal() {
            modalOverlay.classList.remove('pointer-events-none');
            modalOverlay.style.opacity = '1';
            modalContent.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modalOverlay.style.opacity = '0';
            modalContent.style.opacity = '0';
            modalContent.style.transform = 'scale(0.95)';
            setTimeout(() => {
                modalOverlay.classList.add('pointer-events-none');
                document.body.style.overflow = '';
            }, 300);
        }

        openModalBtn.addEventListener('click', openModal);
        closeModalBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        fetchIssues();
        fetchRepoStats();

    } else if (isChangelogPage) {
        async function fetchReleases() {
            const latestReleaseContainer = document.getElementById('latest-release');
            const previousReleasesContainer = document.querySelector('#previous-releases .space-y-6');
            try {
                const response = await fetch('https://api.github.com/repos/cshariq/Sapphire/releases');
                if (!response.ok) throw new Error('Network response was not ok');
                const releases = await response.json();
                
                if (releases.length === 0) {
                    latestReleaseContainer.innerHTML = '<p class="text-center text-text-secondary">No releases found.</p>';
                    document.getElementById('previous-releases').style.display = 'none';
                    return;
                }

                const formatBytes = (bytes, decimals = 2) => {
                    if (bytes === 0) return '0 Bytes';
                    const k = 1024;
                    const dm = decimals < 0 ? 0 : decimals;
                    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                    const i = Math.floor(Math.log(bytes) / Math.log(k));
                    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
                }

                const renderRelease = (release) => {
                    const releaseDate = new Date(release.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                    const assets = release.assets.map(asset => `
                        <a href="${asset.browser_download_url}" class="asset-link">
                            <span class="material-symbols-outlined">download</span>
                            <span>${asset.name}</span>
                            <span class="text-text-secondary text-xs">(${formatBytes(asset.size)})</span>
                        </a>`).join('');

                    return `
                        <div class="release-item">
                            <div class="flex justify-between items-center">
                                <h2 class="text-3xl font-bold text-text-primary">${release.name || release.tag_name}</h2>
                                <span class="text-sm text-text-secondary">${releaseDate}</span>
                            </div>
                            <div class="release-body">${marked.parse(release.body)}</div>
                            <div class="flex gap-4 mt-6 flex-wrap">${assets}</div>
                        </div>`;
                };

                latestReleaseContainer.innerHTML = renderRelease(releases[0]);
                previousReleasesContainer.innerHTML = releases.slice(1).map(renderRelease).join('');
                if (releases.length <= 1) {
                    document.getElementById('previous-releases').style.display = 'none';
                }

            } catch (error) {
                latestReleaseContainer.innerHTML = '<p class="text-center text-red-400">Failed to load releases from GitHub. Please try again later.</p>';
                document.getElementById('previous-releases').style.display = 'none';
            }
        }
        fetchReleases();
    }
});