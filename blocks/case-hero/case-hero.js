import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Case Hero.
 * Row 1, banner: | image | link the banner opens (optional) |
 *   The campaign banner is shown as supplied, full width, with its own artwork text.
 * Row 2, intro: | heading, lede, a bold link (button), a plain link |
 *   When a banner is present the heading is kept for search and screen readers
 *   but hidden on screen, because the banner already shows the headline.
 * @param {Element} block The case-hero block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const bannerRow = rows.find((r) => r.querySelector('picture, img'));
  const introRow = rows.find((r) => r !== bannerRow);

  if (bannerRow) {
    bannerRow.className = 'case-hero-banner';
    const [imageCell, linkCell] = bannerRow.children;
    const img = imageCell.querySelector('img');
    const link = linkCell?.querySelector('a');
    const picture = createOptimizedPicture(img.src, img.alt, true, [
      { media: '(min-width: 1200px)', width: '1920' },
      { media: '(min-width: 600px)', width: '1200' },
      { width: '750' },
    ]);
    const pic = picture.querySelector('img');
    pic.width = 1920;
    pic.height = 800;

    const media = document.createElement(link ? 'a' : 'div');
    media.className = 'case-hero-media';
    if (link) {
      media.href = link.getAttribute('href');
      media.setAttribute('aria-label', link.textContent.trim());
    }
    media.append(picture);
    bannerRow.replaceChildren(media);
    block.classList.add('has-banner');
  }

  if (introRow) {
    introRow.className = 'case-hero-intro';
    const text = introRow.firstElementChild;
    text.classList.add('case-hero-text');
    if (bannerRow) text.querySelector('h1')?.classList.add('case-hero-sr-only');

    const linkParas = [...text.querySelectorAll(':scope > p')]
      .filter((p) => p.classList.contains('button-wrapper')
        || (p.children.length === 1 && p.querySelector('a')
          && p.textContent.trim() === p.querySelector('a').textContent.trim()));
    if (linkParas.length) {
      const actions = document.createElement('div');
      actions.className = 'case-hero-actions';
      linkParas[0].before(actions);
      linkParas.forEach((p) => actions.append(p));
    }
  }
}
