/*
 * =========================================================
 * ZENVERIX — BLOG.JS 3.0
 * =========================================================
 *
 * Supabase Blog System
 *
 * Features:
 * - Public article reading
 * - Admin-only blog management
 * - Admin-only publishing
 * - Admin-only editing
 * - Admin-only deleting
 * - Supabase Storage images
 * - Search
 * - Category filtering
 * - Article modal
 * - Image preview
 * - Dark / Light mode
 * - Local theme persistence
 * - Mobile navigation
 * - Language toggle
 * - Footer filters
 * - Notifications
 * - Console admin command:
 *
 *      admintaha()
 *
 * IMPORTANT:
 * - Existing Supabase articles remain untouched.
 * - No demo articles are created.
 * - No existing articles are deleted automatically.
 *
 * =========================================================
 */

"use strict";


/* =========================================================
   CONFIG
========================================================= */

const BLOG_TABLE = "blog_posts";
const ADMIN_TABLE = "blog_admins";
const STORAGE_BUCKET = "blog-images";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp"
];

const THEME_STORAGE_KEY =
    "zenverix-blog-theme";

const LANGUAGE_STORAGE_KEY =
    "zenverix-blog-language";


/* =========================================================
   STATE
========================================================= */

let currentUser = null;

let isAdmin = false;

let articles = [];

let activeFilter = "all";

let searchQuery = "";

let deleteArticleId = null;

let editingArticleId = null;

let notificationTimer = null;

let selectedLanguage = "en";


/* =========================================================
   DOM ELEMENTS
========================================================= */

const themeToggle =
    document.getElementById("themeToggle");

const langToggle =
    document.getElementById("langToggle");

const langLabel =
    document.getElementById("langLabel");

const mobileMenuToggle =
    document.getElementById("mobileMenuToggle");

const mobileNavigation =
    document.getElementById("mobileNavigation");

const modalImageWrapper =
    document.getElementById("modalImageWrapper");

const modalImage =
    document.getElementById("modalImage");

const blogGrid =
    document.getElementById("blogGrid");

const emptyBlog =
    document.getElementById("emptyBlog");

const searchInput =
    document.getElementById("searchInput");

const clearSearch =
    document.getElementById("clearSearch");

const articleCount =
    document.getElementById("articleCount");

const heroPostCount =
    document.getElementById("heroPostCount");

const adminToggle =
    document.getElementById("adminToggle");

const adminPanel =
    document.getElementById("adminPanel");

const closeAdmin =
    document.getElementById("closeAdmin");

const postForm =
    document.getElementById("postForm");

const clearPostForm =
    document.getElementById("clearPostForm");

const postTitle =
    document.getElementById("postTitle");

const postCategory =
    document.getElementById("postCategory");

const postReadTime =
    document.getElementById("postReadTime");

const postTags =
    document.getElementById("postTags");

const postContent =
    document.getElementById("postContent");

const postImage =
    document.getElementById("postImage");

const imagePreview =
    document.getElementById("imagePreview");

const previewImage =
    document.getElementById("previewImage");

const removeImage =
    document.getElementById("removeImage");

const articleModal =
    document.getElementById("articleModal");

const closeArticleModal =
    document.getElementById("closeArticleModal");

const modalCategory =
    document.getElementById("modalCategory");

const modalTitle =
    document.getElementById("modalTitle");

const modalReadTime =
    document.getElementById("modalReadTime");

const modalDate =
    document.getElementById("modalDate");

const modalContent =
    document.getElementById("modalContent");

const modalTags =
    document.getElementById("modalTags");

const deleteModal =
    document.getElementById("deleteModal");

const cancelDelete =
    document.getElementById("cancelDelete");

const confirmDelete =
    document.getElementById("confirmDelete");

const notification =
    document.getElementById("notification");

const notificationText =
    document.getElementById("notificationText");


/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeBlog
);


/* =========================================================
   INITIALIZE
========================================================= */

async function initializeBlog() {

    try {

        initializeTheme();

        initializeLanguage();

        hideAdminInterface();

        setupEventListeners();

        updateCurrentYear();

        initializeMobileNavigation();


        if (!isSupabaseReady()) {

            console.warn(
                "Zenverix: Supabase client is not available."
            );

            articles = [];

            renderArticles();

            return;

        }


        await checkAuthentication();

        await loadArticles();


        console.log(
            "%cZENVERIX BLOG 3.0",
            "font-size:20px;font-weight:800;"
        );

        console.log(
            "Blog initialized."
        );

        console.log(
            "User:",
            currentUser
                ? currentUser.email
                : "Visitor"
        );

        console.log(
            "Admin:",
            isAdmin
        );


    } catch (error) {

        console.error(
            "Zenverix Blog initialization error:",
            error
        );

        showNotification(
            "Failed to initialize blog.",
            "error"
        );

    }

}


/* =========================================================
   SUPABASE READY
========================================================= */

function isSupabaseReady() {

    return (
        typeof supabaseClient !== "undefined" &&
        supabaseClient !== null
    );

}


/* =========================================================
   THEME
========================================================= */

function initializeTheme() {

    const savedTheme =
        localStorage.getItem(
            THEME_STORAGE_KEY
        );


    if (
        savedTheme === "dark"
    ) {

        document.body.classList.add(
            "dark-mode"
        );

    } else if (
        savedTheme === "light"
    ) {

        document.body.classList.remove(
            "dark-mode"
        );

    } else {

        const prefersDark =
            window.matchMedia &&
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;


        if (prefersDark) {

            document.body.classList.add(
                "dark-mode"
            );

        }

    }


    updateThemeButton();

}


function toggleTheme() {

    const isDark =
        document.body.classList.toggle(
            "dark-mode"
        );


    localStorage.setItem(
        THEME_STORAGE_KEY,
        isDark
            ? "dark"
            : "light"
    );


    updateThemeButton();

}


