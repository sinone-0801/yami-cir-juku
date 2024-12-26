// common.js
document.addEventListener('DOMContentLoaded', async function() {
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
            } else {
                console.warn(`Placeholder element '${placeholderId}' not found`);
            }
        } catch (error) {
            console.error(`Error loading ${url}:`, error);
        }
    }

    // ヘッダーを読み込む
    await loadCommonElement('common/header.html', 'header-placeholder');

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

    const hamburger = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('.global-nav-list');
    const header = document.querySelector('.global-nav');
    let lastScroll = 0;

    // ハンバーガーメニューの制御
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // メニューリンクをクリックしたらメニューを閉じる
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // スクロール時のヘッダー制御
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // スクロール方向の検出
        if (currentScroll > lastScroll) {
            // 下スクロール
            if (currentScroll > 100) {
                header.classList.add('scrolled');
            }
        } else {
            // 上スクロール
            if (currentScroll < 100) {
                header.classList.remove('scrolled');
            }
        }
        
        lastScroll = currentScroll;
    });

    // ウィンドウのリサイズ時にメニューの状態をリセット
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        }
    });

    // タッチデバイスでのスクロール改善
    let touchstart = 0;
    document.addEventListener('touchstart', function(e) {
        touchstart = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchmove', function(e) {
        const touchmove = e.changedTouches[0].screenY;
        const diff = touchstart - touchmove;

        if (Math.abs(diff) > 30) { // スクロール距離が30px以上の場合
            if (nav.classList.contains('active')) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            }
        }
    });
    
    // ナビゲーションの読み込み完了後にアクティブリンクを設定
    setTimeout(setActiveNavLink, 100);
});
