// ============================================================
// 📝 BLOG SYSTEM - Full Version
// ============================================================

// ========== متغیرها ==========
let blogPosts = [];
let currentFilter = 'all';
let searchQuery = '';

// ========== دریافت مطالب ==========
async function getBlogPosts() {
    try {
        const response = await fetch(`${CONFIG.BASE_URL}${CONFIG.BIN_ID}/latest`, {
            headers: { 'X-Master-Key': CONFIG.API_KEY }
        });
        if (!response.ok) throw new Error('خطا در دریافت مطالب');
        const data = await response.json();
        blogPosts = data.record.blog || [];
        localStorage.setItem('blog_backup', JSON.stringify(blogPosts));
        return blogPosts;
    } catch (error) {
        console.error('Error fetching blog:', error);
        blogPosts = JSON.parse(localStorage.getItem('blog_backup') || '[]');
        return blogPosts;
    }
}

// ========== ذخیره مطالب ==========
async function saveBlogPosts(posts) {
    try {
        // ابتدا داده‌های فعلی رو بگیر
        const response = await fetch(`${CONFIG.BASE_URL}${CONFIG.BIN_ID}/latest`, {
            headers: { 'X-Master-Key': CONFIG.API_KEY }
        });
        const data = await response.json();
        const currentData = data.record;
        
        // به‌روزرسانی بخش blog
        currentData.blog = posts;
        
        // ذخیره در سرور
        const updateResponse = await fetch(`${CONFIG.BASE_URL}${CONFIG.BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': CONFIG.API_KEY
            },
            body: JSON.stringify(currentData)
        });
        
        if (!updateResponse.ok) throw new Error('خطا در ذخیره');
        localStorage.setItem('blog_backup', JSON.stringify(posts));
        return true;
    } catch (error) {
        console.error('Error saving blog:', error);
        localStorage.setItem('blog_backup', JSON.stringify(posts));
        return false;
    }
}

// ========== رندر مطالب ==========
async function renderBlog() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;

    await getBlogPosts();
    
    // فیلتر کردن
    let filtered = blogPosts;
    
    if (currentFilter !== 'all') {
        filtered = filtered.filter(p => 
            p.category && p.category.toLowerCase() === currentFilter.toLowerCase()
        );
    }
    
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(p => 
            p.title.toLowerCase().includes(q) ||
            p.content.toLowerCase().includes(q) ||
            (p.tags && p.tags.toLowerCase().includes(q))
        );
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="empty-blog">
                <i class="fas fa-inbox"></i>
                <h3>No posts found</h3>
                <p>${searchQuery ? `No results for "${searchQuery}"` : 'Check back soon for new content!'}</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(post => `
        <div class="blog-card" onclick="showPost('${post.id}')">
            <div class="card-image" style="background: ${getCategoryColor(post.category)};">
                <span>${getCategoryIcon(post.category)}</span>
                <span class="category-badge">${escapeHTML(post.category || 'General')}</span>
            </div>
            <div class="card-body">
                <h3>${escapeHTML(post.title)}</h3>
                <p class="excerpt">${escapeHTML(post.excerpt || post.content.substring(0, 120) + '...')}</p>
            </div>
            <div class="card-footer">
                <div class="tags">
                    ${post.tags ? post.tags.split(',').slice(0, 3).map(t => 
                        `<span>#${escapeHTML(t.trim())}</span>`
                    ).join('') : ''}
                    ${post.tags && post.tags.split(',').length > 3 ? `<span>+${post.tags.split(',').length - 3}</span>` : ''}
                </div>
                <div class="meta">
                    <span><i class="far fa-calendar"></i> ${post.date || 'Unknown'}</span>
                    <span><i class="far fa-clock"></i> ${post.readTime || 3}m</span>
                </div>
            </div>
        </div>
    `).join('');
}

// ========== نمایش مطلب کامل ==========
window.showPost = function(postId) {
    const post = blogPosts.find(p => p.id === postId);
    if (!post) return;

    // ساخت پاپ‌آپ برای نمایش مطلب
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        backdrop-filter: blur(10px);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="
            background: var(--bg-white);
            border-radius: 20px;
            max-width: 800px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            padding: 40px;
            position: relative;
            box-shadow: 0 30px 80px rgba(0,0,0,0.4);
        ">
            <button onclick="this.closest('div[style]').remove()" style="
                position: sticky;
                top: 0;
                float: right;
                background: var(--bg-light);
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                font-size: 1.2rem;
                cursor: pointer;
                color: var(--text-dark);
                transition: all 0.3s;
                z-index: 10;
            ">
                <i class="fas fa-times"></i>
            </button>
            
            <div style="margin-bottom: 20px;">
                <span style="
                    background: ${getCategoryColor(post.category)};
                    color: white;
                    padding: 4px 16px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                ">${escapeHTML(post.category || 'General')}</span>
            </div>
            
            <h2 style="color: var(--text-dark); font-size: 2rem; margin-bottom: 15px;">${escapeHTML(post.title)}</h2>
            
            <div style="display: flex; flex-wrap: wrap; gap: 15px; color: var(--text-light); font-size: 14px; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid var(--border-color);">
                <span><i class="far fa-calendar"></i> ${post.date || 'Unknown'}</span>
                <span><i class="far fa-clock"></i> ${post.readTime || 3} min read</span>
                ${post.tags ? post.tags.split(',').map(t => 
                    `<span style="background:var(--bg-light);padding:2px 12px;border-radius:12px;">#${escapeHTML(t.trim())}</span>`
                ).join('') : ''}
            </div>
            
            <div style="color: var(--text-gray); line-height: 1.9; font-size: 1.05rem;">
                ${post.content.replace(/\n/g, '<br>')}
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid var(--border-color);">
                <button onclick="this.closest('div[style]').remove()" style="
                    background: var(--gradient-primary);
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 600;
                ">
                    <i class="fas fa-arrow-left"></i> Close
                </button>
            </div>
        </div>
    `;
    
    // کلیک روی پس‌زمینه برای بستن
    modal.addEventListener('click', function(e) {
        if (e.target === this) this.remove();
    });
    
    document.body.appendChild(modal);
};

// ========== انتشار مطلب جدید ==========
document.getElementById('publishPost')?.addEventListener('click', async function() {
    const title = document.getElementById('postTitle').value.trim();
    const category = document.getElementById('postCategory').value.trim();
    const tags = document.getElementById('postTags').value.trim();
    const readTime = document.getElementById('postReadTime').value || 5;
    const content = document.getElementById('postContent').value.trim();

    if (!title || !content) {
        showNotification('⚠️ Please enter title and content!', 'error');
        return;
    }

    const newPost = {
        id: 'post_' + Date.now(),
        title: title,
        category: category || 'General',
        tags: tags || '',
        readTime: parseInt(readTime) || 5,
        content: content,
        excerpt: content.replace(/\n/g, ' ').substring(0, 150) + '...',
        date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        timestamp: Date.now(),
        userId: getUserId()
    };

    const posts = await getBlogPosts();
    posts.unshift(newPost);
    const saved = await saveBlogPosts(posts);

    if (saved) {
        document.getElementById('postTitle').value = '';
        document.getElementById('postCategory').value = '';
        document.getElementById('postTags').value = '';
        document.getElementById('postReadTime').value = '5';
        document.getElementById('postContent').value = '';
        await renderBlog();
        showNotification('✅ Post published successfully!', 'success');
    } else {
        showNotification('⚠️ Post saved offline. Will sync later.', 'warning');
    }
});

// ========== فیلترها ==========
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.dataset.filter;
        renderBlog();
    });
});

// ========== جستجو ==========
document.getElementById('searchInput')?.addEventListener('input', function() {
    searchQuery = this.value.trim();
    document.getElementById('clearSearch').style.display = searchQuery ? 'block' : 'none';
    renderBlog();
});

document.getElementById('clearSearch')?.addEventListener('click', function() {
    document.getElementById('searchInput').value = '';
    searchQuery = '';
    this.style.display = 'none';
    renderBlog();
});

// ========== مدیریت پنل ==========
document.getElementById('adminToggle')?.addEventListener('click', function() {
    const panel = document.getElementById('adminPanel');
    panel.classList.toggle('active');
    this.innerHTML = panel.classList.contains('active') ? 
        '<i class="fas fa-times"></i> Close' : 
        '<i class="fas fa-user-cog"></i> Manage Blog';
});

// ========== ابزارهای کمکی ==========
function getCategoryColor(category) {
    const colors = {
        'Web Development': 'linear-gradient(135deg, #2563eb, #7c3aed)',
        'AI': 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
        'Programming': 'linear-gradient(135deg, #f59e0b, #ef4444)',
        'Design': 'linear-gradient(135deg, #ec4899, #f59e0b)',
        'General': 'linear-gradient(135deg, #6b7280, #9ca3af)'
    };
    return colors[category] || colors['General'];
}

function getCategoryIcon(category) {
    const icons = {
        'Web Development': '🌐',
        'AI': '🤖',
        'Programming': '💻',
        'Design': '🎨',
        'General': '📝'
    };
    return icons[category] || '📝';
}

function getUserId() {
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('userId', userId);
    }
    return userId;
}

function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    const colors = {
        success: '#22c55e',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: ${colors[type] || '#3b82f6'};
        color: white;
        padding: 15px 30px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 500;
        animation: slideUp 0.3s ease;
        max-width: 90%;
        text-align: center;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ========== اضافه کردن به کنسول ==========
console.log('📝 Blog System Loaded!');
console.log('📌 Features:');
console.log('   - 📖 Read posts');
console.log('   - 🔍 Search posts');
console.log('   - 🏷️ Filter by category');
console.log('   - ✍️ Write new posts (admin)');
console.log('   - 💾 Stored in JSONBin');

// ========== مقداردهی اولیه ==========
document.addEventListener('DOMContentLoaded', async function() {
    await renderBlog();
    
    // اگه مدیر باشیم، پنل رو نشون بده
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (isAdmin) {
        document.getElementById('adminPanel')?.classList.add('active');
        document.getElementById('adminToggle').innerHTML = '<i class="fas fa-times"></i> Close';
    }
});