function updateThemeButton() {

    if (!themeToggle) {
        return;
    }


    const icon =
        themeToggle.querySelector("i");


    const isDark =
        document.body.classList.contains(
            "dark-mode"
        );


    if (icon) {

        icon.className =
            isDark
                ? "fas fa-sun"
                : "fas fa-moon";

    }


    themeToggle.setAttribute(
        "aria-label",
        isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
    );


    themeToggle.setAttribute(
        "title",
        isDark
            ? "Light mode"
            : "Dark mode"
    );

}


/* =========================================================
   LANGUAGE
========================================================= */

function initializeLanguage() {

    const savedLanguage =
        localStorage.getItem(
            LANGUAGE_STORAGE_KEY
        );


    if (
        savedLanguage === "fa" ||
        savedLanguage === "en"
    ) {

        selectedLanguage =
            savedLanguage;

    }


    updateLanguageButton();

}


function toggleLanguage() {

    selectedLanguage =
        selectedLanguage === "en"
            ? "fa"
            : "en";


    localStorage.setItem(
        LANGUAGE_STORAGE_KEY,
        selectedLanguage
    );


    updateLanguageButton();

}


function updateLanguageButton() {

    if (!langLabel) {
        return;
    }


    langLabel.textContent =
        selectedLanguage.toUpperCase();


    if (langToggle) {

        langToggle.setAttribute(
            "aria-label",
            selectedLanguage === "en"
                ? "Change language to Persian"
                : "Change language to English"
        );

    }

}


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

function initializeMobileNavigation() {

    if (!mobileNavigation) {
        return;
    }


    mobileNavigation
        .querySelectorAll("a")
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    () => {

                        closeMobileNavigation();

                    }
                );

            }
        );

}


function toggleMobileNavigation() {

    if (!mobileNavigation) {
        return;
    }


    const isOpen =
        mobileNavigation.classList.toggle(
            "active"
        );


    if (mobileMenuToggle) {

        mobileMenuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );


        const icon =
            mobileMenuToggle.querySelector(
                "i"
            );


        if (icon) {

            icon.className =
                isOpen
                    ? "fas fa-xmark"
                    : "fas fa-bars";

        }

    }

}


function closeMobileNavigation() {

    if (mobileNavigation) {

        mobileNavigation.classList.remove(
            "active"
        );

    }


    if (mobileMenuToggle) {

        mobileMenuToggle.setAttribute(
            "aria-expanded",
            "false"
        );


        const icon =
            mobileMenuToggle.querySelector(
                "i"
            );


        if (icon) {

            icon.className =
                "fas fa-bars";

        }

    }

}


/* =========================================================
   AUTHENTICATION
========================================================= */

async function checkAuthentication() {

    currentUser = null;

    isAdmin = false;

    hideAdminInterface();


    if (!isSupabaseReady()) {
        return;
    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.getUser();


        if (error) {

            console.warn(
                "Authentication:",
                error.message
            );

            return;

        }


        currentUser =
            data?.user || null;


        if (!currentUser) {
            return;
        }


        await checkAdminStatus();


    } catch (error) {

        console.error(
            "Authentication error:",
            error
        );

        currentUser = null;

        isAdmin = false;

        hideAdminInterface();

    }

}


/* =========================================================
   ADMIN STATUS
========================================================= */

async function checkAdminStatus() {

    isAdmin = false;

    hideAdminInterface();


    if (!currentUser) {
        return false;
    }


    if (!isSupabaseReady()) {
        return false;
    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from(ADMIN_TABLE)
                .select("user_id")
                .eq(
                    "user_id",
                    currentUser.id
                )
                .maybeSingle();


        if (error) {

            console.error(
                "Admin verification failed:",
                error
            );

            return false;

        }


        isAdmin =
            !!data;


        if (isAdmin) {

            showAdminInterface();

            console.log(
                "%cZenverix Admin Authorized",
                "color:#00ff99;font-weight:bold;"
            );

            console.log(
                "Admin:",
                currentUser.email
            );

        }


        return isAdmin;


    } catch (error) {

        console.error(
            "Admin check error:",
            error
        );

        isAdmin = false;

        hideAdminInterface();

        return false;

    }

}


/* =========================================================
   SHOW ADMIN
========================================================= */

function showAdminInterface() {

    if (!adminToggle) {
        return;
    }


    adminToggle.hidden =
        false;


    adminToggle.style.display =
        "";


    adminToggle.classList.add(
        "admin-authorized"
    );


    adminToggle.setAttribute(
        "aria-hidden",
        "false"
    );

}


/* =========================================================
   HIDE ADMIN
========================================================= */

