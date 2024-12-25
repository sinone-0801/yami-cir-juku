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

    // スタイルを読み込む関数
    async function loadCommonStyles(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const content = await response.text();
            
            // スタイル内容を抽出する正規表現
            const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
            
            if (styleMatch && styleMatch[1]) {
                // 新しいstyleタグを作成
                const styleElement = document.createElement('style');
                styleElement.textContent = styleMatch[1];
                
                // headタグの最後に追加
                document.head.appendChild(styleElement);
            } else {
                console.warn('No style content found in the file');
            }
        } catch (error) {
            console.error('Error loading styles:', error);
        }
    }

    // 並行して共通要素を読み込む
    await Promise.all([
        loadCommonStyles('common/styles.html'),
        loadCommonElement('common/header.html', 'header-placeholder'),
    ]).catch(error => {
        console.error('Error loading common elements:', error);
    });

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