import React from 'react';

/**
 * FontPreloader is a hidden component designed to force the browser to preload
 * the primary and secondary fonts used throughout the site. By applying the
 * font families to elements that are in the DOM but not visible to the user,
 * we ensure that when these fonts are actually needed for visible text,
 * they are already downloaded and cached, preventing a "flash of unstyled text" (FOUT).
 *
 * It is styled to be completely invisible and to not affect the layout in any way,
 * using absolute positioning, zero dimensions, and negative z-index.
 */
const FontPreloader = () => {
  return (
    <div className="absolute -z-10 invisible h-0 w-0 overflow-hidden opacity-0">
      {/* This span preloads the primary sans-serif font. */}
      <span className="font-sans">.</span>
      
      {/* This span preloads the secondary monospace font. */}
      <span className="font-mono">.</span>
    </div>
  );
};

export default FontPreloader;