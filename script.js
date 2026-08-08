/* ============================================================
   BACK TO TOP BUTTON
============================================================ */

const backToTop = document.createElement('button');
backToTop.id = 'backToTop';
backToTop.className = 'back-to-top';
backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTop.style.display = 'none';
document.body.appendChild(backToTop);

window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
        backToTop.style.display = 'flex';
    } else {
        backToTop.style.display = 'none';
    }
});

backToTop.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});


/* ============================================================
   HAMBURGER MENU
============================================================ */

const hamburger = document.getElementById("hamburger");
const nav = document.querySelector("nav");

if (hamburger && nav) {
    hamburger.addEventListener("click", function () {
        nav.classList.toggle("active");
        const icon = this.querySelector("i");
        if (icon) {
            icon.classList.toggle("fa-bars");
            icon.classList.toggle("fa-times");
        }
    });
}


/* ============================================================
   SMOOTH SCROLL
============================================================ */

document.querySelectorAll("nav a").forEach(function (link) {
    link.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        if (!targetId || !targetId.startsWith("#")) {
            return;
        }
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
        if (nav) {
            nav.classList.remove("active");
        }
        const icon = hamburger ? hamburger.querySelector("i") : null;
        if (icon) {
            icon.classList.add("fa-bars");
            icon.classList.remove("fa-times");
        }
    });
});


/* ============================================================
   ANIMATED PROGRESS BARS
============================================================ */

document.addEventListener("DOMContentLoaded", function () {
    const progressBars = document.querySelectorAll(".progress-fill");
    if (!progressBars.length) return;

    const animateProgress = function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            const bar = entry.target;
            const width = bar.style.width;
            bar.style.width = "0%";
            bar.style.transition = "none";
            setTimeout(function () {
                bar.style.transition = "width 2s cubic-bezier(0.4, 0, 0.2, 1)";
                bar.style.width = width;
            }, 200);
        });
    };

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(animateProgress, {
            threshold: 0.3
        });
        progressBars.forEach(function (bar) {
            observer.observe(bar);
        });
    } else {
        progressBars.forEach(function (bar) {
            bar.style.width = bar.style.width;
        });
    }
});


/* ============================================================
   TYPING EFFECT (Typed.js)
============================================================ */

const typedScript = document.createElement('script');
typedScript.src = 'https://cdn.jsdelivr.net/npm/typed.js@2.0.12';
typedScript.onload = function() {
    new Typed('.typed-text', {
        strings: [
            'Developer & Creative Thinker',
            'Web Developer',
            'AI Enthusiast',
            'Problem Solver'
        ],
        typeSpeed: 60,
        backSpeed: 40,
        backDelay: 1500,
        loop: true,
        cursorChar: '|'
    });
};
document.head.appendChild(typedScript);


/* ============================================================
   THEME TOGGLE (Dark/Light)
============================================================ */

const themeToggle = document.createElement('button');
themeToggle.id = 'themeToggle';
themeToggle.className = 'theme-toggle';
themeToggle.innerHTML = '🌙';
document.querySelector('header .hamburger').before(themeToggle);

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggle.innerHTML = '☀️';
}

themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    if (document.body.classList.contains('dark-theme')) {
        this.innerHTML = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        this.innerHTML = '🌙';
        localStorage.setItem('theme', 'light');
    }
});


/* ============================================================
   CONTACT FORM
============================================================ */

const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        alert("Thank you for your message! I'll get back to you soon.");
        this.reset();
    });
}


/* ============================================================
   SPLASH SCREEN
============================================================ */

const splash = document.createElement('div');
splash.id = 'splashScreen';
splash.innerHTML = `
    <div class="splash-content">
        <div class="splash-logo">
            <img src="./image/zenverix-logo-transparent.png" alt="Zenverix">
        </div>
        <div class="splash-loader">
            <div class="splash-bar"></div>
        </div>
        <p>Loading...</p>
    </div>
`;
document.body.prepend(splash);

