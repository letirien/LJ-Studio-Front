export const PRIMARY_COLOR = '#fa6218';

const getThemeColorMeta = () => {
  let meta = document.querySelector('meta[name="theme-color"]');

  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
  }

  return meta;
};

export const setBrowserChromeColor = (color) => {
  if (typeof document === 'undefined') return;

  getThemeColorMeta().setAttribute('content', color);
  document.documentElement.style.setProperty('--browser-chrome-color', color);
};

export const startBrowserChromeOverride = (color, key) => {
  if (typeof document === 'undefined') return () => {};

  const root = document.documentElement;
  const body = document.body;
  const previous = {
    key: root.dataset.browserChromeOverride,
    rootBackground: root.style.backgroundColor,
    bodyBackground: body.style.backgroundColor,
  };

  root.dataset.browserChromeOverride = key;
  root.style.backgroundColor = color;
  body.style.backgroundColor = color;
  setBrowserChromeColor(color);

  return () => {
    if (root.dataset.browserChromeOverride !== key) return;

    if (previous.key) root.dataset.browserChromeOverride = previous.key;
    else delete root.dataset.browserChromeOverride;
    root.style.backgroundColor = previous.rootBackground;
    body.style.backgroundColor = previous.bodyBackground;
  };
};

export const getVisibleSectionColor = () => {
  if (typeof document === 'undefined') return PRIMARY_COLOR;

  const viewportCenter = window.innerHeight / 2;
  const visibleSections = [...document.querySelectorAll('[data-browser-color]')]
    .filter((section) => {
      const { top, bottom } = section.getBoundingClientRect();
      return top <= viewportCenter && bottom >= viewportCenter;
    });

  const section = visibleSections.at(-1);
  return section?.dataset.browserColor || '#000000';
};