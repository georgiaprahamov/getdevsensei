/**
 * DevSENSEI — Cookie Consent Banner
 */
(function () {
    const KEY = 'devsensei_cookie_consent';
    if (localStorage.getItem(KEY)) return;

    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML = `
        <div class="cookie-inner">
            <div class="cookie-text">
                <div class="cookie-icon">🍪</div>
                <div>
                    <strong>We use cookies</strong>
                    <p>We use essential cookies to make this site work. We also load fonts from Google Fonts, which may set cookies. See our <a href="privacy.html">Privacy Policy</a> for details.</p>
                </div>
            </div>
            <div class="cookie-actions">
                <button class="btn btn-outline btn-sm" id="cookie-reject">Reject non-essential</button>
                <button class="btn btn-primary btn-sm" id="cookie-accept">Accept all</button>
            </div>
        </div>
    `;
    document.body.appendChild(banner);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => banner.classList.add('cookie-visible'));
    });

    function dismiss(choice) {
        localStorage.setItem(KEY, choice);
        banner.classList.remove('cookie-visible');
        banner.addEventListener('transitionend', () => banner.remove(), { once: true });
    }

    document.getElementById('cookie-accept').addEventListener('click', () => dismiss('accepted'));
    document.getElementById('cookie-reject').addEventListener('click', () => dismiss('rejected'));
})();
