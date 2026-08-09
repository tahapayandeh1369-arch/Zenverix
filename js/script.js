/* ============================================================
   BACK TO TOP
============================================================ */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

/* ============================================================
   HAMBURGER MENU
============================================================ */
const hamburger = document.getElementById('hamburger');
const nav = document.querySelector('nav');

hamburger.addEventListener('click', function () {
    nav.classList.toggle('active');
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

/* ============================================================
   SMOOTH SCROLL
============================================================ */
document.querySelectorAll('nav a').forEach(function (link) {
    link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || !targetId.startsWith('#')) return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        nav.classList.remove('active');
        const icon = hamburger.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    });
});

/* ============================================================
   ANIMATED PROGRESS BARS
============================================================ */
document.addEventListener('DOMContentLoaded', function () {
    const progressBars = document.querySelectorAll('.progress-fill');

    const animateProgress = function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            const bar = entry.target;
            const width = bar.style.width;
            bar.style.width = '0%';
            bar.style.transition = 'none';
            setTimeout(function () {
                bar.style.transition = 'width 2s cubic-bezier(0.4, 0, 0.2, 1)';
                bar.style.width = width;
            }, 200);
        });
    };

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(animateProgress, { threshold: 0.3 });
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
   TYPING EFFECT
============================================================ */
document.addEventListener('DOMContentLoaded', function () {
    if (typeof Typed !== 'undefined') {
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
    }
});

/* ============================================================
   THEME TOGGLE
============================================================ */
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggle.innerHTML = '☀️';
}

themeToggle.addEventListener('click', function () {
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
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Thank you for your message! I\'ll get back to you soon.');
        this.reset();
    });
}

/* ============================================================
   SPLASH SCREEN
============================================================ */
const splash = document.getElementById('splashScreen');

setTimeout(function () {
    splash.classList.add('fade-out');
    setTimeout(function () {
        splash.style.display = 'none';
    }, 500);
}, 2000);

/* ============================================================
   🎵 MUSIC PLAYER WITH PERSIAN SONGS
============================================================ */
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
let isMusicPlaying = false;
let currentTrackIndex = 0;

// لیست آهنگ‌های جدید
const musicPlaylist = [
    {
        name: 'رضا پیشرو - شبشه',
        url: 'https://dl.musicdownload.ir/Music/Reza%20Pishro/Reza%20Pishro%20-%20Shabesheh%20(320).mp3'
    },
    {
        name: 'پیشرو - قبرستون',
        url: 'https://dl.musicdownload.ir/Music/Reza%20Pishro/Reza%20Pishro%20-%20Ghabrestoon%20(320).mp3'
    },
    {
        name: 'هیپ هاپ',
        url: 'https://dl.musicdownload.ir/Music/Hiphop/Hiphop%20-%20(320).mp3'
    },
    {
        name: 'رضا پیشرو - هیپ هاپ',
        url: 'https://dl.musicdownload.ir/Music/Reza%20Pishro/Reza%20Pishro%20-%20Hiphop%20(320).mp3'
    },
    {
        name: 'پیشرو - آرامش',
        url: 'https://dl.musicdownload.ir/Music/Reza%20Pishro/Reza%20Pishro%20-%20Aramesh%20(320).mp3'
    },
    {
        name: 'آهنگ دوم',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    }
];

// تابع برای پخش آهنگ بعدی
function playNextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % musicPlaylist.length;
    bgMusic.src = musicPlaylist[currentTrackIndex].url;
    bgMusic.play().catch(() => {});
}

// تنظیم آهنگ اولیه
bgMusic.src = musicPlaylist[0].url;

// بازیابی وضعیت موسیقی
const musicState = localStorage.getItem('musicState');
if (musicState === 'playing') {
    isMusicPlaying = true;
    bgMusic.play().catch(() => {});
    musicToggle.classList.add('playing');
    musicToggle.innerHTML = '<i class="fas fa-stop"></i>';
}

musicToggle.addEventListener('click', function () {
    if (isMusicPlaying) {
        bgMusic.pause();
        this.innerHTML = '<i class="fas fa-music"></i>';
        this.classList.remove('playing');
        isMusicPlaying = false;
        localStorage.setItem('musicState', 'paused');
    } else {
        bgMusic.play().catch(function (error) {
            console.log('Audio play failed:', error);
        });
        this.innerHTML = '<i class="fas fa-stop"></i>';
        this.classList.add('playing');
        isMusicPlaying = true;
        localStorage.setItem('musicState', 'playing');
    }
});