function hideAdminInterface() {

    if (adminToggle) {

        adminToggle.hidden =
            true;

        adminToggle.style.display =
            "none";

        adminToggle.classList.remove(
            "admin-authorized"
        );

        adminToggle.setAttribute(
            "aria-hidden",
            "true"
        );

        adminToggle.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    if (adminPanel) {

        adminPanel.classList.remove(
            "active"
        );

        adminPanel.setAttribute(
            "aria-hidden",
            "true"
        );

    }

}


/* =========================================================
   CONSOLE ADMIN COMMAND
========================================================= */

window.admintaha =
    async function () {

        try {

            if (!isSupabaseReady()) {

                console.error(
                    "❌ Supabase is not initialized."
                );

                return false;

            }


            const {
                data,
                error
            } =
                await supabaseClient
                    .auth
                    .getUser();


            if (
                error ||
                !data?.user
            ) {

                console.warn(
                    "❌ You must be logged in first."
                );

                return false;

            }


            currentUser =
                data.user;


            const authorized =
                await checkAdminStatus();


            if (!authorized) {

                console.warn(
                    "❌ Access denied. This account is not a Zenverix admin."
                );

                return false;

            }


            openAdminPanel();


            console.log(
                "%c╔══════════════════════════════════════╗",
                "color:#00ff99;font-weight:bold;"
            );

            console.log(
                "%c║       ZENVERIX ADMIN MODE           ║",
                "color:#00ff99;font-weight:bold;"
            );

            console.log(
                "%c╚══════════════════════════════════════╝",
                "color:#00ff99;font-weight:bold;"
            );

            console.log(
                "👤 Admin:",
                currentUser.email
            );

            console.log(
                "🟢 Status: Authorized"
            );

            console.log(
                "📝 Blog management: Enabled"
            );


            return true;


        } catch (error) {

            console.error(
                "❌ Admin mode error:",
                error
            );

            return false;

        }

    };


/* =========================================================
   ADMIN PANEL
========================================================= */

function toggleAdminPanel() {

    if (!currentUser || !isAdmin) {

        showNotification(
            "Admin access required.",
            "error"
        );

        return;

    }


    if (!adminPanel) {
        return;
    }


    const isOpen =
        adminPanel.classList.contains(
            "active"
        );


    if (isOpen) {

        closeAdminPanel();

    } else {

        openAdminPanel();

    }

}


function openAdminPanel() {

    if (!adminPanel) {
        return;
    }


    adminPanel.classList.add(
        "active"
    );


    adminPanel.setAttribute(
        "aria-hidden",
        "false"
    );


    if (adminToggle) {

        adminToggle.setAttribute(
            "aria-expanded",
            "true"
        );

    }


    adminPanel.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


function closeAdminPanel() {

    if (!adminPanel) {
        return;
    }


    adminPanel.classList.remove(
        "active"
    );


    adminPanel.setAttribute(
        "aria-hidden",
        "true"
    );


    if (adminToggle) {

        adminToggle.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    resetEditor();

}


/* =========================================================
   LOAD ARTICLES
========================================================= */

async function loadArticles() {

    if (!isSupabaseReady()) {

        articles = [];

        renderArticles();

        return;

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from(BLOG_TABLE)
                .select(`
                    id,
                    title,
                    category,
                    content,
                    excerpt,
                    tags,
                    read_time,
                    author_id,
                    created_at,
                    updated_at,
                    image_url,
                    status,
                    published_at,
                    is_featured,
                    views_count,
                    likes_count
                `)
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            console.error(
                "Failed to load articles:",
                error
            );

            articles = [];

            renderArticles();

            showNotification(
                getSupabaseErrorMessage(error),
                "error"
            );

            return;

        }


        articles =
            Array.isArray(data)
                ? data
                : [];


        articles =
            articles.filter(
                article =>
                    !article.status ||
                    article.status === "published"
            );


        renderArticles();


    } catch (error) {

        console.error(
            "Load articles error:",
            error
        );

        articles = [];

        renderArticles();

        showNotification(
            "Could not load articles.",
            "error"
        );

    }

}


/* =========================================================
   RENDER ARTICLES
========================================================= */

function renderArticles() {

    if (!blogGrid) {

        updateArticleCount(0);

        return;

    }


    blogGrid.innerHTML =
        "";


    const filteredArticles =
        articles.filter(
            article => {

                const category =
                    String(
                        article.category || ""
                    );


                const matchesCategory =
                    activeFilter === "all" ||
                    category.toLowerCase() ===
                    activeFilter.toLowerCase();


                const query =
                    searchQuery
                        .toLowerCase()
                        .trim();


                const tags =
                    Array.isArray(article.tags)
                        ? article.tags
                        : [];


                const searchableText = [

                    article.title || "",

                    article.category || "",

                    article.content || "",

                    article.excerpt || "",

                    ...tags

                ]
                    .join(" ")
                    .toLowerCase();


                const matchesSearch =
                    !query ||
                    searchableText.includes(
                        query
                    );


                return (
                    matchesCategory &&
                    matchesSearch
                );

            }
        );


    filteredArticles.forEach(
        article => {

            blogGrid.appendChild(
                createArticleCard(article)
            );

        }
    );


    updateArticleCount(
        filteredArticles.length
    );


    if (emptyBlog) {

        emptyBlog.hidden =
            filteredArticles.length !== 0;

    }

}


/* =========================================================
   ARTICLE CARD
========================================================= */

function createArticleCard(article) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "blog-card";


    card.dataset.id =
        article.id;


    card.dataset.category =
        article.category || "";


    const tags =
        Array.isArray(article.tags)
            ? article.tags
            : [];


    const tagHTML =
        tags
            .slice(0, 4)
            .map(
                tag =>
                    `<span>${escapeHTML(tag)}</span>`
            )
            .join("");


    const date =
        article.created_at
            ? formatDate(
                article.created_at
            )
            : "Recently";


    const category =
        article.category ||
        "General";


    const icon =
        getCategoryIcon(
            category
        );


    const imageUrl =
        typeof article.image_url === "string" &&
        article.image_url.trim()
            ? article.image_url.trim()
            : null;


    let cardImageHTML;


    if (imageUrl) {

        cardImageHTML = `

            <div class="card-image card-image-real">

                <img
                    src="${escapeHTML(imageUrl)}"
                    alt="${escapeHTML(
                        article.title ||
                        "Article image"
                    )}"
                    class="article-card-image"
                    loading="lazy"
                >

                <span class="category-badge">
                    ${escapeHTML(category)}
                </span>

            </div>

        `;

    } else {

        cardImageHTML = `

            <div class="card-image">

                <div class="card-pattern"></div>

                <span class="category-badge">
                    ${escapeHTML(category)}
                </span>

                <div class="card-icon">
                    <i class="${icon}"></i>
                </div>

            </div>

        `;

    }


    const excerpt =
        article.excerpt ||
        createExcerpt(
            article.content
        );


    card.innerHTML = `

        ${cardImageHTML}

        <div class="card-body">

            <div class="card-date">

                <i class="far fa-calendar"></i>

                <span>
                    ${escapeHTML(date)}
                </span>

            </div>


            <h3>
                ${escapeHTML(
                    article.title || ""
                )}
            </h3>


            <p class="excerpt">
                ${escapeHTML(excerpt)}
            </p>


            <button
                class="read-more"
                type="button"
                data-action="read"
            >
                Read Article
                <i class="fas fa-arrow-right"></i>
            </button>

        </div>


        <div class="card-footer">

            <div class="tags">
                ${tagHTML}
            </div>


            <div class="meta">

                <span>

                    <i class="far fa-clock"></i>

                    ${
                        Number(
                            article.read_time
                        ) || 5
                    }

                    min

                </span>

            </div>

        </div>

    `;


    /* =====================================================
       ADMIN CONTROLS
    ===================================================== */

    if (isAdmin) {

        const adminControls =
            document.createElement(
                "div"
            );


        adminControls.className =
            "admin-card-controls";


        /* EDIT */

        const editButton =
            document.createElement(
                "button"
            );


        editButton.type =
            "button";


        editButton.className =
            "admin-edit-button";


        editButton.innerHTML =
            '<i class="fas fa-pen"></i>';


        editButton.title =
            "Edit article";


        editButton.setAttribute(
            "aria-label",
            "Edit article"
        );


        editButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                startEditingArticle(
                    article
                );

            }
        );


        /* DELETE */

        const deleteButton =
            document.createElement(
                "button"
            );


        deleteButton.type =
            "button";


        deleteButton.className =
            "admin-delete-button";


        deleteButton.innerHTML =
            '<i class="fas fa-trash"></i>';


        deleteButton.title =
            "Delete article";


        deleteButton.setAttribute(
            "aria-label",
            "Delete article"
        );


        deleteButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                openDeleteModal(
                    article.id
                );

            }
        );


        adminControls.appendChild(
            editButton
        );


        adminControls.appendChild(
            deleteButton
        );


        card.appendChild(
            adminControls
        );

    }


    /* =====================================================
       READ ARTICLE
    ===================================================== */

    card.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-action='read']"
                );


            if (!button) {
                return;
            }


            event.preventDefault();


            openArticle(
                article
            );

        }
    );


    return card;

}


