import { useEffect } from 'react';
import { getVisibleSectionColor, setBrowserChromeColor } from './browserChrome';

export function useBrowserChromeColor() {
  useEffect(() => {
    let rafId;

    const updateColor = () => {
      rafId = undefined;
      if (document.documentElement.dataset.browserChromeOverride) return;
      setBrowserChromeColor(getVisibleSectionColor());
    };

    const scheduleUpdate = () => {
      if (!rafId) rafId = requestAnimationFrame(updateColor);
    };

    updateColor();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
}