// Apply an explicit choice before CSS loads, avoiding a flash of unwanted motion.
try {
  const preference = localStorage.getItem('portfolio-motion');
  if (preference === 'full' || preference === 'reduced') {
    document.documentElement.dataset.motion = preference;
  }
} catch {
  // Storage may be unavailable; the device preference still works.
}