/* =========================================================
   START EDIT
========================================================= */

function startEditingArticle(article) {

    if (!isAdmin || !currentUser) {

        showNotification(
            "Admin access required.",
            "error"
        );

        return;

    }


    if (!article) {
        return;
    }


    editingArticleId =
        article.id;


    if (postTitle) {

        postTitle.value =
            article.title || "";

    }


    if (postCategory) {

        postCategory.value =
            article.category || "";

    }


    if (postReadTime) {

        postReadTime.value =
            Number(
                article.read_time
            ) || 5;

    }


    if (postTags) {

        postTags.value =
            Array.isArray(article.tags)
                ? article.tags.join(", ")
                : "";

    }


    if (postContent) {

        postContent.value =
            article.content || "";

    }


    removeSelectedImage();


    if (
        article.image_url &&
        imagePreview &&
        previewImage
    ) {

        previewImage.src =
            article.image_url;


        imagePreview.hidden =
            false;

    }


    updateAdminFormMode();

    openAdminPanel();

}


/* =========================================================
   ADMIN FORM MODE
========================================================= */

function updateAdminFormMode() {

    if (!adminPanel) {
        return;
    }


    const heading =
        adminPanel.querySelector(
            ".admin-heading h2"
        );


    const description =
        adminPanel.querySelector(
            ".admin-heading p"
        );


    const submitButton =
        document.getElementById(
            "publishPost"
        );


    const submitIcon =
        submitButton?.querySelector(
            "i"
        );


    if (editingArticleId) {

        if (heading) {

            heading.textContent =
                "Edit Article";

        }


        if (description) {

            description.textContent =
                "Update your Zenverix Blog article.";

        }


        if (submitButton) {

            submitButton.innerHTML = `

                <i class="fas fa-save"></i>

                Update Article

            `;

        }

    } else {

        if (heading) {

            heading.textContent =
                "Create New Article";

        }


        if (description) {

            description.textContent =
                "Publish a new article to the Zenverix Blog.";

        }


        if (submitButton) {

            submitButton.innerHTML = `

                <i class="fas fa-paper-plane"></i>

                Publish Article

            `;

        }

    }

}


/* =========================================================
   RESET EDITOR
========================================================= */

function resetEditor() {

    editingArticleId =
        null;


    if (postForm) {

        postForm.reset();

    }


    if (postReadTime) {

        postReadTime.value =
            5;

    }


    removeSelectedImage();

    updateAdminFormMode();

}


/* =========================================================
   PUBLISH / UPDATE ARTICLE
========================================================= */

