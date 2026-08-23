import * as CookieConsent from "vanilla-cookieconsent";

type ConsentState = "denied" | "granted"

type GoogleConsentUpdate = {
  ad_personalization: ConsentState
  ad_storage: ConsentState
  ad_user_data: ConsentState
  analytics_storage: ConsentState
}

declare global {
  interface Window {
    __assignCookieConsentInitialized?: boolean
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

function consentCookieDomain() {
  const { hostname } = window.location;
  return hostname === "assign.so" || hostname.endsWith(".assign.so") ? ".assign.so" : hostname;
}

function updateGoogleConsent() {
  const analyticsStorage = CookieConsent.acceptedCategory("analytics") ? "granted" : "denied";
  const update: GoogleConsentUpdate = {
    ad_personalization: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    analytics_storage: analyticsStorage,
  };

  if (window.gtag) {
    window.gtag("consent", "update", update);
    return;
  }

  window.dataLayer ??= [];
  window.dataLayer.push(["consent", "update", update]);
}

export function createCookieConsentConfig(): CookieConsent.CookieConsentConfig {
  return {
    mode: "opt-in",
    revision: 1,
    autoClearCookies: true,
    hideFromBots: import.meta.env.PROD,
    cookie: {
      name: "assign_cookie_consent",
      domain: consentCookieDomain(),
      path: "/",
      sameSite: "Lax",
      secure: window.location.protocol === "https:",
      expiresAfterDays: 182,
    },
    guiOptions: {
      consentModal: {
        layout: "cloud inline",
        position: "bottom center",
        equalWeightButtons: true,
        flipButtons: false,
      },
      preferencesModal: {
        layout: "bar wide",
        position: "right",
        equalWeightButtons: true,
        flipButtons: false,
      },
    },
    onFirstConsent: updateGoogleConsent,
    onConsent: updateGoogleConsent,
    onChange: updateGoogleConsent,
    categories: {
      necessary: {
        enabled: true,
        readOnly: true,
      },
      analytics: {
        autoClear: {
          cookies: [
            { name: /^_ga/, domain: consentCookieDomain() },
            { name: "_gid", domain: consentCookieDomain() },
          ],
        },
        services: {
          google_analytics: {
            label: "Google Analytics",
          },
        },
      },
    },
    language: {
      default: "en",
      translations: {
        en: {
          consentModal: {
            title: "Your cookie choices",
            description: "Assign uses necessary cookies to keep the site working. With your permission, Google Analytics can use cookies to help us understand which pages are useful.",
            acceptAllBtn: "Accept analytics",
            acceptNecessaryBtn: "Reject analytics",
            showPreferencesBtn: "Manage preferences",
          },
          preferencesModal: {
            title: "Cookie preferences",
            acceptAllBtn: "Accept analytics",
            acceptNecessaryBtn: "Reject analytics",
            savePreferencesBtn: "Save preferences",
            closeIconLabel: "Close cookie preferences",
            sections: [
              {
                title: "Your privacy choices",
                description: "You can change this choice at any time using Cookie preferences in the site footer.",
              },
              {
                title: "Necessary cookies",
                description: "These remember your cookie choice and support essential site behavior. They cannot be disabled here.",
                linkedCategory: "necessary",
              },
              {
                title: "Analytics",
                description: "Allows analytics cookies for fuller visit and page-interaction measurement. When off, Google may receive cookieless Consent Mode pings. Advertising consent remains denied.",
                linkedCategory: "analytics",
                cookieTable: {
                  caption: "Analytics cookies",
                  headers: {
                    name: "Cookie",
                    domain: "Domain",
                    description: "Purpose",
                  },
                  body: [
                    {
                      name: "_ga, _ga_*",
                      domain: ".assign.so",
                      description: "Distinguishes visits and maintains analytics session state.",
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    },
  };
}

export function initializeCookieConsent() {
  if (window.__assignCookieConsentInitialized) return;

  window.__assignCookieConsentInitialized = true;
  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element
      ? event.target.closest("[data-assign-cookie-preferences]")
      : null;
    if (target) CookieConsent.showPreferences();
  });
  void CookieConsent.run(createCookieConsentConfig());
}
