document.addEventListener('DOMContentLoaded', async function() {
    // グローバル変数の初期化
    let hamburger = null;
    let nav = null;
    let header = null;
    let lastScroll = 0;
    let isInitialized = false;

    // 共通要素を読み込む関数
    async function loadCommonElement(url, placeholderId) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const content = await response.text();
            const placeholder = document.getElementById(placeholderId);
            if (placeholder) {
                placeholder.innerHTML = content;
                return true;
            } else {
                console.warn(`Placeholder element '${placeholderId}' not found`);
                return false;
            }
        } catch (error) {
            console.error(`Error loading ${url}:`, error);
            return false;
        }
    }

    // ナビゲーション要素の初期化
    function initializeNavigation() {
        if (isInitialized) return;
    
        hamburger = document.querySelector('.hamburger-menu');
        nav = document.querySelector('.global-nav-list');
        header = document.querySelector('.global-nav');
    
        if (!hamburger || !nav || !header) {
            console.warn('Navigation elements not found. Retrying in 100ms...');
            return false;
        }
    
        // ハンバーガーメニューの制御を改善
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            
            // アニメーションのタイミングを制御
            requestAnimationFrame(() => {
                nav.classList.toggle('active');
                
                if (nav.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                    // メニューアイテムの表示を遅延させる
                    nav.querySelectorAll('.nav-item').forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                } else {
                    document.body.style.overflow = '';
                    nav.querySelectorAll('.nav-item').forEach(item => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(-20px)';
                    });
                }
            });
        });
    
        isInitialized = true;
        return true;
    }

    // スクロールイベントの設定
    function setupScrollEvents() {
        if (!header) return;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                header.classList.add('scrolled');
            } else if (currentScroll < lastScroll && currentScroll < 100) {
                header.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    }

    // タッチイベントの設定
    function setupTouchEvents() {
        if (!nav || !hamburger) return;

        let touchstart = 0;
        let isSwiping = false;

        document.addEventListener('touchstart', function(e) {
            touchstart = e.changedTouches[0].screenY;
            isSwiping = true;
        }, { passive: true });

        document.addEventListener('touchmove', function(e) {
            if (!isSwiping) return;

            const touchmove = e.changedTouches[0].screenY;
            const diff = touchstart - touchmove;

            if (Math.abs(diff) > 30) {
                if (nav.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    nav.classList.remove('active');
                    document.body.style.overflow = '';
                }
                isSwiping = false;
            }
        }, { passive: true });

        document.addEventListener('touchend', function() {
            isSwiping = false;
        }, { passive: true });
    }

    // リサイズイベントの設定
    function setupResizeEvents() {
        if (!nav || !hamburger) return;

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (window.innerWidth > 768) {
                    hamburger.classList.remove('active');
                    nav.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }, 250);
        });
    }

    // 現在のページのナビゲーションリンクをアクティブにする
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
                link.style.color = 'var(--accent-color)';
            }
        });
    }

    // メイン初期化プロセス
    async function initialize() {
        // ヘッダーを読み込む
        const headerLoaded = await loadCommonElement('common/header.html', 'header-placeholder');
        
        if (headerLoaded) {
            // 要素の初期化を試みる
            let initAttempts = 0;
            const maxAttempts = 5;
            
            const initInterval = setInterval(() => {
                if (initializeNavigation() || initAttempts >= maxAttempts) {
                    clearInterval(initInterval);
                    
                    if (isInitialized) {
                        setupScrollEvents();
                        setupTouchEvents();
                        setupResizeEvents();
                        setActiveNavLink();
                    }
                }
                initAttempts++;
            }, 100);
        }
    }

    // 初期化を開始
    initialize();
});