async function publishArticle(event) {

    event.preventDefault();


    await checkAuthentication();


    if (!currentUser || !isAdmin) {

        showNotification(
            "You are not authorized to manage articles.",
            "error"
        );

        return;

    }


    if (!isSupabaseReady()) {

        showNotification(
            "Supabase is not available.",
            "error"
        );

        return;

    }


    const title =
        postTitle?.value.trim() || "";


    const category =
        postCategory?.value.trim() || "";


    const readTime =
        Number(
            postReadTime?.value
        ) || 5;


    const tags =
        postTags?.value
            .split(",")
            .map(
                tag =>
                    tag.trim()
            )
            .filter(Boolean) || [];


    const content =
        postContent?.value.trim() || "";


    const imageFile =
        postImage?.files?.[0] || null;


    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!title) {

        showNotification(
            "Please enter an article title.",
            "error"
        );

        postTitle?.focus();

        return;

    }


    if (!category) {

        showNotification(
            "Please select a category.",
            "error"
        );

        postCategory?.focus();

        return;

    }


    if (!content) {

        showNotification(
            "Please enter article content.",
            "error"
        );

        postContent?.focus();

        return;

    }


    if (content.length < 20) {

        showNotification(
            "Article content must contain at least 20 characters.",
            "error"
        );

        postContent?.focus();

        return;

    }


    if (imageFile) {

        const validation =
            validateImageFile(
                imageFile
            );


        if (!validation.valid) {

            showNotification(
                validation.message,
                "error"
            );

            return;

        }

    }


    const publishButton =
        document.getElementById(
            "publishPost"
        );


    const originalButtonHTML =
        publishButton
            ? publishButton.innerHTML
            : "";


    if (publishButton) {

        publishButton.disabled =
            true;


        publishButton.innerHTML = `

            <i class="fas fa-spinner fa-spin"></i>

            ${
                editingArticleId
                    ? "Updating..."
                    : "Publishing..."
            }

        `;

    }


    try {

        /* =================================================
           EDIT EXISTING ARTICLE
        ================================================= */

        if (editingArticleId) {

            await updateExistingArticle(
                title,
                category,
                readTime,
                tags,
                content,
                imageFile
            );


        /* =================================================
           CREATE NEW ARTICLE
        ================================================= */

        } else {

            await createNewArticle(
                title,
                category,
                readTime,
                tags,
                content,
                imageFile
            );

        }


        renderArticles();

        resetEditor();

        closeAdminPanel();


        showNotification(
            editingArticleId
                ? "Article updated successfully."
                : "Article published successfully.",
            "success"
        );


    } catch (error) {

        console.error(
            "Article management error:",
            error
        );


        showNotification(
            getSupabaseErrorMessage(error),
            "error"
        );


    } finally {

        if (publishButton) {

            publishButton.disabled =
                false;

            publishButton.innerHTML =
                originalButtonHTML;

        }

        updateAdminFormMode();

    }

}


/* =========================================================
   CREATE NEW ARTICLE
========================================================= */

async function createNewArticle(
    title,
    category,
    readTime,
    tags,
    content,
    imageFile
) {

    let imageUrl =
        null;


    if (imageFile) {

        showNotification(
            "Uploading article image...",
            "warning"
        );


        const uploaded =
            await uploadBlogImage(
                imageFile
            );


        imageUrl =
            uploaded?.url || null;

    }


    const articleData = {

        title:
            title,

        category:
            category,

        content:
            content,

        excerpt:
            createExcerpt(
                content,
                180
            ),

        tags:
            tags,

        read_time:
            readTime,

        author_id:
            currentUser.id,

        image_url:
            imageUrl,

        status:
            "published",

        published_at:
            new Date().toISOString(),

        is_featured:
            false,

        views_count:
            0,

        likes_count:
            0

    };


    const {
        data,
        error
    } =
        await supabaseClient
            .from(BLOG_TABLE)
            .insert(
                articleData
            )
            .select()
            .single();


    if (error) {

        /*
         * If database insert fails after image upload,
         * try to clean the uploaded image.
         */

        if (imageUrl) {

            try {

                const path =
                    getStoragePathFromPublicUrl(
                        imageUrl
                    );


                if (path) {

                    await removeStorageImage(
                        path
                    );

                }

            } catch (cleanupError) {

                console.warn(
                    "Uploaded image cleanup failed:",
                    cleanupError
                );

            }

        }


        throw error;

    }


    if (data) {

        articles.unshift(
            data
        );

    }

}


/* =========================================================
   UPDATE EXISTING ARTICLE
========================================================= */

async function updateExistingArticle(
    title,
    category,
    readTime,
    tags,
    content,
    imageFile
) {

    const article =
        articles.find(
            item =>
                item.id ===
                editingArticleId
        );


    if (!article) {

        throw new Error(
            "Article not found."
        );

    }


    let imageUrl =
        article.image_url || null;


    let oldImagePath =
        null;


    /*
     * Upload new image first.
     */

    if (imageFile) {

        showNotification(
            "Uploading new article image...",
            "warning"
        );


        const uploaded =
            await uploadBlogImage(
                imageFile
            );


        imageUrl =
            uploaded?.url || null;


        oldImagePath =
            article.image_url
                ? getStoragePathFromPublicUrl(
                    article.image_url
                )
                : null;

    }


    const updateData = {

        title:
            title,

        category:
            category,

        content:
            content,

        excerpt:
            createExcerpt(
                content,
                180
            ),

        tags:
            tags,

        read_time:
            readTime,

        image_url:
            imageUrl,

        updated_at:
            new Date().toISOString()

    };


    const {
        data,
        error
    } =
        await supabaseClient
            .from(BLOG_TABLE)
            .update(
                updateData
            )
            .eq(
                "id",
                editingArticleId
            )
            .select()
            .single();


    if (error) {

        /*
         * If update fails and a new image was uploaded,
         * remove the newly uploaded image.
         */

        if (
            imageFile &&
            imageUrl
        ) {

            try {

                const newPath =
                    getStoragePathFromPublicUrl(
                        imageUrl
                    );


                if (newPath) {

                    await removeStorageImage(
                        newPath
                    );

                }

            } catch (cleanupError) {

                console.warn(
                    "New image cleanup failed:",
                    cleanupError
                );

            }

        }


        throw error;

    }


    /*
     * Replace local state.
     */

    if (data) {

        articles =
            articles.map(
                item =>
                    item.id ===
                    editingArticleId
                        ? data
                        : item
            );

    }


    /*
     * Remove old image only AFTER
     * successful database update.
     */

    if (
        imageFile &&
        oldImagePath
    ) {

        try {

            await removeStorageImage(
                oldImagePath
            );

        } catch (storageError) {

            console.warn(
                "Old image cleanup failed:",
                storageError
            );

        }

    }

}


/* =========================================================
   IMAGE UPLOAD
========================================================= */

