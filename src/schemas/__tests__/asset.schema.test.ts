import { describe, it, expect } from 'vitest';
import { assetSchema } from '../asset.schema';

describe('asset.schema - assetSchema', () => {
  it('should validate valid asset form data', () => {
    const validData = {
      assetId: 'A1010',
      name: 'ThinkPad X1 Carbon',
      model: 'Gen 11',
      category: 'Laptop',
      status: 'Available',
      location: 'Headquarters',
      serialNumber: 'TP-12345',
      purchaseDate: '2024-01-15',
      purchaseCost: 1499,
      notes: 'New deployment',
      specifications: {
        Processor: 'Intel Core i7',
        RAM: '32GB',
      },
    };

    const result = assetSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail validation when required fields are missing', () => {
    const invalidData = {
      assetId: '',
      name: '',
      serialNumber: '',
      purchaseDate: '',
    };

    const result = assetSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issuePaths = result.error.issues.map((i) => i.path[0]);
      expect(issuePaths).toContain('assetId');
      expect(issuePaths).toContain('name');
      expect(issuePaths).toContain('serialNumber');
    }
  });

  it('should validate technical specifications record', () => {
    const dataWithSpecs = {
      assetId: 'A1020',
      name: 'Dell Monitor',
      category: 'Monitor',
      status: 'Available',
      location: 'Headquarters',
      serialNumber: 'DM-9999',
      purchaseDate: '2024-02-01',
      specifications: {
        Resolution: '4K UHD',
        Panel: 'IPS',
        RefreshRate: '144Hz',
      },
    };

    const result = assetSchema.safeParse(dataWithSpecs);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.specifications?.Resolution).toBe('4K UHD');
    }
  });
});
