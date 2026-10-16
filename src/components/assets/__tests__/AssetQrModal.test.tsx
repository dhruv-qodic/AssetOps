import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AssetQrModal, AssetQrModalCard } from '../AssetQrModal';
import { useAssetStore } from '@/store/useAssetStore';
import { toast } from 'sonner';
import type { Asset } from '@/types/asset';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

const mockAsset: Asset = {
  id: 'ast_2002',
  assetId: 'A2002',
  name: 'Apple Studio Display 27"',
  model: 'Studio Display',
  category: 'Monitor',
  status: 'Available',
  location: 'San Francisco',
  serialNumber: 'ASD-9922-44',
  purchaseDate: '2023-11-01',
  createdAt: '2023-11-01T00:00:00Z',
  updatedAt: '2023-11-01T00:00:00Z',
};

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('AssetQrModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAssetStore.setState({
      selectedAsset: { ...mockAsset },
      isQrModalOpen: true,
      isViewModalOpen: false,
    });
  });

  it('should render asset QR code and asset identifier correctly in standalone modal', () => {
    renderWithRouter(<AssetQrModal />);

    expect(screen.getByText('Asset QR Code')).toBeInTheDocument();
    expect(screen.getAllByText('A2002').length).toBeGreaterThan(0);
    expect(screen.getByText('Apple Studio Display 27"')).toBeInTheDocument();
    expect(screen.getByText('Monitor')).toBeInTheDocument();
    expect(screen.getByText('ASD-9922-44')).toBeInTheDocument();
  });

  it('should copy link to clipboard and show success toast when Copy is clicked', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    renderWithRouter(<AssetQrModal />);

    const copyBtn = screen.getByRole('button', { name: /^copy$/i });
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith(expect.stringContaining('/assets/A2002'));
      expect(toast.success).toHaveBeenCalledWith('Asset link copied to clipboard');
    });
  });

  it('should trigger QR download and toast on download button click', () => {
    // Mock canvas toDataURL
    HTMLCanvasElement.prototype.toDataURL = vi.fn().mockReturnValue('data:image/png;base64,sample');

    renderWithRouter(<AssetQrModalCard asset={mockAsset} onClose={vi.fn()} />);

    const downloadBtn = screen.getByRole('button', { name: /download/i });
    fireEvent.click(downloadBtn);

    expect(toast.success).toHaveBeenCalledWith('QR Code downloaded for A2002');
  });

  it('should toggle payload format and refresh QR code', async () => {
    renderWithRouter(<AssetQrModalCard asset={mockAsset} onClose={vi.fn()} />);

    const formatBtn = screen.getByTitle(/toggle payload encoding format/i);
    expect(screen.getByText('Format: URL')).toBeInTheDocument();

    fireEvent.click(formatBtn);
    expect(screen.getByText('Format: JSON')).toBeInTheDocument();

    const refreshBtn = screen.getByTitle(/refresh qr code/i);
    fireEvent.click(refreshBtn);

    await waitFor(() => {
      expect(toast.info).toHaveBeenCalledWith('QR Code refreshed');
    });
  });

  it('should invoke onClose callback when close button is clicked', () => {
    const onCloseMock = vi.fn();
    renderWithRouter(<AssetQrModalCard asset={mockAsset} onClose={onCloseMock} />);

    const closeBtn = screen.getByLabelText(/close qr modal/i);
    fireEvent.click(closeBtn);

    expect(onCloseMock).toHaveBeenCalled();
  });
});