async function uploadBlogImage(file) {

    if (!file) {
        return null;
    }


    if (!currentUser || !isAdmin) {

        throw new Error(
            "Admin authentication required."
        );

    }


    const validation =
        validateImageFile(
            file
        );


    if (!validation.valid) {

        throw new Error(
            validation.message
        );

    }


    const extension =
        getFileExtension(
            file.name
        );


    const fileName =
        `${crypto.randomUUID()}.${extension}`;


    const filePath =
        `${currentUser.id}/${fileName}`;


    const {
        data,
        error
    } =
        await supabaseClient
            .storage
            .from(STORAGE_BUCKET)
            .upload(
                filePath,
                file,
                {
                    cacheControl:
                        "3600",

                    upsert:
                        false,

                    contentType:
                        file.type

                }
            );


    if (error) {

        console.error(
            "Storage upload error:",
            error
        );

        throw error;

    }


    const {
        data: publicData
    } =
        supabaseClient
            .storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(
                data.path
            );


    return {

        url:
            publicData?.publicUrl ||
            null,

        path:
            data.path

    };

}


/* =========================================================
   DELETE MODAL
========================================================= */

function openDeleteModal(id) {

    if (!isAdmin) {

        showNotification(
            "Admin access required.",
            "error"
        );

        return;

    }


    deleteArticleId =
        id;


    if (!deleteModal) {
        return;
    }


    deleteModal.classList.add(
        "active"
    );


    deleteModal.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeDeleteModal() {

    deleteArticleId =
        null;


    if (!deleteModal) {
        return;
    }


    deleteModal.classList.remove(
        "active"
    );


    deleteModal.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================================
   DELETE ARTICLE
========================================================= */

async function deleteArticle() {

    await checkAuthentication();


    if (!currentUser || !isAdmin) {

        closeDeleteModal();

        showNotification(
            "You are not authorized to delete articles.",
            "error"
        );

        return;

    }


    if (!deleteArticleId) {
        return;
    }


    const id =
        deleteArticleId;


    const article =
        articles.find(
            item =>
                item.id === id
        );


    if (!article) {

        closeDeleteModal();

        showNotification(
            "Article not found.",
            "error"
        );

        return;

    }


    if (confirmDelete) {

        confirmDelete.disabled =
            true;


        confirmDelete.innerHTML = `

            <i class="fas fa-spinner fa-spin"></i>

            Deleting...

        `;

    }


    try {

        const {
            error
        } =
            await supabaseClient
                .from(BLOG_TABLE)
                .delete()
                .eq(
                    "id",
                    id
                );


        if (error) {

            throw error;

        }


        /*
         * Storage cleanup
         */

        if (article.image_url) {

            try {

                const path =
                    getStoragePathFromPublicUrl(
                        article.image_url
                    );


                if (path) {

                    await removeStorageImage(
                        path
                    );

                }

            } catch (storageError) {

                console.warn(
                    "Article deleted but image cleanup failed:",
                    storageError
                );

            }

        }


        articles =
            articles.filter(
                item =>
                    item.id !== id
            );


        renderArticles();

        closeDeleteModal();


        showNotification(
            "Article deleted successfully.",
            "success"
        );


        deleteArticleId =
            null;


    } catch (error) {

        console.error(
            "Delete error:",
            error
        );


        showNotification(
            getSupabaseErrorMessage(error),
            "error"
        );


    } finally {

        if (confirmDelete) {

            confirmDelete.disabled =
                false;


            confirmDelete.innerHTML =
                "Delete";

        }

    }

}


/* =========================================================
   STORAGE DELETE
========================================================= */

async function removeStorageImage(
    imagePath
) {

    if (!imagePath) {
        return;
    }


    const {
        error
    } =
        await supabaseClient
            .storage
            .from(STORAGE_BUCKET)
            .remove([
                imagePath
            ]);


    if (error) {

        throw error;

    }

}


/* =========================================================
   STORAGE PATH
========================================================= */

function getStoragePathFromPublicUrl(
    imageUrl
) {

    if (!imageUrl) {
        return null;
    }


    try {

        const marker =
            `/storage/v1/object/public/${STORAGE_BUCKET}/`;


        const index =
            imageUrl.indexOf(
                marker
            );


        if (index === -1) {
            return null;
        }


        return decodeURIComponent(
            imageUrl.substring(
                index +
                marker.length
            )
        );


    } catch (error) {

        console.warn(
            "Could not parse storage path:",
            error
        );

        return null;

    }

}


/* =========================================================
   ARTICLE MODAL
========================================================= */

function openArticle(article) {

    if (modalCategory) {

        modalCategory.textContent =
            article.category ||
            "General";

    }


    if (modalTitle) {

        modalTitle.textContent =
            article.title ||
            "";

    }


    if (modalReadTime) {

        modalReadTime.textContent =
            `${
                Number(
                    article.read_time
                ) || 5
            } min`;

    }


    if (modalDate) {

        modalDate.textContent =
            article.created_at
                ? formatDate(
                    article.created_at
                )
                : "Recently";

    }


    const imageUrl =
        typeof article.image_url === "string" &&
        article.image_url.trim()
            ? article.image_url.trim()
            : null;


    if (
        modalImageWrapper &&
        modalImage
    ) {

        if (imageUrl) {

            modalImage.src =
                imageUrl;


            modalImage.alt =
                article.title ||
                "Article image";


            modalImageWrapper.hidden =
                false;

        } else {

            modalImage.src =
                "";

            modalImage.alt =
                "";

            modalImageWrapper.hidden =
                true;

        }

    }


    if (modalContent) {

        modalContent.textContent =
            article.content ||
            "";

    }


    if (modalTags) {

        modalTags.innerHTML =
            "";


        const tags =
            Array.isArray(article.tags)
                ? article.tags
                : [];


        tags.forEach(
            tag => {

                const span =
                    document.createElement(
                        "span"
                    );


                span.textContent =
                    tag;


                modalTags.appendChild(
                    span
                );

            }
        );

    }


    if (articleModal) {

        articleModal.classList.add(
            "active"
        );


        articleModal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "modal-open"
        );

    }

}


/* =========================================================
   CLOSE ARTICLE
========================================================= */

function closeArticle() {

    if (!articleModal) {
        return;
    }


    articleModal.classList.remove(
        "active"
    );


    articleModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "modal-open"
    );


    if (modalImage) {

        modalImage.src =
            "";

    }


    if (modalImageWrapper) {

        modalImageWrapper.hidden =
            true;

    }

}