setTimeout(function() {
    splash.classList.add('fade-out');
    setTimeout(function() {
        splash.style.display = 'none';
    }, 500);
}, 2000);


/* ============================================================
   🎵 MUSIC PLAYER
============================================================ */

const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
let isMusicPlaying = false;

const musicState = localStorage.getItem('musicState');
if (musicState === 'playing') {
    isMusicPlaying = true;
    bgMusic.play().catch(() => {});
    musicToggle.classList.add('playing');
    musicToggle.innerHTML = '<i class="fas fa-stop"></i>';
}

musicToggle.addEventListener('click', function() {
    if (isMusicPlaying) {
        bgMusic.pause();
        this.innerHTML = '<i class="fas fa-music"></i>';
        this.classList.remove('playing');
        isMusicPlaying = false;
        localStorage.setItem('musicState', 'paused');
    } else {
        bgMusic.play().catch(function(error) {
            console.log('Audio play failed:', error);
        });
        this.innerHTML = '<i class="fas fa-stop"></i>';
        this.classList.add('playing');
        isMusicPlaying = true;
        localStorage.setItem('musicState', 'playing');
    }
});

bgMusic.addEventListener('ended', function() {
    this.play().catch(() => {});
});


/* ============================================================
   📊 STATS COUNTER WITH ANIMATION (به‌روز شده)
============================================================ */

// تابع شمارش انیمیشنی
function animateCounter(element, target, duration = 2000) {
    if (!element) return;
    
    const start = 0;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // تابع easeOut برای حرکت نرم
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * target);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// دریافت المان‌ها
const visitCountEl = document.getElementById('visitCount');
const onlineCountEl = document.getElementById('onlineCount');
const visitTimeEl = document.getElementById('visitTime');

// ====== تعداد بازدید ======
let visitCount = localStorage.getItem('visitCount');
if (!visitCount) {
    visitCount = 0;
}
visitCount = parseInt(visitCount) + 1;
localStorage.setItem('visitCount', visitCount);

if (visitCountEl) {
    visitCountEl.textContent = '0';
    setTimeout(() => {
        animateCounter(visitCountEl, visitCount, 2000);
    }, 300);
}

// ====== تعداد آنلاین ======
if (onlineCountEl) {
    const onlineTarget = Math.floor(Math.random() * 50) + 10;
    onlineCountEl.textContent = '0';
    setTimeout(() => {
        animateCounter(onlineCountEl, onlineTarget, 1800);
    }, 600);
}

// ====== زمان حضور در سایت ======
let seconds = 0;
setInterval(function() {
    seconds++;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (visitTimeEl) {
        visitTimeEl.textContent = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    }
}, 1000);


/* ============================================================
   💬 COMMENTS SECTION
============================================================ */

let comments = JSON.parse(localStorage.getItem('comments')) || [];

