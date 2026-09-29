/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-deprecated */
import { describe, it, expect, vi } from 'vitest';
import {
  getAssetReferenceUrl,
  generateAssetQrPayload,
  copyToClipboard,
  downloadCanvasAsPng,
} from '../qrCode';
import type { Asset } from '@/types/asset';

const mockAsset: Asset = {
  id: 'ast_1001',
  assetId: 'A1001',
  name: 'MacBook Pro 16',
  model: 'M3 Max',
  category: 'Laptop',
  status: 'Allocated',
  location: 'Headquarters',
  serialNumber: 'MBP-2024-9988',
  purchaseDate: '2024-01-15',
  createdAt: '2024-01-15T08:00:00Z',
  updatedAt: '2024-01-15T08:00:00Z',
};

describe('utils/qrCode', () => {
  describe('getAssetReferenceUrl', () => {
    it('should generate asset-specific URL with custom baseUrl', () => {
      const url = getAssetReferenceUrl(mockAsset, 'https://app.assetops.com');
      expect(url).toBe('https://app.assetops.com/assets/A1001');
    });

    it('should strip trailing slash from baseUrl', () => {
      const url = getAssetReferenceUrl(mockAsset, 'https://app.assetops.com/');
      expect(url).toBe('https://app.assetops.com/assets/A1001');
    });

    it('should handle special characters in assetId by encoding', () => {
      const assetWithSpecialId = { ...mockAsset, assetId: 'A#1001&special' };
      const url = getAssetReferenceUrl(assetWithSpecialId, 'https://app.assetops.com');
      expect(url).toBe('https://app.assetops.com/assets/A%231001%26special');
    });
  });

  describe('generateAssetQrPayload', () => {
    it('should return asset-specific URL format by default', () => {
      const payload = generateAssetQrPayload(mockAsset, 'url', 'https://app.assetops.com');
      expect(payload).toBe('https://app.assetops.com/assets/A1001');
    });

    it('should return valid JSON string when json format is requested', () => {
      const payload = generateAssetQrPayload(mockAsset, 'json', 'https://app.assetops.com');
      const parsed = JSON.parse(payload) as Record<string, unknown>;
      expect(parsed).toEqual({
        id: 'ast_1001',
        assetId: 'A1001',
        name: 'MacBook Pro 16',
        model: 'M3 Max',
        category: 'Laptop',
        serialNumber: 'MBP-2024-9988',
        url: 'https://app.assetops.com/assets/A1001',
      });
    });
  });

  describe('copyToClipboard', () => {
    it('should return false if text is empty', async () => {
      const result = await copyToClipboard('');
      expect(result).toBe(false);
    });

    it('should use navigator.clipboard.writeText if available', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock,
        },
      });

      const result = await copyToClipboard('https://app.assetops.com/assets/A1001');
      expect(result).toBe(true);
      expect(writeTextMock).toHaveBeenCalledWith('https://app.assetops.com/assets/A1001');
    });

    it('should fallback to execCommand if clipboard.writeText fails', async () => {
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn().mockRejectedValue(new Error('Permission denied')),
        },
      });

      const execCommandMock = vi.fn().mockReturnValue(true);
      document.execCommand = execCommandMock;

      const result = await copyToClipboard('test text');
      expect(result).toBe(true);
      expect(execCommandMock).toHaveBeenCalledWith('copy');
    });
  });

  describe('downloadCanvasAsPng', () => {
    it('should return false if canvas is null', () => {
      const result = downloadCanvasAsPng(null, 'test');
      expect(result).toBe(false);
    });

    it('should convert canvas to dataURL and click download link', () => {
      const mockCanvas = document.createElement('canvas');
      mockCanvas.toDataURL = vi.fn().mockReturnValue('data:image/png;base64,mockPngData');

      const clickMock = vi.fn();
      const originalCreate = document.createElement.bind(document);

      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const el = originalCreate(tagName);
        if (tagName.toLowerCase() === 'a') {
          el.click = clickMock;
        }
        return el;
      });

      const result = downloadCanvasAsPng(mockCanvas, 'qrcode-A1001');
      expect(result).toBe(true);
      expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png');
      expect(clickMock).toHaveBeenCalled();
    });
  });
});
