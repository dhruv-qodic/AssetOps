import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { ImportAssetsModal } from '@/components/assets/ImportAssetsModal';
import { useAssetStore } from '@/store/useAssetStore';
import * as assetImportUtils from '@/utils/assetImport';

describe('ImportAssetsModal Component', () => {
  beforeEach(() => {
    cleanup();
    // Reset store state
    useAssetStore.setState({
      isImportModalOpen: true,
      assets: [
        {
          id: 'ast_existing',
          assetId: 'A1000',
          name: 'Existing Device',
          category: 'Laptop',
          status: 'Available',
          location: 'Headquarters',
          serialNumber: 'SN-STORE-EXISTING',
          purchaseDate: '2023-01-01',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
      ],
    });
  });

  afterEach(() => {
    cleanup();
    useAssetStore.setState({
      isImportModalOpen: false,
    });
  });

  it('should render the Import modal dialog with header, dropzone, and template actions', () => {
    render(<ImportAssetsModal />);

    expect(screen.getByRole('heading', { name: 'Import Assets' })).toBeInTheDocument();
    expect(
      screen.getByText(/Upload CSV or Excel spreadsheets to bulk import/i),
    ).toBeInTheDocument();
    expect(screen.getByText('Template (.csv)')).toBeInTheDocument();
    expect(screen.getByText('(.xlsx)')).toBeInTheDocument();
    expect(screen.getByText('Browse Files')).toBeInTheDocument();
    expect(screen.getByText(/Drag & drop your CSV or Excel/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /import assets/i })).toBeInTheDocument();
  });

  it('should trigger template downloads when clicking template buttons', () => {
    const downloadSpy = vi.spyOn(assetImportUtils, 'downloadSampleTemplate');
    render(<ImportAssetsModal />);

    const csvBtn = screen.getByText('Template (.csv)');
    fireEvent.click(csvBtn);
    expect(downloadSpy).toHaveBeenCalledWith('csv');

    const xlsxBtn = screen.getByText('(.xlsx)');
    fireEvent.click(xlsxBtn);
    expect(downloadSpy).toHaveBeenCalledWith('xlsx');

    downloadSpy.mockRestore();
  });

  it('should process uploaded CSV file, display summary metrics, and preview rows', async () => {
    render(<ImportAssetsModal />);

    const csvContent =
      'Asset ID,Asset Name,Category,Status,Location,Serial Number,Purchase Date,Purchase Cost\n' +
      'A2001,MacBook Air M2,Laptop,Available,Headquarters,SN-MAC-2001,2024-01-15,1199\n' +
      'A2002,Dell UltraSharp,Monitor,Available,New York Office,SN-DEL-2002,2024-02-10,499';

    const file = new File([csvContent], 'assets_batch.csv', { type: 'text/csv' });
    const fileInput = screen.getByTestId('file-upload-input');

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getAllByText('assets_batch.csv').length).toBeGreaterThan(0);
      expect(screen.getByText('MacBook Air M2')).toBeInTheDocument();
      expect(screen.getByText('Dell UltraSharp')).toBeInTheDocument();
      expect(screen.getByText('A2001')).toBeInTheDocument();
      expect(screen.getByText('A2002')).toBeInTheDocument();
    });

    // Summary cards & footer summary
    expect(screen.getByText('Total Rows')).toBeInTheDocument();
    expect(screen.getByText(/assets ready for import/i)).toBeInTheDocument();
    expect(screen.getAllByText(/ready/i).length).toBeGreaterThan(0);
  });

  it('should detect invalid and duplicate rows and show accurate badges and issues', async () => {
    render(<ImportAssetsModal />);

    const csvContent =
      'Asset ID,Asset Name,Category,Status,Location,Serial Number,Purchase Date,Purchase Cost\n' +
      'A3001,Valid Device,Laptop,Available,Headquarters,SN-VAL-01,2024-01-15,1000\n' +
      'A1000,Duplicate ID,Laptop,Available,Headquarters,SN-DUP-01,2024-01-15,1000\n' + // Duplicate store assetId A1000
      'A3003,Bad Category Device,InvalidCategory,Available,Headquarters,SN-BAD-01,2024-01-15,1000';

    const file = new File([csvContent], 'test_mixed.csv', { type: 'text/csv' });
    const fileInput = screen.getByTestId('file-upload-input');

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('Valid Device')).toBeInTheDocument();
      expect(screen.getByText('Duplicate ID')).toBeInTheDocument();
      expect(screen.getByText('Bad Category Device')).toBeInTheDocument();
    });

    // Tab buttons & badges
    expect(screen.getByText('All (3)')).toBeInTheDocument();
    expect(screen.getByText('Ready (1)')).toBeInTheDocument();
    expect(screen.getByText('Invalid (1)')).toBeInTheDocument();
    expect(screen.getByText('Duplicates (1)')).toBeInTheDocument();

    // Check duplicate issue message
    expect(
      screen.getAllByText(/Asset ID "A1000" already exists in AssetOps store/i).length,
    ).toBeGreaterThanOrEqual(1);

    // Check invalid category issue message
    expect(
      screen.getAllByText(/Invalid category "InvalidCategory"/i).length,
    ).toBeGreaterThanOrEqual(1);
  });

  it('should filter preview table when switching tabs or using preview search', async () => {
    render(<ImportAssetsModal />);

    const csvContent =
      'Asset ID,Asset Name,Category,Status,Location,Serial Number,Purchase Date,Purchase Cost\n' +
      'A4001,Ready Laptop,Laptop,Available,Headquarters,SN-RDY-01,2024-01-15,1000\n' +
      'A4002,,Laptop,Available,Headquarters,SN-INV-01,2024-01-15,500'; // Missing name -> Invalid

    const file = new File([csvContent], 'filter_test.csv', { type: 'text/csv' });
    const fileInput = screen.getByTestId('file-upload-input');

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('Ready Laptop')).toBeInTheDocument();
    });

    // Switch to Invalid tab
    const invalidTab = screen.getByText('Invalid (1)');
    fireEvent.click(invalidTab);

    expect(screen.queryByText('Ready Laptop')).not.toBeInTheDocument();
    expect(screen.getByText('A4002')).toBeInTheDocument();

    // Switch back to All
    fireEvent.click(screen.getByText('All (2)'));
    expect(screen.getByText('Ready Laptop')).toBeInTheDocument();

    // Search
    const searchInput = screen.getByPlaceholderText('Search parsed records...');
    fireEvent.change(searchInput, { target: { value: 'A4001' } });

    expect(screen.getByText('Ready Laptop')).toBeInTheDocument();
    expect(screen.queryByText('A4002')).not.toBeInTheDocument();
  });

  it('should allow uploading multiple files and removing an individual uploaded file', async () => {
    render(<ImportAssetsModal />);

    const csv1 =
      'Asset ID,Asset Name,Category,Status,Location,Serial Number,Purchase Date,Purchase Cost\n' +
      'A5001,MacBook Pro 16,Laptop,Available,Headquarters,SN-F1,2024-01-01,1000\n' +
      'A5002,MacBook Air M3,Laptop,Available,Headquarters,SN-F2,2024-01-01,1200';
    const csv2 =
      'Asset ID,Asset Name,Category,Status,Location,Serial Number,Purchase Date,Purchase Cost\n' +
      'A5003,Dell Monitor 4K,Monitor,Available,Headquarters,SN-F3,2024-01-01,500\n' +
      'A5004,LG UltraFine,Monitor,Available,Headquarters,SN-F4,2024-01-01,600';

    const file1 = new File([csv1], 'file_a.csv', { type: 'text/csv' });
    const file2 = new File([csv2], 'file_b.csv', { type: 'text/csv' });

    const fileInput = screen.getByTestId('file-upload-input');

    // Upload first file
    fireEvent.change(fileInput, { target: { files: [file1] } });
    await waitFor(() => {
      expect(screen.getAllByText('file_a.csv').length).toBeGreaterThan(0);
      expect(screen.getByText('MacBook Pro 16')).toBeInTheDocument();
      expect(screen.getByText('MacBook Air M3')).toBeInTheDocument();
    });

    // Upload second file (appending)
    fireEvent.change(fileInput, { target: { files: [file2] } });
    await waitFor(() => {
      expect(screen.getAllByText('file_b.csv').length).toBeGreaterThan(0);
      expect(screen.getByText('Dell Monitor 4K')).toBeInTheDocument();
      expect(screen.getByText('LG UltraFine')).toBeInTheDocument();
    });

    // Remove file_a
    const removeButtons = screen.getAllByTitle('Remove file');
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('file_a.csv')).not.toBeInTheDocument();
      expect(screen.getAllByText('file_b.csv').length).toBeGreaterThan(0);
      expect(screen.queryByText('MacBook Pro 16')).not.toBeInTheDocument();
      expect(screen.getByText('Dell Monitor 4K')).toBeInTheDocument();
    });
  });

  it('should import only ready records into asset store when clicking Import Assets', async () => {
    render(<ImportAssetsModal />);

    const csvContent =
      'Asset ID,Asset Name,Category,Status,Location,Serial Number,Purchase Date,Purchase Cost\n' +
      'A6001,Dell XPS 15,Laptop,Available,Headquarters,SN-XPS-01,2024-01-15,1799\n' +
      'A1000,Duplicate Device,Laptop,Available,Headquarters,SN-DUP-X,2024-01-15,1000'; // duplicate

    const file = new File([csvContent], 'import_exec.csv', { type: 'text/csv' });
    const fileInput = screen.getByTestId('file-upload-input');

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /import 1 asset/i })).toBeInTheDocument();
    });

    const importBtn = screen.getByRole('button', { name: /import 1 asset/i });
    fireEvent.click(importBtn);

    await waitFor(() => {
      // Asset store should have the new asset
      const storeAssets = useAssetStore.getState().assets;
      const importedAsset = storeAssets.find((a) => a.assetId === 'A6001');
      expect(importedAsset).toBeDefined();
      expect(importedAsset?.name).toBe('Dell XPS 15');
      expect(importedAsset?.purchaseCost).toBe(1799);
      // Duplicate asset should not have been added
      expect(storeAssets.filter((a) => a.assetId === 'A1000')).toHaveLength(1);
      // Modal should be closed
      expect(useAssetStore.getState().isImportModalOpen).toBe(false);
    });
  });

  it('should handle empty file gracefully with error indicator', async () => {
    render(<ImportAssetsModal />);

    const emptyFile = new File([], 'empty.csv', { type: 'text/csv' });
    const fileInput = screen.getByTestId('file-upload-input');

    fireEvent.change(fileInput, { target: { files: [emptyFile] } });

    await waitFor(() => {
      expect(screen.getByText('empty.csv')).toBeInTheDocument();
      expect(screen.getByText(/File is empty/i)).toBeInTheDocument();
    });
  });
});
