import type { Asset } from '@/types/asset';

/**
 * Generates the reference URL for an asset.
 * Uses window.location.origin when in a browser environment, with a sensible fallback.
 */
export function getAssetReferenceUrl(
  asset: Pick<Asset, 'id' | 'assetId'>,
  baseUrl?: string,
): string {
  let origin = baseUrl;
  if (!origin) {
    if (typeof window !== 'undefined' && Boolean(window.location.origin)) {
      origin = window.location.origin;
    } else {
      origin = 'https://assetops.local';
    }
  }
  // Trim trailing slash from origin if present
  const cleanOrigin = origin.replace(/\/+$/, '');
  const idToUse = asset.assetId || asset.id;
  return `${cleanOrigin}/assets/${encodeURIComponent(idToUse)}`;
}

/**
 * Generates the QR payload string.
 * Supports standard reference URL or structured JSON format.
 */
export function generateAssetQrPayload(
  asset: Pick<Asset, 'id' | 'assetId' | 'name' | 'serialNumber' | 'category' | 'model'>,
  format: 'url' | 'json' = 'url',
  baseUrl?: string,
): string {
  if (format === 'json') {
    return JSON.stringify({
      id: asset.id,
      assetId: asset.assetId,
      name: asset.name,
      model: asset.model || undefined,
      category: asset.category,
      serialNumber: asset.serialNumber,
      url: getAssetReferenceUrl(asset, baseUrl),
    });
  }

  return getAssetReferenceUrl(asset, baseUrl);
}

/**
 * Copies a text string to the user's clipboard.
 * Includes a fallback for environments where navigator.clipboard is not available.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fall back to legacy document.execCommand if clipboard API fails
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}

/**
 * Downloads a canvas element as a PNG image file.
 */
export function downloadCanvasAsPng(
  canvas: HTMLCanvasElement | null,
  fileName: string = 'asset-qr-code',
): boolean {
  if (!canvas) return false;

  try {
    const dataUrl = canvas.toDataURL('image/png');
    const safeName = fileName.endsWith('.png') ? fileName : `${fileName}.png`;

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = safeName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('Failed to download QR code canvas:', err);
    return false;
  }
}