// وقتی آهنگ تمام شد، آهنگ بعدی پخش شود
bgMusic.addEventListener('ended', function () {
    playNextTrack();
});

// نمایش خطاهای پخش
bgMusic.addEventListener('error', function (e) {
    console.log('Error playing track, trying next...');
    playNextTrack();
});

/* ============================================================
   📊 STATS COUNTER
============================================================ */
function animateCounter(element, target, duration = 2000) {
    if (!element) return;
    const start = 0;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
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

const visitCountEl = document.getElementById('visitCount');
const onlineCountEl = document.getElementById('onlineCount');
const visitTimeEl = document.getElementById('visitTime');

let visitCount = localStorage.getItem('visitCount');
if (!visitCount) visitCount = 0;
visitCount = parseInt(visitCount) + 1;
localStorage.setItem('visitCount', visitCount);

if (visitCountEl) {
    visitCountEl.textContent = '0';
    setTimeout(() => animateCounter(visitCountEl, visitCount, 2000), 300);
}

if (onlineCountEl) {
    const onlineTarget = Math.floor(Math.random() * 50) + 10;
    onlineCountEl.textContent = '0';
    setTimeout(() => animateCounter(onlineCountEl, onlineTarget, 1800), 600);
}

let seconds = 0;
setInterval(function () {
    seconds++;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (visitTimeEl) {
        visitTimeEl.textContent = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    }
}, 1000);

/* ============================================================
   💬 COMMENTS
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

    commentsList.innerHTML = comments.map(function (comment, index) {
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
    commentForm.addEventListener('submit', function (e) {
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

window.likeComment = function (index) {
    comments[index].likes = (comments[index].likes || 0) + 1;
    localStorage.setItem('comments', JSON.stringify(comments));
    renderComments();
};

window.deleteComment = function (index) {
    if (confirm('Are you sure you want to delete this comment?')) {
        comments.splice(index, 1);
        localStorage.setItem('comments', JSON.stringify(comments));
        renderComments();
    }
};

renderComments();

/* ============================================================
   🔍 SEARCH
============================================================ */
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');

if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', function () {
        performSearch();
    });

    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
        alert('Please enter a search term!');
        return;
    }

    const sections = document.querySelectorAll('section');
    let found = false;

    sections.forEach(function (section) {
        const text = section.textContent.toLowerCase();
        if (text.includes(query)) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            section.style.transition = 'background 0.5s ease';
            section.style.background = 'rgba(37, 99, 235, 0.08)';
            setTimeout(function () {
                section.style.background = '';
            }, 3000);
            found = true;
            return;
        }
    });

    if (!found) {
        alert(`No results found for: "${query}"`);
    }

    searchInput.value = '';
}

/* ============================================================
   📌 FOOTER - COPYRIGHT YEAR
============================================================ */
const currentYearEl = document.getElementById('currentYear');
if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}

/* ============================================================
   📌 SCROLL PROGRESS BAR
============================================================ */
window.addEventListener('scroll', function () {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    const progressBar = document.getElementById('scrollProgressBar');
    if (progressBar) {
        progressBar.style.width = scrollPercent + '%';
    }
});

/* ============================================================
   🎯 CARDS ANIMATION
============================================================ */
document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.service-card, .achievement-card, .inprogress-card');

    if (cards.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry, index) {
                if (entry.isIntersecting) {
                    setTimeout(function () {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 150);
                }
            });
        }, { threshold: 0.2 });

        cards.forEach(function (card) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }
});

console.log('🚀 Zenverix Loaded Successfully!');
console.log('🌙 Dark Mode: Click the moon/sun icon to toggle');
console.log('🎵 Music Player: Click the music icon to play/pause');
console.log('🎵 Playlist includes: Reza Pishro songs!');
/* ============================================================
   FOOTER - UPDATE DATE & COMMIT
============================================================ */

// تاریخ بروزرسانی خودکار
const updateDate = document.getElementById('updateDate');
if (updateDate) {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    updateDate.textContent = days[now.getDay()] + ', ' + now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
}

// تولید هش کامیت تصادفی
const commitHash = document.getElementById('commitHash');
if (commitHash) {
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 7; i++) {
        hash += chars[Math.floor(Math.random() * 16)];
    }
    commitHash.textContent = hash;
}

// سال کپی‌رایت
const currentYear = document.getElementById('currentYear');
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}