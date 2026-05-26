/**
 * Event tracking utility
 * Google Analytics 4: G-DF2X2QR346
 * Microsoft Clarity: ofg8k8jiyr
 */

function gtag() {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...arguments);
  }
}

// ── Core events ──

export function trackPageView(page, title) {
  gtag('event', 'page_view', {
    page_path: page,
    page_title: title,
  });
}

export function trackOutboundLink(url, label) {
  gtag('event', 'click', {
    event_category: 'outbound',
    event_label: label,
    transport_type: 'beacon',
    link_url: url,
  });
}

export function trackSectionView(sectionId) {
  gtag('event', 'section_view', {
    event_category: 'engagement',
    event_label: sectionId,
  });
}

export function trackThemeToggle(theme) {
  gtag('event', 'theme_toggle', {
    event_category: 'preference',
    event_label: theme,
  });
}

export function trackLanguageSwitch(lang) {
  gtag('event', 'language_switch', {
    event_category: 'preference',
    event_label: lang,
  });
}

export function trackCtaClick(ctaName, destination) {
  gtag('event', 'cta_click', {
    event_category: 'conversion',
    event_label: ctaName,
    link_url: destination,
  });
}

export function trackLinksPageClick(groupName, linkLabel, url) {
  gtag('event', 'links_click', {
    event_category: 'links_page',
    event_label: `${groupName} / ${linkLabel}`,
    link_url: url,
  });
}

export function trackScrollDepth(percent) {
  gtag('event', 'scroll_depth', {
    event_category: 'engagement',
    event_label: `${percent}%`,
    value: percent,
  });
}