/* =========================================================
   SEARCH
========================================================= */

function handleSearch() {

    if (!searchInput) {
        return;
    }


    searchQuery =
        searchInput.value.trim();


    if (clearSearch) {

        clearSearch.hidden =
            !searchQuery;

    }


    renderArticles();

}


/* =========================================================
   FILTER
========================================================= */

function handleFilter(filter) {

    activeFilter =
        filter ||
        "all";


    document
        .querySelectorAll(
            ".filter-btn"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.filter ===
                    activeFilter
                );

            }
        );


    renderArticles();

}


/* =========================================================
   IMAGE PREVIEW
========================================================= */

function handleImagePreview(event) {

    const file =
        event.target.files?.[0];


    if (!file) {

        removeSelectedImage();

        return;

    }


    const validation =
        validateImageFile(
            file
        );


    if (!validation.valid) {

        showNotification(
            validation.message,
            "error"
        );


        removeSelectedImage();

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function (event) {

            if (previewImage) {

                previewImage.src =
                    event.target.result;

            }


            if (imagePreview) {

                imagePreview.hidden =
                    false;

            }

        };


    reader.readAsDataURL(
        file
    );

}


/* =========================================================
   REMOVE IMAGE
========================================================= */

function removeSelectedImage() {

    if (postImage) {

        postImage.value =
            "";

    }


    if (previewImage) {

        previewImage.src =
            "";

    }


    if (imagePreview) {

        imagePreview.hidden =
            true;

    }

}


/* =========================================================
   IMAGE VALIDATION
========================================================= */

function validateImageFile(file) {

    if (!file) {

        return {
            valid: true
        };

    }


    if (
        !ALLOWED_IMAGE_TYPES.includes(
            file.type
        )
    ) {

        return {

            valid: false,

            message:
                "Only JPG, PNG and WebP images are allowed."

        };

    }


    if (
        file.size >
        MAX_IMAGE_SIZE
    ) {

        return {

            valid: false,

            message:
                "Image must be smaller than 5MB."

        };

    }


    return {
        valid: true
    };

}


/* =========================================================
   FILE EXTENSION
========================================================= */

function getFileExtension(
    filename
) {

    const parts =
        String(
            filename || ""
        )
        .split(".");


    if (parts.length < 2) {
        return "jpg";
    }


    const extension =
        parts
            .pop()
            .toLowerCase();


    if (
        extension === "jpeg"
    ) {

        return "jpg";

    }


    if (
        ![
            "jpg",
            "png",
            "webp"
        ].includes(
            extension
        )
    ) {

        return "jpg";

    }


    return extension;

}


/* =========================================================
   ARTICLE COUNT
========================================================= */

function updateArticleCount(
    count
) {

    if (articleCount) {

        articleCount.textContent =
            count;

    }


    if (heroPostCount) {

        heroPostCount.textContent =
            articles.length;

    }

}


/* =========================================================
   EXCERPT
========================================================= */

function createExcerpt(
    content,
    maxLength = 180
) {

    if (!content) {
        return "";
    }


    const clean =
        String(content)
            .replace(
                /\s+/g,
                " "
            )
            .trim();


    if (
        clean.length <=
        maxLength
    ) {

        return clean;

    }


    return (
        clean.substring(
            0,
            maxLength
        ) +
        "..."
    );

}


/* =========================================================
   DATE
========================================================= */

function formatDate(
    dateString
) {

    const date =
        new Date(
            dateString
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Unknown date";

    }


    return date.toLocaleDateString(
        "en-US",
        {
            year:
                "numeric",

            month:
                "short",

            day:
                "numeric"
        }
    );

}


/* =========================================================
   CATEGORY ICON
========================================================= */

function getCategoryIcon(
    category
) {

    const normalized =
        String(
            category || ""
        )
        .toLowerCase();


    if (
        normalized === "ai" ||
        normalized.includes(
            "artificial"
        )
    ) {

        return "fas fa-brain";

    }


    if (
        normalized.includes(
            "web"
        )
    ) {

        return "fas fa-code";

    }


    if (
        normalized.includes(
            "program"
        )
    ) {

        return "fas fa-terminal";

    }


    if (
        normalized.includes(
            "design"
        )
    ) {

        return "fas fa-palette";

    }


    if (
        normalized.includes(
            "zenverix"
        )
    ) {

        return "fas fa-bolt";

    }


    return "fas fa-file-lines";

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   SUPABASE ERROR
========================================================= */

function getSupabaseErrorMessage(
    error
) {

    if (!error) {

        return "Unknown error.";

    }


    console.error(
        "Supabase error details:",
        {
            message:
                error.message,

            code:
                error.code,

            details:
                error.details,

            hint:
                error.hint
        }
    );


    const message =
        String(
            error.message ||
            error.error_description ||
            error.details ||
            ""
        );


    const normalized =
        message.toLowerCase();


    if (
        normalized.includes(
            "permission denied"
        )
    ) {

        return (
            "Supabase permission denied. " +
            "Check your RLS and Storage policies."
        );

    }


    if (
        normalized.includes(
            "row-level security"
        )
    ) {

        return (
            "Supabase RLS blocked this operation."
        );

    }


    if (
        normalized.includes(
            "policy"
        )
    ) {

        return (
            "Supabase policy blocked this operation."
        );

    }


    if (
        normalized.includes(
            "column"
        )
    ) {

        return (
            "Database column mismatch. " +
            "Check the blog_posts table structure."
        );

    }


    return (
        message ||
        "Supabase request failed."
    );

}


/* =========================================================
   NOTIFICATION
========================================================= */

function showNotification(
    message,
    type = "success"
) {

    if (
        !notification ||
        !notificationText
    ) {

        console.log(
            `[${type}] ${message}`
        );

        return;

    }


    clearTimeout(
        notificationTimer
    );


    notificationText.textContent =
        message;


    notification.classList.remove(
        "success",
        "error",
        "warning",
        "active",
        "show"
    );


    notification.classList.add(
        type
    );


    notification.classList.add(
        "active"
    );


    notification.classList.add(
        "show"
    );


    const icon =
        notification.querySelector(
            ".notification-icon i"
        );


    if (icon) {

        if (
            type === "error"
        ) {

            icon.className =
                "fas fa-circle-exclamation";

        } else if (
            type === "warning"
        ) {

            icon.className =
                "fas fa-triangle-exclamation";

        } else {

            icon.className =
                "fas fa-check";

        }

    }


    notificationTimer =
        setTimeout(
            () => {

                notification.classList.remove(
                    "active",
                    "show"
                );

            },
            3500
        );

}


/* =========================================================
   CURRENT YEAR
========================================================= */

function updateCurrentYear() {

    const currentYear =
        document.getElementById(
            "currentYear"
        );


    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();

    }

}


/* =========================================================
   EVENT LISTENERS
========================================================= */

function setupEventListeners() {

    /* =====================================================
       THEME
    ===================================================== */

    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            toggleTheme
        );

    }


    /* =====================================================
       LANGUAGE
    ===================================================== */

    if (langToggle) {

        langToggle.addEventListener(
            "click",
            toggleLanguage
        );

    }


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    if (mobileMenuToggle) {

        mobileMenuToggle.addEventListener(
            "click",
            toggleMobileNavigation
        );

    }


    /* =====================================================
       SEARCH
    ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            handleSearch
        );

    }


    /* =====================================================
       CLEAR SEARCH
    ===================================================== */

    if (clearSearch) {

        clearSearch.addEventListener(
            "click",
            () => {

                if (searchInput) {

                    searchInput.value =
                        "";

                }


                searchQuery =
                    "";


                clearSearch.hidden =
                    true;


                renderArticles();


                searchInput?.focus();

            }
        );

    }


    /* =====================================================
       FILTERS
    ===================================================== */

    document
        .querySelectorAll(
            ".filter-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        handleFilter(
                            button.dataset.filter
                        );

                    }
                );

            }
        );


    /* =====================================================
       ADMIN TOGGLE
    ===================================================== */

    if (adminToggle) {

        adminToggle.addEventListener(
            "click",
            toggleAdminPanel
        );

    }


    /* =====================================================
       CLOSE ADMIN
    ===================================================== */

    if (closeAdmin) {

        closeAdmin.addEventListener(
            "click",
            closeAdminPanel
        );

    }


    /* =====================================================
       PUBLISH / UPDATE
    ===================================================== */

    if (postForm) {

        postForm.addEventListener(
            "submit",
            publishArticle
        );

    }


    /* =====================================================
       CLEAR FORM
    ===================================================== */

    if (clearPostForm) {

        clearPostForm.addEventListener(
            "click",
            () => {

                resetEditor();

            }
        );

    }


    /* =====================================================
       IMAGE
    ===================================================== */

    if (postImage) {

        postImage.addEventListener(
            "change",
            handleImagePreview
        );

    }


    /* =====================================================
       REMOVE IMAGE
    ===================================================== */

    if (removeImage) {

        removeImage.addEventListener(
            "click",
            removeSelectedImage
        );

    }


    /* =====================================================
       ARTICLE MODAL
    ===================================================== */

    if (closeArticleModal) {

        closeArticleModal.addEventListener(
            "click",
            closeArticle
        );

    }


    /* =====================================================
       ARTICLE BACKDROP
    ===================================================== */

    if (articleModal) {

        const backdrop =
            articleModal.querySelector(
                ".article-modal-backdrop"
            );


        if (backdrop) {

            backdrop.addEventListener(
                "click",
                closeArticle
            );

        }

    }


    /* =====================================================
       DELETE CANCEL
    ===================================================== */

    if (cancelDelete) {

        cancelDelete.addEventListener(
            "click",
            closeDeleteModal
        );

    }


    /* =====================================================
       DELETE CONFIRM
    ===================================================== */

    if (confirmDelete) {

        confirmDelete.addEventListener(
            "click",
            deleteArticle
        );

    }


    /* =====================================================
       DELETE BACKDROP
    ===================================================== */

    if (deleteModal) {

        const backdrop =
            deleteModal.querySelector(
                ".confirm-modal-backdrop"
            );


        if (backdrop) {

            backdrop.addEventListener(
                "click",
                closeDeleteModal
            );

        }

    }


    /* =====================================================
       FOOTER FILTERS
    ===================================================== */

    document
        .querySelectorAll(
            "[data-footer-filter]"
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();


                        handleFilter(
                            link.dataset.footerFilter
                        );


                        document
                            .querySelector(
                                ".blog-section"
                            )
                            ?.scrollIntoView({
                                behavior:
                                    "smooth"
                            });

                    }
                );

            }
        );


    /* =====================================================
       ESCAPE
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !==
                "Escape"
            ) {

                return;

            }


            closeArticle();

            closeDeleteModal();

            closeAdminPanel();

            closeMobileNavigation();

        }
    );


    /* =====================================================
       SUPABASE AUTH STATE
    ===================================================== */

    if (isSupabaseReady()) {

        supabaseClient.auth.onAuthStateChange(
            (
                _event,
                session
            ) => {

                setTimeout(
                    async () => {

                        currentUser =
                            session?.user ||
                            null;


                        await checkAdminStatus();


                        renderArticles();

                    },
                    0
                );

            }
        );

    }

}


/* =========================================================
   END
========================================================= */