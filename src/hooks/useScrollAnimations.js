import { useEffect } from 'react';

/**
 * useScrollAnimations
 * High-performance IntersectionObserver hook that powers smooth
 * scroll-triggered reveals, scale-ins, and staggered animations across all sections.
 */
export function useScrollAnimations(dependency) {
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal-on-scroll, .reveal-scale, .reveal-left, .reveal-right, .reveal-fade')
        .forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.12,
    };

    const handleIntersect = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          // Once revealed, unobserve so animation stays locked in place without re-triggering
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    const observeElements = () => {
      const targets = document.querySelectorAll(
        '.reveal-on-scroll, .reveal-scale, .reveal-left, .reveal-right, .reveal-fade'
      );
      targets.forEach((el) => {
        if (!el.classList.contains('is-revealed')) {
          observer.observe(el);
        }
      });
    };

    // Initial observation
    observeElements();

    // Re-observe after a short delay for dynamic components that mount data asynchronously
    const timer = setTimeout(observeElements, 400);

    // MutationObserver to automatically catch newly injected cards/components
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [dependency]);
}
