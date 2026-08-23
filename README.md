# satauna.com

Static one-page site for Satauna Howery, voice actor. Built to be hosted on GitHub Pages.

## Structure

- `index.html` - the whole site (single page)
- `assets/css/style.css` - all page styles
- `assets/js/main.js` - small progressive enhancement (auto-updates the footer copyright year)
- `assets/images/` - logo, headshot, favicon
- `assets/audio/` - the six demo mp3s used on the site
- `assets/audio/` - locally hosted demo files used by the compact custom audio players and download links

## Accessibility

Built for real screen reader and keyboard use, not just visual compliance:

- Proper heading hierarchy (one `h1`, `h2` per section, `h3` per demo)
- Real alt text on every image
- No autoplay or auto-scrolling anything
- Skip-to-content link
- Visible keyboard focus outlines on every interactive element
- Compact demo players use native HTML audio with custom, keyboard-accessible Play/Pause, seek, and clearly labeled site-wide volume controls
- Labeled form fields on the contact form

## Known open items (see project brief)

- Client logo wall: intentionally left out of this build for now.
- Headshot and logo files should get a final confirmation pass before launch.
- Once the site is confirmed working on GitHub Pages, point the `satauna.com` domain at it.
