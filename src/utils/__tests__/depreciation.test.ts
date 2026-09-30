import { describe, it, expect } from 'vitest';
import {
  calculateAnnualDepreciation,
  calculateDepreciationSchedule,
  calculateTotalAssetCost,
} from '../depreciation';
import type { Asset } from '@/types/asset';

describe('Depreciation Utility Calculations', () => {
  it('should accurately compute annual depreciation according to the formula (Cost / Useful Life)', () => {
    // Example from requirement: $12,000 / 5 years = $2,400/year
    const annualDep = calculateAnnualDepreciation(12000, 5);
    expect(annualDep).toBe(2400);

    // $50,000 / 10 years = $5,000/year
    expect(calculateAnnualDepreciation(50000, 10)).toBe(5000);

    // $15,000 / 3 years = $5,000/year
    expect(calculateAnnualDepreciation(15000, 3)).toBe(5000);

    // $21,000 / 7 years = $3,000/year
    expect(calculateAnnualDepreciation(21000, 7)).toBe(3000);
  });

  it('should handle zero and negative inputs gracefully', () => {
    expect(calculateAnnualDepreciation(0, 5)).toBe(0);
    expect(calculateAnnualDepreciation(10000, 0)).toBe(0);
    expect(calculateAnnualDepreciation(-5000, 5)).toBe(0);
    expect(calculateAnnualDepreciation(5000, -2)).toBe(0);
  });

  it('should generate a full depreciation schedule for given useful life years', () => {
    const startYear = 2024;
    const summary = calculateDepreciationSchedule(12000, 5, startYear);

    expect(summary.totalPurchaseCost).toBe(12000);
    expect(summary.usefulLifeYears).toBe(5);
    expect(summary.annualDepreciation).toBe(2400);
    expect(summary.schedule).toHaveLength(6); // Year 0 to Year 5

    // Year 0 (Initial)
    expect(summary.schedule[0]).toEqual({
      year: 2024,
      label: 'Yr 0 (2024)',
      bookValue: 12000,
      accumulatedDepreciation: 0,
      annualDepreciation: 0,
    });

    // Year 1
    expect(summary.schedule[1]).toEqual({
      year: 2025,
      label: 'Yr 1 (2025)',
      bookValue: 9600,
      accumulatedDepreciation: 2400,
      annualDepreciation: 2400,
    });

    // Year 3
    expect(summary.schedule[3]).toEqual({
      year: 2027,
      label: 'Yr 3 (2027)',
      bookValue: 4800,
      accumulatedDepreciation: 7200,
      annualDepreciation: 2400,
    });

    // Year 5 (Fully depreciated)
    expect(summary.schedule[5]).toEqual({
      year: 2029,
      label: 'Yr 5 (2029)',
      bookValue: 0,
      accumulatedDepreciation: 12000,
      annualDepreciation: 2400,
    });
  });

  it('should correctly sum total asset costs from asset records', () => {
    const sampleAssets: Partial<Asset>[] = [
      { id: '1', purchaseCost: 2000 },
      { id: '2', purchaseCost: 3500 },
      { id: '3', purchaseCost: 1500 },
      { id: '4', purchaseCost: undefined },
    ];

    const total = calculateTotalAssetCost(sampleAssets as Asset[]);
    expect(total).toBe(7000);
  });
});
