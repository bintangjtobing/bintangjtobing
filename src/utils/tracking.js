/**
 * Event tracking utility
 * Google Analytics 4: G-DF2X2QR346
 * Microsoft Clarity: ofg8k8jiyr
 *
 * Detailed model: every action emits a specific, self-descriptive GA4 event
 * name (e.g. click_hero_linkedin, view_section_projects, toggle_theme_dark)
 * so events are readable in GA4 directly, without breaking down by label.
 * Extra context rides along as parameters.
 */

function gtag() {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...arguments);
  }
}

// Low-level: emit a specific event by name with optional params.
export function trackEvent(eventName, params = {}) {
  gtag('event', eventName, params);
}

export function trackPageView(page, title) {
  gtag('event', 'page_view', { page_path: page, page_title: title });
}

// 'experience' -> view_section_experience
export function trackSectionView(sectionId) {
  gtag('event', `view_section_${sectionId}`, { section_name: sectionId });
}

// 'dark' -> toggle_theme_dark
export function trackThemeToggle(theme) {
  gtag('event', `toggle_theme_${theme}`, { theme });
}

// 'id' -> switch_lang_id
export function trackLanguageSwitch(lang) {
  gtag('event', `switch_lang_${lang}`, { language: lang });
}

// 75 -> scroll_75
export function trackScrollDepth(percent) {
  gtag('event', `scroll_${percent}`, { percent, value: percent });
}

// 'open' -> cv_menu_open, 'close' -> cv_menu_close
export function trackCvMenu(state, params = {}) {
  gtag('event', `cv_menu_${state}`, { state, ...params });
}

// 'fullstack' -> download_cv_fullstack (also fires a generic file_download for GA4 reporting)
export function trackCvDownload(cvType, params = {}) {
  const payload = { cv_type: cvType, ...params };
  gtag('event', `download_cv_${cvType}`, payload);
  // GA4 recommended event so all CV downloads roll up under one report too.
  gtag('event', 'file_download', {
    file_extension: 'pdf',
    link_text: `CV ${cvType}`,
    ...payload,
  });
}
