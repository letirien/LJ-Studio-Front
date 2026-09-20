export const PRIMARY_COLOR = '#fa6218';

const SECTION_COLORS = {
  white: '#ffffff',
  orange: PRIMARY_COLOR,
  black: '#000000',
};

const SECTION_SELECTOR = '.browser-color-white, .browser-color-orange, .browser-color-black, [data-browser-color], section.white, section.orange, section.black, footer.white, footer.orange, footer.black';
let overrideSequence = 0;

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
  setBrowserChromeColors(color, color);
};

export const setBrowserChromeColors = (topColor, bottomColor) => {
  if (typeof document === 'undefined') return;

  getThemeColorMeta().setAttribute('content', bottomColor);
  document.documentElement.style.setProperty('--browser-chrome-color', topColor);
  document.documentElement.style.setProperty('--browser-chrome-top-color', topColor);
  document.documentElement.style.setProperty('--browser-chrome-bottom-color', bottomColor);
};

export const startBrowserChromeOverride = (color, key) => {
  if (typeof document === 'undefined') return () => {};

  const root = document.documentElement;
  const themeColorMeta = getThemeColorMeta();
  const overrideId = `${key}-${++overrideSequence}`;
  const previous = {
    key: root.dataset.browserChromeOverride,
    id: root.dataset.browserChromeOverrideId,
    themeColor: themeColorMeta.getAttribute('content'),
    topColor: root.style.getPropertyValue('--browser-chrome-top-color'),
    bottomColor: root.style.getPropertyValue('--browser-chrome-bottom-color'),
  };

  root.dataset.browserChromeOverride = key;
  root.dataset.browserChromeOverrideId = overrideId;
  setBrowserChromeColors(color, color);

  return () => {
    if (root.dataset.browserChromeOverrideId !== overrideId) return;

    window.setTimeout(() => {
      if (root.dataset.browserChromeOverrideId !== overrideId) return;

      if (previous.key) root.dataset.browserChromeOverride = previous.key;
      else delete root.dataset.browserChromeOverride;
      if (previous.id) root.dataset.browserChromeOverrideId = previous.id;
      else delete root.dataset.browserChromeOverrideId;
      themeColorMeta.setAttribute('content', previous.themeColor || 'transparent');
      root.style.setProperty('--browser-chrome-top-color', previous.topColor);
      root.style.setProperty('--browser-chrome-bottom-color', previous.bottomColor);
      window.dispatchEvent(new Event('browserchrome:update'));
    }, 220);
  };
};

const getSectionColor = (section) => {
  if (!section) return undefined;

  const colorClass = Object.keys(SECTION_COLORS).find((color) => (
    section.classList.contains(`browser-color-${color}`) || section.classList.contains(color)
  ));
  return SECTION_COLORS[colorClass] || section.dataset.browserColor;
};

const getColorAtViewportEdge = (edge) => {
  const x = Math.max(0, Math.floor(window.innerWidth / 2));
  const paintedElements = document.elementsFromPoint(x, edge);

  for (const element of paintedElements) {
    const section = element.closest?.(SECTION_SELECTOR);
    if (section) return getSectionColor(section);
  }

  const candidates = [...document.querySelectorAll(SECTION_SELECTOR)]
    .filter((section) => {
      const rect = section.getBoundingClientRect();
      return rect.left <= x && rect.right >= x && rect.top <= edge && rect.bottom >= edge;
    });

  return getSectionColor(candidates.at(-1));
};

export const getVisibleSectionColors = () => {
  if (typeof document === 'undefined') return { top: PRIMARY_COLOR, bottom: PRIMARY_COLOR };

  const viewportHeight = window.innerHeight;
  return {
    top: getColorAtViewportEdge(1) || '#000000',
    bottom: getColorAtViewportEdge(viewportHeight - 1) || '#000000',
  };
};

export const getVisibleSectionColor = () => {
  return getVisibleSectionColors().top;
};