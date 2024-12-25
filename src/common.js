document.addEventListener('DOMContentLoaded', async function() {
    // スタイルの読み込み
    try {
        const styleResponse = await fetch('common/styles.html');
        if (styleResponse.ok) {
            const styleContent = await styleResponse.text();
            // スタイルタグを作成して挿入
            const styleElement = document.createElement('div');
            styleElement.innerHTML = styleContent;
            document.head.appendChild(styleElement.querySelector('style'));
        }
    } catch (error) {
        console.error('Error loading styles:', error);
    }

    // ヘッダーの読み込み
    try {
        const headerResponse = await fetch('common/header.html');
        if (headerResponse.ok) {
            const headerContent = await headerResponse.text();
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = headerContent;
            }
        }
    } catch (error) {
        console.error('Error loading header:', error);
    }
});