/**
 * Proof Points: one row per proof. | label | number | supporting line |
 * @param {Element} block The proof-points block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('proof-point');
    const [label, value, text] = row.children;
    label?.classList.add('proof-point-label');
    value?.classList.add('proof-point-value');
    text?.classList.add('proof-point-text');
  });
}