function renderComments() {
    const commentsList = document.getElementById('commentsList');
    if (!commentsList) return;
    
    if (comments.length === 0) {
        commentsList.innerHTML = `
            <div class="comment-empty">
                <i class="fas fa-comment-dots" style="font-size: 40px; display: block; margin-bottom: 12px; color: var(--text-light);"></i>
                No comments yet. Be the first to comment!
            </div>
        `;
        return;
    }

    commentsList.innerHTML = comments.map(function(comment, index) {
        return `
            <div class="comment-item">
                <div class="comment-header">
                    <span class="comment-author">
                        <i class="fas fa-user" style="color: var(--primary); margin-right: 8px;"></i>
                        ${comment.name}
                    </span>
                    <span class="comment-time">${comment.time}</span>
                </div>
                <div class="comment-text">${comment.text}</div>
                <div class="comment-actions">
                    <button onclick="likeComment(${index})">
                        <i class="fas fa-heart"></i> ${comment.likes || 0}
                    </button>
                    <button onclick="deleteComment(${index})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

const commentForm = document.getElementById('commentForm');
if (commentForm) {
    commentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const nameInput = document.getElementById('commentName');
        const textInput = document.getElementById('commentText');
        
        const newComment = {
            name: nameInput.value.trim() || 'Anonymous',
            text: textInput.value.trim(),
            time: new Date().toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            likes: 0
        };
        
        if (newComment.text) {
            comments.unshift(newComment);
            localStorage.setItem('comments', JSON.stringify(comments));
            renderComments();
            this.reset();
        }
    });
}

window.likeComment = function(index) {
    comments[index].likes = (comments[index].likes || 0) + 1;
    localStorage.setItem('comments', JSON.stringify(comments));
    renderComments();
};

window.deleteComment = function(index) {
    if (confirm('Are you sure you want to delete this comment?')) {
        comments.splice(index, 1);
        localStorage.setItem('comments', JSON.stringify(comments));
        renderComments();
    }
};

renderComments();


/* ============================================================
   🔍 SEARCH FUNCTION
============================================================ */

const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');

if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', function() {
        performSearch();
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    if (!query) {
        alert('Please enter a search term!');
        return;
    }

    const sections = document.querySelectorAll('section');
    let found = false;

    sections.forEach(function(section) {
        const text = section.textContent.toLowerCase();
        if (text.includes(query)) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            section.style.transition = 'background 0.5s ease';
            section.style.background = 'rgba(37, 99, 235, 0.08)';
            setTimeout(function() {
                section.style.background = '';
            }, 3000);
            found = true;
            return;
        }
    });

    if (!found) {
        alert(`No results found for: "${query}"`);
    }

    document.getElementById('searchInput').value = '';
}


/* ============================================================
   🎯 SERVICE CARDS ANIMATION
============================================================ */

document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    if (serviceCards.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry, index) {
                if (entry.isIntersecting) {
                    setTimeout(function() {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 150);
                }
            });
        }, {
            threshold: 0.2
        });
        
        serviceCards.forEach(function(card) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }
});
/* ============================================================
   📌 FOOTER - AUTO COPYRIGHT YEAR
============================================================ */

const currentYearEl = document.getElementById('currentYear');
if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}


/* ============================================================
   📌 SCROLL PROGRESS BAR
============================================================ */

window.addEventListener('scroll', function() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    const progressBar = document.getElementById('scrollProgressBar');
    if (progressBar) {
        progressBar.style.width = scrollPercent + '%';
    }
});


/* ============================================================
   📌 FAQ TOGGLE (باز و بسته شدن سوالات)
============================================================ */

function toggleFaq(element) {
    const faqItem = element.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const icon = element.querySelector('.faq-icon');
    
    // بستن همه
    document.querySelectorAll('.faq-item').forEach(function(item) {
        if (item !== faqItem) {
            item.querySelector('.faq-answer').style.maxHeight = '0';
            item.querySelector('.faq-answer').style.opacity = '0';
            item.querySelector('.faq-icon').textContent = '+';
            item.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
        }
    });
    
    // باز/بستن جاری
    if (answer.style.maxHeight && answer.style.maxHeight !== '0px') {
        answer.style.maxHeight = '0';
        answer.style.opacity = '0';
        icon.textContent = '+';
        icon.style.transform = 'rotate(0deg)';
    } else {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.opacity = '1';
        icon.textContent = '−';
        icon.style.transform = 'rotate(180deg)';
    }
}


/* ============================================================
   📌 IN-PROGRESS CARDS ANIMATION
============================================================ */

document.addEventListener('DOMContentLoaded', function() {
    const inprogressCards = document.querySelectorAll('.inprogress-card');
    
    if (inprogressCards.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry, index) {
                if (entry.isIntersecting) {
                    setTimeout(function() {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 150);
                }
            });
        }, {
            threshold: 0.2
        });
        
        inprogressCards.forEach(function(card) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }
});


/* ============================================================
   📌 ACHIEVEMENTS CARDS ANIMATION
============================================================ */

document.addEventListener('DOMContentLoaded', function() {
    const achievementCards = document.querySelectorAll('.achievement-card');
    
    if (achievementCards.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry, index) {
                if (entry.isIntersecting) {
                    setTimeout(function() {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'scale(1)';
                    }, index * 150);
                }
            });
        }, {
            threshold: 0.2
        });
        
        achievementCards.forEach(function(card) {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }
});


/* ============================================================
   🎵 MUSIC PLAYER WITH PLAYLIST (فیکس شده)
============================================================ */

const playlist = [
    {
        title: 'Chill Lofi',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    {
        title: 'Relaxing Piano',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    },
    {
        title: 'Calm Beats',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    }
];

// آهنگ جایگزین (آهنگ دیگه)
const fallbackSongs = [
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
];

let currentTrackIndex = 0;
let isMusicPlaying = false;
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');

// اگه آهنگ اصلی کار نکرد، از آهنگ جایگزین استفاده کن
function tryPlayMusic() {
    bgMusic.src = playlist[currentTrackIndex].url;
    
    bgMusic.play().then(function() {
        isMusicPlaying = true;
        musicToggle.classList.add('playing');
        musicToggle.innerHTML = '<i class="fas fa-stop"></i>';
        localStorage.setItem('musicState', 'playing');
    }).catch(function(error) {
        console.log('Audio play failed:', error);
        // تلاش با آهنگ جایگزین
        bgMusic.src = fallbackSongs[currentTrackIndex];
        bgMusic.play().catch(function(e) {
            console.log('Fallback also failed:', e);
            // نمایش پیام به کاربر
            showTrackNotification('⚠️ Audio unavailable, click again');
        });
    });
}

// بررسی وضعیت موسیقی ذخیره شده
const musicState = localStorage.getItem('musicState');
if (musicState === 'playing') {
    setTimeout(function() {
        tryPlayMusic();
    }, 500);
}

// دکمه پلی/استاپ
musicToggle.addEventListener('click', function() {
    if (isMusicPlaying) {
        bgMusic.pause();
        this.innerHTML = '<i class="fas fa-music"></i>';
        this.classList.remove('playing');
        isMusicPlaying = false;
        localStorage.setItem('musicState', 'paused');
    } else {
        tryPlayMusic();
    }
});

bgMusic.addEventListener('ended', function() {
    if (isMusicPlaying) {
        // رفتن به آهنگ بعدی
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        tryPlayMusic();
    }
});

// دکمه‌های قبلی/بعدی
const prevBtn = document.createElement('button');
prevBtn.className = 'music-btn-small';
prevBtn.innerHTML = '<i class="fas fa-step-backward"></i>';

const nextBtn = document.createElement('button');
nextBtn.className = 'music-btn-small';
nextBtn.innerHTML = '<i class="fas fa-step-forward"></i>';

const musicPlayerEl = document.getElementById('musicPlayer');
musicPlayerEl.prepend(prevBtn);
musicPlayerEl.appendChild(nextBtn);

prevBtn.addEventListener('click', function() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    if (isMusicPlaying) {
        tryPlayMusic();
    } else {
        showTrackNotification(`🎵 ${playlist[currentTrackIndex].title}`);
    }
});

nextBtn.addEventListener('click', function() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    if (isMusicPlaying) {
        tryPlayMusic();
    } else {
        showTrackNotification(`🎵 ${playlist[currentTrackIndex].title}`);
    }
});

function showTrackNotification(title) {
    const notification = document.createElement('div');
    notification.className = 'track-notification';
    notification.textContent = `🎵 ${title}`;
    document.body.appendChild(notification);
    
    setTimeout(function() {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(function() {
        notification.classList.remove('show');
        setTimeout(function() {
            notification.remove();
        }, 500);
    }, 3000);
}
/* ============================================================
   📱 PWA - REGISTER SERVICE WORKER
============================================================ */

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registered successfully:', registration.scope);
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}