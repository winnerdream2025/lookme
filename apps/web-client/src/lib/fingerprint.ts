/**
 * Device Fingerprinting Utility
 *
 * Generates a stable device identifier from native browser signals.
 * No external package required — uses navigator, screen, and timezone APIs.
 * Critical for anti-fraud: prevents workers from using multiple accounts on same device.
 */

let cachedFingerprint: string | null = null;

async function buildFingerprint(): Promise<string> {
  if (typeof window === 'undefined') return 'ssr';
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let canvasHash = '';
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('LookMe🔒', 2, 2);
      canvasHash = canvas.toDataURL().slice(-32);
    }
    const signals = [
      navigator.userAgent,
      `${screen.width}x${screen.height}x${screen.colorDepth}`,
      navigator.language,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      String(navigator.hardwareConcurrency ?? ''),
      String((navigator as any).deviceMemory ?? ''),
      canvasHash,
    ].join('|');

    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(signals));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return `fallback-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }
}

/**
 * Get unique device fingerprint — cached after first call.
 */
export async function getDeviceFingerprint(): Promise<string> {
  if (!cachedFingerprint) {
    cachedFingerprint = await buildFingerprint();
  }
  return cachedFingerprint;
}

/**
 * Check if fingerprinting is supported.
 */
export function isFingerprintingSupported(): boolean {
  return typeof window !== 'undefined' && typeof crypto?.subtle !== 'undefined';
}
