(function () {
  "use strict";

  const CONSENT_KEY = "ce_cookie_consent";
  const CONSENT_DATE_KEY = "ce_cookie_consent_date";

  function getConsent() {
    return localStorage.getItem(CONSENT_KEY);
  }

  function setConsent(value) {
    localStorage.setItem(CONSENT_KEY, value);
    localStorage.setItem(CONSENT_DATE_KEY, new Date().toISOString());
  }

  function removeBanner() {
    const existing = document.getElementById("ceCookieBanner");
    if (existing) {
      existing.remove();
    }
  }

  function createBanner() {
    if (document.getElementById("ceCookieBanner")) {
      return;
    }

    const banner = document.createElement("div");
    banner.id = "ceCookieBanner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-label", "Cookie consent banner");

    banner.innerHTML = `
      <div class="ce-cookie-banner__content">
        <div class="ce-cookie-banner__text">
          <div class="ce-cookie-banner__title">🍪 Privacy & Cookie Notice</div>
          <p class="ce-cookie-banner__desc">
            Cosmic Explorers uses browser storage and may use cookies to keep essential features
            working, remember your preferences, and improve your experience.
            By clicking <strong>Accept</strong>, you agree to this use.
            You can read more in our
            <a href="privacy.html" class="ce-cookie-banner__link">Privacy Policy</a>.
          </p>
        </div>

        <div class="ce-cookie-banner__actions">
          <button type="button" id="ceCookieReject" class="ce-cookie-btn ce-cookie-btn--secondary">
            Reject
          </button>
          <button type="button" id="ceCookieAccept" class="ce-cookie-btn ce-cookie-btn--primary">
            Accept
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    const acceptBtn = document.getElementById("ceCookieAccept");
    const rejectBtn = document.getElementById("ceCookieReject");

    if (acceptBtn) {
      acceptBtn.addEventListener("click", function () {
        setConsent("accepted");
        removeBanner();
      });
    }

    if (rejectBtn) {
      rejectBtn.addEventListener("click", function () {
        setConsent("rejected");
        removeBanner();
      });
    }
  }

  function injectStyles() {
    if (document.getElementById("ceCookieBannerStyles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "ceCookieBannerStyles";
    style.textContent = `
      #ceCookieBanner {
        position: fixed;
        left: 20px;
        right: 20px;
        bottom: 20px;
        z-index: 9999;
        display: flex;
        justify-content: center;
        pointer-events: none;
      }

      .ce-cookie-banner__content {
        width: min(980px, 100%);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 1rem 1.15rem;
        border-radius: 1.2rem;
        border: 1px solid rgba(255,255,255,0.14);
        background: rgba(10, 15, 35, 0.88);
        backdrop-filter: blur(16px);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
        pointer-events: auto;
      }

      .ce-cookie-banner__text {
        flex: 1 1 auto;
      }

      .ce-cookie-banner__title {
        font-weight: 700;
        font-size: 1rem;
        color: #ffffff;
        margin-bottom: 0.4rem;
      }

      .ce-cookie-banner__desc {
        margin: 0;
        color: rgba(255,255,255,0.82);
        line-height: 1.55;
        font-size: 0.95rem;
      }

      .ce-cookie-banner__link {
        color: #00d2ff;
        text-decoration: none;
      }

      .ce-cookie-banner__link:hover {
        color: #8fe8ff;
        text-decoration: underline;
      }

      .ce-cookie-banner__actions {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-shrink: 0;
      }

      .ce-cookie-btn {
        border: none;
        border-radius: 999px;
        padding: 0.7rem 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
      }

      .ce-cookie-btn:hover {
        transform: translateY(-1px);
      }

      .ce-cookie-btn--primary {
        color: #ffffff;
        background: linear-gradient(45deg, #00d2ff, #9d50bb);
        box-shadow: 0 0 16px rgba(0, 210, 255, 0.18);
      }

      .ce-cookie-btn--primary:hover {
        filter: brightness(1.08);
      }

      .ce-cookie-btn--secondary {
        color: #ffffff;
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.14);
      }

      .ce-cookie-btn--secondary:hover {
        box-shadow: 0 0 12px rgba(255,255,255,0.08);
      }

      @media (max-width: 768px) {
        #ceCookieBanner {
          left: 14px;
          right: 14px;
          bottom: 14px;
        }

        .ce-cookie-banner__content {
          flex-direction: column;
          align-items: stretch;
        }

        .ce-cookie-banner__actions {
          width: 100%;
          justify-content: stretch;
        }

        .ce-cookie-btn {
          width: 100%;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function initCookieConsent() {
    const consent = getConsent();

    injectStyles();

    if (!consent) {
      createBanner();
    }
  }

  window.CE_COOKIE = {
    getConsent: getConsent,
    accept: function () {
      setConsent("accepted");
      removeBanner();
    },
    reject: function () {
      setConsent("rejected");
      removeBanner();
    },
    reset: function () {
      localStorage.removeItem(CONSENT_KEY);
      localStorage.removeItem(CONSENT_DATE_KEY);
      removeBanner();
      createBanner();
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCookieConsent);
  } else {
    initCookieConsent();
  }
})();