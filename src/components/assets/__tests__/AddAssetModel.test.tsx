import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import AddAssetModal from '../AddAssetModal';
import { useAssetStore } from '@/store/useAssetStore';
import type { Asset } from '@/types/asset';

const TEST_ASSET: Asset = {
  id: 'ast_1',
  assetId: 'A1001',
  name: 'MacBook Pro 16',
  model: 'M3 Pro',
  category: 'Laptop',
  status: 'Available',
  serialNumber: 'SN-12345',
  purchaseDate: '2024-01-15',
  purchaseCost: 2500,
  location: 'Headquarters',
  assignedTo: null,
  specifications: {
    Processor: 'Intel Core i7',
    RAM: '18GB',
    Storage: '512GB',
  },
  notes: 'Company laptop',
  createdAt: '2024-01-15T00:00:00.000Z',
  updatedAt: '2024-01-15T00:00:00.000Z',
};

const createValidForm = () => {
  return {
    assetId: 'A2001',
    name: 'Dell Laptop',
    model: 'Latitude 5440',
    serialNumber: 'SN-20001',
    purchaseDate: '2024-05-10',
    notes: 'Test asset',
  };
};

describe('AddAssetModal Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    useAssetStore.setState({
      assets: [TEST_ASSET],
      isAddModalOpen: true,
      isEditModalOpen: false,
      isDeleteModalOpen: false,
      isViewModalOpen: false,
      isImportModalOpen: false,
      isAllocateModalOpen: false,
      selectedAsset: null,
    });
  });

  describe('Add Mode Rendering', () => {
    it('should render the Add New Asset modal', () => {
      render(<AddAssetModal />);

      expect(screen.getByText('Add New Asset')).toBeInTheDocument();
      expect(
        screen.getByText('Fill in the information below to register a new organization asset.'),
      ).toBeInTheDocument();
    });

    it('should render all main asset form fields', () => {
      render(<AddAssetModal />);

      expect(screen.getByPlaceholderText('A1010')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('e.g. Dell Laptop')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('e.g. Latitude 5440, 27-inch')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('SN-078000')).toBeInTheDocument();

      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Location')).toBeInTheDocument();
      expect(screen.getByText('Purchase Date')).toBeInTheDocument();

      expect(
        screen.getByPlaceholderText('Additional inventory details or maintenance notes...'),
      ).toBeInTheDocument();
    });

    it('should render Create Asset button in add mode', () => {
      render(<AddAssetModal />);

      expect(screen.getByRole('button', { name: 'Create Asset' })).toBeInTheDocument();

      expect(screen.queryByRole('button', { name: 'Save Changes' })).not.toBeInTheDocument();
    });

    it('should generate the next asset ID based on asset count', () => {
      render(<AddAssetModal />);

      const assetIdInput = screen.getByPlaceholderText('A1010') as HTMLInputElement;

      expect(assetIdInput.value).toBe('A1002');
    });

    it('should use the default category, status and location values', () => {
      render(<AddAssetModal />);

      const selects = screen.getAllByRole('combobox');

      expect(selects.length).toBeGreaterThanOrEqual(3);
      expect(selects[0]).toHaveTextContent('Laptop');
      expect(selects[1]).toHaveTextContent('Available');
      expect(selects[2]).toHaveTextContent('Headquarters');
    });

    it('should render technical specification empty state initially', () => {
      render(<AddAssetModal />);

      expect(screen.getByText('No technical specifications added yet.')).toBeInTheDocument();

      expect(screen.getByRole('button', { name: 'Load Presets' })).toBeInTheDocument();

      expect(screen.getByRole('button', { name: 'Add Spec Field' })).toBeInTheDocument();
    });
  });

  describe('Modal Controls', () => {
    it('should close the modal when Cancel is clicked', () => {
      render(<AddAssetModal />);

      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(useAssetStore.getState().isAddModalOpen).toBe(false);
      expect(useAssetStore.getState().isEditModalOpen).toBe(false);
      expect(useAssetStore.getState().selectedAsset).toBeNull();
    });

    it('should close the modal through the dialog close handler', () => {
      render(<AddAssetModal />);

      const closeButton = screen.queryByRole('button', { name: /close/i });

      if (closeButton) {
        fireEvent.click(closeButton);

        expect(useAssetStore.getState().isAddModalOpen).toBe(false);
      }
    });

    it('should not render the modal when both modal states are closed', () => {
      useAssetStore.setState({
        isAddModalOpen: false,
        isEditModalOpen: false,
      });

      render(<AddAssetModal />);

      expect(screen.queryByText('Add New Asset')).not.toBeInTheDocument();
      expect(screen.queryByText('Edit Asset')).not.toBeInTheDocument();
    });
  });

  describe('Technical Specifications', () => {
    it('should add an empty specification row', () => {
      render(<AddAssetModal />);

      fireEvent.click(screen.getByRole('button', { name: 'Add Spec Field' }));

      expect(screen.getByPlaceholderText('Property (e.g. Processor, RAM)')).toBeInTheDocument();

      expect(screen.getByPlaceholderText('Value (e.g. 16GB DDR5, M3 Pro)')).toBeInTheDocument();

      expect(screen.queryByText('No technical specifications added yet.')).not.toBeInTheDocument();
    });

    it('should allow editing specification key and value', () => {
      render(<AddAssetModal />);

      fireEvent.click(screen.getByRole('button', { name: 'Add Spec Field' }));

      const keyInput = screen.getByPlaceholderText(
        'Property (e.g. Processor, RAM)',
      ) as HTMLInputElement;

      const valueInput = screen.getByPlaceholderText(
        'Value (e.g. 16GB DDR5, M3 Pro)',
      ) as HTMLInputElement;

      fireEvent.change(keyInput, {
        target: { value: 'Processor' },
      });

      fireEvent.change(valueInput, {
        target: { value: 'M3 Pro' },
      });

      expect(keyInput.value).toBe('Processor');
      expect(valueInput.value).toBe('M3 Pro');
    });

    it('should remove a specification row', () => {
      render(<AddAssetModal />);

      fireEvent.click(screen.getByRole('button', { name: 'Add Spec Field' }));

      expect(screen.getByPlaceholderText('Property (e.g. Processor, RAM)')).toBeInTheDocument();

      fireEvent.click(screen.getByTitle('Remove field'));

      expect(
        screen.queryByPlaceholderText('Property (e.g. Processor, RAM)'),
      ).not.toBeInTheDocument();

      expect(screen.getByText('No technical specifications added yet.')).toBeInTheDocument();
    });

    it('should load Laptop preset specifications', () => {
      render(<AddAssetModal />);

      fireEvent.click(screen.getByRole('button', { name: 'Load Presets' }));

      expect(screen.getAllByDisplayValue('Processor').length).toBeGreaterThan(0);

      expect(screen.getAllByDisplayValue('RAM').length).toBeGreaterThan(0);

      expect(screen.getAllByDisplayValue('Storage').length).toBeGreaterThan(0);
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors when required fields are empty', async () => {
      render(<AddAssetModal />);

      const assetIdInput = screen.getByPlaceholderText('A1010') as HTMLInputElement;

      const nameInput = screen.getByPlaceholderText('e.g. Dell Laptop') as HTMLInputElement;

      const serialInput = screen.getByPlaceholderText('SN-078000') as HTMLInputElement;

      fireEvent.change(assetIdInput, { target: { value: '' } });
      fireEvent.change(nameInput, { target: { value: '' } });
      fireEvent.change(serialInput, { target: { value: '' } });

      fireEvent.click(screen.getByRole('button', { name: 'Create Asset' }));

      expect(await screen.findByText('Asset ID is required')).toBeInTheDocument();

      expect(await screen.findByText('Asset name is required')).toBeInTheDocument();

      expect(await screen.findByText('Serial number is required')).toBeInTheDocument();
    });

    it('should reject an invalid asset ID', async () => {
      render(<AddAssetModal />);

      const assetIdInput = screen.getByPlaceholderText('A1010') as HTMLInputElement;

      fireEvent.change(assetIdInput, {
        target: { value: 'A@#$%' },
      });

      fireEvent.click(screen.getByRole('button', { name: 'Create Asset' }));

      expect(
        await screen.findByText(
          'Asset ID can only contain letters, numbers, hyphens, and underscores',
        ),
      ).toBeInTheDocument();
    });

    it('should reject an asset name shorter than two characters', async () => {
      render(<AddAssetModal />);

      const nameInput = screen.getByPlaceholderText('e.g. Dell Laptop') as HTMLInputElement;

      fireEvent.change(nameInput, {
        target: { value: 'A' },
      });

      fireEvent.click(screen.getByRole('button', { name: 'Create Asset' }));

      expect(
        await screen.findByText('Asset name must be at least 2 characters'),
      ).toBeInTheDocument();
    });

    it('should accept a valid asset ID containing hyphens and underscores', async () => {
      render(<AddAssetModal />);

      const assetIdInput = screen.getByPlaceholderText('A1010') as HTMLInputElement;

      fireEvent.change(assetIdInput, {
        target: { value: 'ASSET_001-TEST' },
      });

      fireEvent.click(screen.getByRole('button', { name: 'Create Asset' }));

      await waitFor(() => {
        expect(
          screen.queryByText(
            'Asset ID can only contain letters, numbers, hyphens, and underscores',
          ),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Create Asset', () => {
    it('should create a new asset with valid form data', async () => {
      render(<AddAssetModal />);

      const form = createValidForm();

      fireEvent.change(screen.getByPlaceholderText('A1010'), { target: { value: form.assetId } });

      fireEvent.change(screen.getByPlaceholderText('e.g. Dell Laptop'), {
        target: { value: form.name },
      });

      fireEvent.change(screen.getByPlaceholderText('e.g. Latitude 5440, 27-inch'), {
        target: { value: form.model },
      });

      fireEvent.change(screen.getByPlaceholderText('SN-078000'), {
        target: { value: form.serialNumber },
      });

      fireEvent.change(
        screen.getByPlaceholderText('Additional inventory details or maintenance notes...'),
        { target: { value: form.notes } },
      );

      fireEvent.click(screen.getByRole('button', { name: 'Create Asset' }));

      await waitFor(() => {
        const assets = useAssetStore.getState().assets;

        expect(assets).toHaveLength(2);

        const createdAsset = assets[0];

        expect(createdAsset.assetId).toBe(form.assetId);
        expect(createdAsset.name).toBe(form.name);
        expect(createdAsset.model).toBe(form.model);
        expect(createdAsset.serialNumber).toBe(form.serialNumber);
        expect(createdAsset.notes).toBe(form.notes);
      });

      expect(useAssetStore.getState().isAddModalOpen).toBe(false);
    });

    it('should add specifications to the created asset', async () => {
      render(<AddAssetModal />);

      fireEvent.change(screen.getByPlaceholderText('A1010'), { target: { value: 'A3001' } });

      fireEvent.change(screen.getByPlaceholderText('e.g. Dell Laptop'), {
        target: { value: 'Test Laptop' },
      });

      fireEvent.change(screen.getByPlaceholderText('SN-078000'), { target: { value: 'SN-30001' } });

      fireEvent.click(screen.getByRole('button', { name: 'Add Spec Field' }));

      const keyInput = screen.getByPlaceholderText('Property (e.g. Processor, RAM)');

      const valueInput = screen.getByPlaceholderText('Value (e.g. 16GB DDR5, M3 Pro)');

      fireEvent.change(keyInput, {
        target: { value: 'RAM' },
      });

      fireEvent.change(valueInput, {
        target: { value: '32GB' },
      });

      fireEvent.click(screen.getByRole('button', { name: 'Create Asset' }));

      await waitFor(() => {
        const createdAsset = useAssetStore.getState().assets[0];

        expect(createdAsset.specifications).toEqual({
          RAM: '32GB',
        });
      });
    });

    it('should ignore specification rows with empty key or value', async () => {
      render(<AddAssetModal />);

      fireEvent.change(screen.getByPlaceholderText('e.g. Dell Laptop'), {
        target: { value: 'Test Laptop' },
      });

      fireEvent.change(screen.getByPlaceholderText('SN-078000'), { target: { value: 'SN-40001' } });

      fireEvent.click(screen.getByRole('button', { name: 'Add Spec Field' }));

      const keyInput = screen.getByPlaceholderText('Property (e.g. Processor, RAM)');

      const valueInput = screen.getByPlaceholderText('Value (e.g. 16GB DDR5, M3 Pro)');

      fireEvent.change(keyInput, {
        target: { value: 'Processor' },
      });

      fireEvent.change(valueInput, {
        target: { value: '   ' },
      });

      fireEvent.click(screen.getByRole('button', { name: 'Create Asset' }));

      await waitFor(() => {
        const createdAsset = useAssetStore.getState().assets[0];

        expect(createdAsset.specifications).toBeUndefined();
      });
    });

    it('should trim specification keys and values before saving', async () => {
      render(<AddAssetModal />);

      fireEvent.change(screen.getByPlaceholderText('e.g. Dell Laptop'), {
        target: { value: 'Trim Test Laptop' },
      });

      fireEvent.change(screen.getByPlaceholderText('SN-078000'), { target: { value: 'SN-50001' } });

      fireEvent.click(screen.getByRole('button', { name: 'Add Spec Field' }));

      fireEvent.change(screen.getByPlaceholderText('Property (e.g. Processor, RAM)'), {
        target: { value: '  Processor  ' },
      });

      fireEvent.change(screen.getByPlaceholderText('Value (e.g. 16GB DDR5, M3 Pro)'), {
        target: { value: '  M3 Pro  ' },
      });

      fireEvent.click(screen.getByRole('button', { name: 'Create Asset' }));

      await waitFor(() => {
        expect(useAssetStore.getState().assets[0].specifications).toEqual({
          Processor: 'M3 Pro',
        });
      });
    });
  });

  describe('Edit Mode', () => {
    beforeEach(() => {
      useAssetStore.setState({
        assets: [TEST_ASSET],
        isAddModalOpen: false,
        isEditModalOpen: true,
        selectedAsset: TEST_ASSET,
      });
    });

    it('should render Edit Asset title', () => {
      render(<AddAssetModal />);

      expect(screen.getByText('Edit Asset')).toBeInTheDocument();

      expect(
        screen.getByText(`Update specifications and details for ${TEST_ASSET.assetId}`),
      ).toBeInTheDocument();
    });

    it('should render Save Changes button in edit mode', () => {
      render(<AddAssetModal />);

      expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();

      expect(screen.queryByRole('button', { name: 'Create Asset' })).not.toBeInTheDocument();
    });

    it('should populate the form with the selected asset data', async () => {
      render(<AddAssetModal />);

      await waitFor(() => {
        expect((screen.getByPlaceholderText('A1010') as HTMLInputElement).value).toBe(
          TEST_ASSET.assetId,
        );

        expect((screen.getByPlaceholderText('e.g. Dell Laptop') as HTMLInputElement).value).toBe(
          TEST_ASSET.name,
        );

        expect(
          (screen.getByPlaceholderText('e.g. Latitude 5440, 27-inch') as HTMLInputElement).value,
        ).toBe(TEST_ASSET.model);

        expect((screen.getByPlaceholderText('SN-078000') as HTMLInputElement).value).toBe(
          TEST_ASSET.serialNumber,
        );
      });
    });

    it('should load existing technical specifications', async () => {
      render(<AddAssetModal />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Processor')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Intel Core i7')).toBeInTheDocument();
        expect(screen.getByDisplayValue('RAM')).toBeInTheDocument();
        expect(screen.getByDisplayValue('18GB')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Storage')).toBeInTheDocument();
        expect(screen.getByDisplayValue('512GB')).toBeInTheDocument();
      });
    });

    it('should update the selected asset when Save Changes is submitted', async () => {
      render(<AddAssetModal />);

      const nameInput = screen.getByPlaceholderText('e.g. Dell Laptop') as HTMLInputElement;

      fireEvent.change(nameInput, {
        target: { value: 'Updated MacBook Pro' },
      });

      fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

      await waitFor(() => {
        const updatedAsset = useAssetStore
          .getState()
          .assets.find((asset) => asset.id === TEST_ASSET.id);

        expect(updatedAsset?.name).toBe('Updated MacBook Pro');
      });

      expect(useAssetStore.getState().isEditModalOpen).toBe(false);
      expect(useAssetStore.getState().selectedAsset).toBeNull();
    });

    it('should not create a new asset when editing', async () => {
      render(<AddAssetModal />);

      fireEvent.change(screen.getByPlaceholderText('e.g. Dell Laptop'), {
        target: { value: 'Updated Asset' },
      });

      fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

      await waitFor(() => {
        expect(useAssetStore.getState().assets).toHaveLength(1);
      });
    });

    it('should handle an asset without specifications', async () => {
      const assetWithoutSpecs: Asset = {
        ...TEST_ASSET,
        specifications: undefined,
      };

      useAssetStore.setState({
        assets: [assetWithoutSpecs],
        isEditModalOpen: true,
        isAddModalOpen: false,
        selectedAsset: assetWithoutSpecs,
      });

      render(<AddAssetModal />);

      await waitFor(() => {
        expect(screen.getByText('No technical specifications added yet.')).toBeInTheDocument();
      });
    });
  });

  describe('Category Based Specification Presets', () => {
    it('should load Monitor specification preset', async () => {
      render(<AddAssetModal />);

      const categorySelect = screen.getAllByRole('combobox')[0];

      fireEvent.click(categorySelect);

      const monitorOption = await screen.findByText('Monitor');
      fireEvent.click(monitorOption);

      fireEvent.click(screen.getByRole('button', { name: 'Load Presets' }));

      expect(screen.getByDisplayValue('Resolution')).toBeInTheDocument();

      expect(screen.getByDisplayValue('Refresh Rate')).toBeInTheDocument();

      expect(screen.getByDisplayValue('Panel')).toBeInTheDocument();
    });

    it('should load a generic Property specification for other categories', async () => {
      render(<AddAssetModal />);

      const categorySelect = screen.getAllByRole('combobox')[0];

      fireEvent.click(categorySelect);

      const otherOption = await screen.findByText('Other');
      fireEvent.click(otherOption);

      fireEvent.click(screen.getByRole('button', { name: 'Load Presets' }));

      expect(screen.getByDisplayValue('Property')).toBeInTheDocument();
    });
  });

  describe('Form Data and Store Behavior', () => {
    it('should keep the asset status as Available by default', async () => {
      render(<AddAssetModal />);

      fireEvent.change(screen.getByPlaceholderText('e.g. Dell Laptop'), {
        target: { value: 'Available Asset' },
      });

      fireEvent.change(screen.getByPlaceholderText('SN-078000'), { target: { value: 'SN-60001' } });

      fireEvent.click(screen.getByRole('button', { name: 'Create Asset' }));

      await waitFor(() => {
        expect(useAssetStore.getState().assets[0].status).toBe('Available');
      });
    });

    it('should close the modal after successfully creating an asset', async () => {
      render(<AddAssetModal />);

      fireEvent.change(screen.getByPlaceholderText('e.g. Dell Laptop'), {
        target: { value: 'Close Test Asset' },
      });

      fireEvent.change(screen.getByPlaceholderText('SN-078000'), { target: { value: 'SN-70001' } });

      fireEvent.click(screen.getByRole('button', { name: 'Create Asset' }));

      await waitFor(() => {
        expect(useAssetStore.getState().isAddModalOpen).toBe(false);
      });
    });

    it('should assign the generated ID when creating an asset', async () => {
      render(<AddAssetModal />);

      const assetIdInput = screen.getByPlaceholderText('A1010') as HTMLInputElement;

      const generatedId = assetIdInput.value;

      fireEvent.change(screen.getByPlaceholderText('e.g. Dell Laptop'), {
        target: { value: 'Generated ID Asset' },
      });

      fireEvent.change(screen.getByPlaceholderText('SN-078000'), { target: { value: 'SN-80001' } });

      fireEvent.click(screen.getByRole('button', { name: 'Create Asset' }));

      await waitFor(() => {
        expect(useAssetStore.getState().assets[0].assetId).toBe(generatedId);
      });
    });
  });
});
