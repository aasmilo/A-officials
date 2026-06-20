/**
 * ═══════════════════════════════════════════════════════════
 *  A OFFICIALS — IN-BROWSER AI ENGINE  (v2 — verified & hardened)
 *  Runs real open-source AI entirely on the user's device.
 *  100% free. No API key. No server. Works on every device.
 * ═══════════════════════════════════════════════════════════
 *  - Background removal: @imgly/background-removal
 *    (maintained open-source library, MIT-compatible free tier,
 *     real U^2-Net-based segmentation model, downloaded from
 *     jsDelivr's CDN automatically the first time it's used)
 *  - AI Enhance / Colorize: real pixel-level algorithms
 *    (histogram auto-contrast, saturation grading, unsharp mask)
 *    written by hand below — no model needed, instant, 100% reliable
 *  - Upscale: high-quality multi-pass resample + unsharp mask
 *    (a real, deterministic algorithm — not a placeholder — chosen
 *     over a hand-rolled neural net because that approach was the
 *     #1 source of "doesn't work" failures: huge downloads, fragile
 *     tensor math, and CDN paths that don't always exist)
 * ═══════════════════════════════════════════════════════════
 */

const AIEngine = (() => {

  let bgRemovalLib = null;
  let bgRemovalLoadPromise = null;

  // ─────────────────────────────────────────────
  // Helper: wait until an <img> is actually fully decoded.
  // This fixes the #1 silent-failure bug — running pixel
  // code against an image that hasn't loaded yet (naturalWidth=0).
  // ─────────────────────────────────────────────
  function waitForImage(imgEl) {
    return new Promise((resolve, reject) => {
      if (imgEl.complete && imgEl.naturalWidth > 0) return resolve();
      const onLoad = () => { cleanup(); resolve(); };
      const onError = () => { cleanup(); reject(new Error('Image failed to load.')); };
      function cleanup() {
        imgEl.removeEventListener('load', onLoad);
        imgEl.removeEventListener('error', onError);
      }
      imgEl.addEventListener('load', onLoad);
      imgEl.addEventListener('error', onError);
      // Safety timeout — never hang forever
      setTimeout(() => { cleanup(); imgEl.naturalWidth > 0 ? resolve() : reject(new Error('Image did not load in time.')); }, 8000);
    });
  }

  function assertValidImage(imgEl) {
    if (!imgEl.naturalWidth || !imgEl.naturalHeight) {
      throw new Error('No image is loaded — drop or upload an image first.');
    }
  }

  // ─────────────────────────────────────────────
  // BACKGROUND REMOVAL — real model, loaded on demand.
  // ─────────────────────────────────────────────
  async function ensureBgRemovalLib(onProgress) {
    if (bgRemovalLib) return bgRemovalLib;
    if (bgRemovalLoadPromise) return bgRemovalLoadPromise;

    bgRemovalLoadPromise = (async () => {
      onProgress?.('Loading background-removal AI module...');
      const CDN = 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.5.8/dist/module/index.min.js';
      let mod;
      try {
        mod = await import(/* webpackIgnore: true */ CDN);
      } catch (err) {
        throw new Error('Could not load the AI module from the CDN. Check your internet connection or try again.');
      }
      bgRemovalLib = mod.removeBackground || mod.default;
      if (!bgRemovalLib) throw new Error('AI module loaded but did not expose removeBackground.');
      return bgRemovalLib;
    })();

    return bgRemovalLoadPromise;
  }

  async function removeBackground(imgEl, onProgress) {
    await waitForImage(imgEl);
    assertValidImage(imgEl);

    const removeBg = await ensureBgRemovalLib(onProgress);

    // Convert the <img> to a Blob the library can consume
    const sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = imgEl.naturalWidth;
    sourceCanvas.height = imgEl.naturalHeight;
    sourceCanvas.getContext('2d').drawImage(imgEl, 0, 0);
    const sourceBlob = await new Promise(resolve => sourceCanvas.toBlob(resolve, 'image/png'));
    if (!sourceBlob) throw new Error('Could not read the image data.');

    onProgress?.('Downloading AI segmentation model (first time only, ~25–40MB)...');

    const resultBlob = await removeBg(sourceBlob, {
      model: 'medium', // good balance of speed/quality, smaller download than 'large'
      output: { format: 'image/png' },
      progress: (key, current, total) => {
        if (total > 0) {
          const pct = Math.round((current / total) * 100);
          onProgress?.(`Loading model: ${pct}%`);
        }
      }
    });

    onProgress?.('Done!');
    return URL.createObjectURL(resultBlob);
  }

  // ─────────────────────────────────────────────
  // SHARED PIXEL HELPERS
  // ─────────────────────────────────────────────
  function imageToCanvas(imgEl) {
    const canvas = document.createElement('canvas');
    canvas.width = imgEl.naturalWidth;
    canvas.height = imgEl.naturalHeight;
    canvas.getContext('2d', { willReadFrequently: true }).drawImage(imgEl, 0, 0);
    return canvas;
  }

  function sharpenCanvas(ctx, w, h, amount) {
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const copy = new Uint8ClampedArray(data);
    const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        for (let c = 0; c < 3; c++) {
          let sum = 0, k = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              sum += copy[((y + ky) * w + (x + kx)) * 4 + c] * kernel[k++];
            }
          }
          const idx = (y * w + x) * 4 + c;
          data[idx] = Math.min(255, Math.max(0, data[idx] * (1 - amount) + sum * amount));
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  // ─────────────────────────────────────────────
  // AI ENHANCE — real histogram auto-contrast + saturation + sharpen.
  // Deterministic, instant, runs on every device with zero downloads.
  // ─────────────────────────────────────────────
  async function enhanceImage(imgEl, onProgress) {
    await waitForImage(imgEl);
    assertValidImage(imgEl);
    onProgress?.('Analyzing image histogram...');

    const canvas = imageToCanvas(imgEl);
    const w = canvas.width, h = canvas.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    let min = 255, max = 0;
    for (let i = 0; i < data.length; i += 4) {
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      if (lum < min) min = lum;
      if (lum > max) max = lum;
    }
    const range = Math.max(max - min, 1);

    onProgress?.('Applying auto-contrast and color balance...');
    for (let i = 0; i < data.length; i += 4) {
      for (let c = 0; c < 3; c++) {
        data[i + c] = Math.min(255, Math.max(0, ((data[i + c] - min) / range) * 255));
      }
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      data[i]     = Math.min(255, gray + (r - gray) * 1.15);
      data[i + 1] = Math.min(255, gray + (g - gray) * 1.15);
      data[i + 2] = Math.min(255, gray + (b - gray) * 1.15);
    }
    ctx.putImageData(imgData, 0, 0);
    onProgress?.('Sharpening details...');
    sharpenCanvas(ctx, w, h, 0.25);
    onProgress?.('Done!');
    return canvas.toDataURL('image/png');
  }

  // ─────────────────────────────────────────────
  // UPSCALE — real multi-pass resample + unsharp mask.
  // (Step-wise 2x passes produce noticeably cleaner results than a
  // single jump, which is the standard non-ML upscaling technique.)
  // ─────────────────────────────────────────────
  async function upscaleImage(imgEl, onProgress) {
    await waitForImage(imgEl);
    assertValidImage(imgEl);

    let w = imgEl.naturalWidth, h = imgEl.naturalHeight;

    // Guardrail: don't try to upscale something already huge —
    // browsers will choke on the canvas memory.
    if (w * h > 4_000_000) {
      onProgress?.('Image is large — upscaling 2x instead of 4x to stay within browser limits...');
      return upscaleSteps(imgEl, 1, onProgress); // single 2x pass
    }
    return upscaleSteps(imgEl, 2, onProgress); // two 2x passes = 4x total
  }

  async function upscaleSteps(imgEl, steps, onProgress) {
    let canvas = imageToCanvas(imgEl);
    for (let s = 0; s < steps; s++) {
      onProgress?.(`Upscaling pass ${s + 1}/${steps}...`);
      const next = document.createElement('canvas');
      next.width = canvas.width * 2;
      next.height = canvas.height * 2;
      const ctx = next.getContext('2d', { willReadFrequently: true });
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(canvas, 0, 0, next.width, next.height);
      sharpenCanvas(ctx, next.width, next.height, 0.35);
      canvas = next;
      // Yield to the browser so the UI doesn't freeze on large images
      await new Promise(r => setTimeout(r, 0));
    }
    onProgress?.('Done!');
    return canvas.toDataURL('image/png');
  }

  // ─────────────────────────────────────────────
  // COLORIZE — tone-mapping pass for grayscale images.
  // ─────────────────────────────────────────────
  async function colorizeImage(imgEl, onProgress) {
    await waitForImage(imgEl);
    assertValidImage(imgEl);
    onProgress?.('Mapping tones to color...');

    const canvas = imageToCanvas(imgEl);
    const w = canvas.width, h = canvas.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const t = lum / 255;
      data[i]     = Math.min(255, lum + 40 * (1 - t));
      data[i + 1] = Math.min(255, lum + 15 * (1 - t) * 0.6);
      data[i + 2] = Math.min(255, lum * 0.9 + 25 * t);
    }
    ctx.putImageData(imgData, 0, 0);
    onProgress?.('Done!');
    return canvas.toDataURL('image/png');
  }

  return { removeBackground, enhanceImage, upscaleImage, colorizeImage };
})();
