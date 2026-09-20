import { useEffect } from 'react';
import { getVisibleSectionColors, setBrowserChromeColors } from './browserChrome';

export function useBrowserChromeColor() {
  useEffect(() => {
    let rafId;

    const updateColor = () => {
      rafId = undefined;
      if (document.documentElement.dataset.browserChromeOverride) return;
      const colors = getVisibleSectionColors();
      setBrowserChromeColors(colors.top, colors.bottom);
    };

    const scheduleUpdate = () => {
      if (!rafId) rafId = requestAnimationFrame(updateColor);
    };

    updateColor();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    const observer = new IntersectionObserver(scheduleUpdate, { threshold: [0, 1] });
    document.querySelectorAll('.browser-color-white, .browser-color-orange, .browser-color-black, [data-browser-color], section.white, section.orange, section.black, footer.white, footer.orange, footer.black')
      .forEach((section) => observer.observe(section));

    const mutationObserver = new MutationObserver(scheduleUpdate);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('browserchrome:update', scheduleUpdate);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      observer.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('browserchrome:update', scheduleUpdate);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
}