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

    // ナビゲーションの読み込み完了後にアクティブリンクを設定
    setTimeout(setActiveNavLink, 100);
});