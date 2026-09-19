import { useEffect } from 'react';
import { useLenis } from 'lenis/react';

export function useViewportLock(active) {
	const lenis = useLenis();

	useEffect(() => {
		if (!active || typeof window === 'undefined') return undefined;

		const html = document.documentElement;
		const body = document.body;
		const scrollY = window.scrollY;
		const previous = {
			htmlOverflow: html.style.overflow,
			bodyOverflow: body.style.overflow,
			bodyPosition: body.style.position,
			bodyTop: body.style.top,
			bodyWidth: body.style.width,
			bodyOverscrollBehavior: body.style.overscrollBehavior,
		};

		lenis?.stop?.();
		html.style.overflow = 'hidden';
		body.style.overflow = 'hidden';
		body.style.position = 'fixed';
		body.style.top = `-${scrollY}px`;
		body.style.width = '100%';
		body.style.overscrollBehavior = 'none';

		return () => {
			lenis?.start?.();
			html.style.overflow = previous.htmlOverflow;
			body.style.overflow = previous.bodyOverflow;
			body.style.position = previous.bodyPosition;
			body.style.top = previous.bodyTop;
			body.style.width = previous.bodyWidth;
			body.style.overscrollBehavior = previous.bodyOverscrollBehavior;
			window.scrollTo(0, scrollY);
		};
	}, [active, lenis]);
}
