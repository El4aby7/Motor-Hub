const fs = require('fs');

const htmlFiles = [
    'inventory.html',
    'about.html',
    'contact.html',
    'favorites.html',
    'details.html'
];

const logicStr = `
        // Mobile Menu
        const menuBtn = document.getElementById('mobile-menu-btn');
        const drawer = document.getElementById('mobile-drawer');
        if (menuBtn && drawer) {
            menuBtn.addEventListener('click', () => {
                drawer.classList.toggle('translate-x-full');
                menuBtn.innerHTML = drawer.classList.contains('translate-x-full')
                    ? '<span class="material-symbols-outlined">menu</span>'
                    : '<span class="material-symbols-outlined">close</span>';
            });
        }

        // FAB
        const fabBtn = document.getElementById('fab-btn');
        const fabPopup = document.getElementById('fab-popup');
        if (fabBtn && fabPopup) {
            fabBtn.addEventListener('click', () => {
                fabPopup.classList.toggle('hidden');
                fabPopup.classList.toggle('flex');
            });
        }

        // ==== Global Logic ====
        let currentLang = localStorage.getItem('lang') || 'en';
        let currentCurrency = localStorage.getItem('currency') || 'USD';
        let exchangeRate = 1;
        let translations = {};

        async function initGlobal() {
            try {
                // Fetch translations directly
                const transRes = await fetch('translations.json').then(r => r.json());
                translations = transRes;
                applyLanguage();
                if (typeof updateCurrencyDisplay === 'function') {
                    updateCurrencyDisplay();
                } else {
                    const cToggle = document.getElementById('currency-toggle');
                    if (cToggle) cToggle.textContent = currentCurrency;
                }
            } catch (err) {
                console.error("Global init error:", err);
            }
        }

        function applyLanguage() {
            document.documentElement.lang = currentLang;
            document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (translations[currentLang] && translations[currentLang][key]) {
                    el.textContent = translations[currentLang][key];
                }
            });
            const lt = document.getElementById('lang-toggle');
            if(lt) lt.textContent = currentLang === 'en' ? 'AR' : 'EN';
            const mlt = document.getElementById('mobile-lang-toggle');
            if(mlt) mlt.textContent = currentLang === 'en' ? 'Switch to AR' : 'Switch to EN';
        }

        const langToggleBtn = document.getElementById('lang-toggle');
        if(langToggleBtn) {
            langToggleBtn.addEventListener('click', () => {
                currentLang = currentLang === 'en' ? 'ar' : 'en';
                localStorage.setItem('lang', currentLang);
                applyLanguage();
            });
        }

        const mlangToggleBtn = document.getElementById('mobile-lang-toggle');
        if(mlangToggleBtn) {
            mlangToggleBtn.addEventListener('click', () => {
                currentLang = currentLang === 'en' ? 'ar' : 'en';
                localStorage.setItem('lang', currentLang);
                applyLanguage();
            });
        }

        const currToggleBtn = document.getElementById('currency-toggle');
        if(currToggleBtn) {
            currToggleBtn.addEventListener('click', () => {
                currentCurrency = currentCurrency === 'USD' ? 'EGP' : 'USD';
                localStorage.setItem('currency', currentCurrency);
                currToggleBtn.textContent = currentCurrency;
                if (typeof updateCurrencyDisplay === 'function') updateCurrencyDisplay();
            });
        }

        const mcurrToggleBtn = document.getElementById('mobile-currency-toggle');
        if(mcurrToggleBtn) {
            mcurrToggleBtn.addEventListener('click', () => {
                currentCurrency = currentCurrency === 'USD' ? 'EGP' : 'USD';
                localStorage.setItem('currency', currentCurrency);
                if (typeof updateCurrencyDisplay === 'function') updateCurrencyDisplay();
            });
        }

        initGlobal();
`;

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Clean up wrongly injected script inside tailwind block or other early closing tags.
    // The previous injected logic started with "// ==== Global Logic ===="
    // We will find it and remove it.
    const startGlobal = content.indexOf('// ==== Global Logic ====');
    if (startGlobal !== -1) {
        // Find the next </script> which is where we ended it
        const endScript = content.indexOf('</script>', startGlobal);
        if (endScript !== -1) {
            content = content.substring(0, startGlobal) + content.substring(endScript);
        }
    }

    // Also clean up any other wrongly injected code inside <script src="...">
    content = content.replace(/(<script\s+src="https:\/\/cdn\.tailwindcss\.com"[^>]*>)[\s\S]*?(<\/script>)/, '$1$2');

    // Now inject the new combined logic string properly right before </body>
    if (!content.includes('function initGlobal()')) {
        content = content.replace('</body>', '<script>\n' + logicStr + '\n</script>\n</body>');
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Patched ${file}`);
});
