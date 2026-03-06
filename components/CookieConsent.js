"use client";

import { useEffect } from "react";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import * as CookieConsent from "vanilla-cookieconsent";
import { useSiteReady } from "../lib/SiteReadyContext";

export function hasAnalyticsConsent() {
  return CookieConsent.acceptedCategory("analytics");
}

export default function CookieBanner({ onConsentChange }) {
  const { siteReady } = useSiteReady();

  useEffect(() => {
    if (!siteReady) return;
    CookieConsent.run({
      guiOptions: {
        consentModal: {
          layout: "box inline",
          position: "bottom left",
          border: "none"
        },
        preferencesModal: {
          layout: "box",
        },
      },

      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {
          enabled: false,
          autoClear: {
            cookies: [
              { name: /^_ga/ },
              { name: "_gid" },
            ],
          },
        },
      },

      onFirstConsent: ({ cookie }) => {
        onConsentChange(cookie.categories.includes("analytics"));
      },

      onConsent: ({ cookie }) => {
        onConsentChange(cookie.categories.includes("analytics"));
      },

      onChange: ({ cookie }) => {
        onConsentChange(cookie.categories.includes("analytics"));
      },

      language: {
        default: "en",
        translations: {
          en: {
            consentModal: {
              title: "We use cookies",
              description:
                "We use a few analytics cookies to review the game and improve our pitch. No personal scouting, just performance stats. You’re the coach : ",
              acceptAllBtn: "Accept all",
              acceptNecessaryBtn: "Reject all",
              // showPreferencesBtn: "Manage preferences",
            },
            // preferencesModal: {
            //   title: "Cookie Preferences",
            //   acceptAllBtn: "Accept all",
            //   acceptNecessaryBtn: "Reject all",
            //   savePreferencesBtn: "Save preferences",
            //   sections: [
            //     {
            //       title: "Strictly necessary cookies",
            //       description:
            //         "These cookies are essential for the website to function and cannot be disabled.",
            //       linkedCategory: "necessary",
            //     },
            //     {
            //       title: "Analytics cookies",
            //       description:
            //         "We use Google Analytics to understand how visitors interact with the website, helping us improve content and performance.",
            //       linkedCategory: "analytics",
            //     },
            //   ],
            // },
          },
        },
      },
    });
  }, [siteReady, onConsentChange]);

  return null;
}
