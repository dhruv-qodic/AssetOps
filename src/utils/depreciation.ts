/**
 * Asset Depreciation Calculation Utilities
 * Straight-line depreciation model: Annual Depreciation = Purchase Cost / Useful Life
 */
import type { Asset } from '@/types/asset';

export interface DepreciationSchedulePoint {
  year: number;
  label: string;
  bookValue: number;
  accumulatedDepreciation: number;
  annualDepreciation: number;
}

export interface DepreciationSummary {
  totalPurchaseCost: number;
  usefulLifeYears: number;
  annualDepreciation: number;
  salvageValue: number;
  schedule: DepreciationSchedulePoint[];
}

/**
 * Calculates straight-line annual depreciation for a given cost and useful life.
 * Formula: Annual Depreciation = Purchase Cost / Useful Life
 *
 * @param purchaseCost - The asset acquisition cost in USD
 * @param usefulLifeYears - The useful life in years (e.g., 3, 5, 7, 10)
 * @returns Annual depreciation expense
 */
export function calculateAnnualDepreciation(purchaseCost: number, usefulLifeYears: number): number {
  if (usefulLifeYears <= 0 || purchaseCost <= 0) {
    return 0;
  }
  return purchaseCost / usefulLifeYears;
}

/**
 * Generates a complete depreciation forecast schedule across the useful life horizon.
 *
 * @param totalPurchaseCost - Total cost of hardware assets
 * @param usefulLifeYears - Number of years over which asset depreciates (default 5)
 * @param startYear - Base initial year (default current year)
 */
export function calculateDepreciationSchedule(
  totalPurchaseCost: number,
  usefulLifeYears: number = 5,
  startYear: number = new Date().getFullYear(),
): DepreciationSummary {
  const safeUsefulLife = Math.max(1, usefulLifeYears);
  const safeCost = Math.max(0, totalPurchaseCost);
  const annualDepreciation = calculateAnnualDepreciation(safeCost, safeUsefulLife);

  const schedule: DepreciationSchedulePoint[] = [];

  for (let i = 0; i <= safeUsefulLife; i++) {
    const accumulated = Math.min(safeCost, Math.round(annualDepreciation * i));
    const bookValue = Math.max(0, safeCost - accumulated);
    const yearNumber = startYear + i;

    schedule.push({
      year: yearNumber,
      label: i === 0 ? `Yr 0 (${yearNumber})` : `Yr ${i} (${yearNumber})`,
      bookValue,
      accumulatedDepreciation: accumulated,
      annualDepreciation: i === 0 ? 0 : Math.round(annualDepreciation),
    });
  }

  return {
    totalPurchaseCost: safeCost,
    usefulLifeYears: safeUsefulLife,
    annualDepreciation: Math.round(annualDepreciation),
    salvageValue: 0,
    schedule,
  };
}

/**
 * Computes total acquisition cost for an array of assets.
 */
export function calculateTotalAssetCost(assets: Asset[]): number {
  return assets.reduce((total, asset) => total + (asset.purchaseCost || 0), 0);
}
