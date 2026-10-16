import React from 'react';
import { useTranslation } from 'react-i18next';
import type { AssetStatus } from '@/types/asset';
import { cn } from '@/lib/utils';
import {
  ASSET_STATUS_BADGE_STYLES,
  DEFAULT_ASSET_STATUS_BADGE_STYLE,
} from './constants/AssetStatusBadge.constants';

interface AssetStatusBadgeProps {
  status: AssetStatus;
  className?: string;
}

/**
 * @description: Renders a color-coded status badge for an asset status
 * @param {AssetStatusBadgeProps} props - Component properties containing status and optional className
 * @returns {JSX.Element} Styled badge span element
 */
export const AssetStatusBadge: React.FC<AssetStatusBadgeProps> = ({ status, className }) => {
  const { t: translateAssets } = useTranslation('asset');

  /**
   * @description: Returns CSS style classes based on the asset status
   * @param {AssetStatus} st - Asset status
   * @returns {string} Tailwind CSS class string for background and text colors
   */
  const getBadgeStyle = (st: AssetStatus) => {
    return ASSET_STATUS_BADGE_STYLES[st] || DEFAULT_ASSET_STATUS_BADGE_STYLE;
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-medium text-xs px-3 py-1 rounded-full whitespace-nowrap transition-colors select-none',
        getBadgeStyle(status),
        className,
      )}
    >
      {translateAssets(`statuses.${status}`, { defaultValue: status })}
    </span>
  );
};

export default AssetStatusBadge;
