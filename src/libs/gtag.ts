import { gaTrackingId } from './../config.json';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview: TGaPageview = (url) => {
  window.gtag('config', gaTrackingId, {
    page_path: url,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event: TGaEvent = